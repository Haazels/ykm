"use client";

import {
  createContext,
  useContext,
  useCallback,
  useState,
  type ReactNode,
} from "react";

import { createClient } from "@/lib/supabase/client";
import type { PurchaseOrder } from "@/types";

interface CreateOrderInput {
  orderNumber: string;
  buyerName: string;
  buyerContact: string;
  deliveryAddress: string;
  totalAmount: number;

  items: {
    productId: number;
    productName: string;
    productThumbnail: string;
    price: number;
    quantity: number;
  }[];
}

interface OrdersContextValue {
  allOrders: PurchaseOrder[];
  loading: boolean;

  refreshOrders: () => Promise<void>;

  createOrder: (
    input: CreateOrderInput
  ) => Promise<string | null>;
}

const OrdersContext =
  createContext<OrdersContextValue | null>(null);

const supabase = createClient();

export function OrdersProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [allOrders, setAllOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(false);

  /*
   * LOAD ORDERS + ORDER ITEMS FROM SUPABASE
   */
  const refreshOrders = useCallback(async () => {
    setLoading(true);

    try {
      /*
       * 1. Get orders
       */
      const {
        data: orders,
        error: ordersError,
      } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

      if (ordersError) {
        console.error(
          "Failed to load orders:",
          ordersError.message
        );
        return;
      }

      if (!orders || orders.length === 0) {
        setAllOrders([]);
        return;
      }

      /*
       * 2. Get all order IDs
       */
      const orderIds = orders.map(
        (order) => order.id
      );

      /*
       * 3. Get order items belonging to
       *    those orders.
       */
      const {
        data: orderItems,
        error: itemsError,
      } = await supabase
        .from("order_items")
        .select(
          `
          id,
          order_id,
          product_id,
          product_name,
          product_thumbnail,
          price,
          quantity,
          total,
          created_at
          `
        )
        .in("order_id", orderIds);

      if (itemsError) {
        console.error(
          "Failed to load order items:",
          itemsError.message
        );
        return;
      }

      /*
       * 4. Convert Supabase data into
       *    the PurchaseOrder format used
       *    by your frontend.
       */
      const mappedOrders: PurchaseOrder[] =
        orders.map((order) => {
          const itemsForOrder =
            (orderItems ?? []).filter(
              (item) =>
                item.order_id === order.id
            );

          return {
            orderId: order.order_number,
            date: order.created_at,

            items: itemsForOrder.map((item) => ({
              /*
               * Your PurchaseOrderItem type
               * expects a number.
               *
               * order_items.id is UUID, so we
               * use product_id here.
               */
              id: item.product_id ?? 0,

              name: item.product_name,

              thumb:
                item.product_thumbnail ?? "",

              price: Number(item.price),

              qty: Number(item.quantity),
            })),

            total: Number(order.total_amount),

            buyerName: order.buyer_name,

            buyerContact:
              order.buyer_contact,

            deliveryAddress:
              order.delivery_address,
          };
        });

      setAllOrders(mappedOrders);

      console.log(
        "Orders loaded:",
        mappedOrders
      );
    } catch (error) {
      console.error(
        "Unexpected error loading orders:",
        error
      );
    } finally {
      setLoading(false);
    }
  }, []);

  /*
   * CREATE ORDER + ORDER ITEMS
   */
  const createOrder = useCallback(
    async (
      input: CreateOrderInput
    ): Promise<string | null> => {
      try {
        /*
         * 1. Get currently logged-in user
         */
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          console.error(
            "No authenticated user found."
          );

          return null;
        }

        /*
         * 2. Create main order
         */
        const {
          data: order,
          error: orderError,
        } = await supabase
          .from("orders")
          .insert({
            user_id: user.id,

            order_number:
              input.orderNumber,

            buyer_name:
              input.buyerName,

            buyer_contact:
              input.buyerContact,

            delivery_address:
              input.deliveryAddress,

            total_amount:
              input.totalAmount,

            payment_status: "pending",

            order_status: "pending",
          })
          .select("id")
          .single();

        if (orderError || !order) {
          console.error(
            "Failed to create order:",
            orderError?.message
          );

          return null;
        }

        /*
         * 3. Prepare order items
         *
         * IMPORTANT:
         * Your order_items table contains
         * a `total` column.
         *
         * Therefore we calculate:
         *
         * total = price × quantity
         */
        const orderItems =
          input.items.map((item) => ({
            order_id: order.id,

            product_id:
              item.productId,

            product_name:
              item.productName,

            product_thumbnail:
              item.productThumbnail,

            price: item.price,

            quantity:
              item.quantity,

            total:
              item.price *
              item.quantity,
          }));

        /*
         * 4. Insert order items
         */
        const {
          error: itemsError,
        } = await supabase
          .from("order_items")
          .insert(orderItems);

        /*
         * 5. Roll back the main order
         *    if order items failed.
         */
        if (itemsError) {
          console.error(
            "Failed to create order items:",
            itemsError.message
          );

          await supabase
            .from("orders")
            .delete()
            .eq("id", order.id);

          return null;
        }

        /*
         * 6. Refresh frontend order list
         */
        await refreshOrders();

        console.log(
          "Order created successfully:",
          order.id
        );

        return order.id;
      } catch (error) {
        console.error(
          "Unexpected order creation error:",
          error
        );

        return null;
      }
    },
    [refreshOrders]
  );

  // NOTE: we intentionally do NOT fetch all orders on mount here.
  // `allOrders`/`refreshOrders` from this context aren't rendered
  // anywhere in the app (AdminOrdersPanel reads from AdminContext's
  // localStorage-backed `allOrders` instead) — but this provider sits
  // above every page, so an eager fetch here was firing two full-table
  // Supabase queries (orders + order_items, for every order in the
  // database) on every single page load, for every visitor, logged in
  // or not. Call `refreshOrders()` explicitly wherever this data is
  // actually needed (e.g. inside an admin panel) instead.

  return (
    <OrdersContext.Provider
      value={{
        allOrders,
        loading,
        refreshOrders,
        createOrder,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context =
    useContext(OrdersContext);

  if (!context) {
    throw new Error(
      "useOrders must be used within OrdersProvider"
    );
  }

  return context;
}
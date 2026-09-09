"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, X } from "lucide-react";
import { PRODUCT_REVIEWS } from "@/lib/products";
import { useToast } from "@/context/ToastContext";
import type { ProductReview } from "@/types";

interface ProductReviewsProps {
  productId: number;
}

/**
 * Individual review section for a single product.
 * Shows all existing reviews (name, rating, text, photos) and lets buyers
 * submit their own review with a star rating and uploaded photos.
 *
 * Usage:
 *   <ProductReviews productId={product.id} />
 */
export default function ProductReviews({ productId }: ProductReviewsProps) {
  const { showToast } = useToast();

  const baseReviews = PRODUCT_REVIEWS[productId] ?? [];
  const [addedReviews, setAddedReviews] = useState<ProductReview[]>([]);
  const reviews = [...addedReviews, ...baseReviews];

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  const handlePhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const result = evt.target?.result;
        if (typeof result === "string") {
          setPhotos((prev) => [...prev, result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const submitReview = () => {
    if (!name.trim() || !text.trim() || rating === 0) {
      showToast("Please fill all fields and select a rating");
      return;
    }
    const newReview: ProductReview = {
      name: name.trim(),
      rating,
      text: text.trim(),
      images: photos,
    };
    setAddedReviews((prev) => [newReview, ...prev]);
    showToast("\u2713 Review submitted! Thank you for your feedback");
    setName("");
    setText("");
    setRating(0);
    setPhotos([]);
  };

  return (
    <div className="mb-6">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-xs uppercase tracking-[0.08em] text-muted">
          Customer Reviews &amp; Photos
        </h4>
        {avgRating && (
          <div className="flex items-center gap-1 text-xs text-[#ccc]">
            <Star size={13} className="fill-[#ff7a00] text-[#ff7a00]" />
            {avgRating} &middot; {reviews.length} review{reviews.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* Existing reviews list */}
      {reviews.length === 0 ? (
        <div className="rounded-[10px] bg-[#1a1a1a] p-4 text-center text-xs text-muted">
          No reviews yet. Be the first to share your experience.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {reviews.map((r, idx) => (
            <div key={`${r.name}-${idx}`} className="rounded-[10px] bg-[#1a1a1a] p-3">
              <div className="mb-2 flex items-start gap-2.5">
                <div
                  className="h-8 w-8 flex-shrink-0 rounded-full"
                  style={{ background: "linear-gradient(135deg,#667eea 0%,#764ba2 100%)" }}
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold">{r.name}</div>
                  <div className="mt-px text-[10px] text-[#666]">Recently</div>
                  <div className="mt-[3px] flex gap-0.5">
                    {Array.from({ length: Math.round(r.rating) }).map((_, i) => (
                      <Star key={i} size={11} className="fill-[#ff7a00] text-[#ff7a00]" />
                    ))}
                  </div>
                </div>
              </div>
              <div className="mb-2 text-xs leading-[1.6] text-[#aaa]">{r.text}</div>
              {r.images.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {r.images.map((img, i) => (
                    <div key={i} className="relative h-10 w-10 overflow-hidden rounded-md bg-[#111]">
                      <Image
                        src={img}
                        alt="review photo"
                        fill
                        sizes="40px"
                        unoptimized={typeof img === "string" && img.startsWith("data:")}
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Buyer review form */}
      <div className="mt-4 rounded-[10px] bg-[#1a1a1a] p-3.5">
        <h5 className="mb-2.5 text-[11px] uppercase tracking-[0.08em] text-muted">
          Share Your Review
        </h5>
        <div className="flex flex-col gap-2.5">
          <div className="flex flex-col gap-1">
            <label htmlFor={`reviewName-${productId}`} className="text-[11px] uppercase tracking-[0.04em] text-[#888]">
              Name
            </label>
            <input
              id={`reviewName-${productId}`}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="rounded-md border border-[#333] bg-[#111] px-2.5 py-2 text-xs text-white placeholder:text-[#555] focus:border-accent focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-[0.04em] text-[#888]">Rating</span>
            <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(i)}
                  onMouseEnter={() => setHoverRating(i)}
                  aria-label={`Rate ${i} star${i > 1 ? "s" : ""}`}
                  className={`bg-transparent text-xl leading-none transition-colors ${
                    i <= (hoverRating || rating) ? "text-[#ff7a00]" : "text-[#555]"
                  }`}
                >
                  &#9733;
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor={`reviewText-${productId}`} className="text-[11px] uppercase tracking-[0.04em] text-[#888]">
              Your Review
            </label>
            <textarea
              id={`reviewText-${productId}`}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Share your experience..."
              rows={3}
              className="resize-y rounded-md border border-[#333] bg-[#111] px-2.5 py-2 text-xs text-white placeholder:text-[#555] focus:border-accent focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-[0.04em] text-[#888]">Add Photos</span>
            <div className="mt-2 flex flex-wrap gap-2">
              <label className="flex h-[50px] w-[50px] cursor-pointer items-center justify-center rounded-md border border-dashed border-[#333] text-2xl transition-colors hover:border-accent hover:bg-accent/5">
                +
                <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotos} />
              </label>
              {photos.map((pic, i) => (
                <div key={i} className="group relative h-[50px] w-[50px]">
                  <Image
                    src={pic}
                    alt="uploaded preview"
                    fill
                    sizes="50px"
                    unoptimized
                    className="rounded-md border border-[#333] object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    aria-label="Remove photo"
                    className="absolute -right-2 -top-2 hidden h-5 w-5 items-center justify-center rounded-full bg-accent text-black group-hover:flex"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={submitReview}
            className="rounded-md bg-accent py-2.5 text-xs font-semibold text-black transition-[opacity,transform] hover:-translate-y-px hover:opacity-85"
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
}

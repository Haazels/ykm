export interface CurrentLocationResult {
  address: string;
}

/**
 * Asks the browser for the user's current GPS position, then reverse
 * geocodes it into a human-readable address via OpenStreetMap's free
 * Nominatim API (no API key required, so nothing extra to configure).
 *
 * Throws a plain Error with a message that's safe to show in a toast.
 */
export function getCurrentLocationAddress(): Promise<CurrentLocationResult> {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("Your browser doesn't support location access."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&addressdetails=1`,
            {
              headers: {
                Accept: "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error("Reverse geocoding request failed.");
          }

          const data = await response.json();
          const address: string | undefined = data?.display_name;

          if (!address) {
            throw new Error("Couldn't determine an address for this location.");
          }

          resolve({ address });
        } catch {
          reject(
            new Error("Couldn't look up an address for your location. Please enter it manually.")
          );
        }
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          reject(
            new Error("Location access was denied. Please enter your address manually.")
          );
        } else {
          reject(new Error("Couldn't get your current location."));
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  });
}

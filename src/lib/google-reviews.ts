import "server-only";

type PlaceReview = {
  name: string;
  relativePublishTimeDescription?: string;
  rating?: number;
  text?: { text: string };
  originalText?: { text: string };
  authorAttribution?: { displayName?: string; uri?: string; photoUri?: string };
  publishTime?: string;
};

type PlaceDetails = {
  id: string;
  displayName?: { text: string };
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: PlaceReview[];
  photos?: { name: string; widthPx: number; heightPx: number; authorAttributions?: { displayName?: string }[] }[];
};

const BASE = "https://places.googleapis.com/v1";

function key() {
  const k = process.env.GOOGLE_PLACES_API_KEY;
  if (!k) throw new Error("GOOGLE_PLACES_API_KEY is not set. Add it in your environment variables.");
  return k;
}

export async function findPlaceId(query: string, lat?: number, lng?: number) {
  const res = await fetch(`${BASE}/places:searchText`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": key(),
      "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress",
    },
    body: JSON.stringify({
      textQuery: query,
      ...(lat && lng
        ? { locationBias: { circle: { center: { latitude: lat, longitude: lng }, radius: 2000 } } }
        : {}),
    }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Google Places search failed: ${res.status} ${await res.text()}`);
  const json = (await res.json()) as { places?: { id: string }[] };
  const id = json.places?.[0]?.id;
  if (!id) throw new Error("No matching place found on Google for that search query.");
  return id;
}

export async function fetchPlaceDetails(placeId: string): Promise<PlaceDetails> {
  const res = await fetch(`${BASE}/places/${encodeURIComponent(placeId)}?languageCode=en`, {
    headers: {
      "X-Goog-Api-Key": key(),
      "X-Goog-FieldMask": "id,displayName,rating,userRatingCount,googleMapsUri,reviews,photos",
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Google Place details failed: ${res.status} ${await res.text()}`);
  return (await res.json()) as PlaceDetails;
}

/** Resolves a Places photo resource to a public (googleusercontent) image URL. */
export async function getPhotoUri(photoName: string, maxWidthPx = 1600) {
  const res = await fetch(`${BASE}/${photoName}/media?maxWidthPx=${maxWidthPx}&skipHttpRedirect=true`, {
    headers: { "X-Goog-Api-Key": key() },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json = (await res.json()) as { photoUri?: string };
  return json.photoUri ?? null;
}

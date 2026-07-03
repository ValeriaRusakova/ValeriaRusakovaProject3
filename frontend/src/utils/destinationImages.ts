// ── Curated destination photos ────────────────────────────────────────────────
// Maps a destination name (or its city) to one or more high-quality Unsplash
// photos of famous landmarks or scenic views.  Used by CardMedia when a
// vacation record has no uploaded photo in the database — so cards always
// look elegant, never broken.
//
// Multiple photo IDs per destination = automatic fallback.  If the first URL
// fails to load, CardMedia tries the next one, then finally falls back to
// the gradient + initials placeholder.

const UNSPLASH = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&h=520&q=80`;

// Convert an entry to a real URL.  Entries starting with '/' or 'http' are
// used as-is (local files under /public or external URLs); everything else
// is treated as an Unsplash photo ID.
const toUrl = (entry: string) =>
  entry.startsWith('/') || entry.startsWith('http') ? entry : UNSPLASH(entry);

// Photo IDs picked from Unsplash's iconic travel collections.
// Key = lowercase city name (matched on the first segment before any comma).
// Each destination may list several fallback IDs — we try them in order.
// Entries that start with '/' are served from frontend/public/.
const CURATED: Record<string, string[]> = {
  paris:      ['photo-1502602898657-3e91760cbb34', 'photo-1499856871958-5b9627545d1a'],
  barcelona:  ['photo-1583422409516-2895a77efded', 'photo-1509840841025-9088ba78a826'],
  rome:       ['photo-1552832230-c0197dd311b5',   'photo-1531572753322-ad063cecc140'],
  london:     ['photo-1513635269975-59663e0ac1ad', 'photo-1533929736458-ca588d08c8be'],
  amsterdam:  ['photo-1512470876302-972faa2aa9a4', 'photo-1459679749680-18eb1eb37418', 'photo-1584003564911-a5dfc7cf90a1'],
  athens:     ['photo-1555993539-1732b0258235',   'photo-1503152394-c571994fd383'],
  prague:     ['photo-1541849546-216549ae216d',   'photo-1519677100203-a0e668c92439'],
  bangkok:    ['photo-1508009603885-50cf7c579365', 'photo-1563492065599-3520f775eeed'],
  'tel aviv': ['/destinations/tel-aviv.jpg',      'photo-1601324056820-633fea9941e2', 'photo-1544918877-c67a08b9edb5'],
  telaviv:    ['/destinations/tel-aviv.jpg',      'photo-1601324056820-633fea9941e2', 'photo-1544918877-c67a08b9edb5'],
  'new york': ['photo-1496442226666-8d4d0e62e6e9', 'photo-1522083165195-3424ed129620'],
  newyork:    ['photo-1496442226666-8d4d0e62e6e9'],
  tokyo:      ['photo-1540959733332-eab4deabeeaf', 'photo-1503899036084-c55cdd92da26'],
  dubai:      ['photo-1512453979798-5ea266f8880c', 'photo-1518684079-3c830dcef090'],
  bali:       ['photo-1537996194471-e657df975ab4', 'photo-1531592937781-344ad608fabf'],
  singapore:  ['photo-1525625293386-3f8f99389edd', 'photo-1508964942454-1a56651d54ac'],
  santorini:  ['photo-1570077188670-e3a8d69ac5ff', 'photo-1533105079780-92b9be482077'],
  venice:     ['photo-1530409876824-fbfbaf9d1d09', 'photo-1523906834658-6e24ef2386f9'],
  maldives:   ['photo-1514282401047-d79a71a590c8', 'photo-1573843981267-be1999ff37cd'],
  reykjavik:  ['photo-1621959721891-d297dfd9d6ee', 'photo-1504218200938-a5cfcecac4a5'],
  iceland:    ['photo-1621959721891-d297dfd9d6ee', 'photo-1504218200938-a5cfcecac4a5', 'photo-1490080886466-6ea0a78d4232'],
  cappadocia: ['photo-1512100356356-de1b84283e18', 'photo-1519999482648-25049ddd37b1'],
  istanbul:   ['photo-1524231757912-21f4fe3a7200', 'photo-1541432901042-2d8bd64b4a9b'],
  lisbon:     ['photo-1555881400-74d7acaacd8b',   'photo-1513735492246-483525079686'],
  vienna:     ['photo-1516550893923-42d28e5677af', 'photo-1573599852326-2d4da0bbe613'],
  berlin:     ['photo-1560969184-10fe8719e047',   'photo-1587330979470-3016b6702d89'],
  madrid:     ['photo-1543783207-ec64e4d95325',   'photo-1509840841025-9088ba78a826'],
  copenhagen: ['photo-1513622470522-26c3c8a854bc', 'photo-1543832923-44667a44c804'],
  stockholm:  ['photo-1509356843151-3e7d96241e11', 'photo-1568552477709-7a2b4a6bd5cd'],
  sydney:     ['photo-1506973035872-a4ec16b8e8d9', 'photo-1523428096881-5bd79d043006'],
  rio:                ['photo-1483729558449-99ef09a8c325', 'photo-1516306580123-e6e52b1b7b5f'],
  'rio de janeiro':   ['photo-1483729558449-99ef09a8c325'],
  marrakech:  ['photo-1489749798305-4fea3ae63d43', 'photo-1553900011-6f6db8b62a34'],
  mumbai:     ['photo-1567157577867-05ccb1388e66', 'photo-1595658658481-d53d3f999875'],
};

// Generic fallback used only when the destination isn't in the map.
const GENERIC_TRAVEL = ['photo-1476514525535-07fb3b4ae5f1', 'photo-1488646953014-85cb44e25828'];

/**
 * Returns an ordered list of photo URLs to try for the given destination.
 * Callers should attempt each URL in turn, moving to the next on load error.
 *
 * Matching rules:
 *   1. Take the part before the first comma  ("Paris, France" → "Paris")
 *   2. Lowercase + trim
 *   3. Look up in CURATED — if found, return its list
 *   4. Otherwise return the generic-travel list
 */
export function getDestinationImages(destination: string): string[] {
  if (!destination) return [];
  const key       = destination.split(',')[0].trim().toLowerCase();
  const keyPacked = key.replace(/\s+/g, '');
  const ids       = CURATED[key] ?? CURATED[keyPacked] ?? GENERIC_TRAVEL;
  return ids.map(toUrl);
}

/** Kept for backward compat — returns just the first URL. */
export function getDestinationImage(destination: string): string {
  return getDestinationImages(destination)[0] ?? '';
}

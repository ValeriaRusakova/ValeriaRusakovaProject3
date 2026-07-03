// CardMedia — smart vacation card image with graceful fallback.
//
// Loading priority (top wins):
//   1. src        — the URL the parent passed in (usually the admin-uploaded
//                   photo from /uploads/).  Used first when non-empty.
//   2. curated    — a hand-picked Unsplash photo of the destination.
//   3. gradient   — deterministic gradient + destination initials.
//
// If the current source fails to load, we automatically try the next one.
// The gradient always renders behind the photo so there is never an empty box.

import { useMemo, useState } from 'react';
import { getDestinationImages } from '../utils/destinationImages';

interface Props {
  /** Uploaded photo URL.  Pass '' to skip step 1 and start from step 2. */
  src: string;
  /** Destination name — drives the curated photo lookup and initials text. */
  alt: string;
}

// ── Colour palette ────────────────────────────────────────────────────────────
// Eight dark gradients that complement the glassmorphism design system.
// Dark enough for white initials to be readable; distinct enough to tell apart.
const GRADIENTS = [
  'linear-gradient(145deg, #0d0b2e 0%, #1e1275 100%)',   // deep indigo
  'linear-gradient(145deg, #0a1f3c 0%, #0e4d8f 100%)',   // ocean blue
  'linear-gradient(145deg, #0a2010 0%, #0e6b40 100%)',   // forest green
  'linear-gradient(145deg, #1a0630 0%, #6b21a8 100%)',   // violet
  'linear-gradient(145deg, #1a1008 0%, #92600a 100%)',   // amber
  'linear-gradient(145deg, #0a1a20 0%, #0a6b6b 100%)',   // teal
  'linear-gradient(145deg, #200a08 0%, #9a2215 100%)',   // crimson
  'linear-gradient(145deg, #080a1e 0%, #3730a3 100%)',   // blue-violet
];

/** Stable gradient for a given destination name. */
function pickGradient(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffff;
  return GRADIENTS[h % GRADIENTS.length];
}

/** Up to 2 initials from the destination name, e.g. "New York" → "NY". */
function getInitials(name: string): string {
  return name
    .split(/[\s,]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function CardMedia({ src, alt }: Props) {
  // Ordered list of image URLs to try, best first.
  const sources = useMemo(() => {
    const list: string[] = [];
    if (src) list.push(src);                              // step 1: DB upload
    for (const url of getDestinationImages(alt)) {        // step 2: curated
      if (url && !list.includes(url)) list.push(url);
    }
    return list;
  }, [src, alt]);

  // Index of the source currently being tried.  Starts at 0.
  const [idx, setIdx] = useState(0);
  // 'ok' once the current source loads successfully.
  const [ok,  setOk]  = useState(false);

  const current = sources[idx];
  const showImage = !!current;

  function handleError() {
    // Try the next source; when we run out we simply stop rendering the img.
    setIdx(i => i + 1);
    setOk(false);
  }

  return (
    <div className="card-media">

      {/* Gradient placeholder — always rendered, sits behind the photo */}
      <div
        className="card-media-fallback"
        style={{ background: pickGradient(alt) }}
        aria-hidden="true"
      >
        <span className="card-media-initials">{getInitials(alt)}</span>
      </div>

      {/* Real photo — fades in once loaded; stays invisible on error */}
      {showImage && (
        <img
          key={current}   /* remount on source change so onLoad/onError refire */
          src={current}
          alt={alt}
          loading="lazy"
          className={`card-media-img${ok ? ' loaded' : ''}`}
          onLoad={() => setOk(true)}
          onError={handleError}
        />
      )}

    </div>
  );
}

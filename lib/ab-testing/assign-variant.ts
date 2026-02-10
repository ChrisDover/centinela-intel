/**
 * Deterministic variant assignment using hash of testId + subscriberId.
 * Idempotent — same subscriber always gets the same variant for a given test.
 */

interface Variant {
  id: string;
  value: string;
}

/**
 * Simple string hash (djb2) — deterministic, fast, good distribution.
 */
function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return hash >>> 0; // Ensure unsigned 32-bit integer
}

/**
 * Assign a variant deterministically based on testId + subscriberId.
 * Always returns the same variant for the same test+subscriber combination.
 */
export function assignVariant(
  testId: string,
  subscriberId: string,
  variants: Variant[]
): Variant {
  if (variants.length === 0) {
    throw new Error("No variants provided");
  }
  if (variants.length === 1) {
    return variants[0];
  }

  const hash = hashString(`${testId}:${subscriberId}`);
  const index = hash % variants.length;
  return variants[index];
}

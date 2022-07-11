import { customAlphabet } from 'nanoid';
/**
 * https://zelark.github.io/nano-id-cc/
 *  - Calculates the probability of collision of IDs
 */

const UUID_COMPLEXITY = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

const UUID_LENGTH = 16;

// Generates the uuid using the nanoid
// Default comlexity ~4 million years 1% possible collision for length of 16
export default function nanoid(size?: number) {
  const id = customAlphabet(UUID_COMPLEXITY, size || UUID_LENGTH);

  return id();
}

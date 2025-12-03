const text = `The vibes in the locker room were immaculate
had double-doubles for the Lakers tonight.

Following the game
spending time in the G-League.

While James took a backseat on the scoring tonight
shots during the game (4-of-7, 57.1 field goal
percentage).`;

// Strategy:
// 1. Split by double newlines (paragraphs)
// 2. For each paragraph, replace single newlines with spaces (merge lines)
// 3. Join paragraphs back with double newlines
const paragraphs = text.split(/\n\s*\n/);
const cleanedText = paragraphs
  .map(p => p.replace(/\n/g, ' ').replace(/ +/g, ' ').trim())
  .filter(p => p.length > 0)
  .join('\n\n');

console.log('--- Original ---');
console.log(text);
console.log('\n--- Cleaned ---');
console.log(cleanedText);

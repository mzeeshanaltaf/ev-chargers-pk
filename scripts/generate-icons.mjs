/**
 * One-off PWA icon generator.
 * Run: node scripts/generate-icons.mjs
 * Requires: npm install --save-dev sharp
 *
 * Reads public/favicon.png as the source and outputs:
 *   public/icons/icon-192.png        (192x192, any)
 *   public/icons/icon-512.png        (512x512, any)
 *   public/icons/icon-maskable-512.png (512x512, maskable — brand bg fill)
 *   public/icons/apple-touch-icon.png  (180x180, no transparency)
 */

import sharp from "sharp";
import { mkdir } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const src = join(root, "public", "favicon.png");
const outDir = join(root, "public", "icons");
const BRAND = { r: 0, g: 200, b: 83, alpha: 1 }; // #00C853

await mkdir(outDir, { recursive: true });

// Standard icons (transparent bg preserved)
await sharp(src).resize(192, 192).toFile(join(outDir, "icon-192.png"));
console.log("✓ icon-192.png");

await sharp(src).resize(512, 512).toFile(join(outDir, "icon-512.png"));
console.log("✓ icon-512.png");

// Maskable: composite logo on solid brand-colour background
// Logo occupies the inner ~80% (safe zone), background fills the full 512px
const logoSize = Math.round(512 * 0.72); // 72% of 512 = ~368px
const offset = Math.round((512 - logoSize) / 2);

const logo = await sharp(src).resize(logoSize, logoSize).toBuffer();

await sharp({
  create: {
    width: 512,
    height: 512,
    channels: 4,
    background: BRAND,
  },
})
  .composite([{ input: logo, top: offset, left: offset }])
  .png()
  .toFile(join(outDir, "icon-maskable-512.png"));
console.log("✓ icon-maskable-512.png");

// Apple touch icon: 180x180, brand background, no transparency
const logoApple = await sharp(src).resize(140, 140).toBuffer();
await sharp({
  create: { width: 180, height: 180, channels: 3, background: BRAND },
})
  .composite([{ input: logoApple, top: 20, left: 20 }])
  .png()
  .toFile(join(outDir, "apple-touch-icon.png"));
console.log("✓ apple-touch-icon.png");

console.log("\nAll icons generated in public/icons/");

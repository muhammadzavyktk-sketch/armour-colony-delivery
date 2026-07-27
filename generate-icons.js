import fs from 'fs';
import { PNG } from 'pngjs';

function createIcon(size, filename) {
  const png = new PNG({ width: size, height: size });
  
  const bgR = 15, bgG = 61, bgB = 46; // Forest green #0f3d2e
  const goldR = 240, goldG = 180, goldB = 41; // Gold #f0b429
  const whiteR = 255, whiteG = 255, whiteB = 255;
  const greenR = 47, greenG = 158, greenB = 92; // Bright green #2f9e5c

  const radius = size * 0.22;
  const cx = size / 2;
  const cy = size / 2;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (size * y + x) << 2;

      // Rounded rectangle test
      let inRect = false;
      let dx = 0, dy = 0;

      if (x < radius) dx = radius - x;
      else if (x > size - radius) dx = x - (size - radius);

      if (y < radius) dy = radius - y;
      else if (y > size - radius) dy = y - (size - radius);

      if (dx * dx + dy * dy <= radius * radius) {
        inRect = true;
      }

      if (!inRect) {
        png.data[idx] = 0;
        png.data[idx + 1] = 0;
        png.data[idx + 2] = 0;
        png.data[idx + 3] = 0; // Transparent outside
        continue;
      }

      // Background gradient (forest to deep emerald)
      const grad = y / size;
      const r = Math.round(bgR * (1 - grad * 0.3));
      const g = Math.round(bgG + (greenG - bgG) * grad * 0.4);
      const b = Math.round(bgB * (1 - grad * 0.3));

      png.data[idx] = r;
      png.data[idx + 1] = g;
      png.data[idx + 2] = b;
      png.data[idx + 3] = 255;

      // Draw Delivery Bag / Shopping Box Icon in Center
      const iconSize = size * 0.52;
      const left = (size - iconSize) / 2;
      const right = left + iconSize;
      const top = (size - iconSize) / 2 + size * 0.05;
      const bottom = top + iconSize * 0.85;

      // Outer bag outline
      if (x >= left && x <= right && y >= top && y <= bottom) {
        // Handle of the bag
        const handleR = iconSize * 0.25;
        const handleCx = cx;
        const handleCy = top - handleR * 0.2;
        const distHandle = Math.sqrt((x - handleCx) ** 2 + (y - handleCy) ** 2);

        if (distHandle >= handleR - size * 0.03 && distHandle <= handleR + size * 0.03 && y < top) {
          png.data[idx] = goldR;
          png.data[idx + 1] = goldG;
          png.data[idx + 2] = goldB;
        }

        // Bag Body
        if (y >= top) {
          // Inner padding test
          const borderWidth = size * 0.035;
          if (
            x < left + borderWidth ||
            x > right - borderWidth ||
            y < top + borderWidth ||
            y > bottom - borderWidth
          ) {
            // Gold border
            png.data[idx] = goldR;
            png.data[idx + 1] = goldG;
            png.data[idx + 2] = goldB;
          } else {
            // Inside bag - draw a lightning/speed bolt or letter "A"
            const relX = (x - left) / iconSize;
            const relY = (y - top) / (iconSize * 0.85);

            // Check if inside bolt/check mark shape
            if (
              (relX >= 0.3 && relX <= 0.7 && relY >= 0.3 && relY <= 0.4) ||
              (relX >= 0.42 && relX <= 0.58 && relY >= 0.2 && relY <= 0.8) ||
              (relX >= 0.25 && relX <= 0.75 && relY >= 0.6 && relY <= 0.7)
            ) {
              png.data[idx] = whiteR;
              png.data[idx + 1] = whiteG;
              png.data[idx + 2] = whiteB;
            }
          }
        }
      }
    }
  }

  const buffer = PNG.sync.write(png);
  fs.writeFileSync(filename, buffer);
  console.log(`Generated ${filename} (${size}x${size})`);
}

createIcon(192, './icon-192.png');
createIcon(512, './icon-512.png');
createIcon(180, './apple-touch-icon.png');
createIcon(64, './favicon.png');

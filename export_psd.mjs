import fs from 'fs';
import path from 'path';
import { createCanvas } from 'canvas';
import { readPsd, initializeCanvas } from 'ag-psd';

initializeCanvas((w, h) => createCanvas(w, h));

console.log('Reading PSD buffer...');
const buffer = fs.readFileSync('パンフレット用 1.psd');
console.log('Parsing PSD...');
const psd = readPsd(buffer);

const targetDir = path.join('public', 'assets', 'poster');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const manifest = [];
let index = 0;

function processLayer(layer, folderPath = '') {
  const currentPath = folderPath ? `${folderPath}/${layer.name || 'root'}` : (layer.name || 'root');

  if (layer.children) {
    layer.children.forEach(child => processLayer(child, currentPath));
    return;
  }

  index++;
  const padIndex = String(index).padStart(2, '0');
  
  let safeName = (layer.name || 'layer').replace(/[^a-zA-Z0-9_\-\u3000-\u30FE\u4E00-\u9FA0\uFF01-\uFF5E]/g, '_');
  const filename = `psd_${padIndex}_${safeName}.png`;
  const filepath = path.join(targetDir, filename);

  const fullCanvas = createCanvas(psd.width || 2480, psd.height || 3508);
  const ctx = fullCanvas.getContext('2d');

  let hasContent = false;
  if (layer.canvas && layer.canvas.width > 0 && layer.canvas.height > 0) {
    ctx.drawImage(layer.canvas, layer.left || 0, layer.top || 0);
    hasContent = true;
  }

  const buf = fullCanvas.toBuffer('image/png');
  fs.writeFileSync(filepath, buf);

  // ag-psd の opacity は 0.0 ~ 1.0 の浮動小数点数
  const opacityVal = layer.opacity !== undefined ? Number(layer.opacity.toFixed(3)) : 1.0;

  manifest.push({
    index,
    name: layer.name || 'Unnamed Layer',
    path: currentPath,
    filename,
    hidden: !!layer.hidden,
    blendMode: layer.blendMode || 'normal',
    opacity: opacityVal,
    left: layer.left || 0,
    top: layer.top || 0,
    right: layer.right || 0,
    bottom: layer.bottom || 0,
    hasContent,
    isText: currentPath.includes('fonts')
  });

  console.log(`[${padIndex}] Exported: ${filename} (blend: ${layer.blendMode || 'normal'}, opacity: ${opacityVal}, hidden: ${!!layer.hidden})`);
}

processLayer(psd);

fs.writeFileSync(path.join(targetDir, 'psd_layers_manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`Exported ${manifest.length} layers successfully!`);

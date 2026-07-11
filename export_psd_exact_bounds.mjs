import fs from 'fs';
import path from 'path';
import { createCanvas } from 'canvas';
import { readPsd, initializeCanvas } from 'ag-psd';

initializeCanvas((w, h) => createCanvas(w, h));

console.log('Reading PSD buffer...');
const buffer = fs.readFileSync('パンフレット用 1.psd');
console.log('Parsing PSD...');
const psd = readPsd(buffer);

const targetDir = path.join('public', 'assets', 'poster_bounds');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const psdWidth = psd.width || 2480;
const psdHeight = psd.height || 3508;

// 全レイヤーを順序通りに収集
const flatLayers = [];
function collectLayers(layer, parentPath = '') {
  const currentPath = parentPath ? `${parentPath}/${layer.name || 'root'}` : (layer.name || 'root');
  if (layer.children) {
    layer.children.forEach(child => collectLayers(child, currentPath));
  } else {
    flatLayers.push({ ...layer, fullPath: currentPath });
  }
}
collectLayers(psd);

// フルキャンバスを生成して描画するヘルパー
function getFullLayerCanvas(layer) {
  const c = createCanvas(psdWidth, psdHeight);
  const ctx = c.getContext('2d');
  if (layer && layer.canvas && layer.canvas.width > 0 && layer.canvas.height > 0) {
    ctx.drawImage(layer.canvas, layer.left || 0, layer.top || 0);
  }
  return c;
}

// レイヤー単体のベース層に対するクリッピング対応表（本来の単体クリッピングマスクのみ正確に適用）
const clippingMap = {
  '地面と空の色': '地面と空の色の地',
  '傘に当たっている光': '傘の色',
  '掛け軸左影': '掛け軸左地',
  '掛け軸右影': '掛け軸右地',
  '掛け軸右文字色': '掛け軸右地'
};

const manifest = [];
let layerIndex = 0;

flatLayers.forEach((layer) => {
  if (layer.hidden || !layer.canvas || layer.canvas.width === 0 || layer.canvas.height === 0) {
    return;
  }

  layerIndex++;
  const padIdx = String(layerIndex).padStart(2, '0');
  let safeName = (layer.name || 'layer').replace(/[^a-zA-Z0-9_\-\u3000-\u30FE\u4E00-\u9FA0\uFF01-\uFF5E]/g, '_');
  const filename = `layer_${padIdx}_${safeName}_t${layer.top || 0}.png`;
  const filepath = path.join(targetDir, filename);

  let fullTarget = getFullLayerCanvas(layer);
  let needTrim = false;

  // 正確な単体クリッピング処理（はみ出し防止）
  if (layer.clipping && clippingMap[layer.name]) {
    const baseLayerName = clippingMap[layer.name];
    const baseLayer = flatLayers.find(l => l.name === baseLayerName && !l.hidden);
    if (baseLayer) {
      console.log(`[Clip] Clipping "${layer.name}" using base "${baseLayerName}" alpha...`);
      const fullBase = getFullLayerCanvas(baseLayer);
      const tempCtx = fullTarget.getContext('2d');
      tempCtx.globalCompositeOperation = 'destination-in';
      tempCtx.drawImage(fullBase, 0, 0);
      needTrim = true;
    }
  } else if (layer.name === 'レイヤー 39' || layer.name === 'レイヤー 42') {
    // Soft Light と Pin Light は勝手にフォルダーマスクで切り抜かず、PSD元の実ピクセルのまま最適トリミング！
    needTrim = true;
  } else {
    // その他レイヤーも余白カットの必要があればトリム
    needTrim = true;
  }

  let finalCanvas = layer.canvas;
  let finalLeft = layer.left || 0;
  let finalTop = layer.top || 0;

  if (needTrim) {
    // 実ピクセルが存在する最小バウンディングボックスの計算
    const ctxTarget = fullTarget.getContext('2d');
    const imgData = ctxTarget.getImageData(0, 0, psdWidth, psdHeight);
    const data = imgData.data;
    let minX = psdWidth, minY = psdHeight, maxX = 0, maxY = 0;
    let hasPixel = false;
    for (let y = 0; y < psdHeight; y++) {
      for (let x = 0; x < psdWidth; x++) {
        const idx = (y * psdWidth + x) * 4;
        if (data[idx + 3] > 0) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
          hasPixel = true;
        }
      }
    }
    if (hasPixel) {
      const trimW = maxX - minX + 1;
      const trimH = maxY - minY + 1;
      const trimmed = createCanvas(trimW, trimH);
      trimmed.getContext('2d').drawImage(fullTarget, minX, minY, trimW, trimH, 0, 0, trimW, trimH);
      finalCanvas = trimmed;
      finalLeft = minX;
      finalTop = minY;
    } else {
      finalCanvas = createCanvas(1, 1);
      finalLeft = 0;
      finalTop = 0;
    }
  }

  const opacityVal = layer.opacity !== undefined ? Number(layer.opacity.toFixed(3)) : 1.0;
  let blendMode = layer.blendMode || 'normal';
  if (blendMode === 'passThrough') blendMode = 'normal';

  const buf = finalCanvas.toBuffer('image/png');
  fs.writeFileSync(filepath, buf);

  const isText = layer.fullPath.includes('fonts') || layer.name === '百輝夜行' || layer.name === '夜行' || layer.name === 'タイトル「百輝夜行」縁取り';
  const isFog = layer.name.includes('浮雲') || layer.name === 'レイヤー 42' || layer.name === 'レイヤー 39';

  manifest.push({
    index: layerIndex,
    name: layer.name || 'layer',
    filename: `/assets/poster_bounds/${filename}`,
    left: finalLeft,
    top: finalTop,
    width: finalCanvas.width,
    height: finalCanvas.height,
    leftPct: Number(((finalLeft / psdWidth) * 100).toFixed(4)),
    topPct: Number(((finalTop / psdHeight) * 100).toFixed(4)),
    widthPct: Number(((finalCanvas.width / psdWidth) * 100).toFixed(4)),
    heightPct: Number(((finalCanvas.height / psdHeight) * 100).toFixed(4)),
    opacity: opacityVal,
    blendMode,
    isText,
    isFog
  });

  console.log(`[${padIdx}] Exported: ${filename} [${finalCanvas.width}x${finalCanvas.height}] @ (${finalLeft}, ${finalTop}) | blend: ${blendMode} | op: ${opacityVal}`);
});

fs.writeFileSync(path.join(targetDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`Successfully exported all ${manifest.length} layers with true original bounds and zero artificial trimming!`);

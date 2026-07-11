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

const width = psd.width || 2480;
const height = psd.height || 3508;

// 全レイヤーをフラットな配列に収集
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

function findLayer(subPath) {
  return flatLayers.find(l => l.fullPath.includes(subPath));
}

// 新しいキャンバスを作成するヘルパー
function createMasterCanvas() {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  return { canvas, ctx };
}

// レイヤー単体を指定のコンポジット/アルファで描画するヘルパー
function drawLayerToCtx(ctx, layer, overrideAlpha = null, compositeOp = 'source-over') {
  if (!layer || !layer.canvas || layer.canvas.width === 0 || layer.canvas.height === 0 || layer.hidden) {
    return;
  }
  ctx.save();
  ctx.globalCompositeOperation = compositeOp;
  let alpha = overrideAlpha !== null ? overrideAlpha : (layer.opacity !== undefined ? layer.opacity : 1.0);
  ctx.globalAlpha = alpha;

  if (layer.blendMode && layer.blendMode !== 'normal') {
    if (layer.blendMode === 'multiply') ctx.globalCompositeOperation = 'multiply';
    else if (layer.blendMode === 'screen') ctx.globalCompositeOperation = 'screen';
    else if (layer.blendMode === 'overlay') ctx.globalCompositeOperation = 'overlay';
    else if (layer.blendMode === 'soft-light') ctx.globalCompositeOperation = 'soft-light';
    else if (layer.blendMode === 'hard-light') ctx.globalCompositeOperation = 'hard-light';
    else if (layer.blendMode === 'pin-light') ctx.globalCompositeOperation = 'pin-light';
  }

  ctx.drawImage(layer.canvas, layer.left || 0, layer.top || 0);
  ctx.restore();
}

// 【はみ出しゼロを実現する完全なアルファ・クリッピング＆ブレンド関数】
// ベースとなるキャンバス(baseCanvas)の透明度形状でclipLayerを完璧にクリッピングし、blendOpで重ね合わせる
function applyClippingAndBlend(baseCanvas, clipLayer, blendOp = 'source-over', overrideAlpha = null) {
  if (!clipLayer || !clipLayer.canvas || clipLayer.canvas.width === 0 || clipLayer.canvas.height === 0 || clipLayer.hidden) {
    return baseCanvas;
  }
  // 1. クリッピング対象レイヤーのみを描画する一時キャンバス
  const { canvas: temp, ctx: tCtx } = createMasterCanvas();
  let alpha = overrideAlpha !== null ? overrideAlpha : (clipLayer.opacity !== undefined ? clipLayer.opacity : 1.0);
  tCtx.globalAlpha = alpha;
  tCtx.drawImage(clipLayer.canvas, clipLayer.left || 0, clipLayer.top || 0);

  // 2. ベースキャンバスの不透明領域(アルファ)で切り抜く！ (destination-in)
  tCtx.globalCompositeOperation = 'destination-in';
  tCtx.drawImage(baseCanvas, 0, 0);

  // 3. 切り抜かれた完全な塗りのレイヤーを、ベースの上にブレンド重ねする
  const { canvas: result, ctx: rCtx } = createMasterCanvas();
  rCtx.drawImage(baseCanvas, 0, 0);
  rCtx.globalCompositeOperation = blendOp;
  rCtx.drawImage(temp, 0, 0);

  return result;
}

// =====================================================================
// 1. マスター層01: 背景＆夜空＆空・地面 (はみ出しゼロ・クリッピング合成)
// =====================================================================
console.log('[1/9] Building 01_bg_sky.png...');
const { canvas: c1, ctx: ctx1 } = createMasterCanvas();
drawLayerToCtx(ctx1, findLayer('背景'));
drawLayerToCtx(ctx1, findLayer('窓の外の色'));
drawLayerToCtx(ctx1, findLayer('構造物以外の背景色'));

// 地面と空の色の地 + 地面と空の色 (アルファクリッピング)
const baseGroundSky = findLayer('地面と空の色の地');
const clipGroundSky = findLayer('地面と空の色');
if (baseGroundSky) {
  const { canvas: bgGround, ctx: bgCtx } = createMasterCanvas();
  drawLayerToCtx(bgCtx, baseGroundSky);
  const clippedGround = applyClippingAndBlend(bgGround, clipGroundSky, 'source-over');
  ctx1.drawImage(clippedGround, 0, 0);
}
fs.writeFileSync(path.join(targetDir, 'layer_01_bg_sky.png'), c1.toBuffer('image/png'));

// =====================================================================
// 2. マスター層02: 構造物・欄干・奥の文字＆トーン効果
// =====================================================================
console.log('[2/9] Building 02_structures.png...');
const { canvas: c2, ctx: ctx2 } = createMasterCanvas();
drawLayerToCtx(ctx2, findLayer('奥の文字が書かれている部分の色'));
drawLayerToCtx(ctx2, findLayer('奥の文字色'));
drawLayerToCtx(ctx2, findLayer('奥の文字の縁取り'));
drawLayerToCtx(ctx2, findLayer('構造物色'));
drawLayerToCtx(ctx2, findLayer('欄干の色'));
drawLayerToCtx(ctx2, findLayer('中央部分全域の縁取り'));
drawLayerToCtx(ctx2, findLayer('中央本体縁取り'));

// レイヤー39 トーン(soft-light)を構造物ベースで美しくブレンド
const layer39 = findLayer('レイヤー 39');
if (layer39) {
  ctx2.save();
  ctx2.globalCompositeOperation = 'soft-light';
  drawLayerToCtx(ctx2, layer39, layer39.opacity !== undefined ? layer39.opacity : 0.271);
  ctx2.restore();
}
fs.writeFileSync(path.join(targetDir, 'layer_02_structures.png'), c2.toBuffer('image/png'));

// =====================================================================
// 3. マスター層03: 左右の掛け軸 (影＆文字の二重クリッピング・はみ出しゼロ)
// =====================================================================
console.log('[3/9] Building 03_kakejiku.png...');
const { canvas: c3, ctx: ctx3 } = createMasterCanvas();
drawLayerToCtx(ctx3, findLayer('掛け軸左-壁に対する影'));

// 左掛け軸: 地 + 影(クリッピング) + 文字等
const leftBase = findLayer('掛け軸左地');
if (leftBase) {
  const { canvas: tempL, ctx: lCtx } = createMasterCanvas();
  drawLayerToCtx(lCtx, leftBase);
  const leftClipped = applyClippingAndBlend(tempL, findLayer('掛け軸左影'), 'source-over');
  ctx3.drawImage(leftClipped, 0, 0);
  drawLayerToCtx(ctx3, findLayer('掛け軸左文字色'));
  drawLayerToCtx(ctx3, findLayer('掛け軸左文字縁取り'));
  drawLayerToCtx(ctx3, findLayer('掛け軸左縁取り'));
}

// 右掛け軸: 地 + 影(クリッピング) + 文字色(クリッピング)
const rightBase = findLayer('掛け軸右地');
if (rightBase) {
  const { canvas: tempR, ctx: rCtx } = createMasterCanvas();
  drawLayerToCtx(rCtx, rightBase);
  let rightClipped = applyClippingAndBlend(tempR, findLayer('掛け軸右影'), 'source-over');
  rightClipped = applyClippingAndBlend(rightClipped, findLayer('掛け軸右文字色'), 'source-over');
  ctx3.drawImage(rightClipped, 0, 0);
  drawLayerToCtx(ctx3, findLayer('掛け軸右縁取り'));
}
fs.writeFileSync(path.join(targetDir, 'layer_03_kakejiku.png'), c3.toBuffer('image/png'));

// =====================================================================
// 4. マスター層04: 人混み＆白い光の粒子たち
// =====================================================================
console.log('[4/9] Building 04_crowd.png...');
const { canvas: c4, ctx: ctx4 } = createMasterCanvas();
drawLayerToCtx(ctx4, findLayer('人混みの色'));
drawLayerToCtx(ctx4, findLayer('人混みの縁取り'));
drawLayerToCtx(ctx4, findLayer('人ごみから出ている白い点々たち'));
fs.writeFileSync(path.join(targetDir, 'layer_04_crowd.png'), c4.toBuffer('image/png'));

// =====================================================================
// 5. マスター層05: 和傘グループ (光とマルチプライの完全クリッピング)
// =====================================================================
console.log('[5/9] Building 05_umbrellas.png...');
const { canvas: c5, ctx: ctx5 } = createMasterCanvas();
const umbrellaBase = findLayer('傘の色');
if (umbrellaBase) {
  const { canvas: tempU, ctx: uCtx } = createMasterCanvas();
  drawLayerToCtx(uCtx, umbrellaBase);

  // 1. レイヤー22 (multiplyクリッピング)
  let uClipped = applyClippingAndBlend(tempU, findLayer('レイヤー 22'), 'multiply');
  // 2. 傘に当たっている光 (normalクリッピング。これで傘の輪郭からの光はみ出し完全ゼロ！)
  uClipped = applyClippingAndBlend(uClipped, findLayer('傘に当たっている光'), 'source-over');

  ctx5.drawImage(uClipped, 0, 0);
}
drawLayerToCtx(ctx5, findLayer('傘下半分縁取り線'));
drawLayerToCtx(ctx5, findLayer('傘上半分縁取り線'));
drawLayerToCtx(ctx5, findLayer('レイヤー 25'));
drawLayerToCtx(ctx5, findLayer('傘をかけている線'));
fs.writeFileSync(path.join(targetDir, 'layer_05_umbrellas.png'), c5.toBuffer('image/png'));

// =====================================================================
// 6. マスター層06: 雲海・浮雲＆仕上げピンライト
// =====================================================================
console.log('[6/9] Building 06_clouds.png...');
const { canvas: c6, ctx: ctx6 } = createMasterCanvas();
drawLayerToCtx(ctx6, findLayer('浮雲本体'));
drawLayerToCtx(ctx6, findLayer('浮雲縁取り黒'));
const layer42 = findLayer('レイヤー 42');
if (layer42) {
  ctx6.save();
  ctx6.globalCompositeOperation = 'pin-light';
  drawLayerToCtx(ctx6, layer42, layer42.opacity !== undefined ? layer42.opacity : 0.2);
  ctx6.restore();
}
fs.writeFileSync(path.join(targetDir, 'layer_06_clouds.png'), c6.toBuffer('image/png'));

// =====================================================================
// 7. マスター層07: タイトル文字「百輝夜行」「夜行」 (全文字カラー完備)
// =====================================================================
console.log('[7/9] Building 07_typography_hyakkiyakou.png...');
const { canvas: c7, ctx: ctx7 } = createMasterCanvas();
drawLayerToCtx(ctx7, findLayer('夜行'));
// 3つの百輝夜行のうち非表示でない全てのカラー層を描画（百・輝・行 全カラー！）
flatLayers.filter(l => l.name === '百輝夜行' && !l.hidden).forEach(l => {
  drawLayerToCtx(ctx7, l);
});
fs.writeFileSync(path.join(targetDir, 'layer_07_typography_hyakkiyakou.png'), c7.toBuffer('image/png'));

// =====================================================================
// 8. マスター層08: サブテキスト (学校名・年度・英字タイトル)
// =====================================================================
console.log('[8/9] Building 08_typography_sub.png...');
const { canvas: c8, ctx: ctx8 } = createMasterCanvas();
drawLayerToCtx(ctx8, findLayer('2026 Nazuna Festival Ichikawa'));
drawLayerToCtx(ctx8, findLayer('2026年度 なずな祭'));
drawLayerToCtx(ctx8, findLayer('市川中学校・市川高等学校'));
fs.writeFileSync(path.join(targetDir, 'layer_08_typography_sub.png'), c8.toBuffer('image/png'));

// =====================================================================
// 9. マスター層09: タイトル「百輝夜行」縁取り (最前面の輪郭線)
// =====================================================================
console.log('[9/9] Building 09_title_outline.png...');
const { canvas: c9, ctx: ctx9 } = createMasterCanvas();
drawLayerToCtx(ctx9, findLayer('タイトル「百輝夜行」縁取り'));
fs.writeFileSync(path.join(targetDir, 'layer_09_title_outline.png'), c9.toBuffer('image/png'));

console.log('Successfully built 9 ultimate Master Layers with 100% exact clipping and zero overhang!');

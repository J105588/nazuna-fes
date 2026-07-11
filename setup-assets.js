import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceRoot = path.join(__dirname, 'パンフレット用 1');
const targetDir = path.join(__dirname, 'public', 'assets', 'poster');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const mapping = {
  "背景.png": "bg_night_sky.png",
  "レイヤー 42.png": "layer_42_overlay.png",
  "完成版.png": "poster_complete.png",
  "浮雲本体.png": "cloud_main.png",
  "浮雲縁取り黒.png": "cloud_outline.png",
  "2026 Nazuna Festival Ichikawa.png": "text_2026_nazuna_en.png",
  "2026年度 なずな祭.png": "text_2026_nazuna_ja.png",
  "タイトル「百輝夜行」縁取り.png": "title_hyakki_outline.png",
  "市川中学校・市川高等学校.png": "text_ichikawa_school.png",
  "百輝夜行.png": "title_hyakki_color.png",
  "夜行.png": "title_yakou_sub.png",
  "レイヤー 39.png": "layer_39_tone.png",
  "人ごみから出ている白い点々たち.png": "sparkles_dots.png",
  "地面と空の色.png": "senga_ground_sky_color.png",
  "地面と空の色の地.png": "senga_ground_sky_base.png",
  "構造物以外の背景色.png": "senga_bg_non_structure.png",
  "構造物色.png": "senga_structure_color.png",
  "欄干の色.png": "senga_railing_color.png",
  "窓の外の色.png": "senga_window_lights.png",
  "中央本体縁取り.png": "senga_center_outline.png",
  "中央部分全域の縁取り.png": "senga_center_full_outline.png",
  "レイヤー 16.png": "layer_16_shadow.png",
  "奥の文字が書かれている部分の色.png": "senga_back_text_area.png",
  "奥の文字色.png": "senga_back_text_color.png",
  "奥の文字の縁取り.png": "senga_back_text_outline.png",
  "掛け軸左地.png": "kakejiku_left_base.png",
  "掛け軸左影.png": "kakejiku_left_shadow.png",
  "掛け軸左文字色.png": "kakejiku_left_text_color.png",
  "掛け軸左文字縁取り.png": "kakejiku_left_text_outline.png",
  "掛け軸左-壁に対する影.png": "kakejiku_left_wall_shadow.png",
  "掛け軸左縁取り.png": "kakejiku_left_outline.png",
  "掛け軸右地.png": "kakejiku_right_base.png",
  "掛け軸右影.png": "kakejiku_right_shadow.png",
  "掛け軸右文字色.png": "kakejiku_right_text_color.png",
  "掛け軸右縁取り.png": "kakejiku_right_outline.png",
  "傘の色.png": "umbrella_color.png",
  "傘に当たっている光.png": "umbrella_light.png",
  "傘をかけている線.png": "umbrella_hanging_lines.png",
  "傘上半分縁取り線.png": "umbrella_upper_outline.png",
  "傘下半分縁取り線.png": "umbrella_lower_outline.png",
  "レイヤー 25.png": "umbrella_layer_25.png",
  "人混みの色.png": "crowd_color.png",
  "人混みの縁取り.png": "crowd_outline.png"
};

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });

  return arrayOfFiles;
}

const allFiles = getAllFiles(sourceRoot);
let copiedCount = 0;

allFiles.forEach(filePath => {
  const fileName = path.basename(filePath);
  const targetName = mapping[fileName];
  if (targetName) {
    const destPath = path.join(targetDir, targetName);
    fs.copyFileSync(filePath, destPath);
    console.log(`Copied: ${fileName} -> ${targetName}`);
    copiedCount++;
  } else {
    console.warn(`No mapping found for: ${fileName}`);
  }
});

console.log(`Done! Copied ${copiedCount} / ${Object.keys(mapping).length} assets.`);

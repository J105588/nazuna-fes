# setup-assets.ps1
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
$ErrorActionPreference = 'Stop'

$targetDir = ".\public\assets\poster"
if (-not (Test-Path $targetDir)) {
    New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
}

$files = Get-ChildItem -Path ".\パンフレット用 1" -Recurse -File

$mapping = @{
    "背景.png" = "bg_night_sky.png"
    "レイヤー 42.png" = "layer_42_overlay.png"
    "完成版.png" = "poster_complete.png"
    "浮雲本体.png" = "cloud_main.png"
    "浮雲縁取り黒.png" = "cloud_outline.png"
    "2026 Nazuna Festival Ichikawa.png" = "text_2026_nazuna_en.png"
    "2026年度 なずな祭.png" = "text_2026_nazuna_ja.png"
    "タイトル「百輝夜行」縁取り.png" = "title_hyakki_outline.png"
    "市川中学校・市川高等学校.png" = "text_ichikawa_school.png"
    "百輝夜行.png" = "title_hyakki_color.png"
    "夜行.png" = "title_yakou_sub.png"
    "レイヤー 39.png" = "layer_39_tone.png"
    "人ごみから出ている白い点々たち.png" = "sparkles_dots.png"
    "地面と空の色.png" = "senga_ground_sky_color.png"
    "地面と空の色の地.png" = "senga_ground_sky_base.png"
    "構造物以外の背景色.png" = "senga_bg_non_structure.png"
    "構造物色.png" = "senga_structure_color.png"
    "欄干の色.png" = "senga_railing_color.png"
    "窓の外の色.png" = "senga_window_lights.png"
    "中央本体縁取り.png" = "senga_center_outline.png"
    "中央部分全域の縁取り.png" = "senga_center_full_outline.png"
    "レイヤー 16.png" = "layer_16_shadow.png"
    "奥の文字が書かれている部分の色.png" = "senga_back_text_area.png"
    "奥の文字色.png" = "senga_back_text_color.png"
    "奥の文字の縁取り.png" = "senga_back_text_outline.png"
    "掛け軸左地.png" = "kakejiku_left_base.png"
    "掛け軸左影.png" = "kakejiku_left_shadow.png"
    "掛け軸左文字色.png" = "kakejiku_left_text_color.png"
    "掛け軸左文字縁取り.png" = "kakejiku_left_text_outline.png"
    "掛け軸左-壁に対する影.png" = "kakejiku_left_wall_shadow.png"
    "掛け軸左縁取り.png" = "kakejiku_left_outline.png"
    "掛け軸右地.png" = "kakejiku_right_base.png"
    "掛け軸右影.png" = "kakejiku_right_shadow.png"
    "掛け軸右文字色.png" = "kakejiku_right_text_color.png"
    "掛け軸右縁取り.png" = "kakejiku_right_outline.png"
    "傘の色.png" = "umbrella_color.png"
    "傘に当たっている光.png" = "umbrella_light.png"
    "傘をかけている線.png" = "umbrella_hanging_lines.png"
    "傘上半分縁取り線.png" = "umbrella_upper_outline.png"
    "傘下半分縁取り線.png" = "umbrella_lower_outline.png"
    "レイヤー 25.png" = "umbrella_layer_25.png"
    "人混みの色.png" = "crowd_color.png"
    "人混みの縁取り.png" = "crowd_outline.png"
}

$copiedCount = 0
foreach ($file in $files) {
    $targetName = $mapping[$file.Name]
    if ($targetName) {
        $destPath = Join-Path $targetDir $targetName
        Copy-Item -Path $file.FullName -Destination $destPath -Force
        Write-Host "Copied: $($file.Name) -> $targetName"
        $copiedCount++
    } else {
        Write-Warning "No mapping found for: $($file.Name)"
    }
}

Write-Host "Done! Copied $copiedCount / $($mapping.Count) assets."

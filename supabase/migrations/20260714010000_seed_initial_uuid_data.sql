-- ============================================================================
-- なずな祭 2026「百輝夜行」公式ポータル — 初期シードデータ追加（UUID正規化）
-- マイグレーションID: 20260714010000_seed_initial_uuid_data.sql
-- ============================================================================

-- 2. 日程マスタのシード
INSERT INTO public.timetable_days (id, date_string, label, is_published, display_order)
VALUES
  ('day-1', '2026-09-19', 'DAY 1 (9/19)', true, 1),
  ('day-2', '2026-09-20', 'DAY 2 (9/20)', true, 2)
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  display_order = EXCLUDED.display_order;

-- 3. 出展団体・企画マスタ (UUID必須)
INSERT INTO public.organizations (id, name, category, genre, description, room_code, floor_info, image_url, inventory_status, is_published, use_menu_api, menu_owner_id)
VALUES
  ('a1111111-1111-4111-8111-111111111111', '3年A組「赤い和傘と極夜の謎解き迷宮」', 'class', 'attraction', '百輝夜行の世界観を完全に再現した巨大脱出ゲーム。あやかしの街角で失われた和傘の謎を解き明かせ！難易度調整可能な3つのルートを完備。', '3A', '本館3F 北側教室', '/assets/poster/poster_complete.png', 'STATUS_AVAILABLE', true, false, 'a1111111-1111-4111-8111-111111111111'),
  ('a2222222-2222-4222-8222-222222222222', '2年C組「極夜カフェ 〜緋と金のあやかし茶屋〜」', 'class', 'food', '市川学園名物の手作りマドレーヌと、夜をイメージした金粉入り極上の和風タピオカドリンクをお届けします。ポスターの窓の灯りを再現した癒やしの空間へどうぞ。', '2C', '本館2F 中央ホールそば', '/assets/poster/poster_complete.png', 'STATUS_AVAILABLE', true, false, 'a2222222-2222-4222-8222-222222222222'),
  ('a3333333-3333-4333-8333-333333333333', '軽音楽部「HYAKKI-YAKO ROCK FESTIVAL 2026」', 'club', 'stage', '中庭特設ステージを熱気と爆音で揺らす総勢12バンドの白熱ライブ！和モダンロックやオリジナルテーマソング「百の輝き」を初披露します。', 'STAGE-1', '中庭 屋外特設ステージ', '/assets/poster/poster_complete.png', 'STATUS_AVAILABLE', true, false, 'a3333333-3333-4333-8333-333333333333'),
  ('a4444444-4444-4444-8444-444444444444', '物理・科学部「あやかしネオンと光の実験展示」', 'club', 'exhibition', 'レーザー光線とホログラムで百輝夜行を科学の力で表現！自分で作れる蛍光和傘ストラップのワークショップも同時開催中。', 'SCI-3', '理科棟3F 物理実験室', '/assets/poster/poster_complete.png', 'STATUS_AVAILABLE', true, false, 'a4444444-4444-4444-8444-444444444444'),
  ('a5555555-5555-4555-8555-555555555555', '3年F組「百物語・戦慄のあやかし屋敷」', 'class', 'attraction', '最新の立体音響プロジェクションマッピング技術を結集させた本格お化け屋敷。赤い和傘を持って進む、未だかつてない恐怖と感動体験。', '3F', '本館3F 南側教室', '/assets/poster/poster_complete.png', 'STATUS_AVAILABLE', true, false, 'a5555555-5555-4555-8555-555555555555'),
  ('a6666666-6666-4666-8666-666666666666', '書道部「一筆書きの奇跡 〜毛筆の覚醒〜」', 'club', 'exhibition', 'ポスタービジュアルの原点となった力強い毛筆線画の巨大掛け軸展示と、当日の書道パフォーマンス。文字の中に灯る熱意を感じてください。', 'ART-1', '東館2F 書道室', '/assets/poster/poster_complete.png', 'STATUS_AVAILABLE', true, false, 'a6666666-6666-4666-8666-666666666666')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  room_code = EXCLUDED.room_code;

-- 4. タイムテーブル演目のシード (UUID必須)
INSERT INTO public.timetable_events (id, title, organization_id, organization_name, day_id, start_time, end_time, stage_location, is_published)
VALUES
  ('b1111111-1111-4111-8111-111111111111', 'オープニングセレモニー ＆ 書道パフォーマンス「百輝夜行」', 'a6666666-6666-4666-8666-666666666666', '書道部・文化祭実行委員会', 'day-1', '2026-09-19T09:00:00+09:00', '2026-09-19T09:45:00+09:00', 'gym', true),
  ('b2222222-2222-4222-8222-222222222222', '有志バンドトップバッター「THE NAZUNA BEATS」', 'a3333333-3333-4333-8333-333333333333', '軽音楽部有志', 'day-1', '2026-09-19T10:15:00+09:00', '2026-09-19T11:00:00+09:00', 'courtyard', true),
  ('b3333333-3333-4333-8333-333333333333', '演劇部 秋季特別公演「極夜にさす赤い傘」', NULL, '演劇部', 'day-1', '2026-09-19T11:30:00+09:00', '2026-09-19T12:45:00+09:00', 'av_room', true),
  ('b4444444-4444-4444-8444-444444444444', 'ダンス部メインステージ「HYAKKI DANCE PARADE」', NULL, 'ダンス部', 'day-2', '2026-09-20T13:30:00+09:00', '2026-09-20T14:30:00+09:00', 'gym', true),
  ('b5555555-5555-4555-8555-555555555555', '後夜祭フィナーレ ＆ 表彰式「金銀銅・ピラミッド授与式」', NULL, '文化祭実行委員会', 'day-2', '2026-09-20T16:00:00+09:00', '2026-09-20T17:15:00+09:00', 'gym', true)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  start_time = EXCLUDED.start_time,
  end_time = EXCLUDED.end_time;

-- 5. お知らせ配信のシード (UUID必須)
INSERT INTO public.announcements (id, title, content, category, is_published)
VALUES
  ('c1111111-1111-4111-8111-111111111111', '【重要】第1日目の開門および受付開始時間について', '本日9月12日(土)は午前8:45より正門・東門にて来場受付を開始いたします。招待チケットまたはデジタル入場コードをご準備のうえお並びください。', 'general', true),
  ('c2222222-2222-4222-8222-222222222222', '【雨天時変更】中庭ステージ演目の第一体育館への移動案内', '10:15開始予定の軽音楽部ライブ「THE NAZUNA BEATS」は、天候への配慮のため中庭特設ステージから第一体育館メインステージへ会場を変更して実施いたします。', 'stage', true),
  ('c3333333-3333-4333-8333-333333333333', '【緊急・混雑警報】3年F組お化け屋敷および2年C組カフェの整理券配布状況', '大変多くのご来場をいただき、3年F組および2年C組はただいま整理券によるご案内を実施中です。詳細はインフォメーションセンターまたは企画ページからご確認ください。', 'urgent', true)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content;

-- 6. 落とし物掲示板のシード (UUID必須)
INSERT INTO public.lost_items (id, item_name, found_place, storage_location, status)
VALUES
  ('d1111111-1111-4111-8111-111111111111', '黒い折り畳み傘 (木製ハンドル)', '第一体育館 入口ベンチ', '本館2階総合案内所', 'storage'),
  ('d2222222-2222-4222-8222-222222222222', '水色のパスケース・学生証在中', '中庭 屋台エリアそば', '本館2階総合案内所', 'storage'),
  ('d3333333-3333-4333-8333-333333333333', 'ワイヤレスイヤホン (白いケース)', '本館3F 北側階段踊り場', '本館2階総合案内所', 'returned')
ON CONFLICT (id) DO UPDATE SET
  item_name = EXCLUDED.item_name,
  status = EXCLUDED.status;

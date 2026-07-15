-- ページ公開・メニュー表示制御システム用 page_settings へのお知らせページ登録および全ページのタイトル等調整

INSERT INTO public.page_settings (id, title, is_public, custom_message, updated_at)
VALUES
  ('home', 'トップページ', true, '現在メンテナンス中です。しばらくお待ちください。', NOW()),
  ('news', '実行委員会からのお知らせ', true, '現在、お知らせ準備中です。公開までしばらくお待ちください。', NOW()),
  ('exhibitions', '出し物・展示 企画一覧', true, '現在、企画詳細を最終調整中です。公開までしばらくお待ちください。', NOW()),
  ('timetable', 'タイムテーブル', true, '現在、ステージスケジュールを最終調整中です。公開までしばらくお待ちください。', NOW()),
  ('map', '校内マップ', true, '現在、校内マップを準備中です。公開までしばらくお待ちください。', NOW()),
  ('guidance', 'ご案内・総合案内所', true, '現在準備中です。公開までしばらくお待ちください。', NOW()),
  ('info', 'テーマ「百輝夜行」について', true, '現在準備中です。公開までしばらくお待ちください。', NOW()),
  ('lostfound', '落とし物掲示板', true, '現在準備中です。公開までしばらくお待ちください。', NOW()),
  ('policy', 'プライバシー＆サイトポリシー', true, '現在準備中です。公開までしばらくお待ちください。', NOW())
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  updated_at = NOW();

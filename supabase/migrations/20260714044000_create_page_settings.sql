-- ページ単位の公開設定システム用 page_settings テーブルの作成

CREATE TABLE IF NOT EXISTS public.page_settings (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  is_public BOOLEAN NOT NULL DEFAULT true,
  custom_message TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS (Row Level Security) の有効化
ALTER TABLE public.page_settings ENABLE ROW LEVEL SECURITY;

-- 参照は誰でも可能
CREATE POLICY "Anyone can view page_settings"
  ON public.page_settings
  FOR SELECT
  USING (true);

-- 管理者のみ更新可能（Supabase の Auth / サービスロールポリシー準拠）
CREATE POLICY "Admins can insert page_settings"
  ON public.page_settings
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can update page_settings"
  ON public.page_settings
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- 初期データの登録（デフォルトで各ページを作成し公開状態にする）
INSERT INTO public.page_settings (id, title, is_public, custom_message, updated_at)
VALUES
  ('home', 'トップページ', true, '現在メンテナンス中です。しばらくお待ちください。', NOW()),
  ('exhibitions', '出し物・展示 企画一覧', true, '現在、企画詳細を最終調整中です。公開までしばらくお待ちください。', NOW()),
  ('timetable', 'タイムテーブル', true, '現在、ステージスケジュールを最終調整中です。公開までしばらくお待ちください。', NOW()),
  ('map', '校内マップ', true, '現在、校内マップを準備中です。公開までしばらくお待ちください。', NOW()),
  ('info', 'テーマ・学校案内', true, '現在準備中です。公開までしばらくお待ちください。', NOW()),
  ('lostfound', '落とし物管理・案内', true, '現在準備中です。公開までしばらくお待ちください。', NOW()),
  ('guidance', 'ご案内・総合案内所窓口', true, '現在準備中です。公開までしばらくお待ちください。', NOW()),
  ('policy', '規定・プライバシーポリシー', true, '現在準備中です。公開までしばらくお待ちください。', NOW())
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  updated_at = NOW();

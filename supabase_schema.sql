-- ==============================================================================
-- 2026年度 なずな祭公式サイト「百輝夜行」 Supabase 完璧なSQLセットアップスクリプト
-- ==============================================================================
-- このスクリプトを Supabase Dashboard -> SQL Editor に貼り付けて「Run」をクリックしてください。
-- テーブル作成、インデックス、RLSセキュリティポリシー、リアルタイム設定、初期データまで全て自動完了します。

-- 1. 既存のテーブル・型をリセット（再構築用）
DROP TABLE IF EXISTS public.timetable_events CASCADE;
DROP TABLE IF EXISTS public.organizations CASCADE;
DROP TYPE IF EXISTS public.inventory_status_enum CASCADE;

-- 2. 在庫状況・混雑状況列挙型 (Enum)
CREATE TYPE public.inventory_status_enum AS ENUM (
  'STATUS_AVAILABLE',  -- 販売中・案内スムーズ (グリーン/シアン)
  'STATUS_FEW',        -- 残りわずか・混雑 (イエロー/金茶)
  'STATUS_SOLD_OUT'    -- 完売御礼・受付終了 (深紅/和傘の赤)
);

-- 3. 出展団体・企画マスタテーブル (organizations)
CREATE TABLE public.organizations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('class', 'club')),
  genre TEXT NOT NULL CHECK (genre IN ('food', 'exhibition', 'attraction', 'stage')),
  description TEXT NOT NULL,
  room_code TEXT NOT NULL,
  floor_info TEXT NOT NULL,
  image_url TEXT,
  inventory_status public.inventory_status_enum NOT NULL DEFAULT 'STATUS_AVAILABLE',
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. タイムテーブル演目テーブル (timetable_events)
CREATE TABLE public.timetable_events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  organization_name TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  stage_location TEXT NOT NULL CHECK (stage_location IN ('gym', 'courtyard', 'av_room')),
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. 高速検索用インデックス
CREATE INDEX idx_organizations_genre ON public.organizations(genre);
CREATE INDEX idx_organizations_is_published ON public.organizations(is_published);
CREATE INDEX idx_timetable_stage_time ON public.timetable_events(stage_location, start_time);

-- 6. Supabase Realtime (リアルタイム更新) の有効化
ALTER PUBLICATION supabase_realtime ADD TABLE public.organizations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.timetable_events;

-- 7. Row Level Security (RLS) ポリシーの設定
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable_events ENABLE ROW LEVEL SECURITY;

-- 一般閲覧用：公開状態 (is_published = true) のデータのみ誰でも自由に参照可能
CREATE POLICY "Public can view published organizations"
  ON public.organizations FOR SELECT
  USING (is_published = true);

CREATE POLICY "Public can view published timetable events"
  ON public.timetable_events FOR SELECT
  USING (is_published = true);

-- 管理者・実行委員会用：認証済みロール・サービスロールは全ての権限 (SELECT, INSERT, UPDATE, DELETE) を持つ
CREATE POLICY "Admins can manage all organizations"
  ON public.organizations FOR ALL
  TO authenticated, service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can manage all timetable events"
  ON public.timetable_events FOR ALL
  TO authenticated, service_role
  USING (true)
  WITH CHECK (true);

-- 8. 初期サンプルマスタデータ投入
INSERT INTO public.organizations (id, name, category, genre, description, room_code, floor_info, image_url, inventory_status, is_published)
VALUES
  ('org-1', '3年A組「赤い和傘と極夜の謎解き迷宮」', 'class', 'attraction', '百輝夜行の世界観を完全に再現した巨大脱出ゲーム。あやかしの街角で失われた和傘の謎を解き明かせ！難易度調整可能な3つのルートを完備。', '3A', '本館3F 北側教室', '/assets/poster/poster_complete.png', 'STATUS_AVAILABLE', true),
  ('org-2', '2年C組「極夜カフェ 〜緋と金のあやかし茶屋〜」', 'class', 'food', '市川学園名物の手作りマドレーヌと、夜をイメージした金粉入り極上の和風タピオカドリンクをお届けします。ポスターの窓の灯りを再現した癒やしの空間へどうぞ。', '2C', '本館2F 中央ホールそば', '/assets/poster/poster_complete.png', 'STATUS_FEW', true),
  ('org-3', '軽音楽部「HYAKKI-YAKO ROCK FESTIVAL 2026」', 'club', 'stage', '中庭特設ステージを熱気と爆音で揺らす総勢12バンドの白熱ライブ！和モダンロックやオリジナルテーマソング「百の輝き」を初披露します。', 'STAGE-1', '中庭 屋外特設ステージ', '/assets/poster/poster_complete.png', 'STATUS_SOLD_OUT', true),
  ('org-4', '物理・科学部「あやかしネオンと光の実験展示」', 'club', 'exhibition', 'レーザー光線とホログラムで百輝夜行を科学の力で表現！自分で作れる蛍光和傘ストラップのワークショップも同時開催中。', 'SCI-3', '理科棟3F 物理実験室', '/assets/poster/poster_complete.png', 'STATUS_AVAILABLE', true),
  ('org-5', '3年F組「百物語・戦慄のあやかし屋敷」', 'class', 'attraction', '最新の立体音響プロジェクションマッピング技術を結集させた本格お化け屋敷。赤い和傘を持って進む、未だかつてない恐怖と感動体験。', '3F', '本館3F 南側教室', '/assets/poster/poster_complete.png', 'STATUS_AVAILABLE', true),
  ('org-6', '書道部「一筆書きの奇跡 〜毛筆の覚醒〜」', 'club', 'exhibition', 'ポスタービジュアルの原点となった力強い毛筆線画の巨大掛け軸展示と、当日の書道パフォーマンス。文字の中に灯る熱意を感じてください。', 'ART-1', '東館2F 書道室', '/assets/poster/poster_complete.png', 'STATUS_AVAILABLE', true);

INSERT INTO public.timetable_events (id, title, organization_name, start_time, end_time, stage_location, is_published)
VALUES
  ('evt-1', 'オープニングセレモニー ＆ 書道パフォーマンス「百輝夜行」', '書道部・文化祭実行委員会', '2026-09-12T09:00:00+09:00', '2026-09-12T09:45:00+09:00', 'gym', true),
  ('evt-2', '有志バンドトップバッター「THE NAZUNA BEATS」', '軽音楽部有志', '2026-09-12T10:15:00+09:00', '2026-09-12T11:00:00+09:00', 'courtyard', true),
  ('evt-3', '演劇部 秋季特別公演「極夜にさす赤い傘」', '演劇部', '2026-09-12T11:30:00+09:00', '2026-09-12T12:45:00+09:00', 'av_room', true),
  ('evt-4', 'ダンス部メインステージ「HYAKKI DANCE PARADE」', 'ダンス部', '2026-09-12T13:30:00+09:00', '2026-09-12T14:30:00+09:00', 'gym', true),
  ('evt-5', '後夜祭フィナーレ ＆ 表彰式「金銀銅・ピラミッド授与式」', '文化祭実行委員会', '2026-09-12T16:00:00+09:00', '2026-09-12T17:15:00+09:00', 'gym', true);

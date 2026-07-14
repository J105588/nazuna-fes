-- ============================================================================
-- なずな祭 2026「百輝夜行」公式ポータル — Supabase DB & Auth 統合マイグレーション
-- マイグレーションID: 20260714000000_redesign_db_auth_schema.sql
-- ============================================================================
-- 対象テーブルおよび機能:
--   1. organizations       … クラス・部活・有志団体マスタ (メニュー在庫API連動対応)
--   2. timetable_days      … 日程マスタ（DAY 1, DAY 2 等）
--   3. timetable_events    … ステージ演目・タイムテーブル (外部キー&カスケード整合)
--   4. announcements       … リアルタイムお知らせ・速報配信
--   5. lost_items          … 落とし物掲示板 (画像URL&ステータス管理)
--   6. admin_users         … 管理画面ログインアカウント（Supabase Auth 連動）
--   7. pyramid_releases    … ピラミッド結果開示スケジュール＆集計ロック管理
--   8. 権限(RLS)ポリシー＆双方向Auth連動トリガー定義
-- ============================================================================

-- 0. 必須拡張機能の有効化
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. organizations（出展団体・企画マスタ）
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.organizations (
  id              uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            text        NOT NULL,
  category        text        NOT NULL DEFAULT 'class'
                              CHECK (category IN ('class', 'club', 'volunteer')),
  genre           text        NOT NULL DEFAULT 'exhibition'
                              CHECK (genre IN ('food', 'exhibition', 'attraction', 'stage')),
  room_code       text        NOT NULL DEFAULT '',
  floor_info      text        NOT NULL DEFAULT '',
  description     text,
  image_url       text,
  is_published    boolean     NOT NULL DEFAULT false,

  -- リアルタイム在庫ステータス連携 (NazunaGraph API 等)
  inventory_status text       DEFAULT 'STATUS_AVAILABLE'
                              CHECK (inventory_status IN (
                                'STATUS_AVAILABLE', 'STATUS_FEW',
                                'STATUS_SOLD_OUT', 'STATUS_PREPARING'
                              )),

  -- NazunaGraph メニュー在庫API連携オプション
  use_menu_api    boolean     NOT NULL DEFAULT false,
  menu_owner_id   text,

  updated_at      timestamptz NOT NULL DEFAULT now(),
  created_at      timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE  public.organizations IS 'クラス・部活動・有志企画などの出展団体マスタ';
COMMENT ON COLUMN public.organizations.category IS '区分: class=クラス展示, club=部活動・委員会, volunteer=有志企画';
COMMENT ON COLUMN public.organizations.genre IS 'ジャンル: food=飲食, exhibition=展示, attraction=アトラクション, stage=ステージ';
COMMENT ON COLUMN public.organizations.room_code IS '教室・ステージ識別コード (例: 3A, STAGE-1)';
COMMENT ON COLUMN public.organizations.floor_info IS '階層・場所情報 (例: 本館3階 北側教室)';
COMMENT ON COLUMN public.organizations.is_published IS '公開フラグ: trueのとき一般公開ページに表示';
COMMENT ON COLUMN public.organizations.inventory_status IS 'リアルタイム混雑・在庫状況ステータス';
COMMENT ON COLUMN public.organizations.use_menu_api IS 'NazunaGraph メニュー在庫同期APIの自動更新を有効化するか';
COMMENT ON COLUMN public.organizations.menu_owner_id IS 'NazunaGraph 連携用のオーナーID';

CREATE INDEX IF NOT EXISTS idx_organizations_published ON public.organizations (is_published);
CREATE INDEX IF NOT EXISTS idx_organizations_category ON public.organizations (category);
CREATE INDEX IF NOT EXISTS idx_organizations_genre ON public.organizations (genre);
CREATE INDEX IF NOT EXISTS idx_organizations_room_code ON public.organizations (room_code);

-- ============================================================================
-- 2. timetable_days（タイムテーブル開催日程マスタ）
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.timetable_days (
  id              text        PRIMARY KEY,
  date_string     text        NOT NULL,
  label           text        NOT NULL,
  is_published    boolean     NOT NULL DEFAULT true,
  display_order   integer     NOT NULL DEFAULT 0
);

COMMENT ON TABLE  public.timetable_days IS 'タイムテーブル開催日程マスタ (DAY 1, DAY 2 等)';
COMMENT ON COLUMN public.timetable_days.id IS '日程識別子 (例: day-1, day-2)';
COMMENT ON COLUMN public.timetable_days.date_string IS '開催年月日 (例: 2026-09-19)';
COMMENT ON COLUMN public.timetable_days.label IS '表示ラベル (例: DAY 1 (9/19 校内祭))';
COMMENT ON COLUMN public.timetable_days.display_order IS '表示並び順';

CREATE INDEX IF NOT EXISTS idx_timetable_days_order ON public.timetable_days (display_order);

-- ============================================================================
-- 3. timetable_events（ステージ演目・タイムテーブルデータ）
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.timetable_events (
  id                uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  title             text        NOT NULL,
  organization_id   uuid        REFERENCES public.organizations(id) ON DELETE SET NULL,
  organization_name text,
  day_id            text        REFERENCES public.timetable_days(id) ON DELETE SET NULL,
  start_time        timestamptz NOT NULL,
  end_time          timestamptz NOT NULL,
  stage_location    text        NOT NULL DEFAULT 'courtyard'
                                CHECK (stage_location IN ('gym', 'courtyard', 'av_room')),
  description       text,
  is_published      boolean     NOT NULL DEFAULT false,
  updated_at        timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE  public.timetable_events IS '各ステージの開催時間やタイトルを保持する演目データ';
COMMENT ON COLUMN public.timetable_events.organization_id IS '関連付けられた出展団体ID (SET NULL カスケード)';
COMMENT ON COLUMN public.timetable_events.day_id IS '開催日程マスタのID (例: day-1)';
COMMENT ON COLUMN public.timetable_events.stage_location IS '開催ステージ: gym=第一体育館, courtyard=中庭メインステージ, av_room=多目的ホール';

CREATE INDEX IF NOT EXISTS idx_events_published ON public.timetable_events (is_published);
CREATE INDEX IF NOT EXISTS idx_events_start_time ON public.timetable_events (start_time);
CREATE INDEX IF NOT EXISTS idx_events_day_id ON public.timetable_events (day_id);
CREATE INDEX IF NOT EXISTS idx_events_stage ON public.timetable_events (stage_location);

-- ============================================================================
-- 4. announcements（お知らせ・速報配信データ）
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.announcements (
  id              uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           text        NOT NULL,
  content         text        NOT NULL,
  category        text        NOT NULL DEFAULT 'general'
                              CHECK (category IN ('urgent', 'general', 'stage')),
  is_published    boolean     NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE  public.announcements IS '実行委員会からのリアルタイムお知らせ・速報配信';
COMMENT ON COLUMN public.announcements.category IS '分類: urgent=緊急・重要, general=一般お知らせ, stage=ステージ予定';

CREATE INDEX IF NOT EXISTS idx_announcements_published ON public.announcements (is_published);
CREATE INDEX IF NOT EXISTS idx_announcements_category ON public.announcements (category);
CREATE INDEX IF NOT EXISTS idx_announcements_created ON public.announcements (created_at DESC);

-- ============================================================================
-- 5. lost_items（落とし物・拾得物掲示板）
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.lost_items (
  id                uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_name         text        NOT NULL,
  found_place       text        NOT NULL,
  storage_location  text        NOT NULL DEFAULT '本館2階総合案内所',
  status            text        NOT NULL DEFAULT 'storage'
                                CHECK (status IN ('storage', 'returned')),
  image_url         text,
  created_at        timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE  public.lost_items IS '会場内拾得物の登録および持ち主への返却ステータス管理';
COMMENT ON COLUMN public.lost_items.status IS '状態: storage=保管中(未返却), returned=返却完了済み';

CREATE INDEX IF NOT EXISTS idx_lost_items_status ON public.lost_items (status);
CREATE INDEX IF NOT EXISTS idx_lost_items_created ON public.lost_items (created_at DESC);

-- ============================================================================
-- 6. admin_users（管理者ログインアカウント情報）
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.admin_users (
  id              uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  email           text        NOT NULL UNIQUE,
  role            text        NOT NULL DEFAULT 'admin'
                              CHECK (role IN ('superadmin', 'admin')),
  display_name    text        NOT NULL DEFAULT '',
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

COMMENT ON TABLE  public.admin_users IS '管理画面ユーザーおよび権限レベル (Supabase Auth 連携)';
COMMENT ON COLUMN public.admin_users.role IS '権限: superadmin=統括管理本部 (全権限・ユーザー管理), admin=業務担当';

CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users (email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON public.admin_users (role);

-- ============================================================================
-- 7. pyramid_releases（ピラミッド結果開示スケジュール＆集計ロック管理）
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.pyramid_releases (
  id              text        PRIMARY KEY,
  release_id      text,
  title           text        NOT NULL,
  scheduled_time  text        NOT NULL,
  is_embargoed    boolean     NOT NULL DEFAULT false,
  embargo_message text,
  pyramid_tiers   jsonb       DEFAULT '{"high":[], "upper":[], "middle":[]}'::jsonb,
  updated_at      timestamptz NOT NULL DEFAULT now(),
  created_at      timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE  public.pyramid_releases IS '後夜祭ピラミッド結果の開示スケジュールおよび順位ロック制御';
COMMENT ON COLUMN public.pyramid_releases.is_embargoed IS 'ロックフラグ: trueのとき一般ユーザーへ順位非表示でメッセージ提示';

CREATE INDEX IF NOT EXISTS idx_pyramid_releases_embargo ON public.pyramid_releases (is_embargoed);

-- ============================================================================
-- 8. 自動タイムスタンプ更新トリガー
-- ============================================================================

CREATE OR REPLACE FUNCTION public.trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_organizations_updated_at ON public.organizations;
CREATE TRIGGER set_organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_set_updated_at();

DROP TRIGGER IF EXISTS set_timetable_events_updated_at ON public.timetable_events;
CREATE TRIGGER set_timetable_events_updated_at
  BEFORE UPDATE ON public.timetable_events
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_set_updated_at();

DROP TRIGGER IF EXISTS set_admin_users_updated_at ON public.admin_users;
CREATE TRIGGER set_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_set_updated_at();

DROP TRIGGER IF EXISTS set_pyramid_releases_updated_at ON public.pyramid_releases;
CREATE TRIGGER set_pyramid_releases_updated_at
  BEFORE UPDATE ON public.pyramid_releases
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_set_updated_at();

-- ============================================================================
-- 9. Row Level Security (RLS) セキュアアクセスポリシー
-- ============================================================================

ALTER TABLE public.organizations    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable_days   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lost_items       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pyramid_releases ENABLE ROW LEVEL SECURITY;

-- organizations: 一般は公開データのみ、認証済みユーザーは全操作可能
DROP POLICY IF EXISTS "organizations_public_read" ON public.organizations;
CREATE POLICY "organizations_public_read" ON public.organizations
  FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "organizations_auth_all" ON public.organizations;
CREATE POLICY "organizations_auth_all" ON public.organizations
  FOR ALL USING (auth.role() = 'authenticated');

-- timetable_days: 誰でも閲覧可能、認証済みユーザーは全操作可能
DROP POLICY IF EXISTS "timetable_days_public_read" ON public.timetable_days;
CREATE POLICY "timetable_days_public_read" ON public.timetable_days
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "timetable_days_auth_all" ON public.timetable_days;
CREATE POLICY "timetable_days_auth_all" ON public.timetable_days
  FOR ALL USING (auth.role() = 'authenticated');

-- timetable_events: 一般は公開演目のみ、認証済みは全操作可能
DROP POLICY IF EXISTS "timetable_events_public_read" ON public.timetable_events;
CREATE POLICY "timetable_events_public_read" ON public.timetable_events
  FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "timetable_events_auth_all" ON public.timetable_events;
CREATE POLICY "timetable_events_auth_all" ON public.timetable_events
  FOR ALL USING (auth.role() = 'authenticated');

-- announcements: 一般は公開中のみ、認証済みは全操作可能
DROP POLICY IF EXISTS "announcements_public_read" ON public.announcements;
CREATE POLICY "announcements_public_read" ON public.announcements
  FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "announcements_auth_all" ON public.announcements;
CREATE POLICY "announcements_auth_all" ON public.announcements
  FOR ALL USING (auth.role() = 'authenticated');

-- lost_items: 誰でも閲覧可能（持ち主確認用）、認証済みは全操作可能
DROP POLICY IF EXISTS "lost_items_public_read" ON public.lost_items;
CREATE POLICY "lost_items_public_read" ON public.lost_items
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "lost_items_auth_all" ON public.lost_items;
CREATE POLICY "lost_items_auth_all" ON public.lost_items
  FOR ALL USING (auth.role() = 'authenticated');

-- admin_users: 認証済み管理者のみ読み書き操作を許可
DROP POLICY IF EXISTS "admin_users_auth_read" ON public.admin_users;
CREATE POLICY "admin_users_auth_read" ON public.admin_users
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "admin_users_auth_all" ON public.admin_users;
CREATE POLICY "admin_users_auth_all" ON public.admin_users
  FOR ALL USING (auth.role() = 'authenticated');

-- pyramid_releases: 誰でもスケジュール・ロック状態を閲覧可能、認証済みは編集可能
DROP POLICY IF EXISTS "pyramid_releases_public_read" ON public.pyramid_releases;
CREATE POLICY "pyramid_releases_public_read" ON public.pyramid_releases
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "pyramid_releases_auth_all" ON public.pyramid_releases;
CREATE POLICY "pyramid_releases_auth_all" ON public.pyramid_releases
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================================
-- 10. Supabase Auth (`auth.users`) と `public.admin_users` 双方向自動同期トリガー
-- ============================================================================

-- (1) Supabase Auth でユーザー作成・更新時、自動で public.admin_users に同期
CREATE OR REPLACE FUNCTION public.sync_auth_user_to_admin_users()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role text;
  v_display_name text;
BEGIN
  -- 再帰更新ループ防止ガード
  IF pg_trigger_depth() > 1 THEN
    RETURN NEW;
  END IF;

  v_role := COALESCE(NEW.raw_user_meta_data->>'role', 'admin');
  v_display_name := COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1));

  INSERT INTO public.admin_users (id, email, role, display_name, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    v_role,
    v_display_name,
    now()
  )
  ON CONFLICT (email) DO UPDATE SET
    id = EXCLUDED.id,
    role = EXCLUDED.role,
    display_name = EXCLUDED.display_name,
    updated_at = now()
  WHERE public.admin_users.id IS DISTINCT FROM EXCLUDED.id
     OR public.admin_users.role IS DISTINCT FROM EXCLUDED.role
     OR public.admin_users.display_name IS DISTINCT FROM EXCLUDED.display_name;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_auth_users_to_admin ON auth.users;
CREATE TRIGGER trg_sync_auth_users_to_admin
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_auth_user_to_admin_users();

-- (2) public.admin_users で role/display_name が変更された時、Supabase Auth に自動同期
CREATE OR REPLACE FUNCTION public.sync_admin_users_to_auth()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_current_meta jsonb;
  v_new_meta jsonb;
BEGIN
  -- 再帰更新ループ防止ガード
  IF pg_trigger_depth() > 1 THEN
    RETURN NEW;
  END IF;

  SELECT raw_user_meta_data INTO v_current_meta
  FROM auth.users
  WHERE id = NEW.id OR email = NEW.email
  LIMIT 1;

  v_new_meta := COALESCE(v_current_meta, '{}'::jsonb) || jsonb_build_object('display_name', NEW.display_name, 'role', NEW.role);

  IF v_current_meta IS DISTINCT FROM v_new_meta THEN
    UPDATE auth.users
    SET raw_user_meta_data = v_new_meta
    WHERE (id = NEW.id OR email = NEW.email)
      AND COALESCE(raw_user_meta_data, '{}'::jsonb) IS DISTINCT FROM v_new_meta;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_admin_to_auth_metadata ON public.admin_users;
CREATE TRIGGER trg_sync_admin_to_auth_metadata
  AFTER UPDATE OF role, display_name ON public.admin_users
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_admin_users_to_auth();

-- ============================================================================
-- 11. 初期シードデータ
-- ============================================================================

INSERT INTO public.admin_users (email, role, display_name)
VALUES
  ('superadmin@nazuna.jp', 'superadmin', 'なずな祭 統括管理本部'),
  ('admin@nazuna.jp',      'admin',      '文化祭実行委員会 業務担当')
ON CONFLICT (email) DO NOTHING;

INSERT INTO public.timetable_days (id, date_string, label, is_published, display_order)
VALUES
  ('day-1', '2026-09-19', 'DAY 1 (9/19 校内祭)', true, 1),
  ('day-2', '2026-09-20', 'DAY 2 (9/20 一般公開)', true, 2)
ON CONFLICT (id) DO NOTHING;

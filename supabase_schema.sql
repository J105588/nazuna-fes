-- ============================================================================
-- なずな祭 2026「百輝夜行」公式ポータル — Supabase 完全スキーマ定義
-- ============================================================================
-- 対象テーブル:
--   1. organizations       … クラス・部活・有志団体マスタ
--   2. timetable_days      … 日程マスタ（DAY 1, DAY 2 等）
--   3. timetable_events    … ステージ演目・タイムテーブル
--   4. announcements       … リアルタイムお知らせ配信
--   5. lost_items          … 落とし物掲示板
--   6. admin_users         … 管理者アカウント（superadmin / admin）
-- ============================================================================

-- UUID 生成拡張の有効化
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. organizations（クラス・団体マスタ）
-- ============================================================================
-- ユーザー仕様 5.1 準拠 + コード互換の拡張カラム
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

  -- リアルタイム在庫ステータス連携（喫茶展示専用: NazunaGraph API 定時キャッシュ連携等）
  inventory_status text       DEFAULT 'STATUS_AVAILABLE'
                              CHECK (inventory_status IN (
                                'STATUS_AVAILABLE', 'STATUS_FEW',
                                'STATUS_SOLD_OUT', 'STATUS_PREPARING'
                              )),

  -- NazunaGraph (メニュー在庫管理API) 自動連携設定（喫茶展示専用）
  use_menu_api    boolean     NOT NULL DEFAULT false,
  menu_owner_id   text,

  updated_at      timestamptz NOT NULL DEFAULT now(),
  created_at      timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE  public.organizations IS 'クラス・部活動・有志企画などの出展団体マスタ';
COMMENT ON COLUMN public.organizations.category IS '区分: class=クラス展示, club=部活動・委員会, volunteer=有志企画';
COMMENT ON COLUMN public.organizations.genre IS 'ジャンル: food=飲食, exhibition=展示, attraction=アトラクション, stage=ステージ';
COMMENT ON COLUMN public.organizations.room_code IS '地図連携用パラメータ（例: "3A", "STAGE-1"）';
COMMENT ON COLUMN public.organizations.floor_info IS '階層・場所情報（例: "本館3F 北側教室"）';
COMMENT ON COLUMN public.organizations.is_published IS '公開フラグ — true のとき一般公開サイトに表示';
COMMENT ON COLUMN public.organizations.inventory_status IS 'リアルタイム在庫状態（喫茶展示専用: NazunaGraph API 連携）';
COMMENT ON COLUMN public.organizations.use_menu_api IS 'NazunaGraph API との自動在庫同期を有効にするか（喫茶展示専用）';
COMMENT ON COLUMN public.organizations.menu_owner_id IS 'NazunaGraph API 上の owner_id（連携時に使用）';

CREATE INDEX IF NOT EXISTS idx_organizations_published
  ON public.organizations (is_published);
CREATE INDEX IF NOT EXISTS idx_organizations_category
  ON public.organizations (category);
CREATE INDEX IF NOT EXISTS idx_organizations_room_code
  ON public.organizations (room_code);

-- ============================================================================
-- 2. timetable_days（日程マスタ）
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.timetable_days (
  id              text        PRIMARY KEY,
  date_string     text        NOT NULL,
  label           text        NOT NULL,
  is_published    boolean     NOT NULL DEFAULT true,
  display_order   integer     NOT NULL DEFAULT 0
);

COMMENT ON TABLE  public.timetable_days IS 'タイムテーブル日程マスタ（DAY 1, DAY 2 等）';
COMMENT ON COLUMN public.timetable_days.id IS '日程識別子（例: "day-1", "day-2"）';
COMMENT ON COLUMN public.timetable_days.date_string IS '日付文字列（例: "2026-09-19"）';
COMMENT ON COLUMN public.timetable_days.label IS '表示ラベル（例: "DAY 1 (9/19 校内祭)"）';
COMMENT ON COLUMN public.timetable_days.display_order IS '表示順序（昇順ソート用）';

-- ============================================================================
-- 3. timetable_events（ステージ演目・タイムテーブル）
-- ============================================================================
-- ユーザー仕様 5.2 準拠 + コード互換拡張
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.timetable_events (
  id                uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  title             text        NOT NULL,
  organization_id   uuid        REFERENCES public.organizations(id)
                                ON DELETE SET NULL,
  organization_name text,
  day_id            text        REFERENCES public.timetable_days(id)
                                ON DELETE SET NULL,
  start_time        timestamptz NOT NULL,
  end_time          timestamptz NOT NULL,
  stage_location    text        NOT NULL DEFAULT 'gym'
                                CHECK (stage_location IN ('gym', 'courtyard', 'av_room')),
  is_published      boolean     NOT NULL DEFAULT false,
  updated_at        timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE  public.timetable_events IS 'ステージ演目・タイムテーブルデータ';
COMMENT ON COLUMN public.timetable_events.organization_id IS '主催団体ID（organizations テーブルへの外部キー）';
COMMENT ON COLUMN public.timetable_events.organization_name IS '主催団体名（JOIN 不要のフォールバック表示用）';
COMMENT ON COLUMN public.timetable_events.day_id IS '対象日程ID（timetable_days への外部キー）';
COMMENT ON COLUMN public.timetable_events.stage_location IS 'ステージ場所識別子: gym=体育館, courtyard=中庭, av_room=視聴覚室';
COMMENT ON COLUMN public.timetable_events.is_published IS '演目の公開・非公開フラグ';

CREATE INDEX IF NOT EXISTS idx_events_published
  ON public.timetable_events (is_published);
CREATE INDEX IF NOT EXISTS idx_events_start_time
  ON public.timetable_events (start_time);
CREATE INDEX IF NOT EXISTS idx_events_day_id
  ON public.timetable_events (day_id);
CREATE INDEX IF NOT EXISTS idx_events_stage
  ON public.timetable_events (stage_location);

-- ============================================================================
-- 4. announcements（リアルタイムお知らせ配信）
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

COMMENT ON TABLE  public.announcements IS '実行委員会からのリアルタイムお知らせ・緊急配信';
COMMENT ON COLUMN public.announcements.category IS '分類: urgent=緊急, general=一般, stage=ステージ関連';

CREATE INDEX IF NOT EXISTS idx_announcements_published
  ON public.announcements (is_published);
CREATE INDEX IF NOT EXISTS idx_announcements_category
  ON public.announcements (category);
CREATE INDEX IF NOT EXISTS idx_announcements_created
  ON public.announcements (created_at DESC);

-- ============================================================================
-- 5. lost_items（落とし物掲示板）
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.lost_items (
  id                uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_name         text        NOT NULL,
  found_place       text        NOT NULL,
  storage_location  text        NOT NULL DEFAULT '本館1F インフォメーションセンター',
  status            text        NOT NULL DEFAULT 'storage'
                                CHECK (status IN ('storage', 'returned')),
  created_at        timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE  public.lost_items IS '落とし物・お忘れ物の掲示板データ';
COMMENT ON COLUMN public.lost_items.status IS '状態: storage=保管中, returned=返却済み';

CREATE INDEX IF NOT EXISTS idx_lost_items_status
  ON public.lost_items (status);

-- ============================================================================
-- 6. admin_users（管理者アカウント）
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

COMMENT ON TABLE  public.admin_users IS '管理画面のログインアカウント（Supabase Auth 連携）';
COMMENT ON COLUMN public.admin_users.role IS '権限レベル: superadmin=統括管理本部（全権限+ユーザー管理）, admin=実行委員会業務担当';

CREATE INDEX IF NOT EXISTS idx_admin_users_email
  ON public.admin_users (email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role
  ON public.admin_users (role);

-- ============================================================================
-- Row Level Security (RLS) ポリシー
-- ============================================================================

-- 全テーブルで RLS を有効化
ALTER TABLE public.organizations    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable_days   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lost_items       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users      ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- organizations: 一般ユーザーは公開済みデータのみ閲覧可、認証済みユーザーは全操作可
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "organizations_public_read" ON public.organizations;
CREATE POLICY "organizations_public_read" ON public.organizations
  FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "organizations_auth_all" ON public.organizations;
CREATE POLICY "organizations_auth_all" ON public.organizations
  FOR ALL USING (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- timetable_days: 誰でも閲覧可、認証済みユーザーは全操作可
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "timetable_days_public_read" ON public.timetable_days;
CREATE POLICY "timetable_days_public_read" ON public.timetable_days
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "timetable_days_auth_all" ON public.timetable_days;
CREATE POLICY "timetable_days_auth_all" ON public.timetable_days
  FOR ALL USING (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- timetable_events: 一般は公開済みのみ、認証済みは全操作可
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "timetable_events_public_read" ON public.timetable_events;
CREATE POLICY "timetable_events_public_read" ON public.timetable_events
  FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "timetable_events_auth_all" ON public.timetable_events;
CREATE POLICY "timetable_events_auth_all" ON public.timetable_events
  FOR ALL USING (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- announcements: 一般は公開済みのみ、認証済みは全操作可
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "announcements_public_read" ON public.announcements;
CREATE POLICY "announcements_public_read" ON public.announcements
  FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "announcements_auth_all" ON public.announcements;
CREATE POLICY "announcements_auth_all" ON public.announcements
  FOR ALL USING (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- lost_items: 誰でも閲覧可（保管中の忘れ物を確認するため）、認証済みは全操作可
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "lost_items_public_read" ON public.lost_items;
CREATE POLICY "lost_items_public_read" ON public.lost_items
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "lost_items_auth_all" ON public.lost_items;
CREATE POLICY "lost_items_auth_all" ON public.lost_items
  FOR ALL USING (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- admin_users: 認証済みユーザーのみ全操作可（一般には非公開）
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "admin_users_auth_read" ON public.admin_users;
CREATE POLICY "admin_users_auth_read" ON public.admin_users
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "admin_users_auth_all" ON public.admin_users;
CREATE POLICY "admin_users_auth_all" ON public.admin_users
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================================
-- 初期シードデータ（管理者アカウント）
-- ============================================================================

INSERT INTO public.admin_users (email, role, display_name)
VALUES
  ('superadmin@nazuna.jp', 'superadmin', 'なずな祭 統括管理本部'),
  ('admin@nazuna.jp',      'admin',      '文化祭実行委員会 業務担当')
ON CONFLICT (email) DO NOTHING;

-- ============================================================================
-- 初期シードデータ（日程マスタ）
-- ============================================================================

INSERT INTO public.timetable_days (id, date_string, label, is_published, display_order)
VALUES
  ('day-1', '2026-09-19', 'DAY 1 (9/19 校内祭)', true, 1),
  ('day-2', '2026-09-20', 'DAY 2 (9/20 一般公開)', true, 2)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- updated_at 自動更新トリガー
-- ============================================================================

CREATE OR REPLACE FUNCTION public.trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- organizations
DROP TRIGGER IF EXISTS set_organizations_updated_at ON public.organizations;
CREATE TRIGGER set_organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_set_updated_at();

-- timetable_events
DROP TRIGGER IF EXISTS set_timetable_events_updated_at ON public.timetable_events;
CREATE TRIGGER set_timetable_events_updated_at
  BEFORE UPDATE ON public.timetable_events
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_set_updated_at();

-- admin_users
DROP TRIGGER IF EXISTS set_admin_users_updated_at ON public.admin_users;
CREATE TRIGGER set_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_set_updated_at();

-- ============================================================================
-- 7. pyramid_releases（配信ピラミッドスケジュール＆集計ロック管理）
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.pyramid_releases (
  id              text        PRIMARY KEY,
  title           text        NOT NULL,
  scheduled_time  text        NOT NULL,
  is_embargoed    boolean     NOT NULL DEFAULT false,
  embargo_message text,
  pyramid_tiers   jsonb       DEFAULT '{"high":[], "upper":[], "middle":[]}'::jsonb,
  updated_at      timestamptz NOT NULL DEFAULT now(),
  created_at      timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE  public.pyramid_releases IS '中間開示・最終開示のピラミッド配信スケジュールおよび集計ロック管理';
COMMENT ON COLUMN public.pyramid_releases.is_embargoed IS '集計ロック期間フラグ — true のとき一般画面はロック演出を表示';

CREATE INDEX IF NOT EXISTS idx_pyramid_releases_embargo
  ON public.pyramid_releases (is_embargoed);

ALTER TABLE public.pyramid_releases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "pyramid_releases_public_read" ON public.pyramid_releases;
CREATE POLICY "pyramid_releases_public_read" ON public.pyramid_releases
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "pyramid_releases_auth_all" ON public.pyramid_releases;
CREATE POLICY "pyramid_releases_auth_all" ON public.pyramid_releases
  FOR ALL USING (auth.role() = 'authenticated');

DROP TRIGGER IF EXISTS set_pyramid_releases_updated_at ON public.pyramid_releases;
CREATE TRIGGER set_pyramid_releases_updated_at
  BEFORE UPDATE ON public.pyramid_releases
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_set_updated_at();

-- ============================================================================
-- 8. Supabase Auth (`auth.users`) と `public.admin_users` の双方向自動 RLS 同期
-- ============================================================================
-- (1) Supabase Auth にユーザーが新規登録または更新された際、RLS をバイパスして
--     public.admin_users テーブルへ即時に自動 Upsert (同期) します。
-- ============================================================================

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
  -- 再帰ループ防止ガード: トリガーの深さが2以上になった場合は即時中断
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

-- auth.users の INSERT / UPDATE 時に同期トリガーを発動
DROP TRIGGER IF EXISTS trg_sync_auth_users_to_admin ON auth.users;
CREATE TRIGGER trg_sync_auth_users_to_admin
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_auth_user_to_admin_users();

-- ============================================================================
-- (2) public.admin_users テーブル側のメタデータ (role / display_name) が編集・変更
--     された際、同時に Supabase Auth (auth.users.raw_user_meta_data) にも同期反映します。
-- ============================================================================

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
  -- 再帰ループ防止ガード: トリガーの深さが2以上になった場合は即時中断
  IF pg_trigger_depth() > 1 THEN
    RETURN NEW;
  END IF;

  SELECT raw_user_meta_data INTO v_current_meta
  FROM auth.users
  WHERE id = NEW.id OR email = NEW.email
  LIMIT 1;

  v_new_meta := COALESCE(v_current_meta, '{}'::jsonb) || jsonb_build_object('display_name', NEW.display_name, 'role', NEW.role);

  -- 値が実質的に変化している場合のみ auth.users を更新（差分更新）
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


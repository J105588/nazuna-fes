-- ============================================================================
-- 20260715010000_secure_rls_and_superadmin_policies.sql
-- 管理画面のセキュリティ強化・RLS完全装備およびsuperadmin権限保護ポリシー
-- ============================================================================

-- 1. すべての主要テーブルで確実に RLS (Row Level Security) を有効化
ALTER TABLE IF EXISTS public.organizations    ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.timetable_days   ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.timetable_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.announcements    ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.lost_items       ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.admin_users      ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.pyramid_releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.page_settings    ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- 2. page_settings の保護 (未認証ユーザーからの更新を阻止)
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Anyone can view page_settings" ON public.page_settings;
CREATE POLICY "Anyone can view page_settings" ON public.page_settings
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can insert page_settings" ON public.page_settings;
CREATE POLICY "Admins can insert page_settings" ON public.page_settings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can update page_settings" ON public.page_settings;
CREATE POLICY "Admins can update page_settings" ON public.page_settings
  FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can delete page_settings" ON public.page_settings;
CREATE POLICY "Admins can delete page_settings" ON public.page_settings
  FOR DELETE USING (auth.role() = 'authenticated');

-- ----------------------------------------------------------------------------
-- 3. admin_users の保護 (アカウント登録は superadmin のみ、かつ自身の権限変更禁止)
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "admin_users_auth_read" ON public.admin_users;
CREATE POLICY "admin_users_auth_read" ON public.admin_users
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "admin_users_auth_insert" ON public.admin_users;
CREATE POLICY "admin_users_auth_insert" ON public.admin_users
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND (
      EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE id = auth.uid() AND role = 'superadmin'
      ) OR NOT EXISTS (
        SELECT 1 FROM public.admin_users
      )
    )
  );

DROP POLICY IF EXISTS "admin_users_auth_update" ON public.admin_users;
CREATE POLICY "admin_users_auth_update" ON public.admin_users
  FOR UPDATE USING (
    auth.role() = 'authenticated' AND (
      -- 自分のプロフィール(表示名など)の編集、または superadmin による他ユーザー編集
      id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE id = auth.uid() AND role = 'superadmin'
      )
    )
  ) WITH CHECK (
    auth.role() = 'authenticated' AND (
      -- 自身のロールを変更することは禁止 (変更前のroleと一致している必要がある)
      (id = auth.uid() AND role = (SELECT role FROM public.admin_users WHERE id = auth.uid()))
      OR
      (id != auth.uid() AND EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE id = auth.uid() AND role = 'superadmin'
      ))
    )
  );

DROP POLICY IF EXISTS "admin_users_auth_delete" ON public.admin_users;
CREATE POLICY "admin_users_auth_delete" ON public.admin_users
  FOR DELETE USING (
    auth.role() = 'authenticated' AND
    id != auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE id = auth.uid() AND role = 'superadmin'
    )
  );

-- ----------------------------------------------------------------------------
-- 4. 既存テーブル構造の整合化・不足カラムの追加（補正マイグレーション）
-- ----------------------------------------------------------------------------
-- 以前の構成で pyramid_releases テーブル作成後に release_id カラム等が追加・定義されたケースに対応
ALTER TABLE IF EXISTS public.pyramid_releases
  ADD COLUMN IF NOT EXISTS release_id text,
  ADD COLUMN IF NOT EXISTS is_embargoed boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS embargo_message text,
  ADD COLUMN IF NOT EXISTS pyramid_tiers jsonb DEFAULT '{"high":[], "upper":[], "middle":[]}'::jsonb,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();

-- 既存行の release_id が NULL の場合は主キー id をセットして同期
UPDATE public.pyramid_releases SET release_id = id WHERE release_id IS NULL;

-- organizations テーブルの追加カラム補正
ALTER TABLE IF EXISTS public.organizations
  ADD COLUMN IF NOT EXISTS inventory_status text DEFAULT 'STATUS_AVAILABLE'
    CHECK (inventory_status IN ('STATUS_AVAILABLE', 'STATUS_FEW', 'STATUS_SOLD_OUT', 'STATUS_PREPARING')),
  ADD COLUMN IF NOT EXISTS use_menu_api boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS menu_owner_id text;

-- ----------------------------------------------------------------------------
-- 5. ピラミッド初期シードデータ (DBが空の場合にフロントエンドですぐデータ取得可能にする)
-- ----------------------------------------------------------------------------
INSERT INTO public.pyramid_releases (
  id, release_id, title, scheduled_time, is_embargoed, embargo_message, pyramid_tiers, updated_at
)
SELECT
  'rel_default_seed',
  'rel_default_seed',
  '中間発表・結果開示',
  NOW() - INTERVAL '1 hour',
  false,
  '最終結果の集計および厳正な審査期間中です。公式結果発表までお待ちください。',
  '{"high":["org-1","org-2"],"upper":["org-3","org-4","org-5"],"middle":["org-6","org-7"]}'::jsonb,
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM public.pyramid_releases LIMIT 1
);

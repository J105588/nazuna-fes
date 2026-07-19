-- ============================================================================
-- なずな祭 2026「百輝夜行」公式ポータル — タイムテーブル演目カラーテーマ対応
-- 同期マイグレーションID: 20260717000000_add_color_to_timetable_events.sql
-- ============================================================================

-- public.timetable_events テーブルに color カラムを追加
ALTER TABLE public.timetable_events ADD COLUMN IF NOT EXISTS color text;

COMMENT ON COLUMN public.timetable_events.color IS '演目カードのカラーテーマ (red, blue, green, purple, yellow 等)';

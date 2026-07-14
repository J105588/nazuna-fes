-- =====================================================================================
-- マイグレーション: ステージ会場名称・コード更新（國枝記念国際ホール、古賀記念アリーナ、Nステ会場）
-- =====================================================================================

-- 1. stage_location カラムのコメントを新名称（國枝記念国際ホール、古賀記念アリーナ、Nステ会場）に更新
COMMENT ON COLUMN public.timetable_events.stage_location IS '開催ステージ: gym/koga_arena=古賀記念アリーナ, courtyard/n_stage=Nステ会場, av_room/kunieda_hall=國枝記念国際ホール';

-- 2. 必要に応じて新しいIDで登録できるようCHECK制約を緩和・再設定する場合の定義（既存データを保持した拡張）
DO $$
BEGIN
  ALTER TABLE public.timetable_events DROP CONSTRAINT IF EXISTS timetable_events_stage_location_check;
  ALTER TABLE public.timetable_events ADD CONSTRAINT timetable_events_stage_location_check 
    CHECK (stage_location IN ('gym', 'courtyard', 'av_room', 'kunieda_hall', 'koga_arena', 'n_stage'));
EXCEPTION
  WHEN OTHERS THEN
    -- すでに制約が存在しない、または権限によってスキップ
    NULL;
END $$;

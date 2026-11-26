-- ====================================================================
-- ReUseHub User Activity & History Migration
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.user_activity_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL CHECK (action_type IN ('reuse', 'repair', 'upcycle', 'donate', 'recycle', 'marketplace_rehome')),
  product_name TEXT NOT NULL,
  category TEXT,
  co2_saved_kg NUMERIC(8, 2) DEFAULT 0,
  waste_diverted_kg NUMERIC(8, 2) DEFAULT 0,
  notes TEXT,
  completed BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_activity_history_user ON public.user_activity_history(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_history_created ON public.user_activity_history(created_at);

ALTER TABLE public.user_activity_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own activity history"
  ON public.user_activity_history FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

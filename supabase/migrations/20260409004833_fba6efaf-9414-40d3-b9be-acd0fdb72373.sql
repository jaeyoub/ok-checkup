
CREATE POLICY "Anyone can insert checklist items"
  ON public.checklist_items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can delete checklist items"
  ON public.checklist_items FOR DELETE
  USING (true);

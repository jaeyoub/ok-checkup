import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CheckItem {
  id: string;
  title: string;
  category: string;
  checked: boolean;
  memo: string;
  updated_at: string;
}

export const useChecklist = () => {
  const queryClient = useQueryClient();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["checklist"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("checklist_items")
        .select("id, title, category, checked, memo, updated_at")
        .order("created_at");
      if (error) throw error;
      return data as CheckItem[];
    },
  });

  const updateItem = useMutation({
    mutationFn: async ({
      id,
      checked,
      memo,
    }: {
      id: string;
      checked?: boolean;
      memo?: string;
    }) => {
      const update: Record<string, unknown> = {};
      if (checked !== undefined) update.checked = checked;
      if (memo !== undefined) update.memo = memo;
      const { error } = await supabase
        .from("checklist_items")
        .update(update)
        .eq("id", id);
      if (error) throw error;
    },
    onMutate: async ({ id, checked, memo }) => {
      await queryClient.cancelQueries({ queryKey: ["checklist"] });
      const previous = queryClient.getQueryData<CheckItem[]>(["checklist"]);
      queryClient.setQueryData<CheckItem[]>(["checklist"], (old) =>
        old?.map((item) =>
          item.id === id
            ? {
                ...item,
                ...(checked !== undefined ? { checked } : {}),
                ...(memo !== undefined ? { memo } : {}),
              }
            : item
        )
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["checklist"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["checklist"] });
    },
  });

  return { items, isLoading, updateItem };
};

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user } = useAuth();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["checklist", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("checklist_items")
        .select("id, title, category, checked, memo, updated_at")
        .order("created_at");
      if (error) throw error;
      return data as CheckItem[];
    },
    enabled: !!user,
  });

  const updateItem = useMutation({
    mutationFn: async ({ id, checked, memo }: { id: string; checked?: boolean; memo?: string }) => {
      const update: { checked?: boolean; memo?: string } = {};
      if (checked !== undefined) update.checked = checked;
      if (memo !== undefined) update.memo = memo;
      const { error } = await supabase.from("checklist_items").update(update).eq("id", id);
      if (error) throw error;
    },
    onMutate: async ({ id, checked, memo }) => {
      const key = ["checklist", user?.id];
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<CheckItem[]>(key);
      queryClient.setQueryData<CheckItem[]>(key, (old) =>
        old?.map((item) =>
          item.id === id
            ? { ...item, ...(checked !== undefined ? { checked } : {}), ...(memo !== undefined ? { memo } : {}) }
            : item
        )
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(["checklist", user?.id], context.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["checklist", user?.id] }),
  });

  const addItem = useMutation({
    mutationFn: async ({ title, category }: { title: string; category: string }) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("checklist_items").insert({ title, category, user_id: user.id });
      if (error) throw error;
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["checklist", user?.id] }),
  });

  const deleteItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("checklist_items").delete().eq("id", id);
      if (error) throw error;
    },
    onMutate: async (id) => {
      const key = ["checklist", user?.id];
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<CheckItem[]>(key);
      queryClient.setQueryData<CheckItem[]>(key, (old) => old?.filter((item) => item.id !== id));
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(["checklist", user?.id], context.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["checklist", user?.id] }),
  });

  return { items, isLoading, updateItem, addItem, deleteItem };
};

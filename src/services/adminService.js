import { supabase } from "./supabaseClient";

export const adminService = {
  async getCategories() {
    const { data, error } = await supabase
      .from("product_categories")
      .select("*")
      .eq("status", "active")
      .order("name");
    if (error) throw error;
    return { data: { categories: data } };
  },

  async createCategory(payload) {
    const { data, error } = await supabase.from("product_categories").insert(payload).select().single();
    if (error) throw error;
    return { data };
  },

  async updateCategory(id, payload) {
    const { error } = await supabase.from("product_categories").update(payload).eq("id", id);
    if (error) throw error;
    return { data: { message: "Category updated." } };
  }
};

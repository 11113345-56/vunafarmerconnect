import { supabase } from "./supabaseClient";

function flattenInquiry(row) {
  return {
    ...row,
    product_name: row.product?.product_name,
    farmer_name: row.farmer?.full_name,
    buyer_name: row.buyer?.full_name,
    buyer_phone: row.buyer?.phone
  };
}

const BUYER_SELECT = `*, product:products(product_name), farmer:profiles!inquiries_farmer_id_fkey(full_name)`;
const FARMER_SELECT = `*, product:products(product_name), buyer:profiles!inquiries_buyer_id_fkey(full_name, phone)`;

export const inquiryService = {
  async createInquiry({ product_id, farmer_id, message }) {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("inquiries")
      .insert({
        buyer_id: user.id,
        farmer_id,
        product_id,
        message,
        status: "open"
      })
      .select()
      .single();
    if (error) throw { response: { data: { message: error.message } } };
    return { data: { message: "Inquiry sent.", id: data.id } };
  },

  async getMyInquiries() {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("inquiries")
      .select(BUYER_SELECT)
      .eq("buyer_id", user.id)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return { data: { inquiries: data.map(flattenInquiry) } };
  },

  async getFarmerInquiries() {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("inquiries")
      .select(FARMER_SELECT)
      .eq("farmer_id", user.id)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return { data: { inquiries: data.map(flattenInquiry) } };
  },

  async updateStatus(id, status) {
    const { error } = await supabase.from("inquiries").update({ status }).eq("id", id);
    if (error) throw { response: { data: { message: error.message } } };
    return { data: { message: "Inquiry status updated." } };
  }
};
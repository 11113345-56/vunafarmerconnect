import { supabase } from "./supabaseClient";

function flattenOrder(row) {
  return {
    ...row,
    product_name: row.product?.product_name,
    unit: row.product?.unit,
    farmer_name: row.farmer?.full_name,
    buyer_name: row.buyer?.full_name,
    buyer_phone: row.buyer?.phone
  };
}

const BUYER_SELECT = `*, product:products(product_name, unit), farmer:profiles!orders_farmer_id_fkey(full_name)`;
const FARMER_SELECT = `*, product:products(product_name, unit), buyer:profiles!orders_buyer_id_fkey(full_name, phone)`;

export const orderService = {
  async createOrder({ product_id, quantity_requested, delivery_option, buyer_message }) {
    const { data: { user } } = await supabase.auth.getUser();

    const { data: product, error: productError } = await supabase
      .from("products")
      .select("*")
      .eq("id", product_id)
      .single();
    if (productError) throw productError;

    if (product.availability_status !== "available") {
      throw { response: { data: { message: "This product is not available." } } };
    }
    if (product.farmer_id === user.id) {
      throw { response: { data: { message: "Farmers cannot order their own products." } } };
    }
    if (Number(quantity_requested) > Number(product.quantity)) {
      throw { response: { data: { message: "Requested quantity is higher than available quantity." } } };
    }

    const total_estimated_price = Number(quantity_requested) * Number(product.price_per_unit);

    const { data, error } = await supabase
      .from("orders")
      .insert({
        buyer_id: user.id,
        farmer_id: product.farmer_id,
        product_id,
        quantity_requested,
        total_estimated_price,
        delivery_option,
        buyer_message: buyer_message || null
      })
      .select()
      .single();
    if (error) throw { response: { data: { message: error.message } } };

    return { data: { message: "Order request sent.", id: data.id } };
  },

  async getMyOrders() {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("orders")
      .select(BUYER_SELECT)
      .eq("buyer_id", user.id)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return { data: { orders: data.map(flattenOrder) } };
  },

  async getFarmerOrders() {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("orders")
      .select(FARMER_SELECT)
      .eq("farmer_id", user.id)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return { data: { orders: data.map(flattenOrder) } };
  },

  async updateStatus(id, status) {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) throw { response: { data: { message: error.message } } };
    return { data: { message: "Order status updated." } };
  }
};

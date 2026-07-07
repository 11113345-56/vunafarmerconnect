import { supabase } from "./supabaseClient";

const SELECT = `
  *,
  category:product_categories(name),
  farmer:profiles!products_farmer_id_fkey(full_name, phone)
`;

function flatten(row) {
  return {
    ...row,
    category_name: row.category?.name,
    farmer_name: row.farmer?.full_name,
    farmer_phone: row.farmer?.phone
  };
}

export const productService = {
  async getProducts(params = {}) {
    let query = supabase.from("products").select(SELECT).eq("availability_status", "available");

    if (params.name) query = query.ilike("product_name", `%${params.name}%`);
    if (params.category_id) query = query.eq("category_id", params.category_id);
    if (params.district) query = query.ilike("district", `%${params.district}%`);
    if (params.min_price) query = query.gte("price_per_unit", params.min_price);
    if (params.max_price) query = query.lte("price_per_unit", params.max_price);

    const { data, error } = await query.order("created_at", { ascending: false });
    if (error) throw error;
    return { data: { products: data.map(flatten) } };
  },

  async getProduct(id) {
    const { data, error } = await supabase.from("products").select(SELECT).eq("id", id).single();
    if (error) throw error;
    return { data: { product: flatten(data) } };
  },

  async getMyProducts() {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("products")
      .select(SELECT)
      .eq("farmer_id", user.id)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return { data: { products: data.map(flatten) } };
  },

  async createProduct(formData) {
    const { data: { user } } = await supabase.auth.getUser();
    const payload = Object.fromEntries(formData.entries());
    const imageFile = payload.image instanceof File ? payload.image : null;
    delete payload.image;

    let imageUrl = null;
    if (imageFile) {
      imageUrl = await uploadImage(imageFile);
    }

    const { data, error } = await supabase
      .from("products")
      .insert({ ...payload, farmer_id: user.id, image: imageUrl })
      .select()
      .single();
    if (error) throw error;
    return { data: { message: "Product listing created.", id: data.id } };
  },

  async updateProduct(id, formData) {
    const payload = Object.fromEntries(formData.entries());
    const imageFile = payload.image instanceof File ? payload.image : null;
    delete payload.image;

    if (imageFile) {
      payload.image = await uploadImage(imageFile);
    }

    const { error } = await supabase.from("products").update(payload).eq("id", id);
    if (error) throw error;
    return { data: { message: "Product listing updated." } };
  },

  async deleteProduct(id) {
    // Soft delete, same behavior as the old backend.
    const { error } = await supabase
      .from("products")
      .update({ availability_status: "inactive" })
      .eq("id", id);
    if (error) throw error;
    return { data: { message: "Product listing removed." } };
  }
};

async function uploadImage(file) {
  const path = `${Date.now()}-${file.name}`;
  const { error } = await supabase.storage.from("product-images").upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from("product-images").getPublicUrl(path);
  return data.publicUrl;
}

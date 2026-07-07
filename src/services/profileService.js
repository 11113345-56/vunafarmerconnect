import api from "./api";

export const profileService = {
  getProfile: () => api.get("/profile"),
  updateFarmer: (data) => api.put("/profile/farmer", data),
  updateBuyer: (data) => api.put("/profile/buyer", data)
};

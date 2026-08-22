import apiClient, {
  clearApiClientSession,
  executeApi,
} from "../lib/api-client";
import type { UserProfileType, UserResponse } from "@workspace/contracts/user";

export const getCurrentUser = () =>
  executeApi<UserResponse>(() => apiClient.get("/user"));

export const updateProfile = (data: UserProfileType) =>
  executeApi<null>(() => apiClient.put("/user", data));

export const deleteMyAccount = async () => {
  const response = await executeApi<null>(() => apiClient.delete("/user"));
  await clearApiClientSession();
  return response;
};

import { AxiosRequestConfig } from "axios";

export const authHeaders = (accessToken: string): AxiosRequestConfig => ({
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});

import { api } from "@/lib/axios";
export const authServices = {
  signUp: async (
    username: string,
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    try {
      const res = await api.post(
        "/api/auth/signup",
        {
          username,
          email,
          password,
          firstName,
          lastName,
        },
        {
          withCredentials: true,
        }
      );
      return res.data;
    } catch (error: any) {
      throw error?.response?.data;
    }
  },
  signIn: async (username: string, password: string) => {
    try {
      const res = await api.post(
        "/api/auth/signin",
        {
          username,
          password,
        },
        {
          withCredentials: true,
        }
      );

      return res.data;
    } catch (error: any) {
      throw error?.response?.data;
    }
  },
  logout: async () => {
    try {
      const res = await api.post("/api/auth/signout", {
        withCredentials: true,
      });
      return res.data;
    } catch (error: any) {
      console.log({ error });
      throw error?.response?.data;
    }
  },
  fetchMe: async () => {
    try {
      const res = await api.get("/api/user/me", {
        withCredentials: true,
      });
      return res.data;
    } catch (error: any) {
      throw error?.response?.data;
    }
  },
  refreshToken: async () => {
    try {
      const res = await api.post("/api/auth/refresh-token", {
        withCredentials: true,
      });
      return res.data?.accessToken;
    } catch (error: any) {
      throw error?.response?.data?.message;
    }
  },
};

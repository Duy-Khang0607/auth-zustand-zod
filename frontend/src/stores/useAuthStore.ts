import { create } from "zustand";
import type { AuthState } from "@/types/store";
import { toast } from "sonner";
import { authServices } from "@/services/authServices";

export const useAuthStore = create<AuthState>()((set,get) => ({
    accessToken: null,
    user: null,
    loading: false,

    clearState: () => {
        set({ accessToken: null, user: null, loading: false });
    },

    signUp: async (username: string, email: string, password: string, firstName: string, lastName: string) => {
        try {
        // set Loading 
        set({ loading: true });

        // call api SignUp
        const res = await authServices.signUp(username, email, password, firstName, lastName);
        if(res?.message) {
            toast.success(res?.message);
            return res;
        }else{
            toast.error(res?.message);
            return res;
        }

    } catch (error : any) {
            toast.error(error?.message || "Lỗi hệ thống");
            return error;
        }finally{
            // Setloading
            set({ loading: false });
        }
    },

    signIn: async (username: string, password: string) => {
        try {
        // set Loading 
        set({ loading: true });

        // call api SignIn
        const res = await authServices.signIn(username, password);
        const accessToken = res?.accessToken;

        // Set access token vào local storage
        set({ accessToken });

        // Call api fetchMe
        await get().fetchMe();

        if(res?.status) {
            toast.success(res?.message);
            return res;
        }else{
            toast.error(res?.message);
            return res;
        }

    } catch (error : any) {
            toast.error(error?.message || "Lỗi hệ thống");
            return error;
        }finally{
            // Setloading
            set({ loading: false });
        }
    },
    logout: async () => {
        try {
            // set Loading 
            set({ loading: true });

            // call api Logout
            await authServices.logout();
            
            // Clear state
            get().clearState();

        } catch (error : any) {
            toast.error(error?.message || "Lỗi hệ thống");
            return error;
        }finally{
            // Setloading
            set({ loading: false });
        }
    },
    fetchMe: async () => {
        try {
            // set Loading 
            set({ loading: true });

            // call api FetchMe
            const res = await authServices.fetchMe();
            const user = res?.user;
            set({ user });
            return res;
        } catch (error : any) {
            toast.error(error?.message || "Lỗi hệ thống");
            set({ user: null, accessToken: null });
            return error;
        }finally{
            set({ loading: false });
        }
    },
    refreshToken: async () => {
        try {
            const { user,fetchMe } = get();
            // set Loading 
            set({ loading: true });

            // call api RefreshToken
            const accessToken = await authServices.refreshToken();

            // Set access token vào state
            set({ accessToken });

            // Nếu user không tồn tại
            if(!user) {
               await fetchMe();
            }

        } catch (error : any) {
            console.log({error});
            toast.error(error || "Lỗi hệ thống");
            get().clearState();
            return error;
        }finally{
            set({ loading: false });
        }
    }
}))
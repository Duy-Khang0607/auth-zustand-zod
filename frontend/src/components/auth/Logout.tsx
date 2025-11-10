import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "../ui/button";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const Logout = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/signin");
      toast.success("Đăng xuất thành công");
    } catch (error) {
      toast.error("Đăng xuất thất bại");
    }
  };

  return <Button onClick={handleLogout}>Logout</Button>;
};

export default Logout;

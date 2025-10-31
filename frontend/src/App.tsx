import { BrowserRouter, Routes, Route } from "react-router";
import SignIn from "./page/SignIn";
import SignUp from "./page/SignUp";
import ChatPage from "./page/ChatPage";
import { Toaster } from "sonner";
function App() {
  return (
    <>
      <Toaster richColors/>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          {/* Private Routes */}
          <Route path="/" element={<ChatPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

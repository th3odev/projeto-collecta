import { useNavigate } from "react-router-dom";
import AuthModal from "../components/auth/AuthModal";
import ParticlesBackground from "../components/ui/ParticlesBackground";

export default function AuthPage() {
  const navigate = useNavigate();

  function handleClose() {
    // fechar modal NÃO significa login
    navigate("/");
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black z-0">
      <ParticlesBackground />
      <div className="fixed inset-0 bg-black/60 z-10 pointer-events-none" />
      <AuthModal open={true} onClose={handleClose} />
    </div>
  );
}

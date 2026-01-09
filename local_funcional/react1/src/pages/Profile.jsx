import { useAuth } from "../context/AuthContext";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileLevel from "../components/profile/ProfileLevel";
import ProfileStats from "../components/profile/ProfileStats";
import ProfileHistory from "../components/profile/ProfileHistory";

export default function Profile() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="pt-24 pb-20 bg-[#090A0D] min-h-screen flex items-center justify-center">
          <span className="text-gray-400">Carregando perfil...</span>
        </main>
        <Footer />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <main className="pt-24 pb-20 bg-[#090A0D] min-h-screen flex items-center justify-center">
          <span className="text-red-400">
            Você precisa estar logado para ver o perfil
          </span>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="pt-24 pb-20 bg-[#090A0D] min-h-screen">
        <div className="max-w-6xl mx-auto px-4 md:px-6 space-y-8">
          <ProfileHeader user={user} />
          <ProfileLevel user={user} />
          <ProfileStats user={user} />
          <ProfileHistory user={user} />
        </div>
      </main>

      <Footer />
    </>
  );
}

import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/layout/Navbar";

import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import ItemDetails from "./pages/ItemDetails";
import EarnPoints from "./pages/EarnPoints";
import Rewards from "./pages/Rewards";
import Profile from "./pages/Profile";
import AuthPage from "./pages/Auth";

export default function App() {
  const location = useLocation();

  const hideNavbarRoutes = ["/auth"];
  const hideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}

      <main className={hideNavbar ? "" : "pt-14"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalog />} />
          <Route path="/item/:id" element={<ItemDetails />} />
          <Route path="/ganhe-pontos" element={<EarnPoints />} />
          <Route path="/recompensas" element={<Rewards />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/auth" element={<AuthPage />} />
        </Routes>
      </main>
    </>
  );
}

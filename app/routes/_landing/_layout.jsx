import { Outlet } from "react-router";
import { Navbar, Footer } from "../../components/landing";

export default function LandingLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

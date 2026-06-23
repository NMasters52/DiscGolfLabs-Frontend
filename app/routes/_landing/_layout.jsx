import { Outlet } from "react-router";
import { Footer, Navbar } from "../../components/landing";

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

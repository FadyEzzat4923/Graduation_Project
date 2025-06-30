import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import MainNavigationBar from "../components/MainNavigationBar";

export default function Layout() {
  useEffect(() => {
    const expiration = new Date(localStorage.getItem("expiration"));
    const dateNow = new Date();
    const differance = dateNow - expiration;
    if (differance > 0) {
      localStorage.removeItem("author");
      localStorage.removeItem("expiration");
    }
  }, []);

  return (
    <>
      <MainNavigationBar />
      <main>
        <Outlet />
      </main>
    </>
  );
}

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { GoPerson } from "react-icons/go";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { TfiMenuAlt } from "react-icons/tfi";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import logo1 from "../assets/logo1.png";
import logo2 from "../assets/logo2.png";
import NavBarLink from "./UI/NavBarLink";
import { CgClose } from "react-icons/cg";

export default function MainNavigationBar() {
  const [token, setToken] = useState(false);
  const [openNavSlider, setOpenNavSlider] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setInterval(() => {
      const auth = localStorage.getItem("author");
      if (auth !== undefined) {
        try {
          const authentication = JSON.parse(auth);
          if (authentication.token) {
            setToken(true);
          }
        } catch (err) {
          setToken(false);
        }
      }
    }, 100);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleOpenNavSlider() {
    setOpenNavSlider((prevValue) => !prevValue);
  }

  return createPortal(
    <nav
      className={`mt-7 py-3 rounded-b-xl transition-all duration-300 ${
        isScrolled ? "shadow-md transparent-bg" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="logo">
          <Link to="/home" className="flex items-center">
            <img src={logo1} alt="Motherhood Logo" className="w-14 ms-5" />
            <img src={logo2} alt="Motherhood Logo" className="h-6 ms-2" />
          </Link>
        </div>
        <div className="nav-link hidden text-lg space-x-6 lg:flex md:flex justify-between items-center font-normal transition-all">
          <NavBarLink to="/home">Home</NavBarLink>
          <NavBarLink to={token ? "/guide-mom" : "/login"}>
            Mom&apos;s Guide
          </NavBarLink>
          <NavBarLink to={token ? "/chat" : "/login"}>
            Community Chat
          </NavBarLink>
          <NavBarLink to={token ? "/marketplace" : "/login"}>
            Marketplace
          </NavBarLink>
          <NavBarLink to={token ? "/voice-recognition" : "/login"}>
            Voice Recognition
          </NavBarLink>
        </div>
        <div className="space-x-4 flex justify-between items-center font-normal transition-all text-2xl me-5">
          <div className="nav-link-icon space-x-4 flex justify-between items-center font-normal">
            <NavBarLink to={token ? "/profile" : "/login"}>
              <GoPerson />
            </NavBarLink>
            <NavBarLink to={token ? "/my-market" : "/login"}>
              <HiOutlineShoppingBag />
            </NavBarLink>
          </div>
          <button
            onClick={handleOpenNavSlider}
            className={`nav-btn text-black ${
              openNavSlider === true && "active"
            }`}
          >
            <TfiMenuAlt />
          </button>
        </div>
      </div>
      <AnimatePresence>
        {openNavSlider && (
          <>
            <div
              className="nav-backdrop fixed w-full top-0 left-0"
              onClick={handleOpenNavSlider}
            />
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.5,
                ease: "easeInOut",
              }}
              className="nav-slider fixed top-0 w-3/4 h-full min-w-36 max-w-lg pt-5 overflow-hidden"
            >
              <button
                onClick={handleOpenNavSlider}
                className={`nav-btn text-black text-2xl ms-auto me-5`}
              >
                <CgClose />
              </button>
              <motion.div className="flex flex-col gap-4 py-5 justify-center items-start ps-4 text-xl font-normal transition-all">
                <NavBarLink
                  to="/home"
                  cssClass={"w-full"}
                  onClick={handleOpenNavSlider}
                >
                  Home
                </NavBarLink>
                <NavBarLink
                  to={token ? "/guide-mom" : "/login"}
                  cssClass={"w-full"}
                  onClick={handleOpenNavSlider}
                >
                  Mom&apos;s Guide
                </NavBarLink>
                <NavBarLink
                  to={token ? "/chat" : "/login"}
                  cssClass={"w-full"}
                  onClick={handleOpenNavSlider}
                >
                  Community Chat
                </NavBarLink>
                <NavBarLink
                  to={token ? "/marketplace" : "/login"}
                  cssClass={"w-full"}
                  onClick={handleOpenNavSlider}
                >
                  Marketplace
                </NavBarLink>
                <NavBarLink
                  to={token ? "/voice-recognition" : "/login"}
                  cssClass={"w-full"}
                  onClick={handleOpenNavSlider}
                >
                  Voice Recognition
                </NavBarLink>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>,
    document.getElementById("header")
  );
}

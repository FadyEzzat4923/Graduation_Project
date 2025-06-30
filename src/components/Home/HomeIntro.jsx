import Modal from "../UI/Modal";
import intro1 from "../../assets/intro-1.png";
import intro2 from "../../assets/intro-2.png";
import intro3 from "../../assets/intro-3.png";
import introLogo from "../../assets/Motherhood-intro.png";
import cloud1 from "../../assets/Cloud-1.png";
import cloud2 from "../../assets/Cloud-2.png";
import HomeIntroCard from "./components/HomeIntroCard";
import MainButton from "../UI/MainButton";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function HomeIntro() {
  const navigate = useNavigate();
  useEffect(() => {
    const auth = localStorage.getItem("author");
    const intro = localStorage.getItem("intro");
    if (intro) {
      navigate("/home");
    }
    if (auth === undefined) {
      navigate("/home");
    } else {
      try {
        const authentication = JSON.parse(auth);
        if (authentication.token) {
          navigate("/home");
        }
      } catch (error) {
        // console.log(error);
      }
    }
  }, []);

  function handleHideModal() {
    navigate("/home");
    localStorage.setItem("intro", true);
  }

  return (
    <Modal
      hideModal={handleHideModal}
      className="page-intro w-full min-h-screen"
    >
      <div className="intro-bg">
        <motion.img
          initial={{ x: "-30%", y: "-30%", opacity: 0 }}
          animate={{ x: 0, y: 0, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 70 }}
          src={intro1}
          alt=""
        />
        <motion.img
          initial={{ x: "30%", y: "-30%", opacity: 0 }}
          animate={{ x: 0, y: 0, opacity: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          src={intro2}
          alt=""
        />
        <motion.img
          initial={{ x: "-30%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.7, type: "spring", stiffness: 70 }}
          src={intro3}
          className="lg:block hidden"
          alt=""
        />
      </div>

      <header className="logo">
        <img src={introLogo} alt="" className="mx-auto" width={200} />
      </header>
      <main className="grid pb-16 max-w-6xl mx-auto lg:grid-cols-4 md:grid-cols-2 grid-cols-1">
        <HomeIntroCard src={cloud1} alt={"Cloud image"} title={"Mom's guide"}>
          This application helps mothers get the necessary advice to take care
          of the child after birth.
        </HomeIntroCard>
        <HomeIntroCard
          src={cloud2}
          alt={"Cloud image"}
          title={"Community chat"}
        >
          The group chat section is an interactive space for women to talk to
          each other and share their experiences of pregnancy and childcare.
        </HomeIntroCard>
        <HomeIntroCard src={cloud1} alt={"Cloud image"} title={"Marketplace"}>
          Exchange baby items with other moms in a safe, easy-to-use space.
        </HomeIntroCard>
        <HomeIntroCard
          src={cloud2}
          alt={"Cloud image"}
          title={"Voice recognition "}
        >
          The Baby Voice Recognition feature uses artificial intelligence to
          analyze baby sounds such as laughter, crying, and speech, and provide
          a possible interpretation based on advanced algorithms.
        </HomeIntroCard>
      </main>
      <p className="actions pb-40 mb-5 lg:pb-12 md:pb-12 text-center lg:pe-16 lg:text-end">
        <MainButton delay={1.3} onClick={handleHideModal}>
          Get Started
        </MainButton>
      </p>
    </Modal>
  );
}

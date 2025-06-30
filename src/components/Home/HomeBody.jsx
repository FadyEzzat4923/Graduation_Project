import HomeCard from "./components/HomeCard";
import guideMom from "../../assets/guide_mom.png";
import chat from "../../assets/chat.png";
import marketplace from "../../assets/marketplace.png";
import voiceRecognition from "../../assets/voice_recognition.png";
import { motion } from "framer-motion";
export default function HomeBody() {
  return (
    <div className="mt-20">
      <motion.h1
        initial={{ y: 100, x: -100 }}
        whileInView={{ y: -50, x: 0 }}
        transition={{ duration: 0.2, type: "spring", stiffness: 50 }}
        viewport={{ once: true, amount: 0 }}
        className="text-5xl text-center font-bold"
      >
        Services we provide
      </motion.h1>
      <div className="home-card-container mt-28 grid items-center lg:grid-cols-2 sm:grid-cols-1 ">
        <HomeCard src={chat} alt={"Community chat"} link={"/chat"}>
          Community chat
        </HomeCard>
        <HomeCard
          right
          delay
          src={marketplace}
          alt={"Marketplace"}
          link={"/marketplace"}
        >
          Marketplace
        </HomeCard>
        <HomeCard delay src={guideMom} alt={"Moms guide"} link={"/guide-mom"}>
          Moms guide
        </HomeCard>
        <HomeCard
          right
          src={voiceRecognition}
          alt={"Voice recognition"}
          link={"/voice-recognition"}
        >
          Voice recognition
        </HomeCard>
      </div>
    </div>
  );
}

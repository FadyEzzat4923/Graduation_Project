import { useEffect } from "react";
import HomeBody from "../components/Home/HomeBody";
import HomeHeader from "../components/Home/HomeHeader";
import HelmetIdentify from "../components/HelmetIdentify";

export default function Home() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <>
      <HelmetIdentify
        title={"Motherhood | Home"}
        description={
          "Welcome to the Motherhood platform – your AI-powered support system for infant care, community sharing, and education."
        }
        keywords={
          "motherhood, baby care, community, AI voice recognition, marketplace, infant health"
        }
      />
      <div className="max-w-6xl mx-auto mt-10 pb-20">
        <HomeHeader />
        <HomeBody />
      </div>
    </>
  );
}

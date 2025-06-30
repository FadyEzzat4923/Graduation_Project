import useAuthentication from "../util/useAuthentication";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { fetchVoiceRecognition } from "../util/http";
import guideMomLogo from "../assets/guide_mom_logo.png";
import GuideCard from "../components/Guide/GuideCard";
import ErrorBlock from "../components/UI/ErrorBlock";
import LoadingPops from "../components/UI/LoadingPops";
import HelmetIdentify from "../components/HelmetIdentify";

export default function GuideMom() {
  const author = useAuthentication();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const { data, isError, error, isPending } = useQuery({
    queryKey: ["moms-guid"],
    queryFn: ({ signal }) =>
      fetchVoiceRecognition({ signal, token: author.token, momGuids: true }),
    staleTime: Infinity,
  });

  let content;
  if (isError) {
    content = (
      <div className="mt-20">
        <ErrorBlock
          title={"An Error Occured!"}
          message={
            error.message ||
            "Faild to fetch mom's guids, Please try again later."
          }
        />
      </div>
    );
  }
  if (isPending) {
    content = (
      <div className="text-center mt-16">
        <LoadingPops />
      </div>
    );
  }
  if (data) {
    content = data.map((ele) => {
      return (
        <GuideCard key={ele.id} title={ele.title}>
          {ele.description}
        </GuideCard>
      );
    });
  }
  return (
    <>
      <HelmetIdentify
        title={"Motherhood | Mom&lsquo;s Guide"}
        description={
          "Discover essential guidance and expert advice for new mothers on baby care, health tips, and emotional support."
        }
        keywords={
          "mom guide, baby care, new mothers, parenting tips, infant health"
        }
      />
      <div className="guide-mom max-w-6xl mx-auto mt-10 pb-20 overflow-hidden">
        <motion.div
          initial={{ y: 30, scale: 0.9, opacity: 0 }}
          whileInView={{ y: 0, scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.8,
            type: "spring",
            stiffness: 100,
          }}
          className="logo py-10 w-4/5 mx-auto"
        >
          <img
            className="mx-auto transition-all duration-500 hover:rotate-6"
            src={guideMomLogo}
            alt="guide mom logo"
          />
        </motion.div>
        <main>{content}</main>
      </div>
    </>
  );
}

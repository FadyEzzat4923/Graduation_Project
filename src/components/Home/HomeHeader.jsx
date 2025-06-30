import mainHomeImage from "../../assets/main_home.png";
import { motion, useScroll, useTransform } from "framer-motion";
export default function HomeHeader() {
  const { scrollY } = useScroll();
  const yMom = useTransform(scrollY, [100, 300], [0, -150]);
  // const oMom = useTransform(
  //   scrollY,
  //   [0, 170, 350, 490, 500],
  //   [1, 1, 0.8, 0.5, 0]
  // );
  const ytext = useTransform(scrollY, [300, 500], [0, 70]);
  return (
    <div className="grid overflow-hidden mx-2 items-center lg:grid-cols-2 lg:text-start lg:gap-0  grid-cols-1 gap-10 text-center">
      <motion.div
        initial={{ x: "-50%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{
          duration: 0.3,
          type: "spring",
          stiffness: 50,
        }}
        style={{ y: ytext }}
      >
        <h1 className="text-4xl md:text-6xl lg:text-6xl mb-5 font-bold ">
          Welcome to the mom&apos;s world
        </h1>
        <p className="text-gray-700">
          Where love, care, and support come together for every mother.
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: "40%" }}
        animate={{ opacity: [0, 1], y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.3,
          type: "spring",
          stiffness: 30,
        }}
        className="over-card"
        style={{ y: yMom }}
      >
        <img
          className="w-4/5 md:w-full mx-auto"
          src={mainHomeImage}
          alt="Mother with her kid Image"
        />
      </motion.div>
    </div>
  );
}

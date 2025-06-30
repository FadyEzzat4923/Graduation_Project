/* eslint-disable react/prop-types */
import useAuthentication from "../../util/useAuthentication";
import { BiHeart } from "react-icons/bi";
import { BsHeartFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { egpFormat } from "../../util/methods";
import { isSavedProduct, queryClient, savedProduct } from "../../util/http";
export default function MarketItem({
  id,
  pictureUrl,
  name,
  state,
  price,
  children,
  saved,
}) {
  const author = useAuthentication();

  const { data: isLoved } = useQuery({
    queryKey: ["Products", { loved: id }],
    queryFn: ({ signal, queryKey }) =>
      isSavedProduct({
        signal,
        token: author.token,
        brandId: queryKey[1].loved,
      }),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: savedProduct,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["Products"] });
      queryClient.invalidateQueries({ queryKey: ["saved-products"] });
      queryClient.invalidateQueries({ queryKey: ["my-products"] });
    },
  });

  function handleLove() {
    if (isLoved) {
      mutate({ brandId: id, token: author.token, removeSaved: true });
    } else {
      mutate({ brandId: id, token: author.token });
    }
  }
  const dir = ["-20%", "20%"];
  const randomDir = dir[Math.floor(Math.random() * 2)];

  return (
    <motion.li
      layout
      initial={{ x: randomDir, y: "30%", opacity: 0 }}
      whileInView={{ x: 0, y: 0, opacity: 1 }}
      exit={{ x: randomDir, y: "30%", opacity: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.6,
        delay: 0.1,
        type: "spring",
        stiffness: 70,
      }}
    >
      <section className="market-item rounded-2xl mx-3 overflow-hidden">
        <Link to={`/marketplace/${id}`} className="item-image">
          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            viewport={{ once: true }}
            src={`https://localhost:7054${pictureUrl}`}
            alt={name}
            className="w-full h-80"
          />
        </Link>
        <div className="item-detailes py-3 px-3">
          <motion.h1
            initial={{ y: "-30%", opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            viewport={{ once: true }}
            className="font-bold"
          >
            {name || "Unknowen"}
          </motion.h1>
          <motion.p
            initial={{ x: "-20%", opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 50 }}
            viewport={{ once: true }}
            className="text-gray-500"
          >
            {state || "Unknowen"}
          </motion.p>
          <div className="price flex justify-between mt-4 items-center font-bold text-gray-500">
            <motion.p
              initial={{ y: "70%", opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 50 }}
              viewport={{ once: true }}
            >
              {egpFormat.format(price)}
            </motion.p>
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                delay: 0.3,
                type: "spring",
                stiffness: 200,
              }}
              disabled={isPending}
              onClick={handleLove}
              className={`text-3xl${isLoved ? " love" : ""}`}
            >
              {!saved &&
                (!isLoved ? (
                  <motion.span
                    key={"unLoved"}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    <BiHeart />
                  </motion.span>
                ) : (
                  <motion.span
                    key={"Loved"}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    <BsHeartFill />
                  </motion.span>
                ))}
            </motion.button>
          </div>
          {saved && (
            <button
              disabled={isPending}
              onClick={handleLove}
              className="remove-saved flex justify-center items-center gap-3 px-2 py-1 rounded-lg max-w-48 mt-2"
            >
              <span>
                <BsHeartFill />
              </span>
              Remove from saved
            </button>
          )}
          {children}
        </div>
      </section>
    </motion.li>
  );
}

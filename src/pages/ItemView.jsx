import useAuthentication from "../util/useAuthentication";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { BsWhatsapp } from "react-icons/bs";
import { BiPhoneCall } from "react-icons/bi";
import { useQuery } from "@tanstack/react-query";
import { fetchProductsData } from "../util/http";
import { motion } from "framer-motion";
import { egpFormat } from "../util/methods";
import ErrorBlock from "../components/UI/ErrorBlock";
import LoadingIndicator from "../components/UI/LoadingIndicator";

export default function ItemView() {
  const author = useAuthentication();
  const params = useParams();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["Products", { brandId: params.itemId }],
    queryFn: ({ signal, queryKey }) =>
      fetchProductsData({
        signal,
        brandId: queryKey[1].brandId,
        token: author.token,
      }),
    refetchInterval: false,
  });

  let content;
  if (isError) {
    content = (
      <div className="mt-16">
        <ErrorBlock
          title={"An error Occurred"}
          message={error.message || "Faild to fetch product."}
        />
      </div>
    );
  }
  if (isPending) {
    content = (
      <div className="text-center mt-16">
        <LoadingIndicator />
      </div>
    );
  }

  if (data) {
    content = (
      <div className="item-view max-w-6xl mx-auto mt-5 pb-20">
        <motion.div className="item grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 mx-5 gap-10 items-center">
          <div className="item-image">
            <motion.img
              initial={{ y: 60, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 70 }}
              viewport={{ once: true }}
              src={`https://localhost:7054${data.pictureUrl}`}
              alt={data.name}
              className="w-full rounded-3xl"
            />
          </div>
          <div className="item-details text-xl lg:text-2xl flex flex-col gap-5 px-3 overflow-hidden">
            <motion.h1
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 70 }}
              className="font-bold"
            >
              {data.name}
            </motion.h1>
            <motion.h1
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 70 }}
              className="font-semibold"
            >
              {data.state}
            </motion.h1>
            <motion.h1
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 70 }}
              className="font-bold"
            >
              {egpFormat.format(data.price)}
            </motion.h1>
            <a target="_blank" href={`tel:+20${data.phoneNumber}`}>
              <motion.h1
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 70 }}
                className="font-semibold flex gap-2"
              >
                Call: +20 {data.phoneNumber}
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.1, type: "spring", stiffness: 70 }}
                >
                  <BiPhoneCall />
                </motion.span>
              </motion.h1>
            </a>
            <a
              target="_blank"
              href={`https://wa.me/+20${data.whatsappNumber}?text=Hello, is the product "${data.name}" still available? I'd like to know the details, price, payment methods, and delivery options. Thank you!`}
            >
              <motion.h1
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 70 }}
                className="font-semibold flex gap-2"
              >
                WhatsApp: +20 {data.whatsappNumber}
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.1, type: "spring", stiffness: 70 }}
                >
                  <BsWhatsapp />
                </motion.span>
              </motion.h1>
            </a>
          </div>
        </motion.div>
        <div className="item-description mt-10 px-5 lg:mx-0 md:mx-5">
          <motion.h1
            initial={{ x: -300, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 50 }}
            className="text-3xl mt-5 mb-3 font-bold"
          >
            Product Description
          </motion.h1>
          <motion.code
            initial={{ height: 0, opacity: 0 }}
            whileInView={{ height: "auto", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, type: "spring", stiffness: 50 }}
            className="font-semibold text-gray-600 overflow-hidden"
          >
            {data.description}
          </motion.code>
          <div className="owner flex items-center gap-5 mt-10">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ dela: 0.4, type: "spring", stiffness: 70 }}
              className="owner-icon rounded-full flex justify-center items-center text-3xl font-bold text-gray-700 text-center"
            >
              {data.userName.charAt(0).toUpperCase()}
            </motion.div>
            <motion.p
              initial={{ height: 0, opacity: 0 }}
              whileInView={{ height: "auto", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ dela: 0.8, type: "spring", stiffness: 70 }}
              className="text-2xl font-bold text-gray-700 overflow-hidden"
            >
              {data.userName}
            </motion.p>
          </div>
        </div>
      </div>
    );
  }

  return content;
}

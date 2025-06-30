import useAuthentication from "../../../util/useAuthentication";
import { useQuery } from "@tanstack/react-query";
import { fetchProductsData } from "../../../util/http";
import { AnimatePresence, motion } from "framer-motion";
import MarketItem from "../MarketItem";
import LoadingIndicator from "../../UI/LoadingIndicator";
import ErrorBlock from "../../UI/ErrorBlock";

export default function MarketFavorite() {
  const author = useAuthentication();

  const { data, isError, isPending, isFetching, error } = useQuery({
    queryKey: ["saved-products", { savedProducts: author.userId }],
    queryFn: ({ signal }) =>
      fetchProductsData({ signal, token: author.token, savedProduct: true }),
  });

  let content;

  if (isPending || isFetching) {
    content = (
      <div className="text-center mt-12">
        <LoadingIndicator />
      </div>
    );
  }

  if (isError) {
    content = (
      <div className="mt-12">
        <ErrorBlock
          title={"An error occurred"}
          message={error.message || "Faild to fetch saved products."}
        />
      </div>
    );
  }
  if (data) {
    content = (
      <ul className="mt-20 grid grid-cols-1 gap-5 gap-y-14 mx-3 lg:mx-0 lg:grid-cols-3 md:grid-cols-2">
        <AnimatePresence>
          {data.map((product) => {
            return <MarketItem key={product.id} {...product} saved />;
          })}
        </AnimatePresence>
      </ul>
    );
  }

  if (data && data.length === 0) {
    content = (
      <motion.p
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mt-20 text-2xl text-gray-600"
      >
        No products found.
      </motion.p>
    );
  }
  return content;
}

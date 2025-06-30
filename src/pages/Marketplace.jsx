import useAuthentication from "../util/useAuthentication";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchProductsData } from "../util/http";
import { AnimatePresence, motion } from "framer-motion";
import MarketHeader from "../components/Marketplace/MarketHeader";
import MarketItem from "../components/Marketplace/MarketItem";
import LoadingIndicator from "../components/UI/LoadingIndicator";
import ErrorBlock from "../components/UI/ErrorBlock";
import HelmetIdentify from "../components/HelmetIdentify";

export default function Marketplace() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);
  const [isSearch, setIsSearch] = useState(false);
  const [showError, setShowError] = useState(false);
  useAuthentication();

  const { data, isError, isPending, error } = useQuery({
    queryKey: ["Products"],
    queryFn: ({ signal }) =>
      fetchProductsData({
        signal,
      }),
    refetchInterval: showError ? 10000 : null,
  });

  useEffect(() => {
    if (isError) {
      setShowError(true);
    }
    return () => {
      setTimeout(() => setShowError(false), 10000);
    };
  }, [isError]);

  const {
    mutate,
    data: searchProductData,
    isError: isErrorSearch,
    error: errorSearch,
    isPending: isPendingSearch,
  } = useMutation({
    mutationFn: fetchProductsData,
  });

  function handleProductsSearch(data) {
    const searchData = data.trim();
    mutate({ searchData });
    setIsSearch(() => {
      if (searchData === "") {
        return false;
      } else {
        return true;
      }
    });
  }

  let content = <p className="text-center mt-5">No data found.</p>;

  if (isPending || isPendingSearch) {
    content = (
      <div className="text-center mt-16">
        <LoadingIndicator />
      </div>
    );
  }

  if (isError || isErrorSearch) {
    content = (
      <div className="mt-16">
        <ErrorBlock
          title={"An error occurred"}
          message={
            isError
              ? error.message
              : errorSearch.message || "Faild to fetch products."
          }
        />
      </div>
    );
  }

  if (data || searchProductData) {
    content = (
      <ul className="pt-36 overflow-hidden grid grid-cols-1 gap-1 gap-y-14 mx-3 lg:mx-0 lg:grid-cols-3 md:grid-cols-2">
        <AnimatePresence mode="wait">
          {data &&
            !isSearch &&
            data.data.map((product) => (
              <MarketItem key={product.id} {...product} />
            ))}
          {isSearch &&
            searchProductData &&
            searchProductData.map((product) => (
              <MarketItem key={product.id} {...product} />
            ))}
        </AnimatePresence>
      </ul>
    );
  }

  if (
    (data && data.data.length === 0) ||
    (searchProductData && searchProductData.length === 0)
  ) {
    content = (
      <motion.p
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -30, opacity: 0 }}
        className="text-center mt-20 text-2xl text-gray-600"
      >
        No products found.
      </motion.p>
    );
  }

  return (
    <>
      <HelmetIdentify
        title={"Motherhood | Marketplace"}
        description={
          "Buy, sell, or exchange baby items with other mothers in a safe and supportive online marketplace."
        }
        keywords={
          "baby marketplace, mom exchange, sell baby items, parenting community, motherhood platform"
        }
      />
      <div className="market-place max-w-6xl mx-auto mt-10 pb-20">
        <Outlet />
        <MarketHeader onSearch={handleProductsSearch} />
        {content}
      </div>
    </>
  );
}

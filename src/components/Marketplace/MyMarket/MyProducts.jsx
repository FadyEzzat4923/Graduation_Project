import useAuthentication from "../../../util/useAuthentication";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  deleteProduct,
  fetchProductsData,
  queryClient,
} from "../../../util/http";
import CreateProduct from "../CreateProduct";
import ErrorBlock from "../../UI/ErrorBlock";
import LoadingIndicator from "../../UI/LoadingIndicator";
import MyMarketItem from "./MyMarketItem";
import DeleteConfirmation from "../../UI/DeleteConfirmation";

export default function MyProducts() {
  const [isEditing, setIsEditing] = useState(false);
  const author = useAuthentication();
  const [editData, setEditData] = useState({});
  const [isStartDeleting, setIsStartDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState();

  const { data, isError, isPending, error } = useQuery({
    queryKey: ["my-products", { userProducts: author.userId }],
    queryFn: ({ signal }) =>
      fetchProductsData({
        signal,
        myProduct: true,
        token: author.token,
      }),
  });

  const { mutate, isPending: isPendingDelete } = useMutation({
    mutationFn: deleteProduct,
    onSettled: () => {
      handleStopDelete();
      queryClient.invalidateQueries({ queryKey: ["Products"] });
      queryClient.invalidateQueries({ queryKey: ["my-products"] });
      queryClient.invalidateQueries({ queryKey: ["saved-products"] });
    },
  });

  let content;

  if (isEditing) {
    content = (
      <CreateProduct defaultData={editData} onClose={handleCloseEditing} />
    );
  }

  if (isStartDeleting) {
    content = (
      <DeleteConfirmation
        handleStopDelete={handleStopDelete}
        isPendingDelete={isPendingDelete}
        onDelete={handleDelete}
        deleteText={"this product permanently"}
      />
    );
  }

  function handleEditProduct(data) {
    setIsEditing(true);
    setEditData(data);
  }

  function handleCloseEditing() {
    setIsEditing(false);
    setEditData({});
  }

  function handleStartDelete(id) {
    setIsStartDeleting(true);
    setDeleteId(id);
  }

  function handleStopDelete() {
    setIsStartDeleting(false);
    setDeleteId();
  }

  function handleDelete() {
    mutate({ brandId: deleteId, token: author.token });
  }

  let pageContent;

  if (isPending) {
    pageContent = (
      <div className="text-center mt-12">
        <LoadingIndicator />
      </div>
    );
  }

  if (isError) {
    pageContent = (
      <div className="mt-12">
        <ErrorBlock
          title={"An error occurred"}
          message={error.message || "Faild to delete product."}
        />
      </div>
    );
  }

  if (data) {
    pageContent = (
      <ul className="mt-20 grid grid-cols-1 gap-5 gap-y-14 mx-3 lg:mx-0 lg:grid-cols-3 md:grid-cols-2">
        <AnimatePresence>
          {data.map((event) => {
            return (
              <MyMarketItem
                key={event.id}
                productData={event}
                onEdit={handleEditProduct}
                onDelete={handleStartDelete}
              />
            );
          })}
        </AnimatePresence>
      </ul>
    );
  }
  if (data && data.length === 0) {
    pageContent = (
      <motion.p
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mt-20 text-2xl text-gray-600"
      >
        You have no products yet.
      </motion.p>
    );
  }

  return (
    <>
      <AnimatePresence>{content}</AnimatePresence>
      {pageContent}
    </>
  );
}

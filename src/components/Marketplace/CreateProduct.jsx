/* eslint-disable react/prop-types */
import useAuthentication from "../../util/useAuthentication";
import { useEffect, useRef, useState } from "react";
import { RiArrowLeftDoubleFill } from "react-icons/ri";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createProduct, fetchProductsData, queryClient } from "../../util/http";
import { AnimatePresence, motion } from "framer-motion";
import { isDetails, isNotEmpty, isPhoneNumber } from "../../util/validation";
import ErrorBlock from "../UI/ErrorBlock";
import back from "../../assets/verification.png";
import logo from "../../assets/new_product.png";
import Modal from "../UI/Modal";
import MainButton from "../UI/MainButton";
import Input from "../UI/Input";

export default function CreateProduct({ defaultData, onClose }) {
  const author = useAuthentication();
  const fileRef = useRef();
  const [validationError, setValidationError] = useState({});
  const [showError, setShowError] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  if (showError) {
    setTimeout(() => setShowError(false), 5000);
  }

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Products"] });
      queryClient.invalidateQueries({ queryKey: ["my-products"] });
      queryClient.invalidateQueries({ queryKey: ["saved-products"] });
      onClose();
    },
  });

  const { data: imageData } = useQuery({
    queryKey: ["product-image"],
    queryFn: ({ signal }) =>
      fetchProductsData({ signal, imageId: defaultData.id }),
  });

  useEffect(() => {
    if (defaultData && imageData) {
      const imageURL = URL.createObjectURL(imageData);
      setImageUrl(imageURL);
    }
  }, [defaultData, imageData]);

  function handleUpload() {
    fileRef.current.click();
    setShowImage(false);
  }
  function handleShowImage() {
    const file = fileRef.current.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setImageUrl(imageURL);
    }
  }
  function handleSubmit(event) {
    event.preventDefault();
    const fd = new FormData(event.target);
    const formData = Object.fromEntries(fd.entries());
    let file;
    const errors = {};

    if (!isNotEmpty(formData.Title)) {
      errors.title = "Title must be 3-100 characters.";
    }
    if (!isNotEmpty(formData.State)) {
      errors.state = "Title must be 3-100 characters (e.g., New, Used).";
    }
    if (formData.Price <= 0) {
      errors.price = "Price must be more than 0.01";
    }
    if (!isPhoneNumber(formData.PhoneNumber)) {
      errors.phoneNumber =
        "Phone must start with 010, 011, 012, or 015 and be exactly 11 digits (e.g., 01012345678).";
    }
    if (!isPhoneNumber(formData.WhatsappNumber)) {
      errors.whatsappNumber =
        "WhatsApp must start with 010, 011, 012, or 015 and be exactly 11 digits (e.g., 01512345678).";
    }
    if (!isDetails(formData.Details)) {
      errors.details = "Details must be more than 3 characters.";
    }

    if (defaultData) {
      file = new File([imageData], "default-image.jpg", {
        type: imageData.type,
      });
      fd.append("ImageFile", file);
    } else {
      const fileInput = event.target.ImageFile;
      file = fileInput.files[0];
    }
    if (file) {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];

      if (!allowedTypes.includes(file.type)) {
        fd.delete("ImageFile");
        errors.imageFile =
          "File must be a valid image type (jpeg, png, gif, webp, bmp).";
      }
    } else {
      errors.imageFile = "Image must be uploaded.";
    }

    if (Object.keys(errors).length > 0) {
      setValidationError(errors);
      setShowError(true);
    } else {
      mutate({
        data: fd,
        token: author.token,
        brandId: defaultData ? defaultData.id : null,
      });
    }
  }
  return (
    <Modal className={"login w-full bg-white p-5"}>
      <button
        onClick={onClose}
        className="backward absolute text-4xl rounded-lg duration-150 hover:bg-purple-400 hover:text-white"
      >
        <RiArrowLeftDoubleFill />
      </button>
      <div className="w-full h-full flex justify-center items-center lg:gap-x-20 md:gap-x-5">
        <div className="image h-full hidden lg:block md:block relative">
          <motion.img
            initial={{ opacity: 0, y: "10%" }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 50 }}
            src={back}
            className="h-full"
          />
          <motion.img
            initial={{ opacity: 0, y: "10%" }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 50 }}
            src={logo}
            className=" absolute bottom-0"
          />
        </div>
        <div className="login-card flex flex-col justify-center h-full text-center">
          <motion.h1
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 50 }}
            className="text-4xl font-bold mb-8"
          >
            {defaultData ? "Edit Product" : "New Product"}
          </motion.h1>
          <form
            onSubmit={handleSubmit}
            action=""
            className="flex flex-col items-center gap-4"
          >
            <Input
              delay={0.2}
              id={"Title"}
              type={"text"}
              placeholder={"Product title"}
              lable={"Product Title"}
              defaultValue={defaultData ? defaultData.name : ""}
              error={(showError && validationError.title) || ""}
            />
            <div className="flex-row gap-1 flex w-full">
              <Input
                delay={0.3}
                id={"State"}
                type={"text"}
                placeholder={"New / Used "}
                lable={"Product State"}
                defaultValue={defaultData ? defaultData.state : ""}
                error={(showError && validationError.state) || ""}
              />
              <Input
                delay={0.4}
                id={"Price"}
                type={"number"}
                min="0.01"
                step="0.01"
                placeholder={"EGP 0.00"}
                lable={"Product Price"}
                defaultValue={defaultData ? defaultData.price : ""}
                error={(showError && validationError.price) || ""}
              />
            </div>
            <div className="md:flex-row lg:flex-row lg:gap-1 flex flex-col gap-5 w-full">
              <Input
                delay={0.5}
                id={"PhoneNumber"}
                removeEnd
                type={"number"}
                placeholder={"Phone number"}
                lable={"Phone"}
                icon={<p className="text-sm -ms-5">+20</p>}
                defaultValue={defaultData ? defaultData.phoneNumber : ""}
                error={(showError && validationError.phoneNumber) || ""}
              />
              <Input
                delay={0.6}
                id={"WhatsappNumber"}
                removeEnd
                type={"number"}
                placeholder={"WhatsApp number"}
                lable={"WhatsApp"}
                icon={<p className="text-sm -ms-5">+20</p>}
                defaultValue={defaultData ? defaultData.whatsappNumber : ""}
                error={(showError && validationError.whatsappNumber) || ""}
              />
            </div>
            <Input
              delay={0.7}
              tag={"textarea"}
              id={"Details"}
              rows={2}
              lable={"Product Details"}
              placeholder={"Product Details"}
              defaultValue={defaultData ? defaultData.description : ""}
              error={(showError && validationError.details) || ""}
            />
            <input
              type="file"
              id="ImageFile"
              name="ImageFile"
              ref={fileRef}
              className="hidden"
              accept="image/*"
              onChange={handleShowImage}
            />
            <div className="relative w-full flex items-center">
              <AnimatePresence>
                {showImage && imageUrl && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      ease: "easeInOut",
                    }}
                    className="absolute -top-1 -translate-y-full w-full rounded-2xl overflow-hidden"
                  >
                    <img src={imageUrl} alt="Uploaded image" />
                  </motion.div>
                )}
              </AnimatePresence>
              <MainButton
                delay={0.8}
                onClick={handleUpload}
                type={"button"}
                className={"image-button w-full"}
              >
                {defaultData || imageUrl ? "Edit Image" : "Upload Image"}
              </MainButton>
              {showError && validationError.imageFile && (
                <div className="error rounded-md text-start text-sm shadow-lg p-1 px-3 absolute  start-16">
                  {validationError.imageFile}
                </div>
              )}
              <AnimatePresence>
                {imageUrl && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      delay: defaultData ? 1 : 0.2,
                      ease: "easeInOut",
                    }}
                    onClick={() => setShowImage((prev) => !prev)}
                    className="cursor-pointer ms-5 text-gray-400 bg-white rounded-2xl w-48"
                  >
                    {showImage ? "Hide" : "Show"} Image
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            <p className="flex flex-wrap items-center justify-center lg:flex-nowrap md:flex-nowrap gap-3">
              <MainButton
                disabled={isPending}
                delay={0.9}
                className={"px-2 w-full"}
              >
                {defaultData ? "EDIT" : "ADD"}
              </MainButton>
              <MainButton
                delay={1}
                type={"button"}
                className={"px-2 w-full"}
                onClick={onClose}
              >
                CANCEL
              </MainButton>
            </p>
          </form>
          {isError && (
            <div className="absolute top-0 left-1/2 max-w-3xl -translate-x-1/2">
              <ErrorBlock
                title={"An Error Occurred"}
                message={error.info?.title || "Faild to send product data."}
              />
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

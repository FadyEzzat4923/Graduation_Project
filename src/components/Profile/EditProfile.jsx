import useAuthentication from "../../util/useAuthentication";
import { RiArrowLeftDoubleFill } from "react-icons/ri";
import { MdOutlineMail } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { login } from "../../util/http";
import { useState } from "react";
import { motion } from "framer-motion";
import { isEmail, isNotEmpty } from "../../util/validation";
import Modal from "../UI/Modal";
import signup from "../../assets/signup.png";
import Input from "../UI/Input";
import MainButton from "../UI/MainButton";
export default function EditProfile() {
  const author = useAuthentication();
  const navigate = useNavigate();
  const [showError, setShowError] = useState(false);
  const [validationError, setValidationError] = useState({});
  const [showValidationError, setShowValidationError] = useState(false);

  const { mutate, error, isPending } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      localStorage.setItem("author", JSON.stringify(data));

      const expiration = new Date();
      expiration.setHours(expiration.getHours() + 24);
      localStorage.setItem("expiration", expiration.toISOString());
      navigate("/profile");
    },
    onError: (data) => {
      data.
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
    },
  });

  function handleSubmit(event) {
    event.preventDefault();
    const errors = {};
    const fd = new FormData(event.target);
    const data = Object.fromEntries(fd.entries());
    const mutateData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
    };
    if (!isEmail(mutateData.email)) {
      errors.email =
        "Please enter a valid email address (e.g: example@gmail.com).";
    }
    if (!isNotEmpty(mutateData.firstName)) {
      errors.firstName = "First Name must be 3-100 characters.";
    }
    if (!isNotEmpty(mutateData.lastName)) {
      errors.lastName = "Last Name must be 3-100 characters.";
    }
    if (Object.keys(errors).length > 0) {
      setValidationError(errors);
      setShowValidationError(true);

      setTimeout(() => {
        setValidationError({});
        setShowValidationError(false);
      }, 5000);
    } else {
      mutate({
        data: mutateData,
        action: "update-profile",
        token: author.token,
      });
    }
  }

  return (
    <Modal className={"login w-full bg-white p-5"}>
      <Link
        to={"/profile"}
        className="backward absolute text-4xl rounded-lg duration-150 hover:bg-purple-400 hover:text-white"
      >
        <RiArrowLeftDoubleFill />
      </Link>
      <div className="w-full h-full flex justify-center items-center lg:gap-x-20 md:gap-x-5">
        <div className="image h-full hidden lg:block md:block">
          <motion.img
            initial={{ opacity: 0, y: "10%" }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 50 }}
            src={signup}
            className="h-full"
          />
        </div>
        <div className="login-card flex flex-col justify-center h-full text-center">
          <motion.h1
            initial={{ y: -70, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 50 }}
            className="text-4xl font-bold mb-8"
          >
            Edit Profile
          </motion.h1>
          <form
            onSubmit={handleSubmit}
            action=""
            className="flex flex-col items-center gap-5"
          >
            <div className="lg:flex-row md:flex-row lg:gap-1 md:gap-1 flex flex-col gap-5 w-full">
              <Input
                id={"firstName"}
                delay={0.2}
                type={"text"}
                placeholder={"Your first name"}
                lable={"First Name"}
                defaultValue={author.firstName}
                error={(showValidationError && validationError.firstName) || ""}
              />
              <Input
                delay={0.3}
                id={"lastName"}
                type={"text"}
                placeholder={"Your last name"}
                lable={"Last Name"}
                defaultValue={author.lastName}
                error={(showValidationError && validationError.lastName) || ""}
              />
            </div>
            <Input
              delay={0.4}
              id={"email"}
              type={"email"}
              placeholder={"email@gmail.com"}
              icon={<MdOutlineMail />}
              lable={"Email"}
              defaultValue={author.email}
              error={
                showError
                  ? error?.info?.message
                  : (showValidationError && validationError.email) || ""
              }
            />
            <p className="mt-5 w-full">
              <MainButton
                delay={0.6}
                disabled={isPending}
                className={"w-full px-0"}
              >
                {isPending ? "Submitting..." : "Edit Profile"}
              </MainButton>
            </p>
          </form>
        </div>
      </div>
    </Modal>
  );
}

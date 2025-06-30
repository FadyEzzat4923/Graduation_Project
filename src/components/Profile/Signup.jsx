import { useState } from "react";
import { RiArrowLeftDoubleFill } from "react-icons/ri";
import { MdLockOutline, MdOutlineMail } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { login } from "../../util/http";
import { isEmail, isNotEmpty } from "../../util/validation";
import Modal from "../UI/Modal";
import signup from "../../assets/signup.png";
import Input from "../UI/Input";
import MainButton from "../UI/MainButton";
export default function Signup() {
  const navigate = useNavigate();
  const [showError, setShowError] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);
  const [validationError, setValidationError] = useState({});

  const { mutate, error, isPending } = useMutation({
    mutationFn: login,
    onSettled: (data) => {
      if (data.status === 422 || data.status === 401) {
        console.log("error");
      } else {
        navigate("../");
      }
    },
    onError: () => setShowError(true),
  });

  if (showError) {
    setTimeout(() => setShowError(false), 5000);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const fd = new FormData(event.target);
    const data = Object.fromEntries(fd.entries());
    const errors = {};
    const mutateData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email.toLowerCase(),
      password: data.password,
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
    if (data.password !== data["confirm-password"]) {
      errors.confirmPassword = "Confirm password does not match";
    }

    if (Object.keys(errors).length > 0) {
      setValidationError(errors);
      setShowValidationError(true);

      setTimeout(() => {
        setValidationError({});
        setShowValidationError(false);
      }, 5000);
    } else {
      mutate({ data: mutateData, action: "signup" });
    }
  }

  return (
    <>
      <Helmet>
        <title>Motherhood | Signup</title>
        <meta
          name="description"
          content="Secure login page for Helmet Baby Care platform. Access your account to manage your profile and use all features."
        />
        <meta
          name="keywords"
          content="login, user authentication, helmet baby care, secure access"
        />
      </Helmet>
      <Modal className={"login w-full bg-white p-5"}>
        <Link
          to={"/login"}
          className="backward absolute text-4xl rounded-lg duration-150 hover:bg-purple-400 hover:text-white"
        >
          <RiArrowLeftDoubleFill />
        </Link>
        <div className="w-full h-full flex justify-center items-center lg:gap-x-20 md:gap-x-5">
          <div className="image h-full hidden lg:block md:block">
            <motion.img
              initial={{ opacity: 0, y: "10%" }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 50 }}
              src={signup}
              className="h-full"
            />
          </div>
          <div className="login-card flex flex-col justify-center h-full text-center">
            <motion.h1
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 50 }}
              className="text-4xl font-bold mb-8"
            >
              Create Account
            </motion.h1>
            <form
              onSubmit={handleSubmit}
              action=""
              className="flex flex-col items-center gap-5"
            >
              <div className="lg:flex-row md:flex-row lg:gap-1 md:gap-1 flex flex-col gap-5 w-full">
                <Input
                  delay={0.1}
                  id={"firstName"}
                  type={"text"}
                  placeholder={"Your first name"}
                  lable={"First Name"}
                  error={
                    (showValidationError && validationError.firstName) || ""
                  }
                />
                <Input
                  delay={0.2}
                  id={"lastName"}
                  type={"text"}
                  placeholder={"Your last name"}
                  lable={"Last Name"}
                  error={
                    (showValidationError && validationError.lastName) || ""
                  }
                />
              </div>
              <Input
                delay={0.3}
                id={"email"}
                type={"email"}
                placeholder={"email@gmail.com"}
                icon={<MdOutlineMail />}
                lable={"Email"}
                error={
                  showError
                    ? error?.info?.email
                    : (showValidationError && validationError.email) || ""
                }
              />
              <Input
                delay={0.4}
                id={"password"}
                type={"password"}
                placeholder={"Enter your password"}
                icon={<MdLockOutline />}
                lable={"Password"}
                error={showError && error?.info?.password}
              />
              <Input
                delay={0.5}
                id={"confirm-password"}
                type={"password"}
                placeholder={"Enter confirm password"}
                icon={<MdLockOutline />}
                lable={"Confirm Password"}
                error={
                  (showValidationError && validationError.confirmPassword) || ""
                }
              />
              <p className="mt-5 w-full">
                <MainButton
                  delay={0.9}
                  disabled={isPending}
                  className={"w-full px-0"}
                >
                  {isPending ? "Submitting..." : "Create Account"}
                </MainButton>
              </p>
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
}

import { RiArrowLeftDoubleFill } from "react-icons/ri";
import { MdOutlineMail } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { login } from "../../util/http";
import { motion } from "framer-motion";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Modal from "../UI/Modal";
import reset from "../../assets/reset.png";
import Input from "../UI/Input";
import MainButton from "../UI/MainButton";
import { isEmail } from "../../util/validation";
export default function ForgetPassword() {
  const navigate = useNavigate();
  const [showError, setShowError] = useState(false);

  const { mutate, isPending, error } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      navigate("/login/check-email");
    },
    onError: () => setShowError(true),
  });

  function handleSubmit(event) {
    event.preventDefault();
    const email = new FormData(event.target).get("email").toLowerCase();
    if (!isEmail(email)) {
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
    } else { 
      mutate({ data: { email }, action: "forget-password" });
      localStorage.setItem("forgetPassword", JSON.stringify({ email }));
    }
  }

  if (showError) {
    setTimeout(() => setShowError(false), 5000);
  }
  return (
    <>
      <Helmet>
        <title>Motherhood | Forget Password</title>

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
              transition={{ delay: 0.3, type: "spring", stiffness: 50 }}
              src={reset}
              className="h-full"
            />
          </div>
          <div className="login-card flex flex-col justify-center h-full text-center">
            <motion.h1
              initial={{ y: -70, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 50 }}
              className="text-4xl font-bold mb-5"
            >
              Forgot password
            </motion.h1>
            <motion.p
              initial={{ x: -200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 50 }}
              className="mb-8 login-p text-sm"
            >
              Don’t worry, happens to all of us. Enter your email below to
              recover your password
            </motion.p>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-center gap-5"
            >
              <Input
                id={"email"}
                type={"email"}
                placeholder={"email@gmail.com"}
                icon={<MdOutlineMail />}
                lable={"Email"}
                error={
                  (showError &&
                    (error
                      ? error.info?.message
                      : "Please enter a valid email address (e.g: example@gmail.com).")) ||
                  ""
                }
              />
              <p className="mt-5 w-full">
                <MainButton
                  disabled={isPending}
                  delay={0.6}
                  className={"w-full px-0 mb-5"}
                >
                  {isPending ? "Sending..." : "Send Gmail"}
                </MainButton>
                <Link to={"/login"}>
                  <MainButton
                    disabled={isPending}
                    delay={0.8}
                    type="button"
                    className={"w-full px-0"}
                  >
                    Back To Login
                  </MainButton>
                </Link>
              </p>
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
}

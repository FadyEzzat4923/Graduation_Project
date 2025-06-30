import Modal from "../UI/Modal";
import verification from "../../assets/verification.png";
import verificationLogo from "../../assets/verification_logo.png";
import MainButton from "../UI/MainButton";
import { RiArrowLeftDoubleFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import Input from "../UI/Input";
import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { login } from "../../util/http";
export default function Verification() {
  const navigate = useNavigate();
  const [showError, setShowError] = useState(false);
  const [resend, setResend] = useState(true);
  const resendTime = 1000 * 60;

  const { mutate, isPending, error } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      navigate("/login/new-password");
    },
    onError: () => setShowError(true),
  });

  if (showError) {
    setTimeout(() => setShowError(false), 5000);
  }

  const { mutate: mutateResend, isPending: isPendingResend } = useMutation({
    mutationFn: login,
    onSuccess: () => setResend(false),
  });

  if (!resend) {
    setTimeout(() => {
      setResend(true);
    }, resendTime);
  }

  function handleResendEmail() {
    const email = JSON.parse(localStorage.getItem("forgetPassword")).email;
    mutateResend({ data: { email }, action: "forget-password" });
  }

  function handleSubmit(event) {
    event.preventDefault();
    const userCode = new FormData(event.target).get("code");
    const data = JSON.parse(localStorage.getItem("forgetPassword"));
    const newData = {
      ...data,
      resetCode: userCode,
    };
    mutate({ data: newData, action: "verify-reset-code" });
    localStorage.setItem("forgetPassword", JSON.stringify(newData));
  }

  return (
    <Modal className={"login w-full bg-white p-5"}>
      <Link
        to={"/login/reset"}
        className="backward absolute text-4xl rounded-lg duration-150 hover:bg-purple-400 hover:text-white"
      >
        <RiArrowLeftDoubleFill />
      </Link>
      <div className="w-full h-full flex justify-center items-center lg:gap-x-20 md:gap-x-5">
        <div className="image h-full hidden lg:block md:block relative">
          <motion.img
            initial={{ opacity: 0, y: "10%" }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 50 }}
            src={verification}
            className="h-full"
          />
          <motion.img
            initial={{ opacity: 0, y: "10%" }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 50 }}
            src={verificationLogo}
            className=" absolute bottom-0"
          />
        </div>
        <form
          onSubmit={handleSubmit}
          className="login-card flex flex-col justify-center h-full text-center"
        >
          <motion.h1
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 50 }}
            className="text-4xl font-bold mb-4"
          >
            Verification
          </motion.h1>
          <motion.p
            initial={{ x: -200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 50 }}
            className="mb-8 login-p text-sm"
          >
            We have send you a code to verify your email address
          </motion.p>
          <Input
            delay={0.5}
            autoComplete="off"
            id={"code"}
            placeholder={"Enter your code"}
            autoFocus
            error={showError && error.info?.message}
          />
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8, type: "spring", stiffness: 50 }}
            className="mt-3 text-sm flex justify-center text-gray-900"
          >
            Don’t receive the code?
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.9, type: "spring", stiffness: 50 }}
            >
              <button
                type="button"
                onClick={handleResendEmail}
                disabled={isPendingResend || !resend}
              >
                <span className={`login-t font-bold ms-2`}>
                  {resend ? "Resend code" : "Resend again after 1 minute"}
                </span>
              </button>
            </motion.div>
          </motion.div>
          <p className="mt-12 w-full">
            <MainButton
              disabled={isPending}
              delay={1}
              className={"w-full px-0"}
            >
              {isPending ? "Sending..." : "Verify"}
            </MainButton>
          </p>
        </form>
      </div>
    </Modal>
  );
}

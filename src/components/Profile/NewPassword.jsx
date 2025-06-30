import { RiArrowLeftDoubleFill } from "react-icons/ri";
import { MdLockOutline } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { login } from "../../util/http";
import { useState } from "react";
import { motion } from "framer-motion";
import Modal from "../UI/Modal";
import reset from "../../assets/reset.png";
import Input from "../UI/Input";
import MainButton from "../UI/MainButton";
export default function NewPassword() {
  const navigate = useNavigate();
  const [confirmError, setConfirmError] = useState(false);

  const { mutate, isError, error, isPending } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      navigate("/login/changed");
      localStorage.removeItem("forgetPassword");
    },
  });

  function handleSubmit(event) {
    event.preventDefault();
    const fd = new FormData(event.target);
    const password = fd.get("password");
    const confirmPassword = fd.get("confirm-password");
    try {
      const data = JSON.parse(localStorage.getItem("forgetPassword"));

      const resetData = {
        ...data,
        newPassword: password,
      };

      if (password === confirmPassword) {
        mutate({ data: resetData, action: "reset-password" });
      } else {
        setConfirmError(true);
        setTimeout(() => setConfirmError(false), 5000);
      }
    } catch (err) {
     // error
    }
  }
  return (
    <Modal className={"login w-full bg-white p-5"}>
      <Link
        to={"/login/check-email"}
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
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 50 }}
            className="text-4xl font-bold mb-5"
          >
            New Password
          </motion.h1>
          <motion.p
            initial={{ x: -200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 50 }}
            className="mb-10 login-p"
          >
            Please enter your new password to continue
          </motion.p>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center gap-5"
          >
            <Input
              delay={0.4}
              id={"password"}
              type={"password"}
              autoComplete="off"
              placeholder={"Enter your password"}
              icon={<MdLockOutline />}
              lable={"Password"}
            />
            <Input
              delay={0.7}
              id={"confirm-password"}
              type={"password"}
              autoComplete="off"
              placeholder={"Enter confirm password"}
              icon={<MdLockOutline />}
              lable={"Confirm Password"}
              error={confirmError && "Confirm password does not match."}
            />
            {isError && (
              <div className="text-red-600 text-start">
                <p>{error?.info[0]?.description ?? ""}</p>
                <p>{error?.info[1]?.description ?? ""}</p>
                <p>{error?.info?.message ?? ""}</p>
                <p>
                  {error?.info?.errors?.ResetCode
                    ? "Reset code is required to verifing."
                    : ""}
                </p>
                {!error && (
                  <p>
                    There exist a problem in data provided email or verification
                    code has gone.
                  </p>
                )}
              </div>
            )}
            <p className="mt-5 w-full">
              <MainButton delay={0.9} className={"w-full px-0"}>
                {isPending ? "Submitting..." : "Reset Password"}
              </MainButton>
            </p>
          </form>
        </div>
      </div>
    </Modal>
  );
}

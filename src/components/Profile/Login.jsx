import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { MdLockOutline, MdOutlineMail } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { login as userLogin } from "../../util/http";
// import { FcGoogle } from "react-icons/fc";
// import { BsFacebook } from "react-icons/bs";
// import { FaApple } from "react-icons/fa";
import Modal from "../UI/Modal";
import login from "../../assets/login.png";
import Input from "../UI/Input";
import MainButton from "../UI/MainButton";
import HelmetIdentify from "../HelmetIdentify";
import { isEmail } from "../../util/validation";
export default function Login() {
  const [remember, setRemember] = useState(false);
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();
  const { mutate, error, isPending } = useMutation({
    mutationFn: userLogin,
    onSettled: (data) => {
      if (
        data.status !== 400 ||
        data.status !== 422 ||
        data.status !== 401 ||
        data.status !== 500
      ) {
        localStorage.setItem("author", JSON.stringify(data));
        const expiration = new Date();
        expiration.setHours(expiration.getHours() + (remember ? 7 * 24 : 24));
        localStorage.setItem("expiration", expiration.toISOString());
        navigate("/home");
        setRemember(false);
      }
    },
    onError: () => {
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
    },
  });

  function handleSubmit(event) {
    event.preventDefault();
    const fd = new FormData(event.target);
    const data = Object.fromEntries(fd.entries());
    data.email = data.email.toLowerCase();
    if (data.remember) {
      setRemember(true);
    }
    if (!isEmail(data.email)) {
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
    } else {
      mutate({ data, action: "login" });
    }
  }

  return (
    <>
      <HelmetIdentify
        title={"Motherhood | Login"}
        description={
          "Secure login page for Helmet Baby Care platform. Access your account to manage your profile and use all features."
        }
        keywords={"login, user authentication, helmet baby care, secure access"}
      />
      <Modal className={"login w-full bg-white p-5"}>
        <div className="w-full h-full flex justify-center items-center lg:gap-x-20 md:gap-x-5">
          <div className="login-card flex flex-col justify-center h-full text-center">
            <motion.h1
              initial={{ y: -70, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 50 }}
              className="text-3xl lg:text-4xl  font-bold mb-8"
            >
              Welcome Back!!
            </motion.h1>
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
                      ? error.info?.email
                      : "Please enter a valid email address (e.g: example@gmail.com).")) ||
                  ""
                }
              />
              <Input
                id={"password"}
                type={"password"}
                autoComplete="off"
                placeholder={"Enter your password"}
                icon={<MdLockOutline />}
                lable={"Password"}
                error={showError && (error ? error.info?.password : "")}
              />
              <div className="login-color w-full flex justify-between px-2 overflow-hidden">
                <motion.div
                  initial={{ x: "-60%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 50 }}
                >
                  <input type="checkbox" id="remember" name="remember" />
                  <label htmlFor="remember"> Remember me</label>
                </motion.div>
                <motion.div
                  initial={{ x: "60%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 50 }}
                >
                  <Link className="underline hover:text-purple-500" to="reset">
                    Forgot Password?
                  </Link>
                </motion.div>
              </div>
              <p className="mt-5 w-full">
                <MainButton
                  disabled={isPending}
                  delay={0.5}
                  className={"w-full px-0"}
                >
                  {isPending ? "Submitting..." : "Login"}
                </MainButton>
              </p>
            </form>
            {/* <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "100%", opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="hr my-8 mx-auto"
            data-lable="OR"
          ></motion.div>
          <motion.p
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
            className="login-color overflow-hidden"
          >
          Social media login
          </motion.p>
          <div className="meia-icon mx-auto flex gap-10 mt-3 text-2xl">
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.1, type: "spring", stiffness: 50 }}
            >
              <FcGoogle />
            </motion.button>
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.2, type: "spring", stiffness: 50 }}
            >
              <BsFacebook />
            </motion.button>
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.3, type: "spring", stiffness: 50 }}
            >
              <FaApple />
            </motion.button>
          </div> */}
            <div className="signup overflow-hidden mt-8 text-lg login-color flex flex-wrap justify-center gap-2">
              <motion.div
                initial={{ x: "-30%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 50 }}
              >
                Don’t have an account?
              </motion.div>{" "}
              <Link
                className="font-bold duration-50 overflow-hidden"
                to="signup"
              >
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ delay: 1.2, type: "spring", stiffness: 50 }}
                >
                  Sign up
                </motion.div>
              </Link>
            </div>
          </div>
          <div className="image h-full hidden lg:block md:block overflow-hidden">
            <motion.img
              initial={{ opacity: 0, y: "10%" }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 50 }}
              src={login}
              className="h-full"
            />
          </div>
        </div>
      </Modal>
    </>
  );
}

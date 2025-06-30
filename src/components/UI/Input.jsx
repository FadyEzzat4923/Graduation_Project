/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import { useState } from "react";
import { IoEyeOffOutline } from "react-icons/io5";
import { MdOutlineRemoveRedEye } from "react-icons/md";

export default function Input({
  id,
  tag,
  icon,
  type,
  lable,
  removeEnd,
  placeholder,
  delay,
  error,
  ...props
}) {
  let Tag = "input";
  if (tag) {
    Tag = tag;
  }
  const [seePassword, setSeepassword] = useState(false);
  const [focus, setFocus] = useState(false);
  function handleSeePassword() {
    setSeepassword((prevValue) => !prevValue);
  }
  function handleFocus(event) {
    setFocus(event);
  }
  const dir = ["-15%", "15%"];
  const randomDir = dir[Math.floor(Math.random() * 2)];
  return (
    <div className="relative w-full">
      <motion.div
        initial={{ x: randomDir, y: 15, opacity: 0 }}
        whileInView={{ x: 0, y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{
          delay: delay || 0.3,
          type: "spring",
          stiffness: 70,
        }}
        data-lable={lable}
        className={`main-input ${
          focus ? "focus" : ""
        } flex justify-center items-center w-full gap-3 text-md rounded-2xl py-3 px-8 ${
          removeEnd && "pe-2"
        }`}
      >
        {icon && <div className="text-xl">{icon}</div>}
        <Tag
          type={seePassword ? "text" : type}
          id={id ? id : ""}
          name={id}
          className={`w-full outline-none bg-transparent resize-none${
            type === "email" ? " lowercase" : ""
          }`}
          placeholder={placeholder}
          required
          onFocus={() => handleFocus(true)}
          onBlur={() => handleFocus(false)}
          {...props}
        />
        {type === "password" && (
          <button
            type="button"
            className="bg-transparent text-lg"
            onClick={handleSeePassword}
          >
            {seePassword ? <MdOutlineRemoveRedEye /> : <IoEyeOffOutline />}
          </button>
        )}
      </motion.div>
      {error && (
        <div className="error rounded-md text-start text-sm shadow-lg absolute z-50 p-1 px-3 top-3/4 start-16">
          {error}
        </div>
      )}
    </div>
  );
}

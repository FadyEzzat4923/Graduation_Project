/* eslint-disable react/prop-types */
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { CiMenuKebab } from "react-icons/ci";
import { GoPerson } from "react-icons/go";
import useAuthentication from "../../util/useAuthentication";
import { getYesterdayDate, timeFormate } from "../../util/methods";
import UpperCard from "./UpperCard";
export default function ChatCard({
  user,
  text,
  voice,
  timestamp,
  owner,
  id,
  isEdit,
  isEdited,
  canEdit,
  onStartDelete,
  isPending,
  showDate,
}) {
  useAuthentication();
  const [upperCardOpen, setUpperCardOpen] = useState(false);
  const [startDelete, setStartDelete] = useState(false);
  let day = new Date(timestamp).toDateString();
  if (day === getYesterdayDate().toDateString()) {
    day = "Yesterday";
  }
  if (day === new Date().toDateString()) {
    day = "Today";
  }
  let time;
  if (timestamp) {
    time = timeFormate(timestamp);
  }
  const fullName = user.fullName.split(" ");
  const newFullname = fullName.map((name) =>
    name === "AI"
      ? "AI"
      : name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
  );
  const finalFullName = newFullname.join(" ");

  function handleUpperCardOpeninig() {
    setUpperCardOpen((prevState) => !prevState);
    setStartDelete(false);
  }

  return (
    <>
      {showDate && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            type: "spring",
            stiffness: 150,
          }}
          className="py-1 my-7 px-3 inline-block bg-gray-400 text-white text-center mx-auto rounded-3xl shadow-xl"
        >
          {day}
        </motion.div>
      )}
      <div
        className={`chat-container py-3 px-2 ${
          owner ? "right ms-3" : "left me-3"
        } flex items-start gap-2 lg:items-center lg:gap-x-3 `}
      >
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 70 }}
          className="icon rounded-full shadow-lg text-xl md:text-2xl lg:text-3xl flex justify-center items-center font-bold w-10 h-10 md:12 md:12 lg:w-16 lg:h-16"
        >
          <span>
            {user.fullName ? (
              user.fullName.charAt(0).toUpperCase()
            ) : (
              <GoPerson />
            )}
          </span>
        </motion.div>
        <motion.div
          initial={{ y: voice ? "-50%" : "100%", opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          exit={{ y: -100, opacity: 0 }}
          transition={{
            delay: voice ? 0.1 : 0.2,
            type: "spring",
            stiffness: 100,
          }}
          className="chat-card shadow-xl relative rounded-xl py-2 px-3"
        >
          <AnimatePresence>
            {upperCardOpen && (
              <UpperCard
                id={id}
                canEdit={canEdit}
                isEdit={isEdit}
                isPending={isPending}
                onStartDelete={onStartDelete}
                owner={owner}
                setStartDelete={setStartDelete}
                setUpperCardOpen={setUpperCardOpen}
                startDelete={startDelete}
                text={text}
              />
            )}
          </AnimatePresence>
          <div className={`flex justify-between`}>
            <p className="name">{finalFullName || "Someone"}</p>
            {!voice && (
              <button onClick={handleUpperCardOpeninig}>
                <CiMenuKebab />
              </button>
            )}
          </div>
          <p className="text">{text}</p>
          {time && (
            <div className="date flex justify-end mt-2">
              {isEdited && (
                <p
                  className={`me-1 ${
                    owner ? "text-gray-200" : "text-gray-500"
                  }`}
                >
                  Edited
                </p>
              )}
              <p>{time}</p>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}

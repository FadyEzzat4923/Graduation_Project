/* eslint-disable react/prop-types */
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
export default function UpperCard({
  owner,
  id,
  isEdit,
  canEdit,
  onStartDelete,
  setStartDelete,
  text,
  setUpperCardOpen,
  isPending,
  startDelete,
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  }
  return (
    <>
      <div
        className="upper-card-backdrop fixed w-full top-0 left-0"
        onClick={() => setUpperCardOpen(false)}
      />
      <motion.div
        initial={{ top: 20, opacity: 0 }}
        animate={{ top: 0, opacity: 1 }}
        exit={{ top: 20, opacity: 0 }}
        className="upper-card shadow-2xl font-semibold text-black flex flex-col items-start p-2 rounded-lg absolute min-w-36 top-0 right-0 -translate-y-full z-50"
      >
        <button
          onClick={handleCopy}
          className="w-full text-start rounded-md p-2 hover:bg-gray-200 transition-all"
        >
          {copied ? "Copied" : "Copy"}
        </button>
        {owner && canEdit && (
          <button
            onClick={() => {
              isEdit(id, text);
              setUpperCardOpen(false);
            }}
            disabled={isPending}
            className="w-full text-start rounded-md p-2 hover:bg-gray-200 transition-all"
          >
            Edit
          </button>
        )}
        <div className="flex relative w-full">
          <AnimatePresence>
            {startDelete && (
              <motion.div
                initial={{ top: -20, opacity: 0 }}
                animate={{ top: 0, opacity: 1 }}
                exit={{ top: -20, opacity: 0 }}
                className={`shadow-2xl font-semibold text-black flex flex-col items-start p-2 rounded-lg absolute min-w-40 translate-y-12 ${
                  owner ? "-left-full upper-card" : "-left-1/2 upper-right"
                }`}
              >
                {owner && (
                  <button
                    onClick={() => onStartDelete(id, "EVERY")}
                    disabled={isPending}
                    className="w-full text-start rounded-md p-2 hover:bg-gray-200 transition-all"
                  >
                    For Every One
                  </button>
                )}
                <button
                  disabled={isPending}
                  className="w-full text-start rounded-md p-2 hover:bg-gray-200 transition-all"
                  onClick={() => onStartDelete(id, "ME")}
                >
                  For Me
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            disabled={isPending}
            onClick={() => setStartDelete((prevState) => !prevState)}
            className="w-full text-start rounded-md p-2 hover:bg-gray-200 transition-all"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </>
  );
}

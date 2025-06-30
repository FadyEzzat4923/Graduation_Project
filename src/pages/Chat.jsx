import useAuthentication from "../util/useAuthentication";
import { IoIosSend } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import { MdKeyboardDoubleArrowDown } from "react-icons/md";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  deleteMessage,
  fetchMessages,
  queryClient,
  sendMessage,
} from "../util/http";
import { AnimatePresence, motion } from "framer-motion";
import { CgClose } from "react-icons/cg";
import ChatCard from "../components/Chat/ChatCard";
import ErrorBlock from "../components/UI/ErrorBlock";
import LoadingIndicator from "../components/UI/LoadingIndicator";
import DeleteConfirmation from "../components/UI/DeleteConfirmation";
import HelmetIdentify from "../components/HelmetIdentify";
import { isNewDay } from "../util/methods";

export default function Chat() {
  const author = useAuthentication();
  const containerRef = useRef();
  const fieldFocus = useRef();
  const [toDown, setToDown] = useState(true);
  const [showError, setShowError] = useState(false);
  const [prevText, setPrevText] = useState("");
  const [chatEdittingId, setChatEdittingId] = useState();
  const [isEditting, setIsEditting] = useState(false);
  const [isStartDeleting, setIsStartDeleting] = useState(false);
  const [deleteProps, setDeleteProps] = useState({});
  const [chatValidation, setChatValidation] = useState("");

  const {
    data: chatData,
    isError,
    error,
    isPending,
  } = useQuery({
    queryKey: ["chat-message"],
    queryFn: ({ signal }) => fetchMessages({ signal, token: author.token }),
    refetchInterval: !showError ? 1000 : null,
  });

  useEffect(() => {
    if (isError) {
      setShowError(true);
    }
    return () => {
      setTimeout(() => setShowError(false), 10000);
    };
  }, [isError]);

  const {
    mutate,
    isError: isErrorSend,
    isPending: isPendingSend,
  } = useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat-message"] });
      handleCloseEdit();
    },
  });

  useEffect(() => {
    if (chatData) {
      setTimeout(scrollToBottom, 100);
    }
  }, [chatData]);

  function handleScroll(container) {
    if (
      container.scrollHeight - container.scrollTop >
      container.clientHeight + 100
    ) {
      setToDown(true);
    } else {
      setToDown(false);
    }
  }

  useEffect(() => {
    const container = containerRef.current;
    container.addEventListener("scroll", () => handleScroll(container));
    scrollToBottom();

    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  function scrollToBottom() {
    const container = containerRef.current;
    container.scrollTop = container.scrollHeight;
    window.scrollTo(0, document.body.scrollHeight);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const fd = new FormData(event.target);
    const text = fd.get("text");
    if (text.trim().length === 0) {
      setChatValidation("Please fill out this field.");
    } else {
      mutate({
        data: { text },
        token: author.token,
        messageId: chatEdittingId ?? false,
      });
      fieldFocus.current.focus();
    }
    event.target.reset();
    setTimeout(scrollToBottom, 100);
  }

  if (chatValidation) {
    setTimeout(() => setChatValidation(""), 5000);
  }

  function handleEditChat(id, text) {
    setChatEdittingId(id);
    setIsEditting(true);
    setPrevText(fieldFocus.current.value);
    fieldFocus.current.value = text;
    fieldFocus.current.focus();
  }

  function handleCloseEdit() {
    setChatEdittingId();
    setIsEditting(false);
    fieldFocus.current.value = "";
    fieldFocus.current.value = prevText;
    fieldFocus.current.focus();
  }

  const { mutate: deleteMutate, isPending: isPendingDelete } = useMutation({
    mutationFn: deleteMessage,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["chat-message"] });
      handleStopDelete();
    },
  });

  function handleStartDelete(id, type) {
    setIsStartDeleting(true);
    setDeleteProps({ id, type });
  }

  function handleStopDelete() {
    setIsStartDeleting(false);
    setDeleteProps({});
  }

  function handleDelete() {
    if (deleteProps.type === "ME") {
      deleteMutate({
        messageId: deleteProps.id,
        token: author.token,
        forMe: true,
      });
    } else {
      deleteMutate({ messageId: deleteProps.id, token: author.token });
    }
    handleCloseEdit();
  }

  let content;
  if (isError) {
    content = (
      <ErrorBlock
        title={"An Error Occured!"}
        message={
          error.message ||
          "Faild to fetch chat messages, Please try again later."
        }
      />
    );
  }
  if (isPending) {
    content = (
      <div className="text-center">
        <LoadingIndicator />
      </div>
    );
  }
  if (chatData) {
    content = (
      <div className="main flex flex-col gap-1 mb-20 pt-5">
        {chatData.length === 0 && (
          <motion.p
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-20 text-2xl text-gray-600"
          >
            No previous chat data found.
          </motion.p>
        )}
        <AnimatePresence>
          {chatData.map((event, index) => {
            const prev = chatData[index - 1];
            const showDate = !prev || isNewDay(event.timestamp, prev.timestamp);
            return (
              <ChatCard
                isEdit={handleEditChat}
                key={event.id}
                {...event}
                owner={event.user.id === author.id}
                onStartDelete={handleStartDelete}
                isPending={isPendingDelete}
                showDate={showDate}
              />
            );
          })}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <>
      <HelmetIdentify
        title={"Motherhood | Community Chat"}
        description={
          "Join the motherhood community chat to connect, share experiences, and support each other through parenting journeys."
        }
        keywords={
          "motherhood community, chat for moms, parenting advice, support group, mom experiences"
        }
      />
      <div className="chat w-full relative" ref={containerRef}>
        <div className="intro text-center p-2">
          <h1 className="text-4xl font-bold">Moms Chat</h1>
        </div>
        <div className="main-chat max-w-5xl mx-auto mt-10 pb-20 px-5">
          {content}
          <AnimatePresence>
            {isStartDeleting && (
              <DeleteConfirmation
                handleStopDelete={handleStopDelete}
                isPendingDelete={isPendingDelete}
                onDelete={handleDelete}
                deleteText={
                  deleteProps.type === "ME"
                    ? "this message for you"
                    : "this message permanently"
                }
              />
            )}
          </AnimatePresence>
          {isErrorSend && (
            <ErrorBlock
              end
              title={"An Error Occurred"}
              message={"Faild to send message."}
            />
          )}
          <div className="chat-message fixed bottom-0 h-24 right-2 w-full ps-6 p-3 z-50">
            {toDown && (
              <motion.button
                initial={{ visibility: "hidden", opacity: 0 }}
                animate={{ visibility: "visible", opacity: 1 }}
                transition={{ delay: 0.3 }}
                type="button"
                onClick={scrollToBottom}
                className="down absolute p-1 text-white shadow-lg rounded-lg text-2xl -top-10 right-10"
              >
                <MdKeyboardDoubleArrowDown />
              </motion.button>
            )}
            <motion.form
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
              onSubmit={handleSubmit}
              onClick={() => fieldFocus.current.focus()}
              className="message-container flex items-center w-full h-full rounded-full mx-auto"
            >
              <AnimatePresence>
                {isEditting && (
                  <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ y: 10, opacity: 0 }}
                    className="close-edit text-white rounded-full p-1 text-2xl absolute -top-14 left-1/2 -translate-x-1/2 mt-2"
                    type="button"
                    onClick={handleCloseEdit}
                  >
                    <CgClose />
                  </motion.button>
                )}
              </AnimatePresence>
              <div className="relative w-full">
                <input
                  ref={fieldFocus}
                  name="text"
                  type="text"
                  className="w-full me-10 cursor-default bg-transparent p-5 text-lg ps-10 lg:ps-20 md:ps-12 outline-none text-white placeholder:text-white rounded-s-full"
                  placeholder="Start Typing..."
                  required
                  autoFocus
                />
                {chatValidation !== "" && (
                  <div className="error rounded-md text-start text-sm shadow-lg p-1 px-3 absolute top-3/4 start-1/4">
                    {chatValidation}
                  </div>
                )}
              </div>
              <motion.button
                initial={{ scale: 0, opacity: 0.6 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 150 }}
                disabled={isPendingSend}
                className="ms-auto p-4 text-4xl text-white rounded-full hover:bg-purple-300"
              >
                <IoIosSend />
              </motion.button>
            </motion.form>
          </div>
        </div>
      </div>
    </>
  );
}

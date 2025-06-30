import useAuthentication from "../util/useAuthentication";
import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RiMic2Fill } from "react-icons/ri";
import { FaRegStopCircle } from "react-icons/fa";
import { deleteVoice, fetchVoiceRecognition, sendVoice } from "../util/http";
import {
  MdDelete,
  MdKeyboardDoubleArrowDown,
  MdUploadFile,
} from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import VoiceCard from "../components/Voice/VoiceCard";
import ChatCard from "../components/Chat/ChatCard";
import LoadingIndicator from "../components/UI/LoadingIndicator";
import ErrorBlock from "../components/UI/ErrorBlock";
import LoadingPops from "../components/UI/LoadingPops";
import DeleteConfirmation from "../components/UI/DeleteConfirmation";
import HelmetIdentify from "../components/HelmetIdentify";

export default function VoiceRecognition() {
  const author = useAuthentication();
  const containerRef = useRef();
  const openFileRef = useRef();
  const mediaRecorderRef = useRef();
  const audioChunksRef = useRef([]);
  const [isRecording, setIsRecording] = useState(false);
  const [toDown, setToDown] = useState(true);
  const [isStartDeleting, setIsStartDeleting] = useState(false);
  const [deleteProps, setDeleteProps] = useState({});
  const queryClient = useQueryClient();

  const {
    data: voiceData,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["voiceData"],
    queryFn: ({ signal }) =>
      fetchVoiceRecognition({ token: author.token, signal }),
    refetchInterval: null,
  });

  const {
    mutate,
    isPending: isPendingSendVoice,
    isError: isErrorSendVoice,
  } = useMutation({
    mutationFn: sendVoice,
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["voiceData"] }),
  });

  const { mutate: deleteMutate, isPending: isPendingDelete } = useMutation({
    mutationFn: deleteVoice,
    onSettled: () => {
      handleStopDelete();
      queryClient.invalidateQueries({ queryKey: ["voiceData"] });
    },
  });

  useEffect(() => {
    if (voiceData) {
      setTimeout(scrollToBottom, 100);
    }
  }, [voiceData]);

  function handleScroll() {
    const container = containerRef.current;
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    if (distanceFromBottom > 100) {
      setToDown(true);
    } else {
      setToDown(false);
    }
  }

  useEffect(() => {
    const container = containerRef.current;
    container.addEventListener("scroll", handleScroll);
    scrollToBottom();

    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm; codecs=opus",
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const audioFile = new File([audioBlob], "recorded_audio.webm", {
          type: "audio/webm",
        });

        if (audioFile.size === 0) {
          console.error("Recorded file is empty!");
          return;
        }

        uploadAudio(audioFile);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("An Error occurred", error);
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }

  function uploadAudio(file) {
    if (file.size === 0) {
      console.error("Recorded file is empty!");
      return;
    }
    const formData = new FormData();
    formData.append("File", file);
    mutate({ token: author.token, data: formData });
  }

  function handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("File", file);
      mutate({ token: author.token, data: formData });
    }
  }

  function scrollToBottom() {
    const container = containerRef.current;
    container.scrollTop = container.scrollHeight;
    window.scrollTo(0, document.body.scrollHeight);
  }

  function handleStartDelete(id, type) {
    setIsStartDeleting(true);
    setDeleteProps({ id, type });
  }

  function handleStopDelete() {
    setIsStartDeleting(false);
    setDeleteProps({});
  }

  function handleDelete() {
    if (deleteProps.type === "ONE") {
      deleteMutate({ token: author.token, id: deleteProps.id });
    } else {
      deleteMutate({ token: author.token, userId: author.id });
    }
  }

  let content;
  if (isPending) {
    content = (
      <div className="text-center mt-16">
        <LoadingIndicator />
      </div>
    );
  }
  if (isError) {
    content = (
      <div className="mt-16">
        <ErrorBlock
          title={"An Error Occurred"}
          message={
            error.info?.message || "Faild to fetch previous predictions."
          }
        />
      </div>
    );
  }
  if (voiceData) {
    content = (
      <div className="main flex flex-col gap-5 mb-12 pt-5">
        <ChatCard
          voice
          text={
            "Hello! 😊 I'm here to help you understand your baby's needs.You can record your baby's crying or upload an audio file, and I'll analyze it to provide the best advice for you."
          }
          user={{ fullName: "AI" }}
        />
        {voiceData &&
          voiceData.map((event) => (
            <VoiceCard
              key={event.id}
              data={event}
              onDelete={handleStartDelete}
            />
          ))}
      </div>
    );
  }
  return (
    <>
      <HelmetIdentify
        title={"Motherhood | Voice Recognition"}
        description={
          "A platform to help new mothers analyze baby cries with AI-powered voice recognition."
        }
        keywords={
          "baby cry, voice recognition, motherhood, infant care, AI analysis"
        }
      />
      <div className="voice chat w-full relative" ref={containerRef}>
        <div className="intro max-w-5xl mx-auto text-center p-2">
          <h1 className="text-4xl font-bold mb-5">Voice Recognition</h1>
        </div>
        <div className="main-chat max-w-5xl mx-auto mt-10 pb-20 px-1 lg:px-5 md:px-5">
          {content}
          <AnimatePresence>
            {isPendingSendVoice && <LoadingPops />}
          </AnimatePresence>
          {isStartDeleting && (
            <DeleteConfirmation
              handleStopDelete={handleStopDelete}
              onDelete={handleDelete}
              isPendingDelete={isPendingDelete}
              deleteText={
                deleteProps.type === "ONE"
                  ? "this voice permanently"
                  : "all of these voices permanently"
              }
            />
          )}
          {isErrorSendVoice && (
            <ErrorBlock
              end
              title={"An Error Occurred"}
              message={"Faild to send voice."}
            />
          )}
          <AnimatePresence>
            {voiceData && voiceData.length > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 70 }}
                exit={{ opacity: 0, scale: 0 }}
                className="clear-all shadow-xl relative mb-12 rounded-full mx-auto bg-red-500 hover:bg-red-600 text-white px-3 py-3 flex items-center gap-3 font-bold text-2xl"
                type="button"
                onClick={handleStartDelete}
              >
                <MdDelete />
              </motion.button>
            )}
          </AnimatePresence>
          <div className="chat-message fixed bottom-0 h-24 right-2 w-full p-3">
            {toDown && (
              <motion.button
                initial={{ visibility: "hidden", opacity: 0 }}
                animate={{ visibility: "visible", opacity: 1 }}
                transition={{ delay: 0.2 }}
                type="button"
                onClick={scrollToBottom}
                className="down absolute p-1  text-white shadow-lg rounded-lg text-2xl -top-10 right-10"
              >
                <MdKeyboardDoubleArrowDown />
              </motion.button>
            )}
            <div className="voice-message max-w-5xl flex items-center justify-between w-full mx-auto">
              <input
                type="file"
                className="hidden"
                ref={openFileRef}
                accept="audio/*"
                onChange={handleFileChange}
              />
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 70 }}
                onClick={() => openFileRef.current.click()}
                className="rounded-full px-8 md:px-12 lg:px-12 ms-3 py-4 flex items-center gap-3 font-bold text-xl"
                type="button"
              >
                Upload <MdUploadFile />
              </motion.button>
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 70 }}
                className="rounded-full px-8 md:px-12 lg:px-12 py-4"
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
              >
                {isRecording ? (
                  <p className="flex items-center gap-3 font-bold text-xl">
                    Stop <FaRegStopCircle />
                  </p>
                ) : (
                  <p className="flex items-center gap-3 font-bold text-xl">
                    Record <RiMic2Fill />
                  </p>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

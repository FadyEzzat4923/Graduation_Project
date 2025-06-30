import useAuthentication from "../../util/useAuthentication";
import { GoPerson } from "react-icons/go";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Play, Pause } from "lucide-react";
import { CiMenuKebab } from "react-icons/ci";
import ChatCard from "../Chat/ChatCard";

export default function VoiceCard({ data, onDelete }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [upperCardOpen, setUpperCardOpen] = useState(false);
  const audioRef = useRef(null);
  const author = useAuthentication();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const stopPlaying = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("ended", stopPlaying);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("ended", stopPlaying);
    };
  }, []);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  }

  function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }

  let content;
  if (data) {
    content = (
      <>
        <div className="chat-container right ms-5 flex items-center gap-2 lg:gap-x-3">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, type: "spring", stiffness: 70 }}
            className="icon rounded-full text-lg md:text-2xl lg:text-3xl flex justify-center shadow-xl items-center font-bold w-8 h-8 xs:w-10 xs:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16"
          >
            {author.firstName?.charAt(0).toUpperCase() || <GoPerson />}
          </motion.div>
          <motion.div
            initial={{ y: "20%", opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
            className="voice-recorder rounded-xl w-full"
          >
            <div className="record relative flex items-center gap-3 shadow-xl rounded-2xl p-3 min-w-56 w-9/10 md:w-96 lg:w-96 ms-auto">
              <span className="text-white text-sm">
                {formatTime(currentTime)}
              </span>
              <motion.div
                animate={
                  isPlaying
                    ? { scale: [1, 1.05, 1, 0.95, 1, 1.05, 1] }
                    : { scale: 1 }
                }
                transition={{ repeat: isPlaying ? Infinity : 0, duration: 1 }}
                className="flex-1 h-8 bg-white/30 rounded-lg"
              />

              <button
                onClick={togglePlay}
                className="bg-white/20 p-2 rounded-full"
              >
                {isPlaying ? (
                  <Pause className="text-white" />
                ) : (
                  <Play className="text-white" />
                )}
              </button>
              <audio ref={audioRef} src={data.fileUrl}></audio>
              <AnimatePresence>
                {upperCardOpen && (
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
                      <div className="flex relative w-full">
                        <button
                          onClick={() => onDelete(data.id, "ONE")}
                          className="w-full text-start rounded-md p-2 hover:bg-gray-200 transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
              <button
                className="text-gray-100"
                onClick={() => setUpperCardOpen((prevState) => !prevState)}
              >
                <CiMenuKebab />
              </button>
            </div>
          </motion.div>
        </div>
        {data && (
          <ChatCard
            voice
            timestamp={data.uploadedAt}
            text={
              data.prediction
                ? data.prediction
                : "Faild to recognize this voice, Please check if the mick is clean and try it again."
            }
            user={{ fullName: "AI" }}
          />
        )}
      </>
    );
  }
  // }
  return content;
}

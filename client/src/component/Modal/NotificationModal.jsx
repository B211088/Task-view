import { useRef, useEffect, useState } from "react";

const NotificationModal = ({ notify, onCloseNotify, time }) => {
  const modalRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(4);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    setIsMounted(true);

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 0.19;
        if (newTime <= 0) {
          clearInterval(interval);
          onCloseNotify();
        }
        return newTime;
      });

      setProgress((prevProgress) => {
        const newProgress = prevProgress - 100 / timeLeft / 10;
        return newProgress >= 0 ? newProgress : 0;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onCloseNotify, timeLeft]);

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const handleOverlayClick = (e) => {
    e.stopPropagation();
    onCloseNotify();
  };

  return (
    <div
      className="fixed top-0 bottom-0 right-0 left-0 flex items-center justify-center z-20 px-[20px]"
      onClick={handleOverlayClick}
    >
      <div className="w-full h-full relative">
        <div
          className={`absolute top-[10%] right-[0%] flex flex-col gap-[10px] sm:w-[20%] sm:min-w-[420px] min-w-[300px] w-full bg-bg-light rounded-[5px] px-[0px] ${
            isMounted ? "animate-slide-in-right" : ""
          }`}
          ref={modalRef}
          onClick={handleModalClick}
        >
          <div className="flex items-center justify-between px-[20px] py-[10px]">
            <div className="w-[10%] h-[30px] text-[1.4rem] font-Nunito font-bold text-center flex items-center">
              {notify.type === "error" ? (
                <i className="fa-solid fa-circle-exclamation error"></i>
              ) : notify.type === "warning" ? (
                <i className="fa-solid fa-triangle-exclamation waring"></i>
              ) : (
                <i className="fa-solid fa-circle-check success"></i>
              )}
            </div>
            <div className="w-[70%] font-Nunito font-semibold">
              {notify.payload}
            </div>
            <div className="flex gap-[10px] items-center">
              <button
                className="square-container-s flex items-center justify-center rounded-[5px] text-[0.8rem] font-bold border-1 text-text-red"
                onClick={onCloseNotify}
              >
                <i className="fa-regular fa-square-minus"></i>
              </button>
            </div>
          </div>
          <div className="w-full h-[6px] bg-gray-300 transition-all duration-500 overflow-hidden">
            <div
              className={`h-full ${
                notify.type === "error"
                  ? "bg-error"
                  : notify.type === "warning"
                  ? "bg-warning"
                  : "bg-success"
              } transition-all `}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;

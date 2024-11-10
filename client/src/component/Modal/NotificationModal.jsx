import { useRef } from "react";
const NotificationModal = ({ notify, onCloseNotify }) => {
  const modalRef = useRef(null);
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const handleOverlayClick = () => {
    onCloseNotify();
  };
  return (
    <div
      className="fixed top-0 bottom-0 right-0 left-0 flex items-center bg-overlay justify-center z-20 px-[20px] "
      onClick={handleOverlayClick}
    >
      <div className="w-full h-full relative">
        <div
          className="absolute top-[10%] right-[0%] flex items-center gap-[10px] sm:w-[20%] sm:min-w-[420px] min-w-[300px] w-full bg-bg-light  rounded-[5px] px-[20px] py-[20px]"
          ref={modalRef}
          onClick={handleModalClick}
        >
          <div className="w-[10%] h-[30px]  text-[1.1rem] font-Nunito font-bold text-center flex items-center">
            {notify.type === "error" ? (
              <i className="fa-solid fa-circle-exclamation error "></i>
            ) : notify.type === "warning" ? (
              <i className="fa-solid fa-triangle-exclamation waring"></i>
            ) : (
              <i className="fa-solid fa-circle-check success"></i>
            )}
          </div>
          <div className=" w-[70%]">{notify.payload}</div>
          <div className="w-[20%] flex justify-center gap-[10px]  items-center">
            <button
              className="w-[100px] h-[36px] flex items-center justify-center bg-bg-btn-add rounded-[5px] text-[0.8rem] font-bold text-text-light"
              onClick={onCloseNotify}
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;

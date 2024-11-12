import { useRef } from "react";

const ConfirmModal = ({ notify, onClose, onConfirm }) => {
  const modalRef = useRef(null);
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const handleOverlayClick = (e) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <div
      className="fixed top-0 bottom-0 right-0 left-0 flex  justify-center bg-overlay  z-20 px-[10px]"
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className="sm:w-[22%] h-[180px]  sm:min-w-[360px] min-w-[320px] w-full z flex items-center justify-between mt-[40px] bg-bg-light z rounded-[5px] px-[10px] py-[10px]"
        onClick={handleModalClick}
      >
        <div className="w-full  flex flex-col items-center  justify-between ">
          <div className="flex items-center justify-center square-container-m border-none text-[1.4rem]">
            {notify.type === "error" ? (
              <i className="fa-solid fa-circle-exclamation error "></i>
            ) : notify.type === "warning" ? (
              <i className="fa-solid fa-triangle-exclamation waring"></i>
            ) : (
              <i className="fa-solid fa-circle-check success"></i>
            )}
          </div>

          <div className="w-full min-h-[100px]  px-[5px] flex items-center justify-center text-center py-[10px] font-bold">
            <h1 className="w-full break-words font-Nunito text-[1rem]">
              {notify.payload}
            </h1>
          </div>
          <div className="w-full flex items-center justify-center gap-[20px] text-[0.9rem]">
            <button
              className="border-1 w-[50%] rounded-[5px] px-[14px] py-[5px] border-1 text-text-dark-800 font-Nunito "
              onClick={onClose}
            >
              Đóng
            </button>
            <button
              className=" w-[50%] rounded-[5px] px-[14px] py-[6px] bg-bg-btn-add text-text-light font-Nunito "
              onClick={onConfirm}
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

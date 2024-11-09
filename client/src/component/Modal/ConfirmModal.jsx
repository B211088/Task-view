const ConfirmModal = ({ notify, onClose, onConfirm }) => {
  return (
    <div className="fixed top-0 bottom-0 right-0 left-0 flex  justify-center bg-overlay  z-20 px-[10px]">
      <div className="sm:w-[22%] h-[220px]  sm:min-w-[380px] min-w-[320px] w-full flex items-center justify-between mt-[40px] bg-bg-light z rounded-[5px] px-[10px] py-[20px]">
        <div className="w-full  flex items-center flex-col justify-between ">
          <div className="flex items-center justify-center square-container-m border-none text-[1.4rem]">
            {notify.type === "error" ? (
              <i className="fa-solid fa-circle-exclamation error "></i>
            ) : notify.type === "warning" ? (
              <i className="fa-solid fa-triangle-exclamation waring"></i>
            ) : (
              <i className="fa-solid fa-circle-check success"></i>
            )}
          </div>

          <div className="w-full min-h-[80px]  px-[5px] flex items-center justify-center text-center py-[10px] ">
            <h1 className="w-full break-words font-Nunito text-[1rem]">
              {notify.payload}
            </h1>
          </div>
          <div className="w-full flex items-center justify-center gap-[30px]">
            <button
              className="border-1 w-[30%] rounded-[5px] px-[14px] py-[2px] border-1 text-text-dark-800 font-Nunito "
              onClick={onClose}
            >
              Đóng
            </button>
            <button
              className="border-1 w-[30%] rounded-[5px] px-[14px] py-[2px] bg-bg-btn-add text-text-light font-Nunito "
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

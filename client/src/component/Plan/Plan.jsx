import { useEffect, useState, useRef } from "react";

const Plan = ({ isActive, onClick, plan, openConfirmModal }) => {
  const [data, setData] = useState(plan);
  const [actionModal, setActionModal] = useState(false);
  const actionModalRef = useRef(null);

  const firstLetter =
    data.name && typeof data.name === "string"
      ? data.name.charAt(0).toUpperCase()
      : "";

  const toggleActionModal = (e) => {
    e.stopPropagation;
    setActionModal(!actionModal);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        actionModalRef.current &&
        !actionModalRef.current.contains(event.target)
      ) {
        setActionModal(false);
      }
    };

    if (actionModal) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [actionModal]);

  return (
    <div
      onClick={onClick}
      className={`flex items-center h-full max-h-full  justify-start gap-[5px] py-[5px]  px-[5px]  cursor-pointer border-1 rounded-[5px] ${
        isActive ? "bg-bg-hover" : "bg-bg-light"
      }`}
      ref={actionModalRef}
    >
      <div className="square-container-l border-1 bg-bg-light flex items-center justify-center rounded-[5px] ">
        <div className="h-full w-full text-[1.8rem] flex items-center justify-center">
          <span>{firstLetter}</span>
        </div>
      </div>
      <div className="w-full max-w-[90%] max-h-[50px] flex justify-between py-[1px] flex-1 h-[50px] flex-col gap-[5px] px-[0px] ">
        <div className="flex items-center">
          <h4
            className="w-full leading-[13px] text-[0.8rem] font-bold font-Nunito text-wrap overflow-hidden text-ellipsis"
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
            }}
          >
            {data.name}
          </h4>

          {data.autoPlan && (
            <div className="flex items-center gap-[5px] text-[0.76rem] pr-[5px]">
              <p className="leading-[13px]">auto</p>
              <i className="fa-solid fa-bolt"></i>
            </div>
          )}
        </div>

        <div className="w-full flex justify-between items-center text-[0.76rem] pr-[5px]">
          <div className="flex items-center gap-[5px] text-[0.72rem]">
            <p>{data.startDate}</p> {data.endDate && <span>-</span>}{" "}
            <p>{data.endDate ? data.endDate : ""}</p>
          </div>
        </div>
      </div>
      <div
        className="square-container-s flex  items-center justify-center border-1 rounded-[5px] bg-bg-light cursor-pointer relative"
        onClick={toggleActionModal}
      >
        <div
          className="w-full h-full flex  items-center justify-center"
          onClick={() => openConfirmModal(data.id)}
        >
          <i className="fa-solid fa-trash-can-arrow-up"></i>
        </div>
      </div>
    </div>
  );
};

export default Plan;

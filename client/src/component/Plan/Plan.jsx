import { useEffect } from "react";
import phanImg from "../../assets/plan1.jpg";
import { tasksLoader } from "../../utils/tasksUtils";

const Plan = ({ isActive, onClick, plan }) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center sm:h-full sm:max-h-full max-h-[50px] justify-center sm:justify-start gap-[5px] sm:py-[5px] py-[0px] sm:px-[5px] px-[0px] cursor-pointer border-1 rounded-[5px] ${
        isActive ? "bg-bg-hover" : "bg-bg-light"
      }`}
    >
      <div className="square-container-l">
        <img
          className="w-full h-full object-fill rounded-[3px]"
          src={phanImg}
          alt="Plan image"
        />
      </div>
      <div className="w-full max-w-[90%] max-h-[50px] sm:flex justify-between py-[1px] hidden flex-1 h-[50px] flex-col gap-[5px] px-[0px] ">
        <h4
          className="w-full leading-[16px] text-[0.8rem] font-bold font-Nunito text-wrap overflow-hidden text-ellipsis"
          style={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
          }}
        >
          {plan.name}
        </h4>
        <div className="w-full flex justify-between items-center text-[0.76rem] pr-[5px]">
          <p>{plan.startDate}</p>
        </div>
      </div>
    </div>
  );
};

export default Plan;

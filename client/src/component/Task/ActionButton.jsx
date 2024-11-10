import { useState } from "react";
import { Link } from "react-router-dom";

const ActionButton = ({ isModify, isDelete, task }) => {
  return (
    <div className="flex items-center gap-[5px] ">
      <div
        className="square-container-s flex items-center justify-center border-1 rounded-[5px] cursor-pointer hover:bg-color-dark-800"
        onClick={isModify}
      >
        <i className="fa-solid fa-pen-to-square"></i>
      </div>
      <div
        className="square-container-s flex items-center justify-center border-1 rounded-[5px] cursor-pointer hover:bg-color-dark-800
      "
        onClick={() => isDelete(task.id)}
      >
        <i className="fa-solid fa-trash"></i>
      </div>
      <Link key={task.id} to={`task/${task.id}`}>
        <div className="square-container-s flex items-center justify-center border-1 rounded-[5px] cursor-pointer hover:bg-color-dark-800">
          <i className="fa-solid fa-square-arrow-up-right"></i>
        </div>
      </Link>
    </div>
  );
};

export default ActionButton;

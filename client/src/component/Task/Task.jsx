import { useCallback, useEffect, useState } from "react";
import ActionButton from "./ActionButton";
import ModifyTask from "../Modal/ModifyTask";
import { deleteTask } from "../../utils/tasksUtils";
import { useNavigate } from "react-router-dom";

const Task = ({ autoPlan, task, priorities, plan }) => {
  const [isModifyModal, setisModifyModal] = useState(false);
  const [isPlay, setIsPlay] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [data, setData] = useState(task);
  const [intervalId, setIntervalId] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const navigate = useNavigate();

  const toggleBtnPlay = () => {
    if (!isPlay) {
      const startTime = Date.now();
      setData((prevData) => ({
        ...prevData,
        timeStart: startTime,
      }));
      const id = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000);
      setIntervalId(id);
    } else {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setIsPlay(!isPlay);
  };

  const toggleBtnCompleted = () => {
    setIsCompleted(!isCompleted);
  };

  useEffect(() => {
    if (task.status === "completed") {
      setIsCompleted(true);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId, status]);

  const onChangeModifyModal = () => {
    setisModifyModal(!isModifyModal);
  };

  const handleDeleteTask = async () => {
    const confirmDelete = window.confirm(
      "Bạn chắc chắn muốn xóa công việc này không?"
    );

    if (confirmDelete) {
      const taskId = task.id;
      await deleteTask(taskId);
      console.log(taskId);
      navigate(0);
    }
    return;
  };

  const formatElapsedTime = (time) => {
    const hours = Math.floor(time / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="w-full border-1 rounded-[5px] p-[5px] flex flex-col justify-center gap-[5px] border-r-[1px]">
      <div className="w-full flex items-center justify-between">
        <div className="w-[80px] flex items-center justify-center border-1 rounded-[8px] text-[0.8rem] bg-color-dark-800">
          <span>{isPlay ? formatElapsedTime(elapsedTime) : "0:0:0"}</span>
        </div>
        <div
          className={`w-[120px] flex items-center justify-center border-1 rounded-[8px] font-bold text-[0.8rem] py-[2px] ${
            data.status === "unmake"
              ? "unmake"
              : data.status === "in-progress"
              ? "in-progress"
              : "completed"
          }`}
        >
          <span>
            {data.status === "unmake"
              ? "Chưa làm"
              : data.status === "in-progress"
              ? "Đang làm"
              : "Hoàn thành"}
          </span>
        </div>
      </div>
      <h1 className="w-full text-[1rem] font-Nunito font-bold px-[5px]">
        {data.title}
      </h1>
      <div className="w-full p-[5px] bg-color-dark-1000 rounded-[5px]">
        <p className="w-full text-[0.8rem] text-text-dark-600">
          {data.content}
        </p>
      </div>
      <div className="w-full flex items-center justify-between py-[5px]">
        <ActionButton
          isModify={onChangeModifyModal}
          isDelete={handleDeleteTask}
          task={task}
        />

        <div className="flex gap-[10px]">
          <div
            className={`square-container-s flex items-center justify-center border-1 rounded-[5px] text-[1rem] cursor-pointer ${
              task.status === "completed"
                ? "text-gray-400 cursor-not-allowed"
                : ""
            }`}
            onClick={task.status === "completed" ? null : toggleBtnCompleted}
          >
            {isCompleted ? (
              <i className="fa-solid fa-circle-check text-bg-btn-add"></i>
            ) : (
              <i className="fa-regular fa-circle-check"></i>
            )}
          </div>

          <div
            className="square-container-s flex items-center justify-center border-1 rounded-[5px] text-[1rem] cursor-pointer"
            onClick={toggleBtnPlay}
          >
            {isPlay ? (
              <i className="fa-solid fa-pause"></i>
            ) : (
              <i className="fa-solid fa-play"></i>
            )}
          </div>
        </div>
      </div>

      {isModifyModal && (
        <ModifyTask
          task={task}
          autoPlan={autoPlan}
          onClose={onChangeModifyModal}
          priorities={priorities}
          plan={plan}
        />
      )}
    </div>
  );
};

export default Task;

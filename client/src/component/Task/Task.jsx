import { useCallback, useEffect, useState } from "react";
import ActionButton from "./ActionButton";
import ModifyTask from "../Modal/ModifyTask";
import { deleteTask } from "../../utils/tasksUtils";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../Modal/ConfirmModal";

const Task = ({ autoPlan, task, priorities, plan }) => {
  const [isModifyModal, setisModifyModal] = useState(false);
  const [isPlay, setIsPlay] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [data, setData] = useState(task);
  const [intervalId, setIntervalId] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isContentExpanded, setIsContentExpanded] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [notify, setNotify] = useState({ payload: "", type: "" });
  const [taskId, setTaskId] = useState("");
  const [taskData, setTaskData] = useState(task);
  const navigate = useNavigate();

  const closeConfirmModal = () => {
    setConfirmModal(false);
  };

  const openConfirmModal = async (taskId) => {
    setNotify({
      payload: "Bạn có chắc chắn muốn xóa công việc này?",
      type: "error",
    });
    setConfirmModal(true);
    setTaskId(taskId);
  };

  const onConfirm = async () => {
    try {
      const taskId = task.id;
      await deleteTask(taskId);
      navigate(0);
      return;
    } catch (error) {
      console.error("Lỗi khi xóa công việc này?:", error);
      alert("Xóa công việc không thành công.");
    }
  };

  const toggleContent = () => {
    setIsContentExpanded(!isContentExpanded);
  };

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
  }, []);

  const onChangeModifyModal = () => {
    setisModifyModal(!isModifyModal);
  };

  return (
    <div className="w-full  border-1 rounded-[5px] p-[5px] flex flex-col justify-center gap-[5px] border-r-[1px]">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-[5px]">
          <div className="w-[80px] flex items-center justify-center border-1 rounded-[8px] text-[0.8rem] bg-color-dark-800">
            <span>
              {taskData.timeSchedule ? taskData.timeSchedule : "00:00"}
            </span>
          </div>
        </div>

        <div
          className={`w-[120px] flex items-center justify-center border-1 rounded-[8px] font-bold text-[0.8rem] py-[2px] ${
            taskData.status === "unmake"
              ? "unmake"
              : taskData.status === "in-progress"
              ? "in-progress"
              : "completed"
          }`}
        >
          <span>
            {taskData.status === "unmake"
              ? "Chưa làm"
              : taskData.status === "in-progress"
              ? "Đang làm"
              : "Hoàn thành"}
          </span>
        </div>
      </div>
      <h1 className="w-full   text-[1rem] font-Nunito font-bold px-[5px]">
        {taskData.title}
      </h1>
      <div
        className={`w-full p-[5px] bg-color-dark-1000 rounded-[5px] overflow-hidden ${
          !isContentExpanded ? "max-h-[46px]" : "max-h-full"
        }`}
      >
        <p className="w-full text-[0.8rem] text-text-dark-600">
          {taskData.content}
        </p>
      </div>
      <div className="w-full flex justify-end ">
        <div
          className="flex items-center  text-text-dark-600 cursor-pointer text-[0.8rem]  gap-[5px] "
          onClick={toggleContent}
        >
          <span>{isContentExpanded ? "Thu gọn" : "Xem thêm"}</span>
          <span>
            {" "}
            {isContentExpanded ? (
              <i className="fa-solid fa-caret-up  "></i>
            ) : (
              <i className="fa-solid fa-caret-down"></i>
            )}
          </span>
        </div>
      </div>
      <div className="w-full flex items-center justify-between py-[5px]">
        <ActionButton
          isModify={onChangeModifyModal}
          isDelete={openConfirmModal}
          task={task}
        />

        <div className="flex gap-[10px]">
          <div
            className={`square-container-s flex items-center justify-center border-1 rounded-[5px] text-[1rem] cursor-pointer ${
              taskData.status === "completed"
                ? "text-gray-400 cursor-not-allowed"
                : ""
            }`}
            onClick={
              taskData.status === "completed" ? null : toggleBtnCompleted
            }
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
      {confirmModal && (
        <ConfirmModal
          onClose={closeConfirmModal}
          onConfirm={onConfirm}
          notify={notify}
          taskId={taskId}
        />
      )}
    </div>
  );
};

export default Task;

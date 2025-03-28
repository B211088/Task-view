import { useCallback, useEffect, useRef, useState } from "react";
import ActionButton from "./ActionButton";
import ModifyTask from "../Modal/ModifyTask";
import { deleteTask, updateTask } from "../../utils/tasksUtils";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../Modal/ConfirmModal";
import { useSearchParams } from "react-router-dom";
const Task = ({
  autoPlan,
  task,
  priorities,
  plan,
  onCompelte,
  onProgress,
  onDeleteTask,
}) => {
  const [taskData, setTaskData] = useState({
    ...task,
    timeIsPlay: task.timeIsPlay,
  });
  const [isModifyModal, setIsModifyModal] = useState(false);
  const [isPlay, setIsPlay] = useState(false);
  const [isCompleted, setIsCompleted] = useState(task.status === "completed");
  const [isContentExpanded, setIsContentExpanded] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [notify, setNotify] = useState({ payload: "", type: "" });
  const [elapsedTime, setElapsedTime] = useState(task.timeSchedule);
  const [heightContent, setHeightContent] = useState(0);
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  const formatMillisecondsToTime = (milliseconds) => {
    const seconds = Math.floor((milliseconds / 1000) % 60);
    const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
    const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const startTimer = () => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setElapsedTime((prevElapsedTime) => prevElapsedTime + 1000);
      }, 1000);
    }
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    const element = document.getElementById(`content-${task.id}`);
    if (element) {
      setHeightContent(element.scrollHeight);
    } else {
      console.log("Không tìm thấy phần tử với ID:", `content-${task.id}`);
    }
  }, [taskData.content]);

  useEffect(() => {
    if (task.status === "unmake" || task.status === "complete") {
      setElapsedTime(taskData.timeSchedule);
      return;
    }

    if (task.status === "in-progress") {
      const currentDate = new Date();
      const elapsedTimeMs = currentDate.getTime() - task.timeIsPlay;
      setElapsedTime(elapsedTimeMs);
    }

    if (!task.timeIsPlay) {
      setElapsedTime(0);
      setTaskData({
        ...taskData,
        timeIsPlay: null,
      });
    }
  }, [task.timeIsPlay, task.status]);

  useEffect(() => {
    if (task.status === "completed") {
      stopTimer();
      setElapsedTime(taskData.timeSchedule);
    } else if (task.status === "in-progress") {
      const currentDate = new Date();
      const elapsedTimeMs = task.timeIsPlay
        ? currentDate.getTime() - task.timeIsPlay
        : 0;
      setElapsedTime(task.timeSchedule + elapsedTimeMs);
      startTimer();
    } else {
      stopTimer();
      setElapsedTime(task.timeSchedule);
    }

    return () => stopTimer();
  }, [task.status, task.timeIsPlay, task.timeSchedule]);

  const toggleBtnPlay = async () => {
    setIsPlay((prev) => !prev);
    const currentDate = new Date();

    if (!isPlay) {
      const timeIsPlayCurrent = currentDate.getTime();
      const updateData = {
        ...taskData,
        timeIsPlay: timeIsPlayCurrent,
        status: "in-progress",
      };
      setTaskData(updateData);
      await updateTask(updateData);

      startTimer();
      onProgress(task.id);
    } else {
      const elapsedTimeMs = elapsedTime;
      const updateData = {
        ...taskData,
        timeIsPlay: null,
        status: "unmake",
        timeSchedule: elapsedTimeMs,
      };
      setTaskData(updateData);
      await updateTask(updateData);

      stopTimer();
    }
  };

  const toggleBtnCompleted = async () => {
    setIsCompleted(!isCompleted);
    const elapsedTimeMs = elapsedTime;

    const updateData = {
      ...taskData,
      timeIsPlay: null,
      status: "completed",
      timeSchedule: elapsedTimeMs,
    };

    setTaskData(updateData);
    onCompelte(task.id);
    setIsPlay(false);
    await updateTask(updateData);
    if (plan.autoPlan) {
      navigate(0);
    }
  };

  const openConfirmModal = async () => {
    setNotify({
      payload: "Bạn có chắc chắn muốn xóa công việc này?",
      type: "error",
    });
    setConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setConfirmModal(false);
  };

  const onConfirm = async () => {
    try {
      await deleteTask(taskData.id);
      onDeleteTask(taskData.id);
      closeConfirmModal();
    } catch (error) {
      console.error("Lỗi khi xóa công việc:", error);
      alert("Xóa công việc không thành công.");
    }
  };

  const toggleContent = () => {
    setIsContentExpanded(!isContentExpanded);
  };

  const onChangeModifyModal = () => setIsModifyModal(!isModifyModal);

  useEffect(() => {
    if (taskData.status === "completed") {
      setIsCompleted(true);
    } else {
      setIsCompleted(false);
    }

    return () => clearInterval(intervalRef.current);
  }, [taskData.status]);

  return (
    <div className="w-full border-1 rounded-[5px] p-[5px] flex flex-col justify-center gap-[5px] border-r-[1px]">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-[5px]">
          <div className="w-[80px] flex items-center justify-center border-1 rounded-[8px] text-[0.8rem] bg-color-dark-800">
            <span>{formatMillisecondsToTime(elapsedTime)}</span>
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
      <h1 className="w-full text-[1rem] font-Nunito font-bold px-[5px]">
        {taskData.title}
      </h1>

      {taskData.content != "" ? (
        <div
          className={`w-full p-[5px]  bg-color-dark-1000 rounded-[5px] overflow-hidden ${
            !isContentExpanded ? "max-h-[48px]" : "max-h-full"
          }`}
        >
          <p
            className="w-full text-[0.8rem] text-text-dark-600"
            id={`content-${task.id}`}
          >
            {taskData.content}
          </p>
        </div>
      ) : (
        <div
          className={`w-full p-[5px] bg-color-dark-1000 rounded-[5px] overflow-hidden  "max-h-[46px]" : "max-h-full"
          }`}
        >
          <p className="w-full text-[0.8rem] text-text-dark-600">
            Không có nội dung !
          </p>
        </div>
      )}

      {heightContent && heightContent >= 50 && taskData.content !== "" && (
        <div className="w-full flex justify-end">
          <div
            className="flex items-center text-text-dark-600 cursor-pointer text-[0.8rem] gap-[5px]"
            onClick={toggleContent}
          >
            <span>{isContentExpanded ? "Thu gọn" : "Xem thêm"}</span>
            <span>
              {isContentExpanded ? (
                <i className="fa-solid fa-caret-up" />
              ) : (
                <i className="fa-solid fa-caret-down" />
              )}
            </span>
          </div>
        </div>
      )}
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
              <i className="fa-solid fa-circle-check text-bg-btn-add" />
            ) : (
              <i className="fa-regular fa-circle-check" />
            )}
          </div>
          <div
            className="square-container-s flex items-center justify-center border-1 rounded-[5px] text-[1rem] cursor-pointer"
            onClick={toggleBtnPlay}
          >
            {isPlay || taskData.status === "in-progress" ? (
              <i className="fa-solid fa-pause" />
            ) : (
              <i className="fa-solid fa-play" />
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
          onClose={() => setConfirmModal(false)}
          onConfirm={onConfirm}
          notify={notify}
        />
      )}
    </div>
  );
};

export default Task;

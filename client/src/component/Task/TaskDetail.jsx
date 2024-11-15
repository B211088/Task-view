import { useRef } from "react";
import { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";

const TaskDetail = ({ onClose }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [data, setData] = useState({});
  const { task } = useLoaderData();
  const [elapsedTime, setElapsedTime] = useState(task.timeSchedule);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (task.priority === null) {
      task.priority = "";
      setData((prevData) => ({
        ...prevData,
        priority: task.priority,
      }));
    }
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [task]);

  const startTimer = () => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setElapsedTime((prevElapsedTime) => prevElapsedTime + 1000);
      }, 1000);
    }
  };

  useEffect(() => {
    if (task.status === "unmake") {
      setElapsedTime(task.timeSchedule);
      return;
    }

    if (task.status === "in-progress") {
      const currentDate = new Date();
      const elapsedTimeMs = currentDate.getTime() - task.timeIsPlay;
      setElapsedTime(elapsedTimeMs);
    }

    if (!task.timeIsPlay) {
      setElapsedTime(0);
      setData({
        ...data,
        timeIsPlay: null,
      });
    }
  }, [task.timeIsPlay, task.status, task]);

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    if (task.status === "in-progress") {
      startTimer();
    } else {
      stopTimer();
    }
    return () => stopTimer();
  }, [task.status]);

  const formatMillisecondsToTime = (milliseconds) => {
    const seconds = Math.floor((milliseconds / 1000) % 60);
    const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
    const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const body = (
    <div className="sm:w-full sm:h-full h-[500px] w-[78%] hidden sm:flex  flex-col gap-[10px] border-1 rounded-[5px] bg-bg-light p-[10px]">
      <div className="w-full flex items-center justify-between font-Nunito font-bold text-[1.2rem] py-[10px]">
        <h4 className="">{task.title}</h4>
      </div>
      <div
        className={`w-[120px] flex items-center justify-center border-1 rounded-[8px] font-bold text-[0.8rem] py-[4px] mb-[10px] ${
          task.status === "unmake"
            ? "unmake"
            : task.status === "in-progress"
            ? "in-progress"
            : "completed"
        }`}
      >
        <span>
          {task.status === "unmake"
            ? "Chưa làm"
            : task.status === "in-progress"
            ? "Đang làm"
            : "Hoàn thành"}
        </span>
      </div>
      <div className="w-full flex flex-col gap-[10px] overflow-auto custom-scrollbar-1">
        <div className="w-full flex font-Nunito text-text-dark-800 text-[0.8rem] bg-color-dark-900 rounded-[5px] p-[10px]">
          <p>{task.content}</p>
        </div>
        {task.startDay && (
          <div className="w-full flex gap-[5px] font-Nunito text-text-dark-800 text-[0.8rem] bg-color-dark-900 rounded-[5px] p-[10px]">
            <span>Ngày thực hiện:</span>
            <span>{task.startDay}</span>
          </div>
        )}

        {task.priority && task.priority != "" && (
          <div className="w-full flex  gap-[5px] font-Nunito text-text-dark-800 text-[0.8rem] bg-color-dark-900 rounded-[5px] p-[10px]">
            <span>Độ ưu tiên:</span>
            <span>{task.priority.name === null ? "" : task.priority.name}</span>
          </div>
        )}

        {task.estimatedCompletionTime > 1 && (
          <div className="w-full flex  gap-[5px] font-Nunito text-text-dark-800 text-[0.8rem] bg-color-dark-900 rounded-[5px] p-[10px]">
            <span>Số ngày cần để hoàn thành:</span>
            <span>{`${task.estimatedCompletionTime} Ngày`}</span>
          </div>
        )}
        {/* {task.prerequisites != [] && (
          <div className="w-full flex  gap-[5px] font-Nunito text-text-dark-800 text-[0.8rem] bg-color-dark-900 rounded-[5px] p-[10px]">
            <span>Công việc tiên quyết:</span>
            <span>
              {(task.prerequisites = [] ? "Không có" : task.prerequisites)}
            </span>
          </div>
        )} */}

        <div className="w-full flex  gap-[5px] font-Nunito text-text-dark-800 text-[0.8rem] bg-color-dark-900 rounded-[5px] p-[10px]">
          <span>Đã làm được: </span>
          <span>
            {task.timeSchedule || task.status === "in-progress"
              ? formatMillisecondsToTime(elapsedTime)
              : "00:00"}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={`sm:w-[22%] height-container-taskdetails w-full flex justify-center items-center ${
        isMobile
          ? "sm:static fixed hidden top-0 bottom-0 right-0 left-0 bg-overlay"
          : ""
      }`}
    >
      {isMobile ? (
        <div
          id="mobile"
          className="w-full h-full flex justify-center items-center"
        >
          {body}
        </div>
      ) : (
        <div id="pc" className="w-full h-full flex h-full">
          {body}
        </div>
      )}
    </div>
  );
};

export default TaskDetail;

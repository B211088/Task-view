import { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";

const TaskDetail = ({ onClose }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [data, setData] = useState({});
  const { task } = useLoaderData();
  console.log("TaskDetail", task);

  useEffect(() => {
    if (task.priority === null) {
      task.priority = "Normal";
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

  const body = (
    <div className="sm:w-full sm:h-full h-[500px] w-[78%] hidden sm:flex  flex-col gap-[10px] border-1 rounded-[5px] bg-bg-light p-[10px]">
      <div className="w-full h-[34px] flex items-center justify-between font-Nunito font-bold text-[1.2rem]">
        <h4>{task.title}</h4>
        <div className="square-container-s flex sm:hidden items-center justify-center border-1 rounded-[5px] cursor-pointer">
          <i className="fa-solid fa-xmark"></i>
        </div>
      </div>
      <div
        className={`w-[120px] flex items-center justify-center border-1 rounded-[8px] font-bold text-[0.8rem] py-[2px] ${
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

        {task.priority && (
          <div className="w-full flex  gap-[5px] font-Nunito text-text-dark-800 text-[0.8rem] bg-color-dark-900 rounded-[5px] p-[10px]">
            <span>Độ ưu tiên:</span>
            <span>{task.priority.name === null ? "" : task.priority.name}</span>
          </div>
        )}

        <div className="w-full flex  gap-[5px] font-Nunito text-text-dark-800 text-[0.8rem] bg-color-dark-900 rounded-[5px] p-[10px]">
          <span>Số ngày cần để hoàn thành:</span>
          <span>{`${task.estimatedCompletionTime} Ngày`}</span>
        </div>
        {/* {task.prerequisites != [] && (
          <div className="w-full flex  gap-[5px] font-Nunito text-text-dark-800 text-[0.8rem] bg-color-dark-900 rounded-[5px] p-[10px]">
            <span>Công việc tiên quyết:</span>
            <span>
              {(task.prerequisites = [] ? "Không có" : task.prerequisites)}
            </span>
          </div>
        )} */}

        <div className="w-full flex  gap-[5px] font-Nunito text-text-dark-800 text-[0.8rem] bg-color-dark-900 rounded-[5px] p-[10px]">
          <span>Đã làm được:</span>
          <span>{task.timeSchedule}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={`sm:w-[22%] w-full flex justify-center items-center ${
        isMobile
          ? "sm:static fixed hidden top-0 bottom-0 right-0 left-0 bg-overlay"
          : ""
      }`}
    >
      {isMobile ? (
        <div id="mobile" className="w-full flex justify-center items-center">
          {body}
        </div>
      ) : (
        <div id="pc" className="w-full flex h-full">
          {body}
        </div>
      )}
    </div>
  );
};

export default TaskDetail;

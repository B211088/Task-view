import { useState, useRef, useEffect } from "react";
import useDebounce from "./useDebounce";
import { updateTask } from "../../utils/tasksUtils";
import { useNavigate } from "react-router-dom";

const ModifyTask = ({
  onClose,
  onSubmit,
  autoPlan,
  task,
  priorities,
  plan,
}) => {
  const [data, setData] = useState({
    ...task,
    priorityId: task.priority ? task.priority.id : "",
    estimatedCompletionTime: task.estimatedCompletionTime,
    startDay: task.startDay ? task.startDay : "",
  });
  console.log("taskModify", data);
  const [status, setStatus] = useState("");
  const [isTimeSchedule, setIsTimeSchedule] = useState(false);
  const [isStartDay, setIsStartDay] = useState(false);
  const modalRef = useRef();
  const prevStartDayRef = useRef(data.startDay);

  console.log("taskbefore: ", task);
  const navigate = useNavigate();
  useDebounce(data, 300);

  useEffect(() => {
    if (task.status === "completed") {
      setStatus("Hoàn thành");
    } else if (task.status === "in-progress") {
      setStatus("Đang làm");
    } else {
      setStatus("Chưa làm");
    }
  }, [task]);

  const handleToggleTimeSchedule = () => {
    setIsTimeSchedule(!isTimeSchedule);
  };

  useEffect(() => {
    if (!isStartDay) {
      setData({
        ...data,
        startDay: "",
      });
    }
  }, [isStartDay]);

  useEffect(() => {
    if (!isTimeSchedule) {
      setData((prevData) => ({
        ...prevData,
        timeSchedule: task.timeSchedule,
      }));
    }

    const planStartDate = new Date(plan.startDate);
    const taskStartDate = task.startDay ? new Date(task.startDay) : null;

    setData((prevData) => ({
      ...prevData,
      title: task.title || prevData.title,
      content: task.content || prevData.content,
      startDay:
        taskStartDate && taskStartDate >= planStartDate ? data.startDay : "",
      priorityId: task.priority ? task.priority.id : prevData.priorityId,
      estimatedCompletionTime:
        task.estimatedCompletionTime || prevData.estimatedCompletionTime,
    }));
  }, [task, plan, isTimeSchedule]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) {
      return null;
    }
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedStartDay = new Date(data.startDay);
    const planStartDay = new Date(plan.startDate);

    if (data.startDay && selectedStartDay < planStartDay) {
      alert("Ngày bắt đầu không được nhỏ hơn ngày bắt đầu của kế hoạch.");
      return;
    }

    const formattedStartDay =
      data.startDay !== prevStartDayRef.current
        ? formatDate(data.startDay)
        : task.startDay;

    const updateData = {
      ...data,
      startDay: formattedStartDay,
      estimatedCompletionTime: parseInt(data.estimatedCompletionTime, 10),
    };

    console.log("updateData", updateData);
    console.log("task.startDay", task.startDay);

    console.log("formattedStartDay", formattedStartDay);

    await updateTask(updateData);
    onClose();
    navigate(0);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value || prevData[name],
    }));
  };

  const handleOverlayClick = () => {
    onClose();
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const handleToggleStartDay = () => {
    setIsStartDay(!isStartDay);
  };

  return (
    <div
      className="fixed top-0 bottom-0 right-0 left-0 flex items-center justify-center bg-overlay z-1 px-[20px]"
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className="sm:w-[20%] sm:min-w-[380px] min-w-[320px] w-full bg-bg-light z rounded-[5px] px-[10px] py-[20px]"
        onClick={handleModalClick}
      >
        <div className="w-full mb-[20px] text-[1.1rem] font-Nunito font-bold text-center">
          <h1>Chỉnh sửa công việc</h1>
        </div>
        <form className="flex flex-col gap-[20px]" onSubmit={handleSubmit}>
          <input
            name="title"
            className="w-full h-[36px] border-1 outline-none text-[0.8rem] px-[10px] rounded-[5px]"
            type="text"
            placeholder="Thêm tiêu đề"
            value={data.title}
            onChange={handleChange}
            required
          />
          <textarea
            name="content"
            className="w-full h-[120px] max-h-[200px] min-h-[120px] border-1 custom-scrollbar-1 outline-none text-[0.8rem] p-[10px] rounded-[5px]"
            placeholder="Thêm mô tả"
            value={data.content}
            onChange={handleChange}
            required
          />
          {autoPlan && (
            <input
              name="estimatedCompletionTime"
              className="w-full h-[36px] border-1 outline-none text-[0.8rem] px-[10px] rounded-[5px]"
              type="number"
              placeholder="số ngày cần có để hoàn thành"
              min="1"
              value={data.estimatedCompletionTime}
              onChange={handleChange}
              required
            />
          )}
          {plan.autoPlan === true && (
            <div className="flex items-center gap-[10px]">
              <label className="relative w-[40px] inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isStartDay}
                  onChange={handleToggleStartDay}
                  className="sr-only peer"
                />
                <div
                  className={`w-[40px] flex items-center h-[20px] bg-color-dark-800 rounded-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 
                  transition-all duration-300 ${
                    isStartDay ? "bg-text-dark-700" : "bg-text-dark-100"
                  }`}
                ></div>
                <span
                  className={`absolute top-[10%] left-1 h-[16px] w-[16px] bg-text-light rounded-full transition-transform duration-300 transform 
                  ${isStartDay ? "translate-x-[15px]" : ""}`}
                ></span>
              </label>
              <h3 className="px-[5px] text-[0.75rem]">Ngày bắt đầu</h3>
            </div>
          )}

          {(!plan.autoPlan || isStartDay) && (
            <div className="flex flex-col gap-[5px]">
              <input
                name="startDay"
                className="w-full h-[36px] border-1 outline-none text-[0.8rem] px-[10px] rounded-[5px]"
                type="date"
                value={data.startDay}
                onChange={handleChange}
              />
            </div>
          )}
          <div className="flex items-center gap-[10px]">
            <label className="relative w-[40px] inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isTimeSchedule}
                onChange={handleToggleTimeSchedule}
                className="sr-only peer"
              />
              <div
                className={`w-[40px] flex items-center h-[20px] bg-color-dark-800 rounded-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 
                  transition-all duration-300 ${
                    isTimeSchedule ? "bg-text-dark-700" : "bg-text-dark-100"
                  }`}
              ></div>
              <span
                className={`absolute top-[10%] left-1 h-[16px] w-[16px] bg-text-light rounded-full transition-transform duration-300 transform 
                  ${isTimeSchedule ? "translate-x-[15px]" : ""}`}
              ></span>
            </label>
            <h3 className="px-[5px] text-[0.75rem]">Giờ bắt đầu làm việc</h3>
          </div>

          {isTimeSchedule && (
            <div className="flex flex-col gap-[5px]">
              <input
                name="timeSchedule"
                className="w-full h-[36px] border-1 outline-none text-[0.8rem] px-[10px] rounded-[5px]"
                type="time"
                value={data.timeSchedule}
                onChange={handleChange}
              />
            </div>
          )}
          {autoPlan && (
            <select
              name="priorityId"
              className="w-full h-[36px] border-1 outline-none text-[0.8rem] px-[5px] rounded-[5px]"
              onChange={handleChange}
              value={data.priorityId}
              required
            >
              <option value={task.priority ? task.priority.id : ""}>
                {task.priority ? task.priority.name : "Chọn ưu tiên"}
              </option>
              {priorities
                .sort((a, b) => b.point - a.point)
                .map((priority) => (
                  <option key={priority.id} value={priority.id}>
                    {priority.name}
                  </option>
                ))}
            </select>
          )}

          <select
            name="status"
            className="w-full h-[36px] border-1 outline-none text-[0.8rem] px-[5px] rounded-[5px]"
            value={data.status}
            onChange={handleChange}
            required
          >
            <option value="">{status}</option>
            <option value="unmake">Chưa làm</option>
            <option value="in-progress">Đang làm</option>
            <option value="complete">Hoàn thành</option>
          </select>
          <div className="w-full flex flex-col items-center justify-center gap-[10px]">
            <button
              type="submit"
              className="w-full h-[36px] flex items-center justify-center bg-bg-btn-add rounded-[5px] text-[1rem] text-text-light font-Nunito font-bold cursor-pointer"
            >
              <span>Lưu</span>
            </button>
            <button
              type="button"
              className="w-full h-[36px] flex items-center justify-center bg-bg-light border-1 rounded-[5px] text-[1rem] text-text-dark-1000 font-Nunito font-bold cursor-pointer"
              onClick={onClose}
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModifyTask;

import { useState, useRef, useEffect } from "react";
import useDebounce from "./useDebounce";
import { updateTask } from "../../utils/tasksUtils";
import { useNavigate } from "react-router-dom";
import NotificationModal from "./NotificationModal";

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
  const [status, setStatus] = useState("");
  const [isStartDay, setIsStartDay] = useState(false);
  const [notify, setNotify] = useState({ payload: "", type: "" });
  const [notifyModal, setNotifyModal] = useState(false);
  const modalRef = useRef();
  const prevStartDayRef = useRef(data.startDay);
  const [previousTimeSchedule, setPreviousTimeSchedule] = useState("");

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

  useEffect(() => {
    if (task.startDay) {
      setIsStartDay(true);
      setData((prevData) => ({
        ...prevData,
        startDay: formatDateToDDMMYYYY(task.startDay),
      }));
    } else {
      setIsStartDay(false);
      setData((prevData) => ({
        ...prevData,
        startDay: "",
      }));
    }

    const planStartDate = new Date(plan.startDate);
    const taskStartDate = task.startDay ? new Date(task.startDay) : null;

    setData((prevData) => ({
      ...prevData,
      title: task.title || prevData.title,
      content: task.content || prevData.content,
      startDay:
        taskStartDate && taskStartDate >= planStartDate
          ? formatDateToDDMMYYYY(task.startDay)
          : prevData.startDay,
      priorityId: task.priority ? task.priority.id : prevData.priorityId,
      estimatedCompletionTime:
        task.estimatedCompletionTime || prevData.estimatedCompletionTime,
    }));
  }, [task, plan]);

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

  const formatDateToDDMMYYYY = (date) => {
    if (!date || date.split("-").length !== 3) return null;
    const [year, month, day] = date.split("-");
    return `${day}-${month}-${year}`;
  };

  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split("-");
    return new Date(year, month - 1, day);
  };

  console.log(data);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const planStartDate = parseDate(plan.startDate);
    const planEndDate = parseDate(plan.endDate);
    const inputDate = parseDate(formatDateToDDMMYYYY(data.startDay));

    if (isStartDay && inputDate < planStartDate) {
      setNotify({
        payload: "Ngày bắt đầu công việc sớm hơn ngày bắt đầu kế hoạch",
        type: "warning",
      });
      openNotifyModal();
      return;
    }

    if (isStartDay && inputDate > planEndDate) {
      setNotify({
        payload: "Ngày bắt đầu công việc đã quá hạn kết thúc của kế hoạch!!!",
        type: "warning",
      });
      openNotifyModal();
      return;
    }

    const updateData = {
      ...data,
      startDay: isStartDay ? formatDateToDDMMYYYY(data.startDay) : "",
      estimatedCompletionTime: parseInt(
        data.estimatedCompletionTime || "0",
        10
      ),
    };

    await updateTask(updateData);
    onClose();
    navigate(0);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "title" && value === "") {
      setData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
    if (name === "content" && value === "") {
      setData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else {
      setData((prevData) => ({
        ...prevData,
        [name]: value || prevData[name],
      }));
    }
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

  const closeNotifyModal = () => {
    setNotifyModal(false);
  };

  const openNotifyModal = () => {
    setNotifyModal(true);
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
        {notifyModal && (
          <NotificationModal notify={notify} onCloseNotify={closeNotifyModal} />
        )}
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

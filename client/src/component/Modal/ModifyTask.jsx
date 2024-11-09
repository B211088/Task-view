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
    priorityId: task.priorityId || "",
  });

  const [status, setStatus] = useState("");
  const modalRef = useRef();
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

    const formattedStartDay = data.startDay
      ? formatDate(data.startDay)
      : data.startDay;

    const updateData = {
      ...data,
      startDay: formattedStartDay || task.startDay,
    };

    await updateTask(updateData);
    onClose();
    navigate(0);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value || task[name],
    }));
  };

  const handleOverlayClick = () => {
    onClose();
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
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
          {!autoPlan && (
            <div className="flex flex-col gap-[5px]">
              <h3 className="px-[5px] text-[0.75rem]">Ngày bắt đầu *</h3>
              <input
                name="startDay"
                className="w-full h-[36px] border-1 outline-none text-[0.8rem] px-[5px] rounded-[5px]"
                type="date"
                value={data.startDay || ""}
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
              <option value={task.priority.id}>{task.priority.name}</option>
              {priorities.map((priority) => (
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

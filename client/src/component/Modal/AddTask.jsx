import { useState, useRef, useEffect } from "react";
import useDebounce from "./useDebounce";
import { addTask } from "../../utils/tasksUtils";
import NotificationModal from "./NotificationModal";

const AddTask = ({ autoPlan, onClose, priorities, plan, onSuccess }) => {
  const [data, setData] = useState({
    title: "",
    content: "",
    status: "",
    timeSchedule: "",
    prerequisites: [],
    estimatedCompletionTime: 1,
    startDay: "",
    planId: plan?.id || "",
    priorityId: "",
  });
  const [notify, setNotify] = useState({ payload: "", type: "" });
  const [notifyModal, setNotifyModal] = useState(false);
  const [isTimeSchedule, setIsTimeSchedule] = useState(false);
  const [isStartDay, setIsStartDay] = useState(false);
  console.log(data);

  const closeNotifyModal = (e) => {
    e.stopPropagation();
    setNotifyModal(false);
  };

  const openNotifyModal = () => {
    setNotifyModal(true);
  };

  useDebounce(data, 300);
  const modalRef = useRef(null);

  const formatDateToDDMMYYYY = (date) => {
    const [year, month, day] = date.split("-");
    return `${day}-${month}-${year}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.title || !data.status) {
      openNotifyModal();
      setNotify({ payload: "vui lòng nhập đầy đủ thông tin", type: "warning" });
      return;
    }

    const planStartDate = new Date(plan.startDate);
    const inputDate = new Date(data.startDay);

    if (inputDate < planStartDate) {
      alert("Ngày bắt đầu không thể nhỏ hơn ngày bắt đầu của kế hoạch.");
      return;
    }

    if (
      !data ||
      !data.title ||
      !data.status ||
      isNaN(parseInt(data.estimatedCompletionTime)) ||
      parseInt(data.estimatedCompletionTime) < 1
    ) {
      alert("Số ngày hoàn thành công việc phải lớn hơn hoặc bằng 1.");
      return;
    }

    const estimatedCompletionTime = parseInt(data.estimatedCompletionTime);
    if (isNaN(estimatedCompletionTime) || estimatedCompletionTime < 1) {
      throw new Error(
        "Estimated Completion Time must be a valid number and greater than or equal to 1."
      );
    }

    if (data.startDay !== "") {
      const fotmatDate = formatDateToDDMMYYYY(data.startDay || "");
      const newData = {
        ...data,
        startDay: fotmatDate,
        estimatedCompletionTime,
      };
      console.log(newData);

      await addTask(newData);
      onSuccess(data);
      onClose();
    } else {
      const newData = { ...data, startDay: "", estimatedCompletionTime };
      console.log(newData);

      await addTask(newData);
      onSuccess(data);
      onClose();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const handleOverlayClick = () => {
    onClose();
  };

  useEffect(() => {
    if (!isTimeSchedule) {
      setData({
        ...data,
        timeSchedule: "",
      });
    }
  }, [isTimeSchedule]);

  useEffect(() => {
    if (!isStartDay) {
      setData({
        ...data,
        startDay: "",
      });
    }
  }, [isStartDay]);

  const handleToggleTimeSchedule = () => {
    setIsTimeSchedule(!isTimeSchedule);
  };

  const handleToggleStartDay = () => {
    setIsStartDay(!isStartDay);
  };

  return (
    <div
      className="fixed top-0 bottom-0 right-0 left-0 flex items-center justify-center bg-overlay z-1 px-[20px]"
      onClick={handleOverlayClick}
    >
      {notifyModal && (
        <NotificationModal notify={notify} onCloseNotify={closeNotifyModal} />
      )}
      <div
        ref={modalRef}
        className="sm:w-[20%] sm:min-w-[380px] min-w-[320px] w-full bg-bg-light z rounded-[5px] px-[20px] py-[20px]"
        onClick={handleModalClick}
      >
        <div className="w-full mb-[20px] text-[1.1rem] font-Nunito font-bold text-center">
          <h1>Thêm công việc</h1>
        </div>
        <div className="w-full flex flex-col gap-[20px] z-1">
          <form className="flex flex-col gap-[20px]" onSubmit={handleSubmit}>
            <input
              name="title"
              className="w-full h-[36px] border-1 outline-none text-[0.8rem] px-[10px] rounded-[5px]"
              type="text"
              placeholder="Thêm tiêu đề"
              value={data.title}
              onChange={handleChange}
            />
            <textarea
              name="content"
              className="w-full h-[120px] max-h-[200px] min-h-[120px] border-1 custom-scrollbar-1 outline-none text-[0.8rem] p-[10px] rounded-[5px]"
              placeholder="Thêm mô tả"
              value={data.content}
              onChange={handleChange}
            />
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
              <div className="flex flex-col gap-[5px]">
                <input
                  name="estimatedCompletionTime"
                  className="w-full h-[36px] border-1 outline-none text-[0.8rem] px-[10px] rounded-[5px]"
                  type="Number"
                  placeholder="Thêm số ngày cần để hoàn thành công viẹc"
                  value={data.estimatedCompletionTime}
                  onChange={handleChange}
                  min="1"
                />
              </div>
            )}
            {autoPlan && (
              <select
                name="priorityId"
                className="w-full h-[36px] border-1 outline-none text-[0.8rem] px-[5px] rounded-[5px]"
                value={data.priorityId}
                onChange={handleChange}
              >
                <option value="">Độ ưu tiên</option>
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
            >
              <option value="">Trạng Thái</option>
              <option value="unmake">Chưa làm</option>
              <option value="in-progress">Đang làm</option>
              <option value="completed">Hoàn thành</option>
            </select>
            <button
              type="submit"
              className="w-full h-[36px] flex items-center justify-center bg-bg-btn-add rounded-[5px] text-[1rem] text-text-light font-Nunito font-bold cursor-pointer"
            >
              <span>Thêm</span>
            </button>
          </form>

          <button
            className="w-full h-[36px] flex items-center justify-center bg-bg-light border-1 rounded-[5px] text-[1rem] text-text-dark-1000 font-Nunito font-bold cursor-pointer"
            onClick={onClose}
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTask;

import { useNavigate } from "react-router-dom";
import { addNewPlan, addNewPriority } from "../../utils/plansUtils"; // Import thêm addNewPriority
import Priority from "./Priority";
import useDebounce from "./useDebounce";
import { useState, useRef, useEffect } from "react";
import NotificationModal from "./NotificationModal";

const AddPlan = ({ onCloseModal, onAddPlan }) => {
  const [isOnPriority, setIsOnPriority] = useState(false);
  const [isOnMaxTasks, setIsOnMaxTasks] = useState(false);
  const [maxTasksInput, setMaxTasksInput] = useState(1);
  const [priority, setPriority] = useState([
    {
      name: "",
      point: "",
    },
  ]);
  const [data, setData] = useState({
    name: "",
    autoPlan: false,
    startDate: "",
    endDate: "",
    maxTasksPerDay: 999999,
  });

  console.log(data);

  const [notify, setNotify] = useState({ payload: "", type: "" });
  const [notifyModal, setNotifyModal] = useState(false);
  const modalRef = useRef(null);

  const handleToggle = () => {
    setIsOnPriority((prev) => {
      const newValue = !prev;
      setData((prevData) => ({
        ...prevData,
        autoPlan: newValue,
      }));
      return newValue;
    });
  };

  const closeNotifyModal = () => {
    setNotifyModal(false);
  };

  const openNotifyModal = () => {
    setNotifyModal(true);
  };

  const formatDateToDDMMYYYY = (date) => {
    const [year, month, day] = date.split("-");
    return `${day}-${month}-${year}`;
  };

  const handleAddNewPlan = async () => {
    if (!data.name || !data.startDate) {
      openNotifyModal();
      setNotify({
        payload: "vui lòng điền đầy đủ Tên kế hoạch và ngày bắt đầu",
        type: "warning",
      });
      console.log("Missing data, returning early");
      return;
    }

    const formattedStartDate = formatDateToDDMMYYYY(data.startDate);
    const formattedEndDate = data.endDate
      ? formatDateToDDMMYYYY(data.endDate)
      : "";

    const newPlanData = {
      ...data,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    };

    const { addPlan } = await addNewPlan(newPlanData);
    console.log(addPlan);

    if (!addPlan) {
      return;
    }

    if (priority.length > 0) {
      for (let prio of priority) {
        await addNewPriority({
          name: prio.name,
          point: parseInt(prio.point, 10),
          planId: addPlan.id,
        });
      }
    }

    onAddPlan(addPlan);
    onCloseModal();
  };

  const handleToggleMaxTasks = () => {
    setIsOnMaxTasks((prev) => {
      const newValue = !prev;
      setData((prevData) => ({
        ...prevData,
        maxTasksPerDay: newValue ? maxTasksInput : 999999,
      }));

      return newValue;
    });
  };

  useEffect(() => {
    if (isOnPriority === false) {
      setPriority([]);
    }
  }, [isOnPriority]);

  useEffect(() => {
    if (!isOnMaxTasks) {
      setData((prevData) => ({
        ...prevData,
        maxTasksPerDay: 999999,
      }));
    }
  }, [isOnMaxTasks]);

  useDebounce(data, 300);

  const addPriority = () => {
    setPriority((prevPriorities) => [
      ...prevPriorities,
      { name: "", point: "" },
    ]);
  };

  const removePriority = (index) => {
    setPriority((prevPriorities) =>
      prevPriorities.filter((_, i) => i !== index)
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "maxTasksPerDay") {
      const newValue = Math.max(1, Number(value));

      setMaxTasksInput(newValue);

      if (isOnMaxTasks) {
        setData((prevData) => ({
          ...prevData,
          [name]: newValue,
        }));
      }
    } else {
      setData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handlePriorityChange = (index, name, value) => {
    const updatedPriorities = priority.map((priority, i) => {
      if (i === index) {
        return { ...priority, [name]: value };
      }
      return priority;
    });

    setPriority(updatedPriorities);
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const handleOverlayClick = () => {
    onCloseModal();
  };

  return (
    <div
      className="fixed top-0 bottom-0 right-0 left-0 flex items-center justify-center bg-overlay z-30 px-[10px]"
      onClick={handleOverlayClick}
    >
      {notifyModal && (
        <NotificationModal onCloseNotify={closeNotifyModal} notify={notify} />
      )}
      <div
        ref={modalRef}
        className="sm:w-[20%] sm:min-w-[380px] min-w-[320px] w-full bg-bg-light z rounded-[5px] px-[20px] py-[20px]"
        onClick={handleModalClick}
      >
        <div className="w-full mb-[20px] text-[1.1rem] font-Nunito font-bold text-center">
          <h1>Tạo kế hoạch</h1>
        </div>
        <div className="w-full flex flex-col gap-[20px] z-1">
          <form className="flex flex-col gap-[20px]">
            <input
              name="name"
              className="w-full h-[36px] border-1 outline-none text-[0.8rem] px-[10px] rounded-[5px]"
              type="text"
              placeholder="Tên kế hoạch"
              value={data.name}
              onChange={handleChange}
              autoFocus={true}
            />
            <div className="flex flex-col gap-[5px]">
              <h3 className="px-[5px] text-[0.75rem]">Ngày bắt đầu *</h3>
              <input
                name="startDate"
                className="w-full h-[36px] border-1 outline-none text-[0.8rem] px-[10px] rounded-[5px]"
                type="date"
                value={data.startDate}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-[5px]">
              <h3 className="px-[5px] text-[0.75rem]">Ngày kết thúc *</h3>
              <input
                name="endDate"
                className="w-full h-[36px] border-1 outline-none text-[0.8rem] px-[10px] rounded-[5px]"
                type="date"
                value={data.endDate}
                onChange={handleChange}
              />
            </div>
          </form>
          <div className="flex items-center gap-[10px]">
            <label className="relative w-[40px] inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isOnPriority}
                onChange={handleToggle}
                className="sr-only peer"
              />
              <div
                className={`w-[40px] flex items-center h-[20px] bg-color-dark-800 rounded-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 
                  transition-all duration-300 ${
                    isOnPriority ? "bg-text-dark-700" : "bg-text-dark-100"
                  }`}
              ></div>
              <span
                className={`absolute top-[10%] left-1 h-[16px] w-[16px] bg-text-light rounded-full transition-transform duration-300 transform 
                  ${isOnPriority ? "translate-x-[15px]" : ""}`}
              ></span>
            </label>
            <div className="text-[0.8rem] text-text-dark-800">
              Tự động lập kế hoạch
            </div>
          </div>
          {isOnPriority && (
            <div className="w-full max-h-[150px] custom-scrollbar-1 overflow-auto flex flex-col items-center rounded-[5px] gap-[5px] p-[5px]">
              {priority.map((priorityItem, index) => (
                <Priority
                  key={index}
                  index={index}
                  priority={priorityItem}
                  onPriorityChange={handlePriorityChange}
                  removePriority={() => removePriority(index)}
                />
              ))}
              <div
                className="w-full flex items-center justify-center border-1 rounded-[5px] p-[6px] cursor-pointer"
                onClick={addPriority}
              >
                <i className="fa-solid fa-plus"></i>
              </div>
            </div>
          )}
          <div className="flex items-center gap-[10px]">
            <label className="relative w-[40px] inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isOnMaxTasks}
                onChange={handleToggleMaxTasks}
                className="sr-only peer"
              />
              <div
                className={`w-[40px] flex items-center h-[20px] bg-color-dark-800 rounded-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 
                  transition-all duration-300 ${
                    isOnMaxTasks ? "bg-text-dark-700" : "bg-text-dark-100"
                  }`}
              ></div>
              <span
                className={`absolute top-[10%] left-1 h-[16px] w-[16px] bg-text-light rounded-full transition-transform duration-300 transform 
                  ${isOnMaxTasks ? "translate-x-[15px]" : ""}`}
              ></span>
            </label>
            <div className="text-[0.8rem] text-text-dark-800">
              Thêm giới hạn công việc ngày
            </div>
          </div>
          {isOnMaxTasks && (
            <input
              name="maxTasksPerDay"
              className="w-full h-[36px] border-1 outline-none text-[0.8rem] px-[10px] rounded-[5px]"
              type="number"
              min="1"
              placeholder="Giới hạn công việc trên 1 ngày"
              value={data.maxTasksPerDay}
              onChange={handleChange}
            />
          )}
          <div className="w-full flex flex-col items-center justify-center gap-[10px]">
            <button
              className="w-full h-[36px] flex items-center justify-center bg-bg-btn-add rounded-[5px] text-[0.8rem] font-bold text-text-light"
              onClick={handleAddNewPlan}
            >
              Tạo kế hoạch
            </button>
            <button
              className="w-full h-[36px] flex items-center justify-center rounded-[5px] text-[0.8rem] font-bold text-text-dark-1000 border-1"
              onClick={onCloseModal}
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPlan;

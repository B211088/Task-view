import { useEffect, useState, useRef } from "react";
import NotificationModal from "./NotificationModal";
import Priority from "./Priority";
import {
  addNewPriority,
  deletePriority,
  modifyPlan,
  modifyPriority,
} from "../../utils/plansUtils";
import { useNavigate } from "react-router-dom";

const ModifyPlan = ({ onCloseModal, plan }) => {
  const [isOnPriority, setIsOnPriority] = useState(plan.autoPlan || false);
  const [isOnMaxTasks, setIsOnMaxTasks] = useState(
    plan.maxTasksPerDay !== 999999
  );
  const [previousMaxTasksPerDay, setPreviousMaxTasksPerDay] = useState(
    plan.maxTasksPerDay
  );
  const [notify, setNotify] = useState({ payload: "", type: "" });
  const [notifyModal, setNotifyModal] = useState(false);
  const [priority, setPriority] = useState(plan.priorities);

  const [deletedPriorities, setDeletedPriorities] = useState([]);
  const [data, setData] = useState(plan);
  const modalRef = useRef(null);
  const navigate = useNavigate();

  const previousData = useRef(plan);

  useEffect(() => {
    previousData.current = plan;
  }, [plan]);

  useEffect(() => {}, []);

  useEffect(() => {
    setData({ ...plan });
    setPriority(plan.priorities);
    setIsOnPriority(plan.autoPlan || false);
    setIsOnMaxTasks(plan.maxTasksPerDay !== 999999);
    setPreviousMaxTasksPerDay(plan.maxTasksPerDay);
    setDeletedPriorities([]);
  }, [plan]);

  useEffect(() => {
    setData((prevData) => ({
      ...prevData,
      priorities: isOnPriority ? priority : [],
      autoPlan: isOnPriority,
    }));
  }, [priority, isOnPriority]);

  useEffect(() => {
    if (data.autoPlan === false) {
      if (data.startDate) {
        const formattedStartDate = formatDateToYYYYMMDD(data.startDate);
        setData((prevData) => ({ ...prevData, startDate: formattedStartDate }));
      }
      if (data.endDate) {
        const formattedEndDate = formatDateToYYYYMMDD(data.endDate);
        setData((prevData) => ({ ...prevData, endDate: formattedEndDate }));
      }
    } else if (data.autoPlan === true) {
      if (data.startDate) {
        const formattedStartDate = formatDateToDDMMYYYY(data.startDate);
        setData((prevData) => ({ ...prevData, startDate: formattedStartDate }));
      }
      if (data.endDate) {
        const formattedEndDate = formatDateToDDMMYYYY(data.endDate);
        setData((prevData) => ({ ...prevData, endDate: formattedEndDate }));
      }
    }

    if (isOnMaxTasks) {
      setData((prevData) => ({
        ...prevData,
        maxTasksPerDay: previousMaxTasksPerDay,
      }));
    }
  }, [data.autoPlan, isOnMaxTasks]);

  const formatDateToDDMMYYYY = (date) => {
    const [year, month, day] = date.split("-");
    return `${day}-${month}-${year}`;
  };

  const formatDateToYYYYMMDD = (date) => {
    if (/\d{4}-\d{2}-\d{2}/.test(date)) return date;

    const [day, month, year] = date.split("-");
    return `${year}-${month}-${day}`;
  };

  const handleSavePlan = async () => {
    const planStartDate = data.startDate;
    const planEndDate = data.endDate;

    if (planStartDate > planEndDate) {
      setNotify({
        payload: "Ngày bắt đầu phải nhỏ hơn ngày kết thúc",
        type: "error",
      });
      setNotifyModal(true);
      return;
    }

    if (deletedPriorities.length > 0) {
      await deletePriority(deletedPriorities);
    }

    const newPriorities = data.priorities.filter((priority) => !priority.id);
    if (newPriorities.length > 0) {
      for (let newPriority of newPriorities) {
        const priorityWithPlanId = { ...newPriority, planId: data.id };
        await addNewPriority({
          name: priorityWithPlanId.name,
          point: parseInt(priorityWithPlanId.point, 10),
          planId: data.id,
        });
      }
    }

    const updatedPriorities = data.priorities.map((priority) => ({
      ...priority,
      point: parseInt(priority.point, 10),
    }));

    if (deletedPriorities.length === 0) {
      await modifyPriority(updatedPriorities);
    }

    const formattedStartDate =
      data.startDate !== previousData.current.startDate
        ? formatDateToDDMMYYYY(data.startDate)
        : data.startDate;

    const formattedEndDate =
      data.endDate !== previousData.current.endDate
        ? data.endDate
          ? formatDateToDDMMYYYY(data.endDate)
          : ""
        : data.endDate;

    const dataModify = {
      ...data,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      maxTasksPerDay: parseInt(data.maxTasksPerDay, 10),
    };

    await modifyPlan(dataModify);

    onCloseModal();
    navigate(0);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: name === "maxTasksPerDay" ? Number(value) : value,
    }));
  };

  const addPriority = () => {
    const newPriority = { name: "", point: "" };

    setPriority((prevPriorities) => {
      const updatedPriorities = [...prevPriorities, newPriority];
      return updatedPriorities;
    });
  };

  const removePriority = (index) => {
    const removedPriority = priority[index];
    setPriority((prevPriorities) =>
      prevPriorities.filter((_, i) => i !== index)
    );
    setDeletedPriorities((prevDeleted) => [...prevDeleted, removedPriority]);
  };

  const handlePriorityChange = (index, name, value) => {
    const updatedPriorities = priority.map((priorityItem, i) => {
      if (i === index) {
        return { ...priorityItem, [name]: value };
      }
      return priorityItem;
    });

    setPriority(updatedPriorities);
  };

  const handleToggleMaxTasks = () => {
    setIsOnMaxTasks((prev) => {
      if (prev) {
        setPreviousMaxTasksPerDay(data.maxTasksPerDay);
        setData((prevData) => ({
          ...prevData,
          maxTasksPerDay: 999999,
        }));
      } else {
        setData((prevData) => ({
          ...prevData,
          maxTasksPerDay: previousMaxTasksPerDay,
        }));
      }
      return !prev;
    });
  };

  const closeNotifyModal = (e) => {
    e.stopPropagation();
    setNotifyModal(false);
  };

  const openNotifyModal = () => {
    setNotifyModal(true);
  };

  const handleToggle = () => {
    setIsOnPriority((prev) => !prev);
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
          <h1>Chỉnh sửa kế hoạch</h1>
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
                className={`w-[40px] flex items-center h-[20px] bg-color-dark-800 rounded-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 transition-all duration-300 ${
                  isOnPriority ? "bg-text-dark-700" : "bg-text-dark-100"
                }`}
              ></div>
              <span
                className={`absolute top-[10%] left-1 h-[16px] w-[16px] bg-text-light rounded-full transition-transform duration-300 transform ${
                  isOnPriority ? "translate-x-[15px]" : ""
                }`}
              ></span>
            </label>
            <div className="text-[0.8rem] text-text-dark-800">
              Tự động lập kế hoạch
            </div>
          </div>
          {isOnPriority && (
            <div className="w-full max-h-[150px] custom-scrollbar-1 overflow-auto flex flex-col items-center rounded-[5px] gap-[5px] p-[5px]">
              {priority
                .sort((a, b) => b.point - a.point)
                .map((priorityItem, index) => (
                  <Priority
                    key={priorityItem.id || index}
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
                className={`w-[40px] flex items-center h-[20px] bg-color-dark-800 rounded-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 transition-all duration-300 ${
                  isOnMaxTasks ? "bg-text-dark-700" : "bg-text-dark-100"
                }`}
              ></div>
              <span
                className={`absolute top-[10%] left-1 h-[16px] w-[16px] bg-text-light rounded-full transition-transform duration-300 transform ${
                  isOnMaxTasks ? "translate-x-[15px]" : ""
                }`}
              ></span>
            </label>
            <div className="text-[0.8rem] text-text-dark-800">
              Giới hạn số lượng công việc mỗi ngày
            </div>
          </div>

          {isOnMaxTasks && (
            <div className="flex flex-col gap-[10px]">
              <input
                name="maxTasksPerDay"
                className="w-full h-[36px] border-1 outline-none text-[0.8rem] px-[10px] rounded-[5px]"
                type="number"
                placeholder="Max tasks per day"
                value={data.maxTasksPerDay}
                onChange={handleChange}
                min="1"
              />
            </div>
          )}
          <div className="flex flex-col justify-between gap-[10px] text-[1rem] font-Nunito font-bold ">
            <button
              className="w-full px-[20px] py-[5px] rounded-[5px] bg-bg-btn-add text-text-light"
              onClick={handleSavePlan}
            >
              Lưu
            </button>
            <button
              className="w-full px-[20px] py-[5px] rounded-[5px] bg-bg-light border-1"
              onClick={() => onCloseModal()}
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModifyPlan;

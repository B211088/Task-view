import { useState, useEffect } from "react";
import { Outlet, useLoaderData, useNavigate } from "react-router-dom";
import AddTask from "../Modal/AddTask";
import ListTask from "./ListTask";
import { deletePlan } from "../../utils/plansUtils";

const ViewTasks = () => {
  const { plan } = useLoaderData();
  const { tasks, autoPlan, startDate, maxTasksPerDay } = plan;
  const [isAddModal, setIsAddModal] = useState(false);
  const [scheduledTasks, setScheduledTasks] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const scheduled = autoPlan
      ? autoScheduleTasks(tasks, startDate, maxTasksPerDay)
      : sortTasksByStartDay(tasks);
    setScheduledTasks(scheduled);
  }, [plan, autoPlan, tasks]);

  const autoScheduleTasks = (
    tasks,
    startDate,
    maxTasksPerDay = maxTasksPerDay
  ) => {
    const tasksByDay = {};
    const scheduledTasksMap = new Map();

    tasks.sort((a, b) => (b.priority.point ?? 0) - (a.priority.point ?? 0));

    tasks.forEach((task) => {
      let taskStartDate = startDate;

      if (task.startDay) {
        taskStartDate = task.startDay;
      } else {
        if (task.prerequisites.length > 0) {
          const prerequisiteCompletionDates = task.prerequisites
            .map((prereq) => scheduledTasksMap.get(prereq)?.scheduledDay)
            .filter(Boolean);

          if (
            prerequisiteCompletionDates.length === task.prerequisites.length
          ) {
            const latestPrerequisiteCompletionDate = new Date(
              Math.max(
                ...prerequisiteCompletionDates.map((date) => {
                  const [day, month, year] = date.split("-").map(Number);
                  return new Date(year, month - 1, day).getTime();
                })
              )
            );
            latestPrerequisiteCompletionDate.setDate(
              latestPrerequisiteCompletionDate.getDate() + 1
            );
            const dd = String(
              latestPrerequisiteCompletionDate.getDate()
            ).padStart(2, "0");
            const mm = String(
              latestPrerequisiteCompletionDate.getMonth() + 1
            ).padStart(2, "0");
            const yyyy = latestPrerequisiteCompletionDate.getFullYear();
            taskStartDate = `${dd}-${mm}-${yyyy}`;
          } else {
            return;
          }
        }
      }

      let daysScheduled = 0;
      while (daysScheduled < task.estimatedCompletionTime) {
        if (!tasksByDay[taskStartDate]) {
          tasksByDay[taskStartDate] = [];
        }

        if (tasksByDay[taskStartDate].length < maxTasksPerDay) {
          const taskForDay = { ...task, scheduledDay: taskStartDate };
          tasksByDay[taskStartDate].push(taskForDay);
          scheduledTasksMap.set(task.id, taskForDay);
          daysScheduled++;
        }

        const [day, month, year] = taskStartDate.split("-").map(Number);
        const nextDay = new Date(year, month - 1, day + 1);
        taskStartDate = `${String(nextDay.getDate()).padStart(2, "0")}-${String(
          nextDay.getMonth() + 1
        ).padStart(2, "0")}-${nextDay.getFullYear()}`;
      }
    });

    return tasksByDay;
  };

  const sortTasksByStartDay = (tasks) => {
    const groupedTasks = tasks.reduce((acc, task) => {
      const dateKey = task.startDay;
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(task);
      return acc;
    }, {});

    const sortedTasksByDate = Object.keys(groupedTasks)
      .sort((a, b) => {
        const [aDay, aMonth, aYear] = a.split("-").map(Number);
        const [bDay, bMonth, bYear] = b.split("-").map(Number);
        return (
          new Date(aYear, aMonth - 1, aDay) - new Date(bYear, bMonth - 1, bDay)
        );
      })
      .reduce((sortedAcc, date) => {
        sortedAcc[date] = groupedTasks[date];
        return sortedAcc;
      }, {});

    const tasksByDay = {};

    Object.keys(sortedTasksByDate).forEach((date) => {
      tasksByDay[date] = [];
      const addedTaskIds = new Set();

      sortedTasksByDate[date].forEach((task) => {
        if (!addedTaskIds.has(task.id)) {
          tasksByDay[date].push(task);
          addedTaskIds.add(task.id);
        }
      });
    });

    return tasksByDay;
  };

  const addTaskSuccess = (newTask) => {
    navigate(0);
    const updatedTasks = [...tasks, newTask];
    const scheduled = autoPlan
      ? autoScheduleTasks(updatedTasks, startDate, maxTasksPerDay)
      : sortTasksByStartDay(updatedTasks);
    setScheduledTasks(scheduled);
  };

  const handleDeletePlan = async () => {
    const confirmDelete = window.confirm(
      "Bạn chắc chắn muốn xóa kế hoạch này và tất cả các task và ưu tiên liên quan?"
    );
    if (confirmDelete) {
      try {
        await deletePlan(plan.id);
        navigate(-1);
      } catch (error) {
        console.error("Lỗi khi xóa kế hoạch:", error);
        alert("Xóa kế hoạch không thành công.");
      }
    }
  };

  return (
    <div className="w-full flex justify-between height-container-plans">
      <div className="sm:w-[78%] w-full flex flex-col gap-[10px] sm:mr-[10px] mr-0">
        <div className="w-full flex items-center justify-between gap-[10px]">
          <div
            className="square-container-l flex items-center justify-center rounded-[5px] border-1 cursor-pointer text-[1.5rem] bg-bg-light"
            onClick={() => setIsAddModal((prev) => !prev)}
          >
            <i className="fa-solid fa-notes-medical"></i>
          </div>
          <div className="w-full h-[50px] border-1 rounded bg-bg-light flex items-center justify-center px-[20px]">
            <div className="flex w-full items-center px-[10px] justify-end">
              <div
                className="square-container-s flex items-center justify-center border-1 rounded-[5px] bg-bg-light text-text-red cursor-pointer"
                onClick={handleDeletePlan}
              >
                <i className="fa-regular fa-square-minus"></i>
              </div>
            </div>
          </div>
          {isAddModal && (
            <AddTask
              plan={plan}
              autoPlan={autoPlan}
              onClose={() => setIsAddModal(false)}
              priorities={plan.priorities}
              onSuccess={addTaskSuccess}
            />
          )}
        </div>

        <div className="w-full height-container-plans flex flex-col gap-2 border-1 rounded bg-bg-light flex-1">
          <div className="flex w-full overflow-auto custom-scrollbar-1">
            {Object.keys(scheduledTasks).map((day) => {
              return (
                <ListTask
                  priorities={plan.priorities}
                  key={day}
                  tasks={scheduledTasks[day]}
                  date={day}
                  autoPlan={autoPlan}
                  plan={plan}
                />
              );
            })}
          </div>
        </div>
      </div>

      <Outlet />
    </div>
  );
};

export default ViewTasks;

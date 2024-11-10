import { useState, useEffect } from "react";
import {
  Outlet,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import AddTask from "../Modal/AddTask";
import ListTask from "./ListTask";

const ViewTasks = () => {
  const { plan } = useLoaderData();
  const { tasks, autoPlan, startDate, maxTasksPerDay } = plan;
  const [isAddModal, setIsAddModal] = useState(false);
  const [scheduledTasks, setScheduledTasks] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const popupName = searchParams.get("popup");
  const navigate = useNavigate();

  useEffect(() => {
    if (popupName === "add-task") {
      setIsAddModal(true);
      return;
    }
    setIsAddModal(false);

    const scheduled = autoPlan
      ? autoScheduleTasks(tasks, startDate, maxTasksPerDay)
      : sortTasksByStartDay(tasks);
    setScheduledTasks(scheduled);
  }, [plan, autoPlan, tasks, popupName]);

  const autoScheduleTasks = (
    tasks,
    startDate,
    maxTasksPerDay = maxTasksPerDay
  ) => {
    const tasksByDay = {};
    const scheduledTasksMap = new Map();

    tasks.sort((a, b) => (b.priority?.point ?? 0) - (a.priority?.point ?? 0));

    tasks.forEach((task) => {
      let taskStartDate = task.startDay || startDate;

      if (!task.startDay && task.prerequisites.length > 0) {
        const prerequisiteCompletionDates = task.prerequisites
          .map((prereq) => scheduledTasksMap.get(prereq)?.scheduledDay)
          .filter(Boolean);

        if (prerequisiteCompletionDates.length === task.prerequisites.length) {
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

    const sortedTaskDays = Object.keys(tasksByDay).sort((a, b) => {
      const [dayA, monthA, yearA] = a.split("-").map(Number);
      const [dayB, monthB, yearB] = b.split("-").map(Number);
      const dateA = new Date(yearA, monthA - 1, dayA);
      const dateB = new Date(yearB, monthB - 1, dayB);
      return dateA - dateB;
    });

    const sortedTasksByDay = {};
    sortedTaskDays.forEach((date) => {
      sortedTasksByDay[date] = tasksByDay[date];
    });

    return sortedTasksByDay;
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

  const openAddTaskMpdal = () => {
    setSearchParams({ popup: "add-task" });
  };

  const closeAddTaskModal = () => {
    navigate(-1);
  };

  const addTaskSuccess = (newTask) => {
    const updatedTasks = [...tasks, newTask];
    const scheduled = autoPlan
      ? autoScheduleTasks(updatedTasks, startDate, maxTasksPerDay)
      : sortTasksByStartDay(updatedTasks);
    setScheduledTasks(scheduled);
  };

  return (
    <div className="w-full flex justify-between height-container-taskview  ">
      <div className="sm:w-[78%] w-full flex flex-col gap-[10px] sm:mr-[10px] mr-0">
        <div className="w-full flex items-center justify-between gap-[10px]">
          <div
            className="w-[50px] h-[50px] min-w-[50px] p-[5px] flex items-center justify-center rounded-[5px] border-1 cursor-pointer text-[1.5rem] bg-bg-light"
            onClick={openAddTaskMpdal}
          >
            <i className="fa-solid fa-notes-medical"></i>
          </div>
          <div className="w-full h-[50px] border-1 rounded bg-bg-light flex items-center justify-center px-[20px]">
            <div className="flex w-full items-center px-[10px] font-Nunito font-bold">
              {plan.name}
            </div>
          </div>
          {isAddModal && (
            <AddTask
              plan={plan}
              autoPlan={autoPlan}
              onClose={closeAddTaskModal}
              priorities={plan.priorities}
              onSuccess={addTaskSuccess}
            />
          )}
        </div>

        <div className="w-full height-container-taskdetails flex flex-col gap-2 border-1 rounded bg-bg-light flex-1">
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

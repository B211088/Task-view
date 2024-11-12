import Task from "../Task/Task";

const ListTask = ({ tasks, date, autoPlan, priorities, plan }) => {
  const getCurrentDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();

    return `${day}-${month}-${year}`;
  };

  return (
    <div className=" w-4/12 sm:min-w-[400px] min-w-full    flex flex-col justify-center pb-[10px] px-[10px] border-r">
      <div className="w-full h-[34px] flex items-center justify-center px-2">
        <div className="h-[1px] flex-1 border border-gray-300"></div>
        <div
          className={`w-[120px] text-sm  flex justify-center items-center border-1 rounded-[5px] font-Nunito font-medium ${
            date === getCurrentDate() ? "text-bg-btn-add" : ""
          }  `}
        >
          <div>{date}</div>
        </div>
        <div className="h-[1px] flex-1 border border-gray-300"></div>
      </div>
      <div className="w-full flex flex-col height-container-task-list overflow-y-auto custom-scrollbar gap-[10px]">
        {tasks && tasks.length > 0 ? (
          tasks.map((task) => (
            <Task
              key={`${task.id}-${date}`}
              task={task}
              autoPlan={autoPlan}
              priorities={priorities}
              plan={plan}
            />
          ))
        ) : (
          <p className="text-center text-gray-500">Không có nhiệm vụ nào</p>
        )}
      </div>
    </div>
  );
};

export default ListTask;

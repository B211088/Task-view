import Task from "../Task/Task";

const ListTask = ({ tasks, date, autoPlan, priorities, plan }) => {
  return (
    <div className=" w-4/12 sm:min-w-[400px] min-w-full    flex flex-col justify-center pb-[10px] px-[10px] border-r">
      <div className="w-full h-[34px] flex items-center justify-center px-2">
        <div className="h-[1px] flex-1 border border-gray-300"></div>
        <div className="w-[120px] text-sm font-Nunito flex justify-center items-center">
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

import Task from "../Task/Task";

const ListTask = ({ tasks, date, autoPlan, priorities, plan }) => {
  return (
    <div className="sm:w-3/12 w-full h-full sm:min-w-[400px] min-w-full flex flex-col justify-center py-[0] px-[10px] border-r">
      <div className="w-full h-[34px] flex items-center justify-center px-2">
        <div className="h-[1px] flex-1 border border-gray-300"></div>
        <div className="w-[120px] text-sm font-Nunito flex justify-center items-center">
          <div>{date}</div>
        </div>
        <div className="h-[1px] flex-1 border border-gray-300"></div>
      </div>
      <div className="w-full flex flex-col height-container-task-list overflow-y-auto custom-scrollbar gap-2">
        {tasks && tasks.length > 0 ? (
          tasks.map((task) => (
            <Task
              key={task.id}
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

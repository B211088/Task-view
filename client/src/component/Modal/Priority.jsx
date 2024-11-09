const Priority = ({ index, priority, onPriorityChange, removePriority }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onPriorityChange(index, name, value);
  };

  return (
    <div className="w-full flex items-center text-[0.8rem] border-1 rounded-[5px]">
      <input
        name="name"
        className="w-[40%] p-[5px] outline-none border-r"
        type="text"
        placeholder="Tên độ ưu tiên"
        value={priority.name}
        onChange={handleInputChange}
      />
      <input
        name="point"
        className="w-[60%] p-[5px] outline-none"
        type="number"
        placeholder="Điểm ưu tiên"
        value={priority.point}
        onChange={handleInputChange}
      />
      <div
        className="square-container-m flex items-center justify-center border-none rounded-[5px] cursor-pointer text-text-red"
        onClick={removePriority}
      >
        <i className="fa-regular fa-square-minus"></i>
      </div>
    </div>
  );
};

export default Priority;

const Filter = () => {
  return (
    <div className="absolute w-[120px] sm:top-[110%] top-[-4%] sm:left-[-250%] left-[151%] font-Nunito font-bold bg-bg-light border-1 border-cl-border rounded-[5px] text-[0.9rem] text-text-dark-700 ">
      <div className="w-full h-[34px] flex items-center justify-center text-center  px-[10px] hover:bg-color-dark-900">
        <span>Mới nhất</span>
      </div>
      <div className="w-full h-[34px] flex items-center justify-center text-center  px-[10px] hover:bg-color-dark-900">
        <span>Cũ nhất</span>
      </div>
    </div>
  );
};

export default Filter;

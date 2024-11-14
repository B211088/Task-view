const UserMenu = ({ logOut, name }) => {
  return (
    <div className="absolute w-[70%] min-w-[170px] top-[140%] right-0 bg-bg-light  border-1 rounded-[5px]">
      <div className="w-full  sm:hidden  flex items-center gap-[10px] p-[10px]">
        <span className="text-[0.9rem] font-Nunito font-bold   text-text-dark-800">
          {name}
        </span>
      </div>
      <div
        className="w-full  flex items-center gap-[10px] p-[10px]"
        onClick={logOut}
      >
        <span className="text-[0.9rem] font-Nunito font-bold     text-text-dark-800">
          Logout
        </span>
        <div className="text-text-dark-1000">
          <i className="fa-solid fa-right-from-bracket"></i>
        </div>
      </div>
    </div>
  );
};

export default UserMenu;

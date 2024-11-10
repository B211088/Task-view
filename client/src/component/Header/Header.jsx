import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../../context/AuthProvider";
import UserMenu from "./userMenu";

const Header = ({ openSideBar }) => {
  const {
    user: { displayName, photoURL, auth },
  } = useContext(AuthContext);

  const [userMenu, setUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  const handleLogoutUser = () => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn đăng xuất không?");
    if (confirmed) {
      auth.signOut();
    }
  };

  const onChangeStatusUserMenu = () => {
    setUserMenu(!userMenu);
  };

  const handleClickOutside = (event) => {
    if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
      setUserMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full h-[68px] flex items-center justify-between bg-bg-header px-[10px]">
      <div
        className="flex sm:hidden square-container-l  rounded-[5px] items-center justify-center cursor-pointer font-bold text-[1.5rem] text-text-light "
        onClick={openSideBar}
      >
        <i className="fa-solid fa-bars"></i>
      </div>
      <div className="text-text-light w-2/12 flex items-center text-[1.2rem] uppercase font-Nunito font-bold">
        <h1>Logo</h1>
      </div>
      <div
        className="relative w-2/12 h-[32px] flex items-center justify-end gap-[10px] text-text-light cursor-pointer"
        onClick={onChangeStatusUserMenu}
        ref={userMenuRef}
      >
        <div className="text-[1rem] font-Nunito font-bold sm:flex hidden">
          {displayName}
        </div>
        <div className="square-container-l rounded-full flex items-center justify-center ">
          <img
            className="w-full h-full rounded-full object-cover"
            src={photoURL}
            alt="Avatar user"
          />
        </div>
        {userMenu && <UserMenu logOut={handleLogoutUser} name={displayName} />}
      </div>
    </div>
  );
};

export default Header;

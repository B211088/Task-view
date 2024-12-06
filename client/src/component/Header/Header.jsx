import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../../context/AuthProvider";
import UserMenu from "./UserMenu";
import ConfirmModal from "../Modal/ConfirmModal";
import logo from "../../assets/images/logo.png";
import { useNavigate } from "react-router-dom";

const Header = ({ openSideBar }) => {
  const [confirmModal, setConfirmModal] = useState(false);
  const [notify, setNotify] = useState({ payload: "", type: "" });

  const {
    user: { displayName, photoURL, auth, name },
  } = useContext(AuthContext);

  const userDisplayName = displayName || name || "User";
  const userPhotoURL = photoURL || "";

  const [userMenu, setUserMenu] = useState(false);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();
  const closeConfirmModal = () => {
    setConfirmModal(false);
  };

  const openConfirmModal = () => {
    setConfirmModal(true);
  };

  const onConfirm = () => {
    if (auth) {
      auth.signOut();
    }
    localStorage.clear();
    navigate("/login");
  };

  const handleLogoutUser = () => {
    setNotify({
      payload: "Bạn có chắc chắn muốn đăng xuất tài khoảng này không?",
      type: "warning",
    });
    openConfirmModal();
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
      <div className="sm:w-2/12 w-6/12  flex items-center sm:justify-start justify-center text-[1.2rem] uppercase font-Nunito font-bold">
        <img
          className="min-w-[180px] h-[68px] object-cover"
          src={logo}
          alt=""
        />
      </div>
      <div
        className="relative w-2/12 h-[32px] flex items-center justify-end gap-[10px] text-text-light cursor-pointer"
        onClick={onChangeStatusUserMenu}
        ref={userMenuRef}
      >
        <div className="text-[1rem] font-Nunito font-bold sm:flex hidden">
          {userDisplayName}
        </div>
        <div className="h-[50px] w-[50px]  rounded-full flex items-center justify-center ">
          {photoURL ? (
            <img
              className="w-full h-full rounded-full object-cover"
              src={photoURL}
              alt="Avatar user"
            />
          ) : (
            <div className="h-[50px] w-[50px] border-1 rounded-full flex items-center justify-center ">
              <h1 className="text-[1.8rem] font-Nunito font-bold">T</h1>
            </div>
          )}
        </div>
        {userMenu && <UserMenu logOut={handleLogoutUser} name={displayName} />}
      </div>
      {confirmModal && (
        <ConfirmModal
          onClose={closeConfirmModal}
          onConfirm={onConfirm}
          notify={notify}
        />
      )}
    </div>
  );
};

export default Header;

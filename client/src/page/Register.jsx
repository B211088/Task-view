import { useContext, useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { graphQLRequest } from "../utils/request";
import { registerUser } from "../api/index";
import NotificationModal from "../component/Modal/NotificationModal";

const Register = () => {
  const [registerForm, setRegisterForm] = useState({
    name: "",
    gmail: "",
    password: "",
    confirmPassword: "",
  });
  const auth = getAuth();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [notify, setNotify] = useState({ payload: "", type: "" });
  const [notifyModal, setNotifyModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const closeNotifyModal = () => {
    setNotifyModal(false);
  };

  const handleShowPassword = () => setShowPassword(!showPassword);
  const handleShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  useEffect(() => {
    showPassword
      ? (document.getElementById("password").type = "text")
      : (document.getElementById("password").type = "password");

    showConfirmPassword
      ? (document.getElementById("comfirmPassword").type = "text")
      : (document.getElementById("comfirmPassword").type = "password");
  }, [showPassword, showConfirmPassword]);

  const openNotifyModal = () => {
    setNotifyModal(true);
  };

  const handleLoginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();

    const {
      user: { uid, displayName, email },
    } = await signInWithPopup(auth, provider);

    const { data } = await graphQLRequest({
      query: `mutation register($uid: String!, $name: String!, $gmail: String!) {
        register(uid: $uid, name: $name, gmail: $gmail) {
          uid
          name
          gmail
        }}`,
      variables: { uid, name: displayName, gmail: email },
    });
  };

  if (localStorage.getItem("accessToken")) {
    return <Navigate to="/" />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  console.log(registerForm);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (
      !registerForm.name ||
      !registerForm.gmail ||
      !registerForm.password ||
      !registerForm.confirmPassword
    ) {
      openNotifyModal();
      setNotify({
        payload: "Vui lòng điền đầy đủ thông tin.",
        type: "warning",
      });

      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerForm.gmail)) {
      openNotifyModal();
      setNotify({
        payload: "Email không hợp lệ. Vui lòng kiểm tra lại!",
        type: "warning",
      });

      return;
    }

    if (registerForm.password.length < 8) {
      openNotifyModal();
      setNotify({
        payload: "Mật khẩu phải có ít nhất 8 ký tự.",
        type: "warning",
      });

      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      openNotifyModal();
      setNotify({
        payload: "Mật khẩu và xác nhận mật khẩu không khớp.",
        type: "warning",
      });

      return;
    }

    try {
      const response = await registerUser(registerForm);

      if (response) {
        openNotifyModal();
        setNotify({
          payload: "Đăng ký thành công!",
          type: "success",
        });

        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        openNotifyModal();
        setNotify({
          payload: "Có lỗi xảy ra khi đăng ký. Vui lòng thử lại!",
          type: "error",
        });
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          openNotifyModal();
          setNotify({
            payload: "Email đã được sử dụng. Vui lòng chọn email khác.",
            type: "warning",
          });
        } else {
          openNotifyModal();
          setNotify({
            payload: "Có lỗi xảy ra khi đăng ký. Vui lòng thử lại!",
            type: "error",
          });
        }
      }
    }
  };

  return (
    <div className="auth-bg w-full h-[100vh] flex items-center justify-center bg-text-dark-200 gap-[50px] px-[20px]">
      {notifyModal && (
        <NotificationModal onCloseNotify={closeNotifyModal} notify={notify} />
      )}
      <div className="sm:w-[50%] w-full flex items-center sm:flex-row flex-col gap-[50px]">
        <div className="sm:w-[50%] w-full h-[190px] flex flex-col justify-center items-center uppercase font-Nunito text-center text-text-light rounded-[10px] bg-box-shadow pb-[50px]">
          <h1 className="text-[3rem] font-extrabold">Task Views</h1>
          <p className="text-[1.2rem] font-medium">
            Quản lý công việc dễ dàng hơn với TaskViews
          </p>
        </div>
        <div className="sm:w-[30%] w-full min-w-[350px] flex flex-col items-center justify-center gap-[20px]">
          <div className="w-full flex flex-col justify-center items-center gap-[20px] py-[10px] px-[20px] bg-bg-light rounded-[5px]">
            <h1 className="text-[1.2rem] font-Nunito font-bold">Đăng ký</h1>
            <form
              onSubmit={handleRegister}
              className="w-full flex flex-col gap-[20px] text-[0.9rem]"
            >
              <input
                type="text"
                name="name"
                className="w-full border-1 rounded-[5px] h-[40px] px-[5px] outline-none"
                placeholder="Tên người dùng"
                value={registerForm.name}
                onChange={handleChange}
              />
              <input
                type="email"
                name="gmail"
                className="w-full border-1 rounded-[5px] h-[40px] px-[5px] outline-none"
                placeholder="Email"
                value={registerForm.gmail}
                onChange={handleChange}
              />
              <div className=" h-[40px] flex items-center border-1 rounded-[5px] pl-[10px] ">
                <input
                  id="password"
                  name="password"
                  className=" text-[0.9rem] outline-none flex-1"
                  type="password"
                  placeholder="Nhập Mật khẩu"
                  required
                  value={registerForm.password}
                  onChange={handleChange}
                />
                <div
                  className="w-[30px] h-[30px] flex items-center justify-center cursor-pointer"
                  onClick={handleShowPassword}
                >
                  {showPassword ? (
                    <i className="fa-solid fa-eye-slash text-text-dark-300"></i>
                  ) : (
                    <i className="fa-solid fa-eye text-text-dark-300"></i>
                  )}
                </div>
              </div>
              <div className=" h-[40px] flex items-center border-1 rounded-[5px] pl-[10px] ">
                <input
                  id="comfirmPassword"
                  name="confirmPassword"
                  className=" text-[0.9rem] outline-none flex-1"
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  required
                  value={registerForm.confirmPassword}
                  onChange={handleChange}
                />
                <div
                  className="w-[30px] h-[30px] flex items-center justify-center cursor-pointer"
                  onClick={handleShowConfirmPassword}
                >
                  {showConfirmPassword ? (
                    <i className="fa-solid fa-eye-slash text-text-dark-300"></i>
                  ) : (
                    <i className="fa-solid fa-eye text-text-dark-300"></i>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-[10px] border-1 px-[20px] py-[7px] rounded-[5px] mt-[10px] text-[1rem] font-Nunito font-bold bg-bg-btn-add text-text-light"
              >
                Đăng ký
              </button>
            </form>
            <div className="h-[1px] bg-text-red w-[60%]"></div>
            <button
              className="w-full flex items-center justify-center gap-[10px] border-1 px-[20px] py-[7px] rounded-[5px] text-[1rem] font-Nunito font-bold"
              onClick={handleLoginWithGoogle}
            >
              <i className="fa-brands fa-google text-[1.2rem]"></i>
              <p> Đăng ký với Google</p>
            </button>

            <div className="w-full flex items-center justify-center py-[10px] gap-[5px]">
              <span>Bạn đã có tài khoản? </span>
              <Link to="/login">
                <button className="border-none outline-none bg-bg-light font-bold hover:text-bg-btn-add">
                  Đăng nhập
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

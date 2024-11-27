import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { AuthContext } from "../context/AuthProvider";
import { useContext, useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { graphQLRequest } from "../utils/request";
import { loginUser } from "../api/index";

const Login = () => {
  const auth = getAuth();
  const { user } = useContext(AuthContext);
  const [loginForm, setLoginForm] = useState({
    gmail: "",
    password: "",
  });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => setShowPassword(!showPassword);

  useEffect(() => {
    showPassword
      ? (document.getElementById("password").type = "text")
      : (document.getElementById("password").type = "password");
  }, [showPassword]);

  const handleLoginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();

    try {
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
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    const { gmail, password } = loginForm;

    if (!gmail || !password) {
      return alert("Vui lòng điền đầy đủ email và mật khẩu!");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(gmail)) {
      return alert("Email không hợp lệ. Vui lòng kiểm tra lại!");
    }

    try {
      const response = await loginUser(loginForm);

      if (response?.accessToken) {
        localStorage.setItem("accessToken", response.accessToken);
        window.location.reload();
      } else {
        alert("Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Login failed:", error);

      if (error.response && error.response.status === 401) {
        alert("Sai email hoặc mật khẩu. Vui lòng thử lại!");
      } else {
        alert("Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại!");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      navigate("/");
    } else {
      console.log("No token found");
    }
  }, [navigate]);

  return (
    <div className="auth-bg w-full h-[100vh] flex items-center justify-center bg-text-dark-200 gap-[50px] px-[20px]">
      <div className="sm:w-[50%] w-full flex sm:flex-row items-center flex-col gap-[50px]">
        <div className="sm:w-[50%] w-full h-[190px] flex flex-col justify-center items-center uppercase font-Nunito text-center text-text-light rounded-[10px] bg-box-shadow pb-[50px]">
          <h1 className="text-[3rem] font-extrabold"> Task Views</h1>
          <p className="text-[1.2rem] font-medium">
            Quản lý công việc dễ dàng hơn với TaskViews{" "}
          </p>
        </div>
        <div className="sm:w-[30%] w-full min-w-[350px] flex flex-col items-center justify-center gap-[20px]">
          <div className="w-full flex flex-col justify-center items-center gap-[20px] py-[10px] px-[20px] bg-bg-light rounded-[5px]">
            <h1 className="text-[1.2rem] font-Nunito font-bold">Đăng nhập</h1>
            <form
              onSubmit={handleLogin}
              className="w-full flex flex-col gap-[20px] text-[0.9rem]"
            >
              <input
                name="gmail"
                type="email"
                className="w-full border-1 rounded-[5px] h-[40px] px-[5px] outline-none"
                placeholder="email"
                value={loginForm.gmail}
                onChange={handleChange}
              />
              <div className=" h-[40px] flex items-center border-1 rounded-[5px] pl-[10px] ">
                <input
                  id="password"
                  className=" text-[0.9rem] outline-none flex-1"
                  name="password"
                  type="password"
                  placeholder="Nhập Mật khẩu"
                  required
                  value={loginForm.password}
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

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-[10px] border-1 px-[20px] py-[7px] rounded-[5px] mt-[10px] text-[1rem] font-Nunito font-bold bg-bg-btn-add text-text-light"
              >
                Đăng nhập
              </button>
            </form>
            <div className="h-[1px] bg-text-red w-[60%]"></div>
            <button
              className="w-full flex items-center justify-center gap-[10px] border-1 px-[20px] py-[7px] rounded-[5px] text-[1rem] font-Nunito font-bold"
              onClick={handleLoginWithGoogle}
            >
              <i className="fa-brands fa-google text-[1.2rem]"></i>
              <p> Đăng nhập với Google</p>
            </button>

            <div className="w-full flex items-center justify-center py-[10px] gap-[5px]">
              <span>Bạn chưa có tài khoản? </span>
              <Link to="/register">
                <button className="border-none outline-none bg-bg-light font-bold hover:text-bg-btn-add">
                  Đăng ký
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

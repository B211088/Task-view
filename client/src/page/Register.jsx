import { useContext, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { graphQLRequest } from "../utils/request";

const Register = () => {
  const { registerUser } = useContext(AuthContext);
  const [registerForm, setRegisterForm] = useState({
    name: "",
    gmail: "",
    password: "",
    confirmPassword: "",
  });
  const auth = getAuth();
  const { user } = useContext(AuthContext);

  console.log(user);

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

  const handleRegister = async (e) => {
    e.preventDefault();
    if (
      !registerForm.name ||
      !registerForm.gmail ||
      !registerForm.password ||
      !registerForm.confirmPassword
    ) {
      alert("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      alert("Mật khẩu và xác nhận mật khẩu không khớp.");
      return;
    }
  };

  return (
    <div className="auth-bg w-full h-[100vh] flex items-center justify-center bg-text-dark-200 gap-[50px] px-[20px]">
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
              <input
                type="password"
                name="password"
                className="w-full border-1 rounded-[5px] h-[40px] px-[5px] outline-none"
                placeholder="Mật khẩu"
                value={registerForm.password}
                onChange={handleChange}
              />
              <input
                type="password"
                name="confirmPassword"
                className="w-full border-1 rounded-[5px] h-[40px] px-[5px] outline-none"
                placeholder="Nhập lại mật khẩu"
                value={registerForm.confirmPassword}
                onChange={handleChange}
              />
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

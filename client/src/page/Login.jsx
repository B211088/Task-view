import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { AuthContext } from "../context/AuthProvider";
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { graphQLRequest } from "../utils/request";

const Login = () => {
  const auth = getAuth();
  const { user } = useContext(AuthContext);

  const handleLoginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();

    const {
      user: { uid, displayName, email },
    } = await signInWithPopup(auth, provider);

    console.log("Google Provider:", provider);
    console.log("User Info:", { uid, displayName, email });

    const { data } = await graphQLRequest({
      query: `mutation register($uid: String!, $name: String!, $gmail: String!) {
        register(uid: $uid, name: $name, gmail: $gmail) {
          uid
          name
          gmail
        }}`,
      variables: { uid, name: displayName, gmail: email },
    });

    console.log("register response:", { data });
  };

  if (localStorage.getItem("accessToken")) {
    return <Navigate to="/" />;
  }

  return (
    <div className="w-full h-[100vh] flex items-center justify-center">
      <div className="w-[20%] h-[200px] flex flex-col items-center justify-center gap-[20px]">
        <h1 className="text-[1.2rem]">Login</h1>
        <button
          className="border-1 px-[20px] py-[5px] rounded-[5px] text-[1rem] font-Nunito font-bold"
          onClick={handleLoginWithGoogle}
        >
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default Login;

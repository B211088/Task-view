import { createContext, useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Loading from "../page/Loading";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});

  const auth = getAuth();

  const navigate = useNavigate();
  const [isLoading, setisLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onIdTokenChanged((user) => {
      if (user?.uid) {
        setUser(user);
        if (user.accessToken !== localStorage.getItem("accessToken")) {
          localStorage.setItem("accessToken", user.accessToken);
          window.location.reload();
        }
        setisLoading(false);
        return;
      }

      setisLoading(false);
      setUser({});
      localStorage.clear();
      navigate("/login");
    });

    return () => {
      unsubscribe();
    };
  }, [auth]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {isLoading ? <Loading /> : children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

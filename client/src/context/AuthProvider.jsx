import { createContext, useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Loading from "../page/Loading";
import { getUserData } from "../api";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});

  const auth = getAuth();

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const unsubscribe = auth.onIdTokenChanged(async (firebaseUser) => {
        if (firebaseUser?.uid) {
          if (
            firebaseUser.accessToken !== localStorage.getItem("accessToken")
          ) {
            localStorage.setItem("accessToken", firebaseUser.accessToken);
            window.location.reload();
          }
          setUser(firebaseUser);
          setIsLoading(false);
          return;
        }

        const token = localStorage.getItem("accessToken");

        if (token) {
          try {
            const userData = await getUserData(token);
           

            if (userData?.user) {
              const { name, gmail } = userData.user;
              setUser({
                displayName: name || "",
                photoURL: "",
                auth: null,
                gmail,
              });

              localStorage.setItem("accessToken", token);
            }
             navigate("/");
            setIsLoading(false);
            return;
          } catch (error) {
            console.error("Failed to fetch user data:", error);
            setIsLoading(false);
          }
        }

        setIsLoading(false);
        setUser(null);
        localStorage.clear();
        navigate("/login");
      });

      return () => unsubscribe();
    };

    checkAuth();
  }, [auth, navigate]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {isLoading ? <Loading /> : children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

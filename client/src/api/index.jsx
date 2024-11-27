import axios from "axios";

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/auth/register",
      userData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/auth/login",
      userData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserData = async (token) => {
  try {
    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.get("http://localhost:5000/api/auth", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

import axios from "axios";
import { GRAPHQL_SERVER } from "../utils/constants";

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(
      `${GRAPHQL_SERVER}/api/auth/register`,
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
      `${GRAPHQL_SERVER}/api/auth/login`,
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

    const response = await axios.get(`${GRAPHQL_SERVER}/api/auth`, {
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

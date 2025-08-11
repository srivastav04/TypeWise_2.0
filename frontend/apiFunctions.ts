import axios from "axios";
import { FormValues } from "./pageComponents/LoginForm";

const URL = process.env.NEXT_PUBLIC_URL;
export const handleLogin = async (data: FormValues) => {
  try {
    const res = await axios.post(`${URL}/auth/login`, data, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    return res.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

export const handleSignUp = async (data: FormValues) => {
  try {
    const res = await axios.post(`${URL}/auth/signup`, data, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    return res.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

export const handleLogout = async () => {
  await axios.post(
    `${URL}/auth/logout`,
    {},
    {
      withCredentials: true,
    }
  );
};

export const handleData = async (data: any) => {
  await axios.post(`${URL}/user/data`, data, {
    withCredentials: true,
  });
};

export const handleGetData = async () => {
  const res = await axios.get(`${URL}/user/data`, {
    withCredentials: true,
  });

  return res.data.data;
};

export const searchUsers = async (query: string) => {
  const res = await axios.get(`${URL}/user/search`, {
    params: { query },
  });

  return res.data;
};

export const getUserData = async (userId: any) => {
  const res = await axios.get(`${URL}/user/data/${userId}`);

  return res.data.data;
};

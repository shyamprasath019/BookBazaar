import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080", // backend server URL
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["x-auth-token"] = token;
  }
  return config;
});

export default instance;

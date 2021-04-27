import axios from "axios";
import urlConstants from "../util/urlConstants";
import router from "../routers";

// api service
const ApiHelper = axios.create({
  baseURL: urlConstants.BASE_URL,
});

// Add a request interceptor
ApiHelper.interceptors.request.use(
  (config) => {
    let jwtToken = localStorage.getItem("jwtToken");
    if (jwtToken) {
      config.headers["Authorization"] = "Bearer " + jwtToken;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

ApiHelper.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error == "Error: Network Error") {
      router.push("/no-connection");
      localStorage.setItem("checkOffline", "true");
      return Promise.reject(error);
    }
    if (error.response.status === 403) {
      router.push("/no-connection");
      localStorage.setItem("checkOffline", "true");
      return Promise.reject(error);
    }
    if (error.response.status === 401) {
      router.push("/error");
      return Promise.reject(error);
    }
    if (error.response.status !== 200) {
      return error.response;
    }
  }
);

export default ApiHelper;

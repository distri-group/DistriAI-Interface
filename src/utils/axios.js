import axios from "axios";
import webconfig from "@/webconfig.js";
import { enqueueSnackbar } from "notistack";

const instance = axios.create({
  baseURL: webconfig.apiUrl + "/index-api",
  timeout: 5000,
});
instance.interceptors.response.use(
  (response) => {
    const responseData = response.data;
    if (responseData.Code === 0) {
      const errorMessage = responseData.Msg || "Request Failed";
      throw new Error(errorMessage);
    }
    return responseData.Data;
  },
  (error) => {
    if (error.response) {
      const errorMessage = error.response.data.message || "Request Failed";
      enqueueSnackbar(errorMessage, { variant: "error" });
    } else if (error.request) {
      enqueueSnackbar("Request failed. Please check your network connection.", {
        variant: "error",
      });
    } else {
      enqueueSnackbar("Unknown error occured.", { variant: "error" });
    }
    return Promise.reject(error);
  }
);

export default instance;

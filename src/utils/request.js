import _ from "lodash";
import * as util from "../utils";

// const baseUrl = process.env.REACT_APP_BASE_API + "";
import webconfig from "../webconfig";
import { formdataify } from "../utils";
const baseUrl = webconfig.apiUrl;

let timer = null;
const request = {
  /**
   * @param url
   * @param options
   * @returns {Promise<unknown>}
   */
  request: function (url, options = {}) {
    url = baseUrl + url;
    if (!options.method) options.method = "get";
    return new Promise((resolve, reject) => {
      fetch(url, options)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          // 防抖
          clearTimeout(timer);
          timer = setTimeout(() => {
            console.log(error);
            util.showError("Network Error.Please refresh page later.");
          }, 500);
          // resolve({ code: 503, msg: "网络错误！" });
          reject(error);
        });
    });
  },
  /**
   * @param url
   * @param options
   * @returns {Promise<void>}
   */
  get: async function (
    url,
    options = {
      method: "get",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      params: {},
    }
  ) {
    options = {
      method: "get",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      ...options,
    };
    const queryParams = new URLSearchParams(options.params); // 将参数对象转换为 URLSearchParams
    // 如果有参数存在，则将参数附加到 URL 中
    if (Object.keys(options.params).length > 0) {
      url = `${url}?${queryParams.toString()}`;
    }
    if (localStorage.getItem("token")) {
      options.headers["token"] = localStorage.getItem("token");
    }
    return this.request(url, options);
  },
  /**
   * @param url
   * @param options
   * @returns {Promise<void>}
   */
  post: async function (url, options = { method: "post" }) {
    options.method = "post";
    if (!options.headers) {
      options.headers = { "Content-Type": "application/json" };
    }
    if (options.headers["Content-Type"] === "multipart/form-data") {
      options.body = options.data;
    } else {
      options.headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(options.data);
    }
    if (localStorage.getItem("token")) {
      options.headers["token"] = localStorage.getItem("token");
    }
    return this.request(url, options);
  },
  /**
   * @param url
   * @param options
   * @returns {Promise<void>}
   */
  put: async function (url, options = { method: "put" }) {
    options.method = "put";
    if (!options.headers) {
      options.headers = { "Content-Type": "application/json" };
    }
    if (options.headers["Content-Type"] === "multipart/form-data") {
      options.body = formdataify(options.data);
    } else {
      options.headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(options.data);
    }
    if (localStorage.getItem("token")) {
      options.headers["token"] = localStorage.getItem("token");
    }
    return this.request(url, options);
  },
  delete: async function (url, options = { method: "delete" }) {
    options.method = "delete";
    if (!options.headers) {
      options.headers = { "Content-Type": "application/json" };
    }
    if (options.headers["Content-Type"] === "multipart/form-data") {
      options.body = formdataify(options.data);
    } else {
      options.headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(options.data);
    }
    if (localStorage.getItem("token")) {
      options.headers["token"] = localStorage.getItem("token");
    }
    return this.request(url, options);
  },
};

export default request;

import webconfig from "../webconfig";
import { formdataify } from "../utils";
const baseUrl = webconfig.apiUrl;

const request = {
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
          reject(error);
        });
    });
  },
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
    const queryParams = new URLSearchParams(options.params);
    if (Object.keys(options.params).length > 0) {
      url = `${url}?${queryParams.toString()}`;
    }
    if (localStorage.getItem("token")) {
      options.headers["token"] = localStorage.getItem("token");
    }
    return this.request(url, options);
  },
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

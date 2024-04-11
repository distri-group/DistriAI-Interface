import axios from "@/utils/axios.js";
import { login, formatItem } from "./model.js";

const baseUrl = "/dataset";

export const getDatasetList = async (pageIndex, pageSize, filter) => {
  const apiUrl = baseUrl + "/list";
  const body = {
    Page: pageIndex,
    PageSize: pageSize,
  };
  if (filter) {
    Object.entries(filter).forEach(([key, value]) => {
      if (value !== "all") {
        body[key] = value;
      }
    });
  }
  try {
    const res = await axios.post(apiUrl, body);
    for (let dataset of res.List) {
      dataset = formatItem(dataset);
      dataset.size = sizes[dataset.size - 1];
    }
    return res;
  } catch (error) {
    throw error;
  }
};

export const getDatasetDetail = async (owner, name) => {
  const apiUrl = baseUrl + `/${owner}/${name}`;
  try {
    const res = await axios.get(apiUrl);
    return formatItem(res);
  } catch (error) {
    throw error;
  }
};

export const createDataset = async (dataset, publicKey) => {
  const apiUrl = baseUrl + "/create";
  const token = await login(publicKey);
  const headers = {
    Authorization: token,
  };
  try {
    const res = await axios.post(apiUrl, dataset, { headers });
    return res;
  } catch (error) {
    throw error;
  }
};

export const sizes = ["<1k", "1k-10k", "10k-100k", "100k-1M", ">1M"];

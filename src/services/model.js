import request from "../utils/request";
import types from "../services/types.json";

export const getModelList = async (pageIndex, filter) => {
  try {
    let apiUrl = "/index-api/model/list";
    let options = {
      data: {
        Page: pageIndex,
        PageSize: 10,
      },
    };
    if (filter) {
      for (let k in filter) {
        let v = filter[k];
        if (v !== "all") {
          options.data[k] = v;
        }
      }
    }
    let ret = await request.post(apiUrl, options);
    if (ret.Msg !== "success") {
      return null;
    }
    let list = ret.Data.List;
    for (let model of list) {
      formatTags(model);
    }
    return { list: ret.Data.List, total: ret.Data.Total };
  } catch (e) {
    throw e;
  }
};

export const getModelDetail = async (id) => {
  try {
    let apiUrl = `/index-api/model/${id}`;
    let ret = await request.get(apiUrl);
    if (ret.Msg !== "success") {
      return null;
    }
    return formatTags(ret.Data);
  } catch (e) {
    throw e;
  }
};

export const createModel = async (model) => {
  try {
    let apiUrl = "/index-api/model/create";
    let options = {
      data: {},
    };
    for (let k in model) {
      let v = model[k];
      options.data[k] = v;
    }
    let ret = await request.post(apiUrl, options);
    if (ret.Msg !== "success") {
      return null;
    }
    return ret;
  } catch (e) {
    throw e;
  }
};

export const generatePresignUrl = async (id, path) => {
  try {
    let apiUrl = "/index-api/model/presign";
    let options = {
      data: {
        Id: id,
        FilePath: path,
        Method: "PUT",
      },
    };
    let ret = await request.post(apiUrl, options);
    if (ret.Msg !== "success") {
      return null;
    }
    return ret.Data;
  } catch (e) {
    throw e;
  }
};

export const fileUpload = async (url, file) => {
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Length": file.size,
      },
      body: file,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload file (${response.status})`);
    }

    const responseBody = await response.text();
    return responseBody;
  } catch (error) {
    throw error;
  }
};

const formatTags = (model) => {
  if (model.Tags.includes(",")) {
    model.Tags = model.Tags.split(",");
  } else if (!model.Tags.length) model.Tags = null;
  else {
    model.Tags = [model.Tags];
  }
  model.license = licenses[model.License - 1];
  model.type1 = types[model.Type1 - 1].title;
  model.type2 = types[model.Type1 - 1].items[model.Type2 - 1];
  model.expanded = false;
  return model;
};

export const frameworks = [
  "Pytorch",
  "Tensorflow",
  "Keras",
  "MXNet",
  "PaddlePaddle",
  "Others",
];
export const licenses = [
  "Apache License 2.0",
  "MIT License",
  "GPL-2.0",
  "GPL-3.0",
  "LGPL-2.1",
  "LGPL-3.0",
  "OpenRAlL license family",
  "BigScience OpenRAIL-M",
  "CreativeML OpenRAIL-M",
  "AFL-3.0",
  "ECL-2.0",
  "CC-BY-4.0",
  "CC-BY-NC-4.0",
  "CC-BY-NC-ND",
  "Others",
];

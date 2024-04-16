import { create } from "kubo-rpc-client";

export default function useIpfs() {
  const client = create({ url: "https://ipfs.distri.ai/rpc/api/v0" });

  // File upload
  const fileUpload = async (file, path) => {
    file = {
      path,
      content: file,
    };
    const res = await client.add(file);
    return res;
  };

  // Folder upload
  const folderUpload = async (files) => {
    let list = Array.from(files);
    list = list.map((file) => ({
      path: "/" + file.webkitRelativePath,
      content: file,
    }));
    const uploadResponse = [];
    for await (const res of client.addAll(list)) {
      uploadResponse.push(res);
    }
    return uploadResponse;
  };

  // Create folder
  const createFolder = async (path, name) => {
    let createPath;
    if (name) createPath = `${path}/${name}`;
    else createPath = path;
    const res = await client.files.mkdir(createPath, { parents: true });
    return res;
  };

  // Check folder
  const getFolderList = async (cid) => {
    const files = [];
    for await (const item of client.ls(cid)) {
      files.push(item);
    }
    return files;
  };

  // Download file
  const fileDownload = async (cid) => {
    const res = await client.read(cid);
    return res;
  };

  const methods = {
    fileUpload,
    folderUpload,
    fileDownload,
    getFolderList,
    createFolder,
  };

  return { client, methods };
}

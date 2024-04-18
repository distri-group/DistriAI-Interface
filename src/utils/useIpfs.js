import { create } from "kubo-rpc-client";

export default function useIpfs() {
  const client = create({ url: "https://ipfs.distri.ai/rpc/api/v0" });

  // File upload
  const fileUpload = async (path, file, onProgress) => {
    file = {
      path: file.name,
      content: file,
    };
    try {
      const res = await client.add(file, { progress: onProgress });
      await client.files.cp(res.cid, path + "/" + res.path, {
        parents: true,
      });
      return res;
    } catch (error) {
      throw error;
    }
  };

  // Folder upload
  const folderUpload = async (path, files, onProgress) => {
    let list = Array.from(files);
    list = list.map((file) => ({
      path: file.webkitRelativePath,
      content: file,
    }));
    const uploadResponse = [];
    try {
      for await (const res of client.addAll(list, {
        parents: true,
        progress: onProgress,
      })) {
        try {
          await client.files.cp(res.cid, path + "/" + res.path, {
            parents: true,
          });
        } catch (error) {
          if (!error.message.includes("already has")) {
            throw error;
          }
        }

        uploadResponse.push(res);
      }
      return uploadResponse;
    } catch (error) {
      if (!error.message.includes("exist")) {
        throw error;
      }
    }
  };

  // Create folder
  const createFolder = async (path, name) => {
    let createPath;
    if (name) createPath = `${path}/${name}`;
    else createPath = path;
    try {
      const res = await client.files.mkdir(createPath, { parents: true });
      return res;
    } catch (error) {
      throw error;
    }
  };

  // Check folder
  const getFolderList = async (path) => {
    const files = [];
    try {
      const res = await client.files.stat(path);
      for await (const item of client.files.ls(path)) {
        files.push(item);
      }
      files.sort((a, b) => {
        if (a.type === "directory" && b.type === "file") {
          return -1;
        } else if (a.type === "file" && b.type === "directory") {
          return 1;
        } else {
          return 0;
        }
      });
      return { files, cid: res.cid.toString() };
    } catch (error) {
      throw error;
    }
  };

  // Delete file from folder
  const fileDelete = async (path, recursive) => {
    try {
      const res = await client.files.rm(path, { recursive });
      return res;
    } catch (error) {
      throw error;
    }
  };

  // JSON upload
  const jsonUpload = async (object) => {
    try {
      const res = await client.add(JSON.stringify(object));
      return res;
    } catch (error) {
      throw error;
    }
  };

  const methods = {
    fileUpload,
    fileDelete,
    folderUpload,
    getFolderList,
    createFolder,
    jsonUpload,
  };

  return { client, methods };
}

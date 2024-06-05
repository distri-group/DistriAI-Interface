import { create } from "kubo-rpc-client";

export default function useIpfs() {
  const client = create({ url: "https://ipfs.distri.ai/rpc/api/v0" });

  // File upload
  const fileUpload = async (path, file, onProgress) => {
     // Create a file item object, including the file name and content
    let fileItem = {
      path: file.name,
      content: file,
    };
    // Create an upload item object to record file size, progress, and a random number for progress adjustment
    let item = {
      size: file.size,
      progress: 0,
      random: parseFloat((Math.random() * 5 + 0.01).toFixed(2)),
    };
    // Call the client's add file method to upload the file with a progress callback
    const res = await client.add(fileItem, {
      progress: (bytes) => {
        // Update the upload progress
        item.progress = handleProgress(bytes, item.size);
        // Invoke the progress callback, subtracting the random number to adjust the display of progress
        onProgress(
          item.progress - item.random <= 0
            ? 0
            : (item.progress - item.random).toFixed(2)
        );
      },
    });
    // Move the uploaded file to the specified path
    await client.files.cp(res.cid, `${path}/${res.path}`, {
      parents: true,
    });
// Upload completed, callback to set progress to 100
    onProgress(100);
    // Return the upload result
    return res;
  };

  // Folder upload
  const folderUpload = async (path, files, onProgress) => {
    // Converts FileList to an array and constructs a list of objects with file paths and content
    let list = Array.from(files);
    list = list.map((file) => ({
      path: file.webkitRelativePath,
      content: file,
    }));
    const uploadResponse = [...list];
    uploadResponse.forEach((item) => {
      item.progress = 0;
      item.random = parseFloat((Math.random() * 5 + 0.01).toFixed(2));
    });
    try {
      for await (const res of client.addAll(list, {
        parents: true,
        progress: (bytes, path) => {
          let currentItem = uploadResponse.find((item) => item.path === path);

          currentItem.progress = handleProgress(
            bytes,
            currentItem.content.size
          );
          onProgress(
            currentItem.progress - currentItem.random <= 0
              ? 0
              : currentItem.progress - currentItem.random,
            path
          );
        },
      })) {
        try {
          await client.files.cp(res.cid, `${path}/${res.path}`, {
            parents: true,
          });
          onProgress(100, res.path);
        } catch (error) {
          if (!error.message.includes("already has")) {
            throw error;
          }
        }
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
    const res = await client.files.mkdir(createPath, { parents: true });
    return res;
  };

  // Check folder
  const getFolderList = async (path) => {
    const files = [];
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
  };

  // Delete file from folder
  const fileDelete = async (path, recursive) => {
    const res = await client.files.rm(path, { recursive });
    return res;
  };

  // JSON upload
  const jsonUpload = async (object) => {
    const res = await client.add(JSON.stringify(object));
    return res;
  };

  const handleProgress = (bytes, total) => {
    const progress = Math.floor((bytes / total) * 100 * 100) / 100;
    return progress;
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

import { Folder, InsertDriveFile } from "@mui/icons-material";
import {
  Button,
  Box,
  Breadcrumbs,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Modal,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import styled from "styled-components";
import prettyBytes from "pretty-bytes";
import React, { useEffect, useMemo, useState } from "react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import useIpfs from "@/utils/useIpfs.js";
import { useSnackbar } from "notistack";
import { checkDeployable, downloadItem } from "@/services/model.js";
import { useClearCache } from "./ClearCacheProvider";

function FileList({
  className,
  item,
  type,
  onSelect,
  onReload,
  disableUpload,
}) {
  const initialPrefix = useMemo(
    () => `/distri.ai/${type}/${item.Owner}/${item.Name}`,
    [item, type]
  );
  const wallet = useAnchorWallet();
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [folderCid, setFolderCid] = useState("");
  const [createFolderDialog, setDialog] = useState(false);
  const [creating, setCreating] = useState(false);
  const [folderName, setName] = useState("");
  const [filesToUpload, setFiles] = useState([]);
  const [uploadProgress, setProgress] = useState([]);
  const [selectedItems, setItems] = useState([]);
  const [currentPrefix, setPrefix] = useState(initialPrefix);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [deployFile, setDeployFile] = useState(null);
  const [existedDialog, setExistedDialog] = useState(false);
  const [deleteFile, setDeleteFile] = useState("");
  const deployPath = useMemo(
    () => `${initialPrefix}/deployment`,
    [initialPrefix]
  );
  const { methods } = useIpfs();
  const { enqueueSnackbar } = useSnackbar();
  const { clearCache } = useClearCache();

  // Go back to parent folder
  const getParentPrefix = (prefix) => {
    const lastIndex = prefix.lastIndexOf("/", prefix.length - 2);
    if (lastIndex === -1) {
      return "";
    }
    const parentPrefix = prefix.slice(0, lastIndex);
    return parentPrefix;
  };

  // Load file list
  const loadFiles = async (prefix) => {
    setLoading(true);
    try {
      let { files: list, cid } = await methods.getFolderList(prefix);
      if (wallet?.publicKey && wallet.publicKey.toString() !== item.Owner) {
        list = list.filter(
          (file) => !(file.type === "directory" && file.name === "deployment")
        );
      }
      setList(list);
      setFolderCid(cid);
    } catch (error) {
      if (error.message === "file does not exist" && prefix === initialPrefix) {
        await methods.createFolder(prefix);
      }
    }
    setLoading(false);
  };

  // Create folder
  const handleFolderCreate = async () => {
    setCreating(true);
    try {
      await methods.createFolder(currentPrefix, folderName);
      setName("");
      setDialog(false);
      await loadFiles(currentPrefix);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
    setCreating(false);
  };

  // Delete file/folder
  const handleDelete = async (path) => {
    try {
      await methods.fileDelete(path, true);
      await loadFiles(currentPrefix);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  const handleSelection = async (item) => {
    const selectedIndex = selectedItems.findIndex(
      (selectedItem) => selectedItem.cid === item.cid.toString()
    );
    const selectedItem = {
      name: item.name,
      cid: item.cid.toString(),
    };
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = [...selectedItems, selectedItem];
    } else {
      newSelected = selectedItems.filter(
        (selectedItem) => selectedItem.cid !== item.cid.toString()
      );
    }
    setItems(newSelected);
  };

  // Change prefix
  const handleFolderNavigate = (index) => {
    let suffix;
    if (!index) {
      return setPrefix(initialPrefix);
    }
    if (index > 0) {
      suffix = breadcrumbs.slice(0, index + 1).join("/");
    } else suffix = breadcrumbs[index];
    setPrefix(`${initialPrefix}/${suffix}`);
  };

  const handleUploadProgress = (bytes, total) => {
    const progress = Math.floor((bytes / total) * 100 * 100) / 100;
    return progress;
  };

  // Deployment script upload
  const handleDeploymentFileUpload = async (existed) => {
    if (existed) {
      await methods.fileDelete(deployPath, true);
    }
    enqueueSnackbar("Start uploading", { variant: "info" });
    try {
      await methods.fileUpload(deployPath, deployFile, (bytes) => {
        const progress = handleUploadProgress(bytes, deployFile.size);
        setProgress((prevState) => {
          const newProgress = [...prevState];
          newProgress[0].progress = progress;
          return newProgress;
        });
      });
      enqueueSnackbar("Upload success", { variant: "success" });
      await loadFiles(currentPrefix);
      setDeployFile(null);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
    if (!existed) {
      await onReload();
    }
    if (existedDialog) {
      setExistedDialog(false);
    }
  };

  // Download file
  const handleDownload = async (event) => {
    event.preventDefault();
    try {
      clearCache();
      await downloadItem(type, item.Owner, item.Name);
    } catch (error) {}
    const downloadLink = event.target.closest("a");
    if (downloadLink) {
      const downloadUrl = downloadLink.getAttribute("href");
      const fileName = downloadLink.getAttribute("download");
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  useEffect(() => {
    setPrefix(initialPrefix);
  }, [initialPrefix]);
  useEffect(() => {
    if (currentPrefix) {
      loadFiles(currentPrefix);
      if (currentPrefix !== initialPrefix) {
        const suffix = currentPrefix.split(initialPrefix)[1];
        const items = suffix.split("/").slice(1);
        setBreadcrumbs(items);
      } else {
        setBreadcrumbs([]);
      }
    }
    // eslint-disable-next-line
  }, [currentPrefix]);

  useEffect(() => {
    if (onSelect) {
      onSelect(selectedItems);
    }
    // eslint-disable-next-line
  }, [selectedItems]);
  useEffect(() => {
    const handleUpload = async () => {
      enqueueSnackbar("Start uploading", { variant: "info" });
      try {
        if (filesToUpload.length > 1) {
          await methods.folderUpload(
            currentPrefix,
            filesToUpload,
            (progress, path) => {
              setProgress((prevState) => {
                const newProgress = prevState.map((item) => {
                  if (item.path === path) {
                    return {
                      ...item,
                      progress,
                    };
                  }
                  return item;
                });
                return newProgress;
              });
            }
          );
        } else {
          await methods.fileUpload(
            currentPrefix,
            filesToUpload[0],
            (progress) => {
              setProgress((prevState) => {
                const newProgress = [...prevState];
                newProgress[0].progress = progress;
                return newProgress;
              });
            }
          );
        }
        enqueueSnackbar("Upload success", { variant: "success" });
      } catch (error) {
        enqueueSnackbar(error.message, { variant: "error" });
      }
      setFiles([]);
      await loadFiles(currentPrefix);
    };
    if (filesToUpload.length > 0) {
      setProgress(
        Array.from(filesToUpload).map((file) => ({
          path: file.webkitRelativePath || file.name,
          size: file.size,
          progress: 0,
        }))
      );
      handleUpload();
    }
    // eslint-disable-next-line
  }, [filesToUpload]);
  useEffect(() => {
    const handleDeploymentFile = async () => {
      const deployable = await checkDeployable(item);
      if (deployable) {
        setExistedDialog(true);
      } else {
        handleDeploymentFileUpload();
      }
    };
    if (deployFile) {
      setProgress([
        {
          path: deployFile.name,
          size: deployFile.size,
          progress: 0,
        },
      ]);
      handleDeploymentFile();
    }
    // eslint-disable-next-line
  }, [deployFile]);

  return (
    <div className={className}>
      <Stack direction="column">
        {loading ? (
          <Stack
            justifyContent="center"
            alignItems="center"
            style={{ width: "100%", height: 400 }}>
            <CircularProgress />
          </Stack>
        ) : (
          <TableContainer>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="end"
              className="controls">
              <div className="breadcrumbs">
                <Breadcrumbs
                  separator={<span style={{ color: "white" }}>/</span>}>
                  <span
                    className={`breadcrumb${
                      breadcrumbs.length > 0 ? " avail" : ""
                    }`}
                    onClick={() => handleFolderNavigate(0)}>
                    {item.Name}
                  </span>
                  {breadcrumbs.slice(0, -1).map((breadcrumb, index) => (
                    <span
                      key={index}
                      className="breadcrumb avail"
                      onClick={() => handleFolderNavigate(index)}>
                      {breadcrumb}
                    </span>
                  ))}
                  <span className="breadcrumb">{breadcrumbs.slice(-1)[0]}</span>
                </Breadcrumbs>
              </div>
              {wallet?.publicKey &&
                item.Owner === wallet.publicKey.toString() &&
                !(onSelect || disableUpload) && (
                  <Stack direction="row" justifyContent="right" spacing={3}>
                    <Button
                      className="white-btn"
                      style={{ width: 100 }}
                      component="label"
                      role={undefined}
                      tabIndex={-1}>
                      Add File
                      <input
                        type="file"
                        id="uploadFile"
                        style={{ display: "none" }}
                        onClick={(e) => (e.target.value = null)}
                        onChange={(e) => {
                          if (currentPrefix === deployPath) {
                            setDeployFile(e.target.files[0]);
                          } else {
                            setFiles(e.target.files);
                          }
                        }}
                      />
                    </Button>
                    <Button
                      className="white-btn"
                      style={{ width: 160 }}
                      disabled={currentPrefix === deployPath}
                      component="label"
                      role={undefined}
                      tabIndex={-1}>
                      Upload Folder
                      <input
                        type="file"
                        id="uploadFolder"
                        style={{ display: "none" }}
                        onClick={(e) => (e.target.value = null)}
                        onChange={(e) => setFiles(e.target.files)}
                        webkitdirectory="true"
                      />
                    </Button>
                    {type === "model" && (
                      <Button
                        className="white-btn"
                        style={{ width: 220 }}
                        component="label"
                        role={undefined}
                        tabIndex={-1}>
                        Add Deployment Script
                        <input
                          type="file"
                          id="uploadDeployment"
                          style={{ display: "none" }}
                          onClick={(e) => (e.target.value = null)}
                          onChange={(e) => setDeployFile(e.target.files[0])}
                        />
                      </Button>
                    )}
                    <Button
                      className="white-btn"
                      style={{ width: 120 }}
                      component="label"
                      onClick={() => setDialog(true)}>
                      Create Folder
                    </Button>
                  </Stack>
                )}
            </Stack>
            <Table className="file-table">
              <TableBody>
                {currentPrefix !== initialPrefix ? (
                  <TableRow>
                    {onSelect && <TableCell width="5%" />}
                    <TableCell>
                      <Folder style={{ color: "#959DA5" }} />
                      <span
                        onClick={() => {
                          setPrefix(getParentPrefix(currentPrefix));
                        }}
                        style={{ marginLeft: 8, cursor: "pointer" }}>
                        ..
                      </span>
                    </TableCell>
                    <TableCell />
                    <TableCell />
                  </TableRow>
                ) : (
                  list.length === 0 && (
                    <div className="empty">
                      <span style={{ color: "#898989" }}>No item yet</span>
                    </div>
                  )
                )}
                {list.map((file) => {
                  const isSelected =
                    selectedItems.findIndex(
                      (selectedItem) => file.cid.toString() === selectedItem.cid
                    ) !== -1;
                  return (
                    <TableRow key={file.name} selected={isSelected}>
                      {onSelect && (
                        <TableCell width="5%">
                          {file.type === "file" && (
                            <Checkbox
                              checked={isSelected}
                              onChange={() => handleSelection(file)}
                            />
                          )}
                        </TableCell>
                      )}
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="end">
                          {file.type === "file" ? (
                            <InsertDriveFile style={{ color: "#959DA5" }} />
                          ) : (
                            file.type === "directory" && (
                              <Folder style={{ color: "#959DA5" }} />
                            )
                          )}
                          <span
                            style={{
                              cursor: file.type === "directory" && "pointer",
                            }}
                            onClick={() =>
                              file.type === "directory" &&
                              setPrefix(`${currentPrefix}/${file.name}`)
                            }>
                            {file.name}
                          </span>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        {file.size !== 0 && (
                          <a
                            href={`https://ipfs.distri.ai/ipfs/${folderCid}/${file.name}`}
                            download={file.name}
                            onClick={handleDownload}>
                            <img
                              src="/img/download.png"
                              alt="download"
                              style={{
                                width: 17,
                                height: 17,
                              }}
                            />
                            <span className="size">
                              {prettyBytes(file.size)}
                            </span>
                          </a>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {wallet?.publicKey &&
                          item.Owner === wallet.publicKey.toString() &&
                          !(onSelect || disableUpload) &&
                          !(
                            file.type === "directory" &&
                            file.name === "deployment"
                          ) && (
                            <Button
                              className="white-btn"
                              style={{
                                height: 32,
                              }}
                              onClick={() =>
                                setDeleteFile(`${currentPrefix}/${file.name}`)
                              }>
                              Delete
                            </Button>
                          )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Stack>
      <Dialog open={createFolderDialog} fullWidth maxWidth="sm">
        <DialogTitle>Input folder name here:</DialogTitle>
        <DialogContent>
          <TextField
            value={folderName}
            onChange={(e) => setName(e.target.value)}
            InputProps={{
              style: {
                color: "black",
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            disabled={creating}
            className="default-btn"
            onClick={() => {
              setDialog(false);
              setName("");
            }}>
            Cancel
          </Button>
          <LoadingButton
            loading={creating}
            className="default-btn"
            onClick={handleFolderCreate}>
            {!creating && <span>Create</span>}
          </LoadingButton>
        </DialogActions>
      </Dialog>
      <Modal open={Boolean(filesToUpload.length)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 1000,
            maxHeight: 600,
            overflowY: "auto",
            bgcolor: "#00000b",
            p: 4,
            zIndex: 300,
            borderRadius: "8px",
            "&::-webkit-scrollbar": {
              width: 4,
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#059d5e",
              borderRadius: "65654px",
            },
          }}>
          <h2 style={{ textAlign: "center" }}>File uploading...</h2>
          {Array.from(uploadProgress).map((item) => (
            <React.Fragment key={item.cid}>
              <h3>{item.path}</h3>
              <Stack direction="row" spacing={2}>
                <LinearProgress
                  variant="determinate"
                  value={item.progress}
                  sx={{
                    width: "80%",
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: "#fff",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: "#bdff95",
                    },
                  }}
                />
                <span>{item.progress}%</span>
              </Stack>
            </React.Fragment>
          ))}
        </Box>
      </Modal>
      <Dialog open={existedDialog} fullWidth maxWidth="sm">
        <DialogTitle>Deployment script already existed</DialogTitle>
        <DialogContent>
          <p>
            You have uploaded a deployment script for your model.
            <br /> Are you willing to replace it with the file you uploaded just
            now?
          </p>
        </DialogContent>
        <DialogActions>
          <Button
            className="default-btn"
            onClick={() => {
              setExistedDialog(false);
              setDeployFile(null);
            }}>
            Cancel
          </Button>
          <Button
            className="default-btn"
            onClick={() => {
              handleDeploymentFileUpload(true);
            }}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteFile} fullWidth maxWidth="sm">
        <DialogTitle>Are you sure you want to delete the file?</DialogTitle>
        <DialogActions>
          <Button
            onClick={() => {
              handleDelete(deleteFile);
              setDeleteFile("");
            }}
            className="cbtn"
            style={{ width: 100 }}>
            Delete
          </Button>
          <Button
            onClick={() => setDeleteFile("")}
            className="cbtn"
            style={{ width: 100 }}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
export default styled(FileList)`
  a {
    color: white;
    display: flex;
    width: 100px;
    height: 100%;
    align-items: center;
  }
  .size {
    display: inline-block;
    margin-left: 8px;
  }
  .empty {
    width: 100%;
    height: 480px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .breadcrumbs {
    display: flex;
    align-items: center;
    .breadcrumb {
      color: white;
    }
    .breadcrumb.avail {
      color: #898989;
      cursor: pointer;
      &:hover {
        color: white;
        text-decoration: underline;
      }
    }
  }

  .controls {
    background: rgba(149, 157, 165, 0.16);
    padding: 16px 40px;
    height: 48px;
    border-radius: 0 8px 8px 8px;
  }
  .file-table {
    border-collapse: separate;
    border-spacing: 0 27px;
    tr {
      td {
        font-size: 18px;
        line-height: 26px;
        padding-bottom: 27px;
        border-bottom: 1px solid #898989;
        span {
          font-weight: 400;
          font-size: 18px;
          line-height: 26px;
        }
      }
    }
  }
`;

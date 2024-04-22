import { ArrowDownward, Folder, InsertDriveFile } from "@mui/icons-material";
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
import React, { useEffect, useState } from "react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import useIpfs from "@/utils/useIpfs.js";
import { useSnackbar } from "notistack";
import { checkDeployable } from "@/services/model.js";

function FileList({ className, item, type, onSelect, onReload }) {
  const [initialPrefix, setInitialPrefix] = useState(
    `/distri.ai/${type}/${item.Owner}/${item.Name}`
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
  const [currentPrefix, setPrefix] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [deployFile, setDeployFile] = useState(null);
  const [existedDialog, setExistedDialog] = useState(false);
  const { methods } = useIpfs();
  const { enqueueSnackbar } = useSnackbar();

  const getParentPrefix = (prefix) => {
    const lastIndex = prefix.lastIndexOf("/", prefix.length - 2);
    if (lastIndex === -1) {
      return "";
    }
    const parentPrefix = prefix.slice(0, lastIndex);
    return parentPrefix;
  };

  const loadFiles = async (prefix) => {
    setLoading(true);
    try {
      const { files: list, cid } = await methods.getFolderList(prefix);
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
  const handleFolderNavigate = (index) => {
    let suffix;
    if (index > 0) {
      suffix = breadcrumbs.slice(0, index + 1).join("/");
    } else suffix = breadcrumbs[index];
    setPrefix(initialPrefix + "/" + suffix);
  };
  const handleUploadProgress = (bytes, total) => {
    const progress = Math.floor((bytes / total) * 100 * 100) / 100;
    return progress;
  };
  const handleDeploymentFileUpload = async (existed) => {
    if (existed) {
      await methods.fileDelete(initialPrefix + "/deployment", true);
    }
    enqueueSnackbar("Start uploading", { variant: "info" });
    try {
      await methods.fileUpload(
        initialPrefix + "/deployment",
        deployFile,
        (bytes) => {
          const progress = handleUploadProgress(bytes, deployFile.size);
          setProgress((prevState) => {
            const newProgress = [...prevState];
            newProgress[0].progress = progress;
            return newProgress;
          });
        }
      );
      enqueueSnackbar("Upload success", { variant: "success" });
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
    setPrefix(initialPrefix);
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    const handleUpload = async () => {
      enqueueSnackbar("Start uploading", { variant: "info" });
      try {
        if (filesToUpload.length > 1) {
          await methods.folderUpload(
            currentPrefix,
            filesToUpload,
            (bytes, path) => {
              setProgress((prevState) => {
                const newProgress = prevState.map((item) => {
                  if (item.path === path) {
                    return {
                      ...item,
                      progress: handleUploadProgress(bytes, item.size),
                    };
                  }
                  return item;
                });
                return newProgress;
              });
            }
          );
        } else {
          await methods.fileUpload(currentPrefix, filesToUpload[0], (bytes) => {
            const progress = handleUploadProgress(bytes, filesToUpload[0].size);
            setProgress((prevState) => {
              const newProgress = [...prevState];
              newProgress[0].progress = progress;
              return newProgress;
            });
          });
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
  }, [deployFile]);
  useEffect(() => {
    setInitialPrefix(`/distri.ai/${type}/${item.Owner}/${item.Name}`);
    setPrefix(`/distri.ai/${type}/${item.Owner}/${item.Name}`);
  }, [item, type]);

  return (
    <div className={className}>
      <Stack direction="column">
        {loading ? (
          <CircularProgress />
        ) : (
          <TableContainer>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="bottom"
              style={{ padding: "0 16px" }}>
              <span>
                {breadcrumbs.length > 0 && (
                  <Breadcrumbs
                    separator={<span style={{ color: "white" }}>/</span>}>
                    {breadcrumbs.slice(0, -1).map((breadcrumb, index) => (
                      <span
                        key={index}
                        className="breadcrumb avail"
                        onClick={() => handleFolderNavigate(index)}>
                        {breadcrumb}
                      </span>
                    ))}
                    <span className="breadcrumb">
                      {breadcrumbs.slice(-1)[0]}
                    </span>
                  </Breadcrumbs>
                )}
              </span>
              {item.Owner === wallet.publicKey.toString() && !onSelect && (
                <Stack direction="row" justifyContent="right" spacing={2}>
                  <Button
                    className="cbtn"
                    style={{ width: 100 }}
                    component="label"
                    role={undefined}
                    tabIndex={-1}>
                    Upload File
                    <input
                      type="file"
                      id="uploadFile"
                      style={{ display: "none" }}
                      onClick={(e) => (e.target.value = null)}
                      onChange={(e) => setFiles(e.target.files)}
                    />
                  </Button>
                  <Button
                    className="cbtn"
                    style={{ width: 120 }}
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
                      className="cbtn"
                      style={{ width: 200 }}
                      component="label"
                      role={undefined}
                      tabIndex={-1}>
                      Upload Deployment Script
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
                    className="cbtn"
                    style={{ width: 120 }}
                    onClick={() => setDialog(true)}>
                    Create Folder
                  </Button>
                </Stack>
              )}
            </Stack>
            <Table>
              <TableBody>
                {currentPrefix !== initialPrefix ? (
                  <TableRow>
                    {onSelect && <TableCell width="5%" />}
                    <TableCell>
                      <Folder />
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
                  list.filter(
                    (item) =>
                      !(item.name === "deployment" && item.type === "directory")
                  ).length === 0 && (
                    <div className="empty">
                      <span style={{ color: "#797979" }}>No item yet</span>
                    </div>
                  )
                )}
                {list
                  .filter(
                    (file) =>
                      !(file.name === "deployment" && file.type === "directory")
                  )
                  .map((file) => {
                    const isSelected =
                      selectedItems.findIndex(
                        (selectedItem) =>
                          file.cid.toString() === selectedItem.cid
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
                          {file.type === "file" ? (
                            <InsertDriveFile />
                          ) : (
                            file.type === "directory" && <Folder />
                          )}
                          <span
                            style={{
                              marginLeft: 8,
                              cursor: file.type === "directory" && "pointer",
                            }}
                            onClick={() =>
                              file.type === "directory" &&
                              setPrefix(`${currentPrefix}/${file.name}`)
                            }>
                            {file.name}
                          </span>
                        </TableCell>
                        <TableCell>
                          {file.size !== 0 && (
                            <a
                              href={`https://ipfs.distri.ai/ipfs/${folderCid}/${file.name}`}
                              download={file.name}>
                              <span className="size">
                                {prettyBytes(file.size)}
                              </span>
                              <ArrowDownward />
                            </a>
                          )}
                        </TableCell>
                        <TableCell align="right">
                          {item.Owner === wallet.publicKey.toString() &&
                            !onSelect && (
                              <Button
                                className="default-btn"
                                onClick={() =>
                                  handleDelete(currentPrefix + "/" + file.name)
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
            {!creating && "Create"}
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
            overflowY: "scroll",
            bgcolor: "#00000b",
            p: 4,
            zIndex: 300,
            borderRadius: "8px",
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
    margin-right: 8px;
  }
  .empty {
    width: 100%;
    height: 480px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .breadcrumb {
    color: white;
  }
  .breadcrumb.avail {
    color: #797979;
    cursor: pointer;
    &:hover {
      color: white;
      text-decoration: underline;
    }
  }
`;

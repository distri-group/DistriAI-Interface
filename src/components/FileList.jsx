import { ArrowDownward, Folder, InsertDriveFile } from "@mui/icons-material";
import {
  Button,
  Breadcrumbs,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import { useEffect, useState } from "react";
import { create } from "kubo-rpc-client";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import useIpfs from "@/utils/useIpfs.js";
import { uniq, uniqBy } from "lodash";

function FileList({ className, item, type, onSelect }) {
  const initialPrefix = `/distri.ai/${type}/${item.Owner}/${item.Name}`;
  const wallet = useAnchorWallet();
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [createFolderDialog, setDialog] = useState(false);
  const [creating, setCreating] = useState(false);
  const [folderName, setName] = useState("");
  const [filesToUpload, setFiles] = useState([]);
  const [selectedCid, setSelectedCid] = useState([]);
  const [currentPrefix, setPrefix] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const { client, methods } = useIpfs();

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
    const list = [];
    try {
      for await (const res of client.files.ls(prefix)) {
        list.push(res);
      }
    } catch (error) {
      if (error.message === "file does not exist" && prefix === initialPrefix) {
        await methods.createFolder(prefix);
      }
    }
    setList(list);
    setLoading(false);
  };
  const handleFolderCreate = async () => {
    setCreating(true);
    await methods.createFolder(currentPrefix, folderName);
    setCreating(false);
    setName("");
    setDialog(false);
    await loadFiles(currentPrefix);
  };
  const handleDownload = async (item) => {
    let concatenatedBuf = new Uint8Array();
    for await (const buf of client.files.read(
      currentPrefix + "/" + item.name
    )) {
      concatenatedBuf = new Uint8Array([...concatenatedBuf, ...buf]);
    }
    const blob = new Blob([concatenatedBuf], {
      type: "application/octet-stream",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = item.name;

    link.click();
    URL.revokeObjectURL(url);
  };
  const handleSelection = async (item) => {
    const selectedIndex = selectedCid.indexOf(item.cid.toString());
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selectedCid, item.cid.toString()];
    } else {
      newSelected = selectedCid.filter((id) => id !== item.cid.toString());
    }
    setSelectedCid(newSelected);
  };
  const handleFolderNavigate = (index) => {
    let suffix;
    if (index > 0) {
      suffix = breadcrumbs.slice(0, index + 1).join("/");
    } else suffix = breadcrumbs[index];
    setPrefix(initialPrefix + "/" + suffix);
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
  }, [currentPrefix]);
  useEffect(() => {
    if (onSelect) {
      onSelect(selectedCid);
    }
  }, [onSelect, selectedCid]);
  useEffect(() => {
    try {
      loadFiles(initialPrefix);
      setPrefix(initialPrefix);
    } catch (error) {
      console.log(error);
    }
  }, []);
  useEffect(() => {
    const handleUpload = async () => {
      const files = Array.from(filesToUpload).map((file) => ({
        path: file.webkitRelativePath || file.name,
        content: file,
      }));
      for await (const res of client.addAll(files, { parents: true })) {
        // console.log(res);
        try {
          await client.files.cp(res.cid, currentPrefix + "/" + res.path, {
            parents: true,
          });
        } catch (error) {}
      }
      await loadFiles(currentPrefix);
    };
    if (filesToUpload.length > 0) {
      handleUpload();
    }
  }, [filesToUpload]);
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
                  </TableRow>
                ) : (
                  list.length === 0 && (
                    <div className="empty">
                      <span style={{ color: "#797979" }}>No item yet</span>
                    </div>
                  )
                )}
                {list
                  .sort((a, b) => {
                    if (!("size" in a) && !("size" in b)) {
                      return 0;
                    } else if (!("size" in a)) {
                      return -1;
                    } else if (!("size" in b)) {
                      return 1;
                    } else {
                      return 0;
                    }
                  })
                  .map((item) => {
                    const isSelected =
                      selectedCid.indexOf(item.cid.toString()) !== -1;
                    return (
                      <TableRow key={item.name} selected={isSelected}>
                        {onSelect && (
                          <TableCell width="5%">
                            <Checkbox
                              checked={isSelected}
                              onChange={() => handleSelection(item)}
                            />
                          </TableCell>
                        )}
                        <TableCell>
                          {item.type === "file" ? (
                            <InsertDriveFile />
                          ) : (
                            item.type === "directory" && <Folder />
                          )}
                          <span
                            style={{
                              marginLeft: 8,
                              cursor: item.type === "directory" && "pointer",
                            }}
                            onClick={() =>
                              item.type === "directory" &&
                              setPrefix(`${currentPrefix}/${item.name}`)
                            }>
                            {item.name}
                          </span>
                        </TableCell>
                        <TableCell>
                          {item.size !== 0 && (
                            <span
                              style={{ cursor: "pointer" }}
                              onClick={() => handleDownload(item)}>
                              <ArrowDownward />
                              <span className="size">
                                {prettyBytes(item.size)}
                              </span>
                            </span>
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
    </div>
  );
}
export default styled(FileList)`
  width: 100%;
  a {
    color: white;
    display: block;
    height: 100%;
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

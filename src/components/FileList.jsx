import { ArrowDownward, Folder, InsertDriveFile } from "@mui/icons-material";
import {
  Button,
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
import { useSnackbar } from "notistack";
import styled from "styled-components";
import prettyBytes from "pretty-bytes";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { useEffect, useState, useRef } from "react";
import { fileUpload, generatePresignUrl } from "../services/model";
import { useAnchorWallet } from "@solana/wallet-adapter-react";

function FileList({ className, prefix, setPrefix, id, onSelect, upload }) {
  const { enqueueSnackbar } = useSnackbar();
  const wallet = useAnchorWallet();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [createFolderDialog, setCreateFolderDialog] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [downloadLinks, setLinks] = useState([]);
  const [initialPrefix] = useState(prefix);
  const fileInputRef = useRef(null);
  const S3client = new S3Client({
    region: "ap-northeast-2",
    signer: { sign: async (request) => request },
  });
  const handleUpload = async (file) => {
    enqueueSnackbar("File uploading...", { variant: "info" });
    try {
      const path = await generatePresignUrl(
        parseInt(id),
        (prefix !== initialPrefix ? prefix.replace(initialPrefix, "") : "") +
          file.name,
        wallet.publicKey.toString()
      );
      await fileUpload(path, file);
    } catch (e) {
      console.log(e);
    }
  };
  const handleFileInputChange = async (event) => {
    try {
      const file = event.target.files[0];
      await handleUpload(file);
      loadFileList();
      enqueueSnackbar("Upload Success", { variant: "success" });
    } catch (e) {
      enqueueSnackbar(e, { variant: "error" });
    }
  };
  const getParentPrefix = (prefix) => {
    const lastIndex = prefix.lastIndexOf("/", prefix.length - 2);
    if (lastIndex === -1) {
      return "";
    }
    const parentPrefix = prefix.slice(0, lastIndex + 1);
    return parentPrefix;
  };
  const handleFolderCreate = async () => {
    const blob = new Blob([""], { type: "text/plain" });
    const file = new File([blob], "empty.txt", { type: "text/plain" });
    const path = await generatePresignUrl(
      parseInt(id),
      (prefix !== initialPrefix ? prefix.replace(initialPrefix, "") : "") +
        folderName +
        "/",
      wallet.publicKey.toString()
    );
    setCreateFolderDialog(false);
    enqueueSnackbar("Folder creating...", { variant: "info" });
    try {
      await fileUpload(path, file);
      loadFileList();
      enqueueSnackbar("Folder created", { variant: "success" });
    } catch (e) {
      console.log(e);
    }
  };
  const loadFileList = () => {
    setLoading(true);
    const command = new ListObjectsV2Command({
      Bucket: "distriai",
      Prefix: prefix,
      Delimiter: "/",
    });
    S3client.send(command)
      .then(({ Contents, CommonPrefixes }) => {
        setFiles(Contents || []);
        setFolders(CommonPrefixes || []);
      })
      .then(() => setLoading(false));
  };
  const handleSelection = (e, key) => {
    if (e.target.checked) {
      setLinks([
        ...downloadLinks,
        `https://distriai.s3.ap-northeast-2.amazonaws.com/${key}`,
      ]);
    } else {
      setLinks(
        downloadLinks.filter(
          (link) =>
            link !== `https://distriai.s3.ap-northeast-2.amazonaws.com/${key}`
        )
      );
    }
  };
  useEffect(() => {
    if (onSelect) {
      onSelect(downloadLinks);
    }
  }, [onSelect, downloadLinks]);
  useEffect(() => {
    loadFileList();
  }, [prefix]);
  return (
    <div className={className}>
      <Stack direction="column">
        {!onSelect && upload && (
          <Stack direction="row" justifyContent="end" spacing={2}>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileInputChange}
            />
            <Button
              variant="contained"
              className="cbtn"
              style={{ width: 100, margin: "0 10px" }}
              onClick={() => {
                fileInputRef.current.click();
              }}>
              Add File
            </Button>
            <Button
              variant="contained"
              className="cbtn"
              style={{ margin: "0 10px" }}
              onClick={() => setCreateFolderDialog(true)}>
              Create Folder
            </Button>
          </Stack>
        )}
        {loading ? (
          <CircularProgress />
        ) : files.length > 0 || folders.length > 0 ? (
          <TableContainer>
            <Table>
              <TableBody>
                {prefix !== initialPrefix && (
                  <TableRow>
                    <TableCell width="20%">
                      <Folder />
                      <span
                        onClick={() => {
                          setPrefix(getParentPrefix(prefix));
                        }}
                        style={{ marginLeft: 8, cursor: "pointer" }}>
                        ..
                      </span>
                    </TableCell>
                    <TableCell />
                    <TableCell />
                  </TableRow>
                )}
                {folders.map((folder) => (
                  <TableRow key={folder.Prefix}>
                    <TableCell width="20%">
                      <Folder />
                      <span
                        onClick={() => setPrefix(folder.Prefix)}
                        style={{ marginLeft: 8, cursor: "pointer" }}>
                        {folder.Prefix.replace(prefix, "")}
                      </span>
                    </TableCell>
                    <TableCell />
                    <TableCell />
                  </TableRow>
                ))}
                {files.map(
                  (file) =>
                    file.Key !== prefix && (
                      <TableRow key={file.Key}>
                        {onSelect && (
                          <TableCell width="5%">
                            <Checkbox
                              checked={downloadLinks.includes(
                                `https://distriai.s3.ap-northeast-2.amazonaws.com/${file.Key}`
                              )}
                              onChange={(e) => handleSelection(e, file.Key)}
                            />
                          </TableCell>
                        )}
                        <TableCell width="20%">
                          <InsertDriveFile />
                          <span style={{ marginLeft: 8 }}>
                            {file.Key.replace(prefix, "")}
                          </span>
                        </TableCell>
                        <TableCell align="right">
                          <a
                            style={{
                              display: "inline",
                            }}
                            href={`https://distriai.s3.ap-northeast-2.amazonaws.com/${file.Key}`}
                            download>
                            <ArrowDownward />
                            <span className="size">
                              {prettyBytes(file.Size)}
                            </span>
                          </a>
                        </TableCell>
                        <TableCell align="right">
                          <span className="date">
                            {new Date(file.LastModified).toLocaleDateString()}
                          </span>
                          <span className="time">
                            {new Date(file.LastModified).toLocaleTimeString()}
                          </span>
                        </TableCell>
                      </TableRow>
                    )
                )}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <div className="empty">
            <span>No file uploaded yet</span>
          </div>
        )}
      </Stack>
      <Dialog open={createFolderDialog} fullWidth maxWidth="sm">
        <DialogTitle>Input folder name here:</DialogTitle>
        <DialogContent>
          <TextField
            onChange={(e) => {
              setFolderName(e.target.value);
            }}
            InputProps={{
              style: {
                color: "black",
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            className="default-btn"
            onClick={() => setCreateFolderDialog(false)}>
            Cancel
          </Button>
          <Button className="default-btn" onClick={handleFolderCreate}>
            Create
          </Button>
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
  .date,
  .time {
    display: block;
  }
  .time {
    color: #aaa;
  }
  .size {
    display: inline-block;
    width: 64px;
  }
  .empty {
    width: 100%;
    height: 480px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

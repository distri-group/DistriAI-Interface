import { useEffect, useState } from "react";
import { Breadcrumbs, CircularProgress, Stack } from "@mui/material";
import { getFileList } from "@/services/jupyter";
import FileItem from "./FileItem";
import { Folder as FolderIcon } from "@mui/icons-material";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { signToken } from "@/services/jupyter";
import styled from "styled-components";

function FileList({ ip, port, onSelect, className }) {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [defaultPath] = useState("");
  const [currentPath, setCurrentPath] = useState("");
  const [selectedPaths, setSelectedPaths] = useState([]);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [token, setToken] = useState("");
  const wallet = useAnchorWallet();
  const getList = async (path, token) => {
    setLoading(true);
    const res = await getFileList(`http://${ip}:${port}`, path, token);
    setContents(res.content);
    setLoading(false);
  };
  const handleNavigate = (path) => {
    setCurrentPath(path);
  };
  const handleItemSelect = (path, checked) => {
    if (checked) {
      setSelectedPaths((prev) => [...prev, path]);
    } else {
      const filteredPath = selectedPaths.filter(
        (item) => item.path !== path.path
      );
      setSelectedPaths(filteredPath);
    }
  };
  const getToken = async () => {
    try {
      const res = await signToken(
        `http://${ip}:${port}`,
        wallet.publicKey.toString()
      );
      console.log(res);
      setToken(res.data.token);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (currentPath !== defaultPath) {
      setBreadcrumbs(currentPath.split("/"));
    } else {
      setBreadcrumbs([]);
    }
    if (token) {
      getList(currentPath, token);
    }
  }, [currentPath, token]);
  useEffect(() => {
    onSelect(selectedPaths);
  }, [selectedPaths]);
  useEffect(() => {
    if (wallet?.publicKey) {
      getToken();
    }
  }, [wallet]);
  return (
    <div className={className}>
      {breadcrumbs.length > 0 && (
        <Breadcrumbs
          separator={<span style={{ color: "white" }}>/</span>}
          style={{ padding: "0 10px" }}>
          <FolderIcon
            style={{ color: "white" }}
            onClick={() => {
              setCurrentPath("");
            }}
          />
          {breadcrumbs.slice(0, -1).map((breadcrumb, index) => (
            <span
              key={index}
              className="breadcrumb avail"
              onClick={() => {
                console.log(breadcrumbs.slice(0, index - 1).join("/"));
                setCurrentPath(breadcrumbs.slice(0, index - 1).join("/"));
              }}>
              {breadcrumb}
            </span>
          ))}
          <span className="breadcrumb">{breadcrumbs.slice(-1)[0]}</span>
        </Breadcrumbs>
      )}
      {loading ? (
        <Stack alignItems="center" justifyContent="center" className="empty">
          <CircularProgress />
        </Stack>
      ) : contents.length > 0 ? (
        contents.map((content) => (
          <FileItem
            item={content}
            key={content.path}
            onSelect={handleItemSelect}
            onNavigate={handleNavigate}
            isSelected={
              selectedPaths.findIndex((item) => item.path === content.path) !==
              -1
            }
          />
        ))
      ) : (
        <Stack alignItems="center" justifyContent="center" className="empty">
          <span>No item yet</span>
        </Stack>
      )}
    </div>
  );
}
export default styled(FileList)`
  height: 300px;
  overflow-y: auto;
  .empty {
    width: 100%;
    height: 100%;
  }
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
`;

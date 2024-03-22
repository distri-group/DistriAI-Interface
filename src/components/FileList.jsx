import { ArrowDownward, InsertDriveFile } from "@mui/icons-material";
import { Button, Stack } from "@mui/material";
import { useSnackbar } from "notistack";
import styled from "styled-components";
import prettyBytes from "pretty-bytes";
import { ListObjectsCommand, S3Client } from "@aws-sdk/client-s3";
import { useEffect, useState, useRef } from "react";
import { fileUpload, generatePresignUrl } from "../services/model";

function FileList({ className, prefix, id }) {
  const { enqueueSnackbar } = useSnackbar();
  const [files, setFiles] = useState([]);
  const [uploadFile, setUploadFile] = useState("");
  const fileInputRef = useRef(null);

  const S3client = new S3Client({
    region: "ap-northeast-2",
    signer: { sign: async (request) => request },
  });

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    setUploadFile(file);
  };
  const handleUpload = async () => {
    const path = await generatePresignUrl(parseInt(id), uploadFile.name);
    console.log(path);
    const res = await fileUpload(path, uploadFile);
    console.log(res);
  };
  useEffect(() => {
    const command = new ListObjectsCommand({
      Bucket: "distriai",
      Prefix: prefix,
    });
    S3client.send(command).then(({ Contents }) => setFiles(Contents || []));
  }, []);
  useEffect(() => {
    if (uploadFile) {
      handleUpload();
    }
  }, [uploadFile]);
  return (
    <div className={className}>
      <Stack direction="column">
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
            style={{ width: 100, margin: "0 20px" }}
            onClick={() => {
              fileInputRef.current.click();
            }}>
            Add File
          </Button>
        </Stack>
        <div>
          {files.length > 0 &&
            files.map(
              (file) =>
                file.Key !==
                  "model/Bv3qEmRjPn3z7bB3JynCoXJmopcNM8PGa6ASxPCi7bY/animagine-xl-3.0/" && (
                  <Stack
                    key={file.Key}
                    direction="row"
                    justifyContent="space-between"
                    style={{ padding: 10, borderBottom: "1px solid #eeeeee" }}>
                    <Stack
                      style={{ width: "20%" }}
                      direction="row"
                      alignItems="end">
                      <InsertDriveFile />
                      {file.Key.replace(
                        "model/Bv3qEmRjPn3z7bB3JynCoXJmopcNM8PGa6ASxPCi7bY/animagine-xl-3.0/",
                        ""
                      )}
                    </Stack>
                    <div style={{ width: "20%" }}>
                      <a
                        href={`https://distriai.s3.ap-northeast-2.amazonaws.com/${file.Key}`}
                        download>
                        <Stack
                          direction="row"
                          alignItems="end"
                          style={{ height: "100%" }}>
                          <ArrowDownward />
                          {prettyBytes(file.Size)}
                        </Stack>
                      </a>
                    </div>
                    <div>
                      <span className="date">
                        {new Date(file.LastModified).toLocaleDateString()}
                      </span>
                      <span className="time">
                        {new Date(file.LastModified).toLocaleTimeString()}
                      </span>
                    </div>
                  </Stack>
                )
            )}
        </div>
      </Stack>
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
`;
const files = [
  {
    name: ".gitattributes",
    size: "1.62kb",
  },
  {
    name: "README.md",
    size: "21.1kb",
  },
  {
    name: "config.json",
    size: "629 Bytes",
  },
  {
    name: "gemma-7b.gguf",
    size: "34.2GB",
  },
  {
    name: "generation_config.json",
    size: "137 Bytes",
  },
];

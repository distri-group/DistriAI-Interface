import { TabList, TabPanel, TabContext } from "@mui/lab";
import {
  Button,
  Box,
  Chip,
  CircularProgress,
  Stack,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import metadataParser from "markdown-yaml-metadata-parser";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import FileList from "@/components/FileList.jsx";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import "@/dark.css";
import {
  getItemDetail,
  checkDeployable,
  likeItem,
  isItemLiked,
} from "@/services/model.js";
import { getOrderList } from "@/services/order.js";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { AccountBalance } from "@mui/icons-material";
import { capitalize } from "lodash";
import useIpfs from "@/utils/useIpfs.js";
import { copy } from "@/utils/index.js";
import { useSnackbar } from "notistack";
import { useProgram } from "@/KeepAliveLayout";
import { useClearCache } from "@/components/ClearCacheProvider";

function Detail({ className, type }) {
  document.title = `${capitalize(type)} Detail`;
  const navigate = useNavigate();
  const wallet = useAnchorWallet();
  const { owner, name } = useParams();
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState({});
  const [intent, setIntent] = useState("");
  const [filesForTraining, setTrainingFiles] = useState([]);
  const [tabValue, setTabValue] = useState("readme");
  const [markdown, setMarkdown] = useState("");
  const [metadata, setMetadata] = useState("");
  const [dialog, setDialog] = useState("");
  const [orderDialog, setOrderDialog] = useState(false);
  const [deployable, setDeployable] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const { client } = useIpfs();
  const { enqueueSnackbar } = useSnackbar();
  const { clearCache } = useClearCache();

  function handleTabChange(e, newValue) {
    setTabValue(newValue);
  }

  useEffect(() => {
    async function loadDetail() {
      const orders = await getOrderList(
        1,
        10,
        { Status: 1, Direction: "buy" },
        wallet.publicKey.toString()
      );
      const orderUsing = orders.List.find(
        (order) =>
          order.Metadata.OrderInfo?.Model &&
          order.Metadata.OrderInfo.Model === item.Id
      );
      if (orderUsing) {
        setIntent(orderUsing.Metadata.OrderInfo.Intent);
      } else {
        const orderEmpty = orders.List.find(
          (order) => order.Metadata.OrderInfo?.Model === ""
        );
        if (orderEmpty) {
          setIntent("train");
        }
      }
    }
    if (wallet?.publicKey && Object.keys(item).length > 0 && type === "model") {
      loadDetail();
    }
  }, [wallet, item, type]);
  async function loadItem() {
    setLoading(true);
    const res = await getItemDetail(type, owner, name);
    if (type === "model") {
      const isDeployable = await checkDeployable(res);
      setDeployable(isDeployable);
    }
    try {
      for await (const item of client.files.read(
        `/distri.ai/${type}/${owner}/${name}/README.md`
      )) {
        const text = new TextDecoder().decode(item);
        if (type === "model") {
          const match = text.match(/^---\n([\s\S]+?)\n---/);
          const result = metadataParser(text);
          setMarkdown(result.content);
          if (match) {
            setMetadata(match[1]);
          }
        } else setMarkdown(text);
      }
    } catch (error) {}
    setItem(res);
    setLoading(false);
  }
  async function handleLiked() {
    try {
      clearCache();
      await likeItem(
        type,
        item.Owner,
        item.Name,
        wallet.publicKey.toString(),
        !liked
      );
      if (liked) {
        setLikeCount((prev) => prev - 1);
      } else {
        setLikeCount((prev) => prev + 1);
      }
      setLiked((prev) => !prev);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
  }
  async function checkIsLiked() {
    const isLike = await isItemLiked(
      type,
      owner,
      name,
      wallet.publicKey.toString()
    );
    setLiked(isLike);
  }
  useEffect(() => {
    loadItem();
    // eslint-disable-next-line
  }, [type]);
  useEffect(() => {
    if (wallet?.publicKey) {
      checkIsLiked();
    }
  }, [wallet]);
  useEffect(() => {
    if (!orderDialog && filesForTraining.length > 0) {
      setTrainingFiles([]);
    }
  }, [orderDialog, filesForTraining]);

  return (
    <div className={className}>
      <div className="container">
        {loading ? (
          <Stack
            justifyContent="center"
            alignItems="center"
            style={{
              width: "100%",
              height: 1000,
            }}>
            <CircularProgress />
          </Stack>
        ) : (
          <>
            <Stack direction="row" spacing={2} justifyContent="space-between">
              <div>
                <Stack
                  direction="row"
                  spacing={2}
                  style={{ paddingBottom: 16 }}>
                  <h1>{item.Name}</h1>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Stack direction="row" alignItems="center">
                      {liked ? (
                        <Favorite
                          onClick={handleLiked}
                          sx={{ width: 24, height: 24, cursor: "pointer" }}
                        />
                      ) : (
                        <FavoriteBorder
                          onClick={handleLiked}
                          sx={{ width: 24, height: 24, cursor: "pointer" }}
                        />
                      )}
                      <label style={{ paddingLeft: 4 }}>Like</label>
                    </Stack>
                    <span>{item.Likes + likeCount}</span>
                  </Stack>
                </Stack>
                <Stack direction="row" spacing={2}>
                  <Stack direction="row" spacing={1}>
                    <label>Updated</label>
                    <span>{new Date(item.UpdateTime).toLocaleString()}</span>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <label>Downloads</label>
                    <span>{item.Downloads}</span>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <label>From</label>
                    <span>{owner}</span>
                  </Stack>
                </Stack>
              </div>
              <Stack direction="row" style={{ alignItems: "end" }} spacing={2}>
                {type === "model" &&
                  (intent.length > 0 ? (
                    <Button
                      className="cbtn"
                      onClick={() => setOrderDialog(true)}
                      style={{ width: 160 }}>
                      <span className="btn-txt">{capitalize(intent)}</span>
                    </Button>
                  ) : (
                    <>
                      <Button
                        className="cbtn"
                        style={{ width: 160 }}
                        component="label"
                        onClick={() => setDialog("train")}>
                        <span className="btn-txt">Train</span>
                      </Button>
                      <Button
                        disabled={!deployable}
                        className="white-btn"
                        style={{ width: 160 }}
                        component="label"
                        onClick={() => setDialog("deploy")}>
                        <span className="btn-txt">Deploy</span>
                      </Button>
                    </>
                  ))}
              </Stack>
            </Stack>
            <Stack direction="row" spacing={2} style={{ margin: "10px 0" }}>
              <Chip color="warning" label={item.framework || item.scale} />
              <Chip color="success" label={item.type1} />
              {item.type1 !== "Others" && (
                <Chip variant="outlined" color="success" label={item.type2} />
              )}
              {item.Tags &&
                item.Tags.map((tag) => (
                  <Chip
                    color="primary"
                    label={tag}
                    key={tag}
                    style={{ minWidth: 50 }}
                  />
                ))}
              <Chip
                avatar={
                  <AccountBalance
                    style={{ background: "transparent", color: "white" }}
                  />
                }
                color="info"
                label={item.license}
              />
            </Stack>
            <hr style={{ margin: "32px 0" }} />
            <TabContext value={tabValue}>
              <TabList
                TabIndicatorProps={{ style: { display: "none" } }}
                onChange={handleTabChange}>
                <Tab
                  className="tab"
                  label={type === "model" ? "Model Card" : "README"}
                  value="readme"
                />
                <Tab
                  className="tab"
                  label={`${capitalize(type)} Files`}
                  value="files"
                />
              </TabList>
              <TabPanel value="readme">
                {markdown ? (
                  <div
                    style={{
                      background: "rgba(149,157,165,0.16)",
                    }}>
                    <div style={{ width: "100%", height: 32 }} />
                    {metadata && (
                      <SyntaxHighlighter language="yaml" style={tomorrow}>
                        {metadata}
                      </SyntaxHighlighter>
                    )}
                    <Markdown
                      className="markdown-body"
                      children={markdown}
                      rehypePlugins={[rehypeRaw]}
                      components={{
                        code({ node, inline, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || "");
                          return !inline && match ? (
                            <SyntaxHighlighter
                              children={String(children).replace(/\n$/, "")}
                              style={tomorrow}
                              language={match[1]}
                              PreTag="div"
                              {...props}
                            />
                          ) : (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          );
                        },
                      }}
                    />
                  </div>
                ) : (
                  <div className="empty">
                    <span>There is no detailed {type} introduction yet</span>
                  </div>
                )}
              </TabPanel>
              <TabPanel value="files">
                <FileList item={item} type={type} onReload={loadItem} />
              </TabPanel>
            </TabContext>
          </>
        )}
        <Dialog open={Boolean(dialog)}>
          <DialogContent>
            <p>
              No available machine yet. Please rent a machine in market before
              using.
            </p>
          </DialogContent>
          <DialogActions>
            <Button className="cbtn" onClick={() => setDialog("")}>
              Cancel
            </Button>
            <Button
              className="cbtn"
              onClick={() => {
                navigate("/market", {
                  state: {
                    model: { name: item.Name, owner: item.Owner },
                    intent: dialog,
                  },
                });
                setDialog("");
              }}>
              Go to Market
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={orderDialog}>
          <Box
            sx={{
              bgcolor: "#00000b",
              color: "#ffffff",
              maxHeight: "1000px",
              overflowY: "scroll",
            }}>
            <DialogTitle>
              You have already rent a GPU for {intent}ing{" "}
              {intent === "deploy" && <span>using this model</span>}
            </DialogTitle>
            <DialogContent>
              <p>
                You can find example code in the model card, then select the GPU
                you have purchased for use.
              </p>
              <p>
                Alternatively, you can select the file to obtain the
                corresponding download code, and then download the model locally
                for use.
              </p>
              {filesForTraining.length > 0 && (
                <code
                  style={{
                    border: "1px solid white",
                    position: "relative",
                    display: "block",
                    margin: "20px 0",
                    padding: "16px 8px",
                  }}>
                  {filesForTraining.map((item, index) => (
                    <React.Fragment key={index}>
                      wget --no-check-certificate https://ipfs.distri.ai/ipfs/
                      {item.cid} <br />
                    </React.Fragment>
                  ))}
                  <Button
                    className="white-btn"
                    style={{
                      position: "absolute",
                      height: 24,
                      top: 8,
                      right: 8,
                    }}
                    onClick={() => {
                      copy(
                        filesForTraining
                          .map(
                            (item) =>
                              `wget --no-check-certificate https://ipfs.distri.ai/ipfs/${item.cid}`
                          )
                          .join("\n")
                      );
                      enqueueSnackbar("Copied to clipboard", {
                        variant: "success",
                      });
                    }}>
                    Copy
                  </Button>
                </code>
              )}
              <FileList
                item={item}
                type={type}
                onReload={loadItem}
                onSelect={(files) => setTrainingFiles(files)}
                disableUpload={true}
              />
            </DialogContent>
            <DialogActions>
              <Button
                className="default-btn"
                onClick={() => setOrderDialog(false)}>
                Cancel
              </Button>
              <Button
                className="default-btn"
                onClick={() => {
                  navigate("/dashboard");
                  setOrderDialog(false);
                }}>
                Go to GPUs
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      </div>
    </div>
  );
}

export default styled(Detail)`
  h1 {
    font-size: 32px;
    line-height: 44px;
    margin: 0;
  }
  .container {
    margin-top: 25px;
    label {
      color: #898989;
      font-size: 16px;
      line-height: 22px;
    }
  }
  .tab {
    border-radius: 12px 12px 0 0;
    color: white;
    width: 240px;
    height: 64px;
    &.Mui-selected {
      background: rgba(149, 157, 165, 0.16);
    }
  }
  .output {
    display: block;
    max-width: 800px;
    max-height: 800px;
    margin: 0 auto;
  }
  .empty {
    width: 100%;
    height: 480px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .deployment {
    width: 100%;
    height: 800px;
    border: none;
  }
  .default-btn {
    margin-left: 8px;
  }
  .Mui-disabled {
    background-color: #898989;
  }
  .btn-txt {
    font-weight: 500;
    font-size: 18px;
    line-height: 26px;
  }
`;

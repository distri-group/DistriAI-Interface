import { TabList, TabPanel, TabContext } from "@mui/lab";
import {
  Button,
  Chip,
  CircularProgress,
  Stack,
  Tab,
  Backdrop,
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import metadataParser from "markdown-yaml-metadata-parser";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import FileList from "@/components/FileList.jsx";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { Favorite } from "@mui/icons-material";
import "@/dark.css";
import { getModelDetail } from "@/services/model.js";
import { getOrderList } from "@/services/order.js";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { signToken } from "@/services/order.js";
import { useSnackbar } from "notistack";
import { AccountBalance } from "@mui/icons-material";
import axios from "axios";
import { getDatasetDetail } from "@/services/dataset";
import { capitalize } from "lodash";

function Detail({ className, type }) {
  document.title = `${capitalize(type)} Detail`;
  const navigate = useNavigate();
  const wallet = useAnchorWallet();
  const { owner, name } = useParams();
  const prefix = `${type}/${owner}/${name}/`;
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState({});
  const [machine, setMachine] = useState("");
  const [tabValue, setTabValue] = useState("readme");
  const [markdown, setMarkdown] = useState("");
  const [metadata, setMetadata] = useState("");
  const [signing, setSigning] = useState(false);
  const [dialog, setDialog] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  function handleTabChange(e, newValue) {
    setTabValue(newValue);
  }
  async function handleConsole(machine, deploy) {
    setSigning(true);
    try {
      const href = await signToken(
        machine.IP,
        machine.Port,
        wallet.publicKey.toString(),
        deploy
      );
      window.open(href);
    } catch (e) {
      enqueueSnackbar(e, { variant: "error" });
    }
    setSigning(false);
  }

  useEffect(() => {
    async function loadDetail() {
      setLoading(true);
      const order = await getOrderList(1, 10, {}, wallet.publicKey.toString());
      const orderUsing = order.List.find(
        (item) =>
          item.Metadata.OrderInfo?.Model &&
          item.Metadata.OrderInfo.Model === item.Id &&
          item.Status === 1
      );
      if (orderUsing) {
        setItem((prevState) => ({
          ...prevState,
          Intent: orderUsing.Metadata.OrderInfo.Intent,
        }));
        setMachine(orderUsing.Metadata.MachineInfo);
      }
      setLoading(false);
    }
    if (wallet?.publicKey && Object.keys(item).length > 0 && type === "model") {
      loadDetail();
    }
  }, [wallet, item, type]);
  useEffect(() => {
    async function loadItem() {
      setLoading(true);
      let res;
      if (type === "model") {
        res = await getModelDetail(owner, name);
      } else {
        res = await getDatasetDetail(owner, name);
      }
      setItem(res);
      axios
        .get(
          `https://distriai.s3.ap-northeast-2.amazonaws.com/${type}/${owner}/${name}/README.md`
        )
        .then((response) => {
          const text = response.data;
          if (type === "model") {
            const match = text.match(/^---\n([\s\S]+?)\n---/);
            const result = metadataParser(text);
            setMarkdown(result.content);
            setMetadata(match[1]);
          } else setMarkdown(text);
        })
        .catch((error) => {});
      setLoading(false);
    }
    loadItem();
    // eslint-disable-next-line
  }, [type]);

  return (
    <div className={className}>
      <div className="container">
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <Stack
              direction="row"
              spacing={2}
              style={{ justifyContent: "space-between" }}>
              <div>
                <Stack direction="row" spacing={2}>
                  <h1>{item.Name}</h1>
                  <Stack direction="row" alignItems="center">
                    <Favorite sx={{ width: 20, height: 20 }} />
                    <span>{item.likes}</span>
                  </Stack>
                </Stack>
                <Stack direction="row" spacing={2}>
                  <span>
                    Updated {new Date(item.UpdatedAt).toLocaleString()}
                  </span>
                  <span>Downloads {item.downloads}</span>
                  <span>From: {owner}</span>
                </Stack>
              </div>
              <Stack direction="row" style={{ alignItems: "end" }} spacing={2}>
                {type === "model" &&
                  (item.Intent ? (
                    item.Intent === "train" ? (
                      <Button
                        className="cbtn"
                        style={{ width: 100 }}
                        onClick={() => {
                          handleConsole(machine, false);
                        }}>
                        Notebook
                      </Button>
                    ) : (
                      <Button
                        className="cbtn"
                        style={{ width: 100 }}
                        onClick={() => {
                          handleConsole(machine, true);
                        }}>
                        Deployment
                      </Button>
                    )
                  ) : (
                    <>
                      <Button
                        className="cbtn"
                        style={{ width: 100 }}
                        onClick={() => setDialog("train")}>
                        Train
                      </Button>
                      <Button
                        className="cbtn"
                        style={{ width: 100 }}
                        onClick={() => setDialog("deploy")}>
                        Deploy
                      </Button>
                    </>
                  ))}
              </Stack>
            </Stack>
            <Stack direction="row" spacing={2} style={{ margin: "10px 0" }}>
              <Chip
                color="warning"
                size="small"
                label={item.framework || item.size}
              />
              <Chip color="success" size="small" label={item.type1} />
              {item.type1 !== "Others" && (
                <Chip
                  size="small"
                  variant="outlined"
                  color="success"
                  label={item.type2}
                />
              )}
              {item.Tags &&
                item.Tags.map((tag) => (
                  <Chip
                    color="primary"
                    size="small"
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
                size="small"
                label={item.license}
              />
            </Stack>
            <hr style={{ margin: "32px 0" }} />
            <TabContext value={tabValue}>
              <TabList onChange={handleTabChange}>
                <Tab
                  className="tab"
                  label={type === "model" ? "Model Card" : "README"}
                  value="readme"
                />
                <Tab
                  className="tab"
                  style={{ margin: "0 20px" }}
                  label={`${capitalize(type)} Files`}
                  value="files"
                />
              </TabList>
              <TabPanel
                value="readme"
                style={{
                  backgroundColor: "#0d1117",
                }}>
                {markdown ? (
                  <>
                    {metadata && (
                      <div>
                        <Chip
                          label="metadata"
                          style={{
                            background: "gray",
                            color: "white",
                            marginLeft: 16,
                          }}
                        />
                        <SyntaxHighlighter language="yaml" style={tomorrow}>
                          {metadata}
                        </SyntaxHighlighter>
                      </div>
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
                  </>
                ) : (
                  <div className="empty">
                    <span>There is no detailed {type} introduction yet</span>
                  </div>
                )}
              </TabPanel>
              <TabPanel value="files">
                <FileList
                  prefix={prefix}
                  id={item.Id}
                  upload={item.Owner === wallet?.publicKey?.toString()}
                />
              </TabPanel>
            </TabContext>
          </>
        )}
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={signing}>
          <CircularProgress />
        </Backdrop>
        <Dialog open={Boolean(dialog)}>
          <DialogContent>
            <p>
              No available machine yet. Please rent a machine in market before
              using.
            </p>
          </DialogContent>
          <DialogActions>
            <Button className="default-btn" onClick={() => setDialog("")}>
              Cancel
            </Button>
            <Button
              className="default-btn"
              onClick={() => {
                navigate("/market", {
                  state: { modelId: item.Id, intent: dialog },
                });
                setDialog("");
              }}>
              Go to Market
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default styled(Detail)`
  width: 1600px;
  margin: 0 auto;
  .container {
    margin-top: 25px;
  }
  .tab {
    border-radius: 15px 15px 0 0;
    color: white;
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
    background-color: rgb(148, 214, 226);
    border-radius: 3px;
    color: black;
    padding: 4px 12px;
    margin-left: 8px;
  }
`;

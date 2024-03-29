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
import FileList from "../components/FileList";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { Favorite } from "@mui/icons-material";
import "../dark.css";
import { getModelDetail } from "../services/model";
import { getOrderList } from "../services/order";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { signToken } from "../services/order";
import { useSnackbar } from "notistack";
import { AccountBalance } from "@mui/icons-material";

function ModelDetail({ className }) {
  document.title = "Model Detail";
  const navigate = useNavigate();
  const wallet = useAnchorWallet();
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState({});
  const [machine, setMachine] = useState("");
  const [prefix, setPrefix] = useState("");
  const [tabValue, setTabValue] = useState("model-card");
  const [markdown, setMarkdown] = useState("");
  const [metadata, setMetadata] = useState("");
  const [signing, setSigning] = useState(false);
  const [dialog, setDialog] = useState("");
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const handleTabChange = (e, newValue) => {
    setTabValue(newValue);
  };

  const handleConsole = async (machine, deploy) => {
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
  };

  useEffect(() => {
    const loadDetail = async () => {
      setLoading(true);
      const order = await getOrderList(1, [], wallet.publicKey);
      const orderUsing = order.list.find(
        (item) =>
          item.Metadata.OrderInfo?.Model &&
          item.Metadata.OrderInfo.Model == id &&
          item.Status === 1
      );
      if (orderUsing) {
        setModel((prevState) => ({
          ...prevState,
          Intent: orderUsing.Metadata.OrderInfo.Intent,
        }));
        setMachine(orderUsing.Metadata.MachineInfo);
      }
      setLoading(false);
    };
    if (wallet?.publicKey) {
      loadDetail();
    }
  }, [wallet, id]);
  useEffect(() => {
    const loadModel = async () => {
      setLoading(true);
      const res = await getModelDetail(id);
      setModel(res);
      setPrefix(`model/${res.Owner}/${res.Name}/`);
      fetch(
        "https://distriai.s3.ap-northeast-2.amazonaws.com/" +
          `model/${res.Owner}/${res.Name}/` +
          "README.md"
      )
        .then((res) =>
          res.text().then((text) => {
            const match = text.match(/^---\n([\s\S]+?)\n---/);
            const result = metadataParser(text);
            setMarkdown(result.content);
            setMetadata(match[1]);
          })
        )
        .catch((e) => {
          console.log(e);
        });
      setLoading(false);
    };
    loadModel();
  }, []);

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
                  <h1>{model.Name}</h1>
                  <Stack direction="row" alignItems="center">
                    <Favorite sx={{ width: 20, height: 20 }} />
                    <span>1.2k</span>
                  </Stack>
                </Stack>
                <Stack direction="row" spacing={2}>
                  <span>
                    Updated {new Date(model.UpdatedAt).toLocaleString()}
                  </span>
                  <span>From Distri.AI</span>
                  <span>Downloads 19k</span>
                </Stack>
              </div>
              <Stack direction="row" style={{ alignItems: "end" }} spacing={2}>
                {model.Intent ? (
                  model.Intent === "train" ? (
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
                )}
              </Stack>
            </Stack>
            <Stack direction="row" spacing={2} style={{ margin: "10px 0" }}>
              <Chip color="success" size="small" label={model.type1} />
              {model.type1 !== "Others" && (
                <Chip
                  size="small"
                  variant="outlined"
                  color="success"
                  label={model.type2}
                />
              )}
              {model.Tags &&
                model.Tags.map((tag) => (
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
                label={model.license}
              />
            </Stack>
            <hr style={{ margin: "32px 0" }} />
            <TabContext value={tabValue}>
              <TabList onChange={handleTabChange}>
                <Tab className="tab" label="Model Card" value="model-card" />
                <Tab
                  className="tab"
                  style={{ margin: "0 20px" }}
                  label="Model Files"
                  value="files"
                />
              </TabList>
              <TabPanel value="model-card">
                {markdown && metadata ? (
                  <>
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
                    <span>There is no detailed model introduction yet</span>
                  </div>
                )}
              </TabPanel>
              <TabPanel value="files">
                {wallet?.publicKey && (
                  <FileList
                    prefix={prefix}
                    id={id}
                    upload={model.Owner === wallet.publicKey.toString()}
                  />
                )}
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
            <Button
              style={{
                backgroundColor: "rgb(148, 214, 226)",
                borderRadius: "3px",
                color: "black",
                padding: "4px 12px",
              }}
              onClick={() => setDialog("")}>
              Cancel
            </Button>
            <Button
              style={{
                backgroundColor: "rgb(148, 214, 226)",
                borderRadius: "3px",
                color: "black",
                padding: "4px 12px",
              }}
              onClick={() => {
                navigate("/market", {
                  state: { modelId: id, intent: dialog },
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

export default styled(ModelDetail)`
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

import { TabList, TabPanel, TabContext } from "@mui/lab";
import {
  Button,
  Chip,
  CircularProgress,
  Grid,
  Skeleton,
  Stack,
  Tab,
  TextField,
  Backdrop,
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
import { client } from "@gradio/client";
import { Favorite } from "@mui/icons-material";
import "../dark.css";
import { getModelDetail } from "../services/model";
import { getMachineList } from "../services/machine";
import { getOrderList } from "../services/order";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { signToken } from "../services/order";
import { useSnackbar } from "notistack";

function ModelDetail({ className }) {
  document.title = "Model Detail";
  const navigate = useNavigate();
  const wallet = useAnchorWallet();
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState({});
  const [machineId, setMachineId] = useState("");
  const [prefix, setPrefix] = useState("");
  const [gradio, setGradio] = useState();
  const [tabValue, setTabValue] = useState("model-card");
  const [markdown, setMarkdown] = useState("");
  const [metadata, setMetadata] = useState("");
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [generating, setGenerating] = useState(false);
  const [signing, setSigning] = useState(false);
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const handleTabChange = (e, newValue) => {
    setTabValue(newValue);
  };
  const handleOutput = async () => {
    setGenerating(true);
    try {
      const res = await gradio.predict("/predict", [prompt]);
      setOutput(res.data[0].url);
    } catch (e) {
      console.log(e);
    }
    setGenerating(false);
  };
  const handleConsole = async (uuid) => {
    setSigning(true);
    const res = await getMachineList(1);
    const machineList = res.list;
    const machine = machineList.find((machine) => machine.UUID === uuid);
    if (machine) {
      try {
        await signToken(machine.IP, machine.Port, wallet.publicKey.toString());
      } catch (e) {
        enqueueSnackbar(e, { variant: "error" });
      }
    }
    setSigning(false);
  };
  useEffect(() => {
    const loadDetail = async () => {
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

    loadDetail();
  }, []);

  useEffect(() => {
    const connectToGradio = async () => {
      const gradio = await client("http://3.236.221.156:7860/"); // IP needed
      setGradio(gradio);
    };
    const loadOrderDetail = async () => {
      const res = await getOrderList(1, [], wallet.publicKey);
      const orderUsing = res.list.find(
        (item) =>
          item.Metadata.OrderInfo?.Model &&
          item.Metadata.OrderInfo.Model === Number(id) &&
          item.Status === 1
      );
      if (orderUsing) {
        setModel((prevState) => ({
          ...prevState,
          Intent: orderUsing.Metadata.OrderInfo.Intent,
        }));
        setMachineId(orderUsing.Metadata.MachineInfo.UUID);
        if (orderUsing.Metadata.OrderInfo.Intent === "deploy") {
          connectToGradio();
        }
      }
    };

    if (wallet?.publicKey) {
      loadOrderDetail();
    }
  }, [wallet, id]);

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
                  model.Intent === "train" && (
                    <Button
                      className="cbtn"
                      style={{ width: 100 }}
                      onClick={() => {
                        handleConsole(machineId);
                      }}>
                      Notebook
                    </Button>
                  )
                ) : (
                  <>
                    <Button
                      className="cbtn"
                      style={{ width: 100 }}
                      onClick={() =>
                        navigate("/market", {
                          state: { modelId: id, intent: "train" },
                        })
                      }>
                      Train
                    </Button>
                    <Button
                      className="cbtn"
                      style={{ width: 100 }}
                      onClick={() =>
                        navigate("/market", {
                          state: { modelId: id, intent: "deploy" },
                        })
                      }>
                      Deploy
                    </Button>
                  </>
                )}
              </Stack>
            </Stack>
            <div style={{ margin: "10px 0" }}>
              {model.Tags &&
                model.Tags.map((tag) => (
                  <Chip
                    color="primary"
                    size="small"
                    style={{
                      margin: 4,
                      minWidth: 50,
                    }}
                    key={tag}
                    label={tag}
                  />
                ))}
            </div>
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
                {model.Intent === "deploy" && (
                  <Tab className="tab" label="Deployment" value="deployment" />
                )}
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
                <FileList prefix={prefix} id={id} />
              </TabPanel>
              {model.Intent === "deploy" && (
                <TabPanel value="deployment">
                  <div style={{ padding: 20 }}>
                    <Grid container spacing={2}>
                      <Grid item md={12}>
                        <h2>Interactive Demo</h2>
                      </Grid>
                      <Grid item md={12}>
                        <label>Input</label>
                      </Grid>
                      <Grid item md={12}>
                        <TextField
                          disabled={generating}
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          multiline
                          fullWidth
                          placeholder="Input your prompt here."
                        />
                      </Grid>
                      <Grid item md={8} />
                      <Grid item md={4}>
                        <Stack direction="row-reverse">
                          <Button
                            disabled={generating}
                            onClick={handleOutput}
                            className="cbtn"
                            style={{ width: 100, margin: "0 8px" }}>
                            Submit
                          </Button>
                          <Button
                            disabled={generating}
                            onClick={() => {
                              setPrompt("");
                              setOutput("");
                            }}
                            className="cbtn"
                            style={{ width: 100 }}>
                            Clear
                          </Button>
                        </Stack>
                      </Grid>
                      <Grid item md={12}>
                        {generating ? (
                          <Skeleton
                            variant="rectangular"
                            width={800}
                            height={800}
                            style={{ display: "block", margin: "0 auto" }}
                          />
                        ) : (
                          output && (
                            <img src={output} alt="output" className="output" />
                          )
                        )}
                      </Grid>
                    </Grid>
                  </div>
                </TabPanel>
              )}
            </TabContext>
          </>
        )}
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={signing}>
          <CircularProgress />
        </Backdrop>
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
`;

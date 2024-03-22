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

function ModelDetail({ className }) {
  document.title = "Model Detail";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState({});
  const [gradio, setGradio] = useState();
  const [tabValue, setTabValue] = useState("model-card");
  const [markdown, setMarkdown] = useState("");
  const [metadata, setMetadata] = useState("");
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [generating, setGenerating] = useState(false);
  const { id } = useParams();
  const Prefix =
    "model/Bv3qEmRjPn3z7bB3JynCoXJmopcNM8PGa6ASxPCi7bY/animagine-xl-3.0/";
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
  useEffect(() => {
    fetch(
      "https://distriai.s3.ap-northeast-2.amazonaws.com/" + Prefix + "README.md"
    ).then((res) =>
      res.text().then((text) => {
        const match = text.match(/^---\n([\s\S]+?)\n---/);
        const result = metadataParser(text);
        setMarkdown(result.content);
        setMetadata(match[1]);
      })
    );
    const loadDetail = async () => {
      setLoading(true);
      const res = await getModelDetail(id);
      setModel(res);
      setLoading(false);
    };
    const connectToGradio = async () => {
      const gradio = await client("http://3.236.221.156:7860/");
      setGradio(gradio);
    };
    loadDetail();
    connectToGradio();
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
                <Button className="cbtn" style={{ width: 100 }}>
                  Notebook
                </Button>
                <Button
                  onClick={() => {
                    navigate(`/models/${id}/deploy`);
                  }}
                  className="cbtn"
                  style={{ width: 100 }}>
                  Deploy
                </Button>
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
                <Tab className="tab" label="Deployment" value="deployment" />
              </TabList>
              <TabPanel value="model-card">
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
              </TabPanel>
              <TabPanel value="files">
                <FileList prefix={Prefix} id={id} />
              </TabPanel>
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
            </TabContext>
          </>
        )}
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
`;

import React, { useState } from "react";
import ReactDOM from "react-dom";
import Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";
import { pythonGenerator } from "blockly/python";

import { BlocklyWorkspace } from "./index";
import ConfigFiles from "./initContent/content";
import { ToolboxInfo } from "blockly/core/utils/toolbox";

import "./dev-index.css";

const TestEditor = () => {
  const [toolboxConfiguration, setToolboxConfiguration] =
    React.useState<ToolboxInfo>(ConfigFiles.INITIAL_TOOLBOX_JSON);
  const [generatedXml, setGeneratedXml] = useState("");
  const [generatedJson, setGeneratedJson] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");

  React.useEffect(() => {
    window.setTimeout(() => {
      setToolboxConfiguration((prevConfig: ToolboxInfo) => ({
        ...prevConfig,
        contents: [
          ...prevConfig.contents,
          {
            kind: "category",
            name: "Dynamically added category",
            contents: [
              { kind: "block", type: "text" },
              {
                kind: "block",
                blockxml:
                  '<block type="text_print"><value name="TEXT"><shadow type="text">abc</shadow></value></block>',
              },
            ],
          },
        ],
      }));
    }, 2000);

    window.setTimeout(() => {
      setToolboxConfiguration((prevConfig: ToolboxInfo) => ({
        ...prevConfig,
        contents: [
          ...prevConfig.contents.slice(0, prevConfig.contents.length - 1),
          {
            ...prevConfig.contents[prevConfig.contents.length - 1],
            contents: [{ kind: "block", type: "text" }],
          },
        ],
      }));
    }, 4000);

    window.setTimeout(() => {
      setToolboxConfiguration((prevConfig: ToolboxInfo) => ({
        ...prevConfig,
        contents: [
          ...prevConfig.contents.slice(0, prevConfig.contents.length - 1),
        ],
      }));
    }, 10000);
  }, []);

  const onWorkspaceChange = React.useCallback((workspace) => {
    workspace.registerButtonCallback("myFirstButtonPressed", () => {
      alert("button is pressed");
    });
    const newXml = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace));
    setGeneratedXml(newXml);
    const newJson = JSON.stringify(Blockly.serialization.workspaces.save(workspace));
    setGeneratedJson(newJson);
    const code = pythonGenerator.workspaceToCode(workspace);
    setGeneratedCode(code);
  }, []);

  const onXmlChange = React.useCallback((newXml) => {
    setGeneratedXml(newXml);
  }, []);

  const onJsonChange = React.useCallback((newJson) => {
    setGeneratedJson(JSON.stringify(newJson));
  }, []);
  const [ serialState, setSerialState ] = useState<"XML" | "JSON">("XML")
  return (
    <>
      <div className="hstack">
      <div style={{ height: "600px", width: "600px" }}>
        <BlocklyWorkspace
          key={serialState}
          toolboxConfiguration={toolboxConfiguration}
          workspaceConfiguration={{
            grid: {
              spacing: 20,
              length: 3,
              colour: "#ccc",
              snap: true,
            },
          }}
          initialXml={serialState === "XML" ? ConfigFiles.INITIAL_XML : undefined}
          initialJson={serialState === "JSON" ? ConfigFiles.INITIAL_JSON : undefined}
          className="fill-height"
          onWorkspaceChange={onWorkspaceChange}
          onXmlChange={onXmlChange}
          onJsonChange={onJsonChange}
        />
      </div >
        <div style={{paddingTop: "40px"}}>
        <textarea
            style={{ height: "600px", width: "600px"}}
            value={generatedCode}
            readOnly
        />
        </div>
      </div>
    </>
  );
};

window.addEventListener("load", () => {
  const editor = React.createElement(TestEditor);
  const root = document.createElement("div");
  document.body.appendChild(root);

  ReactDOM.render(editor, root);
});

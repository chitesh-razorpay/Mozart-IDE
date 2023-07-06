import React, { useState } from "react";
import { Typography, Checkbox, FormControlLabel, Grid, Paper } from "@mui/material";
import VanillaJSONEditor from "./VanillaJSONEditor.js";
import "./styles.css";

export default function Editor({data,onChange}) {
  const [showEditor, setShowEditor] = useState(true);
  const [readOnly, setReadOnly] = useState(false);
//   const [content, setContent] = useState(data)
//     json: {
//       greeting: "Hello World",
//       color: "#ff3e00",
//       ok: true,
//       values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
//     },
//     text: undefined
//   }
console.log("data in the editor",data)
  const handleShowEditorToggle = () => {
    setShowEditor(!showEditor);
  };

  const handleReadOnlyToggle = () => {
    setReadOnly(!readOnly);
  };

  return (
    <div className="Editor">
      {/* <FormControlLabel
        control={
          <Checkbox checked={showEditor} onChange={handleShowEditorToggle} />
        }
        label="Show JSON editor"
      />
      <FormControlLabel
        control={
          <Checkbox checked={readOnly} onChange={handleReadOnlyToggle} />
        }
        label="Read only"
      /> */}

      {/* {showEditor && ( */}
        <>
          {/* <Grid xs={12}><Typography variant="h6" gutterBottom>
            Editor
          </Typography></Grid> */}
          <Paper elevation={3} sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <VanillaJSONEditor
                  content={{json:data}}
                  readOnly={readOnly}
                //   onChange={onChange}
                //   mode="tree"
                />
              </Grid>
            </Grid>
          </Paper>
        </>
       {/* )} */}

      {/* <>
        <h2>Contents</h2>
        <pre>
          <code>{JSON.stringify(content, null, 2)}</code>
        </pre>
      </> */}
    </div>
  );
}

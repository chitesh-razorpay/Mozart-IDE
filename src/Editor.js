import React, { useState } from "react";
import { Typography, Checkbox, FormControlLabel, Grid, Paper } from "@mui/material";
import VanillaJSONEditor from "./VanillaJSONEditor.js";

export default function Editor({data,onChange}) {
  const [showEditor, setShowEditor] = useState(true);

  const handleonChange = (d)=>{
    console.log("handling on change",d)
    onChange(d)
  }
  return (
    <div className="Editor">

          <Paper elevation={3} sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <VanillaJSONEditor
                  content={data}
                  onChange={onChange}
                //   mode="tree"
                />
              </Grid>
            </Grid>
          </Paper>
    </div>
  );
}

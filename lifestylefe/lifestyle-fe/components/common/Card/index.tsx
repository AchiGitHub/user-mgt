import { Paper } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

interface CardProps {
    children: React.ReactElement;
    backgroundColor: string;
}

function Card({ backgroundColor, children }: CardProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        "& > :not(style)": {
          m: 1,
          width: '100%',
          height: 128,
        },
      }}
    >
      <Paper elevation={3} sx={{ backgroundColor }}>
        {children}
      </Paper>
    </Box>
  );
}

export default Card;

import { Button, Container, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useRouter } from "next/router";
import React from "react";

function Selection() {
  const route = useRouter();
  return (
    <Container>
      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          sm={6}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Box
            sx={{
              width: 300,
              height: 100,
              backgroundColor: "primary.dark",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "10px",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "primary.main",
                opacity: [0.9, 0.8, 0.7],
                cursor: "pointer",
              },
            }}
            onClick={() => route.push("/membership/register/new")}
          >
            <Typography
              sx={{
                color: "white",
                fontFamily: "sans-serif",
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              New Registration
            </Typography>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Box
            sx={{
              width: 300,
              height: 100,
              backgroundColor: "primary.dark",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "10px",
              "&:hover": {
                backgroundColor: "primary.main",
                opacity: [0.9, 0.8, 0.7],
                cursor: "pointer",
              },
            }}
            onClick={() => route.push("/membership/register/renew")}
          >
            <Typography
              sx={{
                color: "white",
                fontFamily: "sans-serif",
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              Renew Registration
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Selection;

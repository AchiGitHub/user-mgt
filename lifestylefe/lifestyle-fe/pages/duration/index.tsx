import { Button } from "@mui/material";
import { Container } from "@mui/system";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/router";
import React from "react";
import { BASE_URL } from "../../common/utils/constants";

interface DurationsProps {
  durations: any[];
  error: any
}

const columns: GridColDef[] = [
  { field: "durationType", headerName: "Duration Type", width: 100, flex: 1 },
  { field: "duration", headerName: "Duration", width: 100, flex: 1 },
];

export async function getServerSideProps() {
  let response = [];
  let error = {};
  try {
    const durations = await fetch(`${BASE_URL}/membership/duration`);
    const durationsList = await durations.json();
    response = durationsList.response; 
  } catch (error) {
    error = "Something went wrong!";
  }
  return {
    props: {
      durations: response,
      error
    },
  };
}

function Durations({ durations, error }: DurationsProps) {
  const route = useRouter();
  return (
    <Container>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          margin: "0 0 10px 0",
        }}
      >
        <Button variant="contained" onClick={() => route.push("/duration/add")}>
          ADD DURATION
        </Button>
      </div>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          columns={columns}
          rows={durations}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
        />
      </div>
    </Container>
  );
}

export default Durations;

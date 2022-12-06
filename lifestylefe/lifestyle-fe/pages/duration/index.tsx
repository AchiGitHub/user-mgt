import { Delete } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import { Container } from "@mui/system";
import { DataGrid, GridColDef, GridSelectionModel } from "@mui/x-data-grid";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../common/utils/constants";

interface DurationsProps {
  durations: any[];
  error: any;
}

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
      error,
    },
  };
}

function Durations({ durations, error }: DurationsProps) {
  const route = useRouter();

  const [availableDurations, setAvailableDurations] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<GridSelectionModel>();

  useEffect(() => {
    setAvailableDurations(durations);
  }, [durations]);

  const columns: GridColDef[] = [
    { field: "duration", headerName: "Duration", width: 100, flex: 2 },
    { field: "durationType", headerName: "Duration Type", width: 100, flex: 2 },
    {
      field: "delete",
      width: 75,
      sortable: false,
      disableColumnMenu: true,
      renderHeader: () => {
        return (
          <IconButton onClick={handleDeleteDurations}>
            <Delete />
          </IconButton>
        );
      },
    },
  ];

  const handleDeleteDurations = async () => {
    let response = await Promise.allSettled(
      (selectedIds as string[])?.map(async (id) => {
        await fetch(`${BASE_URL}/membership/duration/${id}`, {
          method: "DELETE",
          mode: "cors",
          cache: "no-cache",
          headers: {
            "Content-Type": "application/json",
          },
        });
        return id;
      })
    );
    // get ids that were deleted
    const deletedIds = response.map((resp) =>
      resp.status === "fulfilled" ? resp.value : ""
    );
    // filter available durations
    const durations = availableDurations.filter(
      (item) => !deletedIds.includes(item.id)
    );
    setAvailableDurations(durations);
  };

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
          rows={availableDurations}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          onSelectionModelChange={(ids) => setSelectedIds(ids)}
        />
      </div>
    </Container>
  );
}

export default Durations;

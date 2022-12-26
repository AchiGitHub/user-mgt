import React, { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { Delete } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import { Container } from "@mui/system";
import { DataGrid, GridColDef, GridSelectionModel } from "@mui/x-data-grid";
import { useRouter } from "next/router";
import { Duration } from "../../common/types/Durations";
import { BASE_URL } from "../../common/utils/constants";

interface DurationsProps {
  durations: any[];
  error: any;
  token: string;
}

type Data = {
  durations: Duration[],
  error: any
}

export const getServerSideProps: GetServerSideProps<Data> = async (context) => {
  let response = [];
  let error = {};
  const token = context.req.cookies?.token;
  try {
    const durations = await fetch(`${BASE_URL}/membership/duration`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const durationsList = await durations.json();
    response = durationsList.response;
  } catch (error) {
    return {
      redirect: {
        permanent: false,
        destination: '/login'
      }
    }
  }
  
  return {
    props: {
      durations: response,
      token,
      error,
    },
  };
}

function Durations({ durations, token, error }: DurationsProps) {
  
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
          <IconButton onClick={handleDeleteDurations} disabled={!selectedIds}>
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
            "Authorization": `Bearer ${token}`,
            'Content-Type': 'application/json'
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

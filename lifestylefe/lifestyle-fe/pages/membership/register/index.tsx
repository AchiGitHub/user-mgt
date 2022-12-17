import { Button, Container } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import { BASE_URL } from "../../../common/utils/constants";
import { RegisterTypes } from "../../../common/types/Common";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import moment from "moment";

export async function getServerSideProps() {
  let response = [];
  let error = {};
  try {
    const resp = await fetch(`${BASE_URL}/registration`);
    const members = await resp.json();
    response = members.response;
  } catch (error) {
    error = "Something went wrong!";
  }
  return {
    props: {
      registrations: response,
      error,
    },
  };
}

interface RegisterProps {
  registrations: RegisterTypes[];
}

function Registrations({ registrations }: RegisterProps) {
  const route = useRouter();

  const columns: GridColDef[] = [
    { field: "name", headerName: "Registration Name", minWidth: 200 },
    { field: "membershipType", headerName: "Membership Type", minWidth: 200, renderCell: ({value}) => <div>{value.membershipName}</div> },
    {
      field: "startDate",
      headerName: "Start Date",
      minWidth: 150,
      renderCell: (startDate: any) => <div>{moment(startDate.value).format("YYYY-MM-DD")}</div>,
    },
    {
      field: "endDate",
      headerName: "End Date",
      minWidth: 150,
      renderCell: (endDate: any) => <div>{moment(endDate.value).format("YYYY-MM-DD")}</div>,
    },
    { field: "amount", headerName: "Amount", minWidth: 150 },
    { field: "users", headerName: "Member", minWidth: 150, renderCell: ({value}) =>  <div>{`${value[0].firstName} ${value[0].lastName}`}</div>},
  ];

  return (
    <Container>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          margin: "0 0 10px 0",
        }}
      >
        <Button variant="contained" onClick={() => route.push("/membership/register/type")}>
          Create Registration
        </Button>
      </div>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          columns={columns}
          rows={registrations}
          pageSize={5}
          rowsPerPageOptions={[5]}
          sx={{ overflowX: "scroll" }}
        />
      </div>
    </Container>
  );
}

export default Registrations;

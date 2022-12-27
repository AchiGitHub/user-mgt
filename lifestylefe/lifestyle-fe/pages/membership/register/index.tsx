import { Button, Container } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import { BASE_URL } from "../../../common/utils/constants";
import { RegisterTypes } from "../../../common/types/Common";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import moment from "moment";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps<any> = async (context) => {
  let response = [];
  let error = {};
  const token = context.req.cookies?.token;
  try {
    const resp = await fetch(`${BASE_URL}/registration`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
    const members = await resp.json();
    response = members.response;
  } catch (error) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }
  return {
    props: {
      registrations: response,
      error,
      token
    },
  };
}

interface RegisterProps {
  registrations: RegisterTypes[];
  token: string;
}

function Registrations({ registrations, token }: RegisterProps) {
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
    { field: "amount", headerName: "Amount", minWidth: 150 }
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

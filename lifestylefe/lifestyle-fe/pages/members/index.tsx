import { Edit } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { Container } from "@mui/system";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import moment from "moment";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React from "react";
import { Member } from "../../common/types/Common";
import { BASE_URL } from "../../common/utils/constants";

export const getServerSideProps: GetServerSideProps<any> = async (context) => {
  let response = [];
  let error = {};
  const token = context.req.cookies?.token;
  try {
    const resp = await fetch(`${BASE_URL}/member`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
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
      members: response,
      error,
      token,
    },
  };
};

interface MembersProps {
  members: Member[];
  token: string;
}

function Members({ members, token }: MembersProps) {
  const route = useRouter();
  const columns: GridColDef[] = [
    { field: "firstName", headerName: "First Name", minWidth: 150, flex: 1 },
    { field: "lastName", headerName: "Last Name", minWidth: 150, flex: 1 },
    {
      field: "mobileNumber",
      headerName: "Mobile Number",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "address",
      headerName: "Address",
      minWidth: 150,
      flex: 1,
    },
    { field: "occupation", headerName: "Occupation", minWidth: 150, flex: 1 },
    { field: "weight", headerName: "Weight", minWidth: 150, flex: 1 },
    { field: "height", headerName: "Height", minWidth: 150, flex: 1 },
    {
      field: "dob",
      headerName: "Date of Birth",
      minWidth: 150,
      flex: 1,
      renderCell: (dob: any) => (
        <div>{moment(dob.value).format("YYYY-MM-DD")}</div>
      ),
    },
    {
      field: "delete",
      minWidth: 75,
      sortable: false,
      disableColumnMenu: true,
      headerName: "",
      renderCell: (params) => {
        return (
          <IconButton
            onClick={() => route.push(`/members/edit/${params.row.id}`)}
          >
            <Edit />
          </IconButton>
        );
      },
    },
  ];

  return (
    <Container>
      <div style={{ height: 550, width: "100%" }}>
        <DataGrid
          columns={columns}
          rows={members}
          pageSize={100}
          rowsPerPageOptions={[5]}
        />
      </div>
    </Container>
  );
}

export default Members;

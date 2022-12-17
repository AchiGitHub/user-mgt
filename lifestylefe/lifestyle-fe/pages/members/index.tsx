import { Container } from "@mui/system";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import moment from "moment";
import React from "react";
import { Member } from "../../common/types/Common";
import { BASE_URL } from "../../common/utils/constants";

export async function getServerSideProps() {
  let response = [];
  let error = {};
  try {
    const resp = await fetch(`${BASE_URL}/member`);
    const members = await resp.json();
    response = members.response;
  } catch (error) {
    error = "Something went wrong!";
  }
  return {
    props: {
      members: response,
      error,
    },
  };
}

interface MembersProps {
  members: Member[];
}

function Members({ members }: MembersProps) {
  const columns: GridColDef[] = [
    { field: "firstName", headerName: "First Name", width: 100, flex: 1 },
    { field: "lastName", headerName: "Last Name", width: 100, flex: 1 },
    { field: "nic", headerName: "NIC", width: 100, flex: 1 },
    {
      field: "dob",
      headerName: "Date of Birth",
      width: 100,
      flex: 1,
      renderCell: (dob: any) => <div>{moment(dob.value).format("YYYY-MM-DD")}</div>,
    },
    {
      field: "address",
      headerName: "Address",
      width: 100,
      flex: 1
    },
    { field: "mobileNumber", headerName: "Mobile Number", width: 100, flex: 1 },
    { field: "gender", headerName: "Gender", width: 100, flex: 1 },
  ];

  return (
    <Container>
      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          columns={columns}
          rows={members}
          pageSize={20}
          rowsPerPageOptions={[5]}
        />
      </div>
    </Container>
  );
}

export default Members;

import { Delete, Edit } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import { Container } from "@mui/system";
import { DataGrid, GridColDef, GridSelectionModel } from "@mui/x-data-grid";
import moment from "moment";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
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
  const [selectedIds, setSelectedIds] = useState<GridSelectionModel>();
  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const route = useRouter();

  useEffect(() => {
    setAllMembers(members);
  }, [members]);

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
      renderHeader: () => {
        return (
          <IconButton onClick={handleDeleteMembers} disabled={!selectedIds}>
            <Delete />
          </IconButton>
        );
      },
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

  const handleDeleteMembers = async () => {
    let response = await Promise.allSettled(
      (selectedIds as string[])?.map(async (id) => {
        await fetch(`${BASE_URL}/member/${id}`, {
          method: "DELETE",
          mode: "cors",
          cache: "no-cache",
          headers: {
            Authorization: `Bearer ${token}`,
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
    // filter available filteredMembers
    const filteredMembers = allMembers.filter(
      (item) => !deletedIds.includes(item.id)
    );
    setAllMembers(filteredMembers);
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
        <Button
          variant="contained"
          onClick={() => route.push("/members/add")}
        >
          ADD MEMBER
        </Button>
      </div>
      <div style={{ height: 550, width: "100%" }}>
        <DataGrid
          columns={columns}
          rows={allMembers}
          pageSize={100}
          rowsPerPageOptions={[5]}
          checkboxSelection
          onSelectionModelChange={(ids) => setSelectedIds(ids)}
        />
      </div>
    </Container>
  );
}

export default Members;

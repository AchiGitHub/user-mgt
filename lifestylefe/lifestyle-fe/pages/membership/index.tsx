import { Delete, Edit } from "@mui/icons-material";
import { Button, Container, IconButton } from "@mui/material";
import { DataGrid, GridColDef, GridSelectionModel } from "@mui/x-data-grid";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { MembershipType } from "../../common/types/Common";
import { BASE_URL } from "../../common/utils/constants";

interface MembershipTypesProps {
  response: MembershipType[];
  token: string;
  error: any;
}

export const getServerSideProps: GetServerSideProps<any> = async (context) => {
  let response = {};
  let error = {};
  const token = context.req.cookies?.token;
  try {
    const membershipTypes = await fetch(`${BASE_URL}/membership/type`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
    const data = await membershipTypes.json();
    response = data.response;
  } catch (error) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    }
  }
  return {
    props: {
      response,
      token,
      error,
    },
  };
}

function MembershipType({ response, token, error }: MembershipTypesProps) {
  const route = useRouter();
  const [membershipTypes, setMembershipTypes] = useState<MembershipType[]>([]);
  const [selectedIds, setSelectedIds] = useState<GridSelectionModel>();

  useEffect(() => {
    setMembershipTypes(response);
  }, [response]);

  const columns: GridColDef[] = [
    {
      field: "membershipName",
      headerName: "Membership Name",
      width: 100,
      flex: 2,
    },
    { field: "numberOfMembers", headerName: "Members", width: 100, flex: 2 },
    { field: "price", headerName: "Price(Rs.)", width: 100, flex: 2, valueFormatter: (params) => params.value.toFixed(2) },
    {
      field: "duration",
      headerName: "Duration",
      width: 100,
      flex: 2,
      valueGetter: (params) => {
        if (params.row.duration) {
          return `${params.row.duration?.duration} ${params.row.duration?.durationType}`;
        }
        return "Allocated duration deleted"
      }
    },
    {
      field: "delete",
      width: 75,
      sortable: false,
      disableColumnMenu: true,
      renderHeader: () => {
        return (
          <IconButton onClick={handleDeleteType} disabled={!selectedIds}>
            <Delete />
          </IconButton>
        );
      },
      renderCell: (params) => {
        return (
          <IconButton onClick={() => route.push(`/membership/edit/${params.row.id}`)}>
            <Edit />
          </IconButton>
        );
      },
    },
  ];

  const handleDeleteType = async () => {
    let response = await Promise.allSettled(
      (selectedIds as string[])?.map(async (id) => {
        await fetch(`${BASE_URL}/membership/type/${id}`, {
          method: "DELETE",
          mode: "cors",
          cache: "no-cache",
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        return id;
      })
    );
    // get ids that were deleted
    const deletedIds = response.map((resp) =>
      resp.status === "fulfilled" ? resp.value : ""
    );
    // filter available durations
    const durations = membershipTypes.filter(
      (item) => !deletedIds.includes(item.id)
    );
    setMembershipTypes(durations);
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
        <Button variant="contained" onClick={() => route.push("/membership/add")}>
          ADD MEMBERSHIP TYPE
        </Button>
      </div>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          columns={columns}
          rows={membershipTypes}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          onSelectionModelChange={(ids) => setSelectedIds(ids)}
          disableSelectionOnClick
        />
      </div>
    </Container>
  );
}

export default MembershipType;

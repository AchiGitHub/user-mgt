import { Button, Container, IconButton } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../../common/utils/constants";
import { Member, MembershipType, RegisterTypes } from "../../../common/types/Common";
import { DataGrid, GridColDef, GridSelectionModel } from "@mui/x-data-grid";
import moment from "moment";
import { GetServerSideProps } from "next";
import { Delete, Edit } from "@mui/icons-material";

export const getServerSideProps: GetServerSideProps<any> = async (context) => {
  let response = [];
  let membershipTypesResponse = [];
  let error = {};
  const token = context.req.cookies?.token;
  try {
    const resp = await fetch(`${BASE_URL}/registration`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const members = await resp.json();
    response = members.response;

    const membershipTypesResp = await fetch(
      `${BASE_URL}/membership/type`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const membershipTypes = await membershipTypesResp.json();
    membershipTypesResponse = membershipTypes.response;
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
      membershipTypes: membershipTypesResponse,
      error,
      token,
    },
  };
};

interface RegisterProps {
  registrations: RegisterTypes[];
  membershipTypes: MembershipType[];
  token: string;
}

function Registrations({ registrations, token, membershipTypes }: RegisterProps) {
  const [selectedIds, setSelectedIds] = useState<GridSelectionModel>();
  const [allRegistrations, setAllRegistrations] = useState<RegisterTypes[]>([]);

  useEffect(() => {
    setAllRegistrations((registrations??[]).sort((a, b) => a.startDate < b.startDate ? 1 : -1));
  }, [registrations]);

  const route = useRouter();

  const handleDeleteRegistration = async () => {
    let response = await Promise.allSettled(
    (selectedIds as string[])?.map(async (id) => {
      await fetch(`${BASE_URL}/registration/${id}`, {
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
  )
    const deletedIds = response.map((resp) =>
      resp.status === "fulfilled" ? resp.value : ""
    );
    const filteredRegs = allRegistrations.filter(
      (item) => !deletedIds.includes(item.id)
    );
    setAllRegistrations(filteredRegs);
  };

  const columns: GridColDef[] = [
    {
      field: "users",
      headerName: "Member(s)",
      minWidth: 350,
      valueGetter: ({ row }) => {
        let memberNames: string[] = [];
        row.users.forEach((member: Member) => {
          memberNames.push(`${member?.firstName} ${member?.lastName}`);
        });
        return memberNames.join(", ");
      },
    },
    {
      field: "membershipType",
      headerName: "Membership Type",
      minWidth: 200,
      valueGetter: (params) => {
        return params.row.membershipType?.membershipName;
      },
      type: 'singleSelect',
      valueOptions: membershipTypes?.map((membershipType: MembershipType) => membershipType.membershipName)
    },
    {
      field: "startDate",
      headerName: "Start Date",
      minWidth: 150,
      renderCell: (startDate: any) => (
        <div>{moment(startDate?.value).format("YYYY-MM-DD")}</div>
      ),
    },
    {
      field: "endDate",
      headerName: "End Date",
      minWidth: 150,
      renderCell: (endDate: any) => (
        <div>{moment(endDate?.value).format("YYYY-MM-DD")}</div>
      ),
    },
    { field: "amount", headerName: "Amount", minWidth: 150 },
    {
      field: "delete",
      minWidth: 75,
      sortable: false,
      disableColumnMenu: true,
      headerName: "",
      renderHeader: () => {
        return (
          <IconButton onClick={handleDeleteRegistration} disabled={!selectedIds}>
            <Delete />
          </IconButton>
        );
      }
    },
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
        <Button
          variant="contained"
          onClick={() => route.push("/membership/register/type")}
        >
          Create Registration
        </Button>
      </div>
      <div style={{ height: 550, width: "100%" }}>
        <DataGrid
          columns={columns}
          rows={allRegistrations}
          pageSize={100}
          rowsPerPageOptions={[5]}
          sx={{ overflowX: "scroll" }}
          checkboxSelection
          onSelectionModelChange={(ids) => setSelectedIds(ids)}
        />
      </div>
    </Container>
  );
}

export default Registrations;

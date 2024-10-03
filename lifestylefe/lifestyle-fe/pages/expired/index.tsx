import { Container, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Member, MembershipType, RegisterTypes } from "common/types/Common";
import { BASE_URL } from "common/utils/constants";
import moment from "moment";
import { GetServerSideProps } from "next";
import React, { FC } from "react";

export const getServerSideProps: GetServerSideProps<any> = async (context) => {
  let response = [];
  let membershipTypesResponse = [];
  let error = {};
  const token = context.req.cookies?.token;
  try {
    const resp = await fetch(`${BASE_URL}/registration/expired`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const reportData = await resp.json();
    response = reportData.response;

    const membershipTypesResp = await fetch(`${BASE_URL}/membership/type`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
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
    },
  };
};

interface Props {
  registrations: any;
  membershipTypes: MembershipType[];
}

const ExpiredRegistrations: FC<Props> = ({
  membershipTypes,
  registrations,
}) => {
  const columns: GridColDef[] = [
    {
      field: "name",
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
      type: "singleSelect",
      valueOptions: membershipTypes?.map(
        (membershipType: MembershipType) => membershipType.membershipName
      ),
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
  ];

  const sortedRegs = (registrations ?? []).sort(
    (a: RegisterTypes, b: RegisterTypes) => (a.endDate < b.endDate ? 1 : -1)
  );

  return (
    <Container>
      <Typography
        variant="h2"
        m="10px"
        fontWeight="700"
        fontSize="14px"
        color="black"
      >
        Expired Registrations
      </Typography>
      <div style={{ height: 550, width: "100%" }}>
        <DataGrid
          columns={columns}
          rows={sortedRegs}
          pageSize={100}
          rowsPerPageOptions={[5]}
          sx={{ overflowX: "scroll" }}
        />
      </div>
    </Container>
  );
};

export default ExpiredRegistrations;

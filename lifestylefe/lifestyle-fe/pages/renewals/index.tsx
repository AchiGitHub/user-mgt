import { Delete } from "@mui/icons-material";
import { Box, CircularProgress, IconButton, TextField } from "@mui/material";
import { DataGrid, GridColDef, GridSelectionModel } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers";
import moment from "moment";
import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import { Member } from "../../common/types/Common";
import { BASE_URL } from "../../common/utils/constants";

export const getServerSideProps: GetServerSideProps<any> = async (context) => {
  let response = [];
  let error = {};
  const token = context.req.cookies?.token;
  try {
    const resp = await fetch(
      `${BASE_URL}/registration/renewals?date=${moment().toISOString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const registrations = await resp.json();
    response = registrations.response;
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
      renewals: response,
      error,
      token,
    },
  };
};

interface RenewalProps {
  renewals: any;
  token: string;
}

function Renewals({ renewals, token }: RenewalProps) {
  const [loading, setLoading] = useState(false);
  const [allRenewals, setAllRenewals] = useState<any>([]);
  const [selectedDate, setSelectedDate] = useState(moment().toISOString());
  const [selectedIds, setSelectedIds] = useState<GridSelectionModel>();
  useEffect(() => {
    setAllRenewals(renewals);
  }, [renewals]);

  const handleDeleteMembers = async () => {
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
    );
    // get ids that were deleted
    const deletedIds = response.map((resp) =>
      resp.status === "fulfilled" ? resp.value : ""
    );
    // filter available filteredMembers
    const newRenewals = allRenewals.filter(
      (item: any) => !deletedIds.includes(item.id)
    );
    setAllRenewals(newRenewals);
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
      renderCell: ({ value }) => <div>{value?.membershipName}</div>,
    },
    {
      field: "startDate",
      headerName: "Start Date",
      minWidth: 150,
      renderCell: (startDate: any) => (
        <div>{moment(startDate.value).format("YYYY-MM-DD")}</div>
      ),
    },
    {
      field: "endDate",
      headerName: "End Date",
      minWidth: 150,
      renderCell: (endDate: any) => (
        <div>{moment(endDate.value).format("YYYY-MM-DD")}</div>
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
          <IconButton onClick={handleDeleteMembers} disabled={!selectedIds}>
            <Delete />
          </IconButton>
        );
      },
    },
  ];

  const getRenewals = async (date: string) => {
    setLoading(true);
    try {
      const resp = await fetch(
        `${BASE_URL}/registration/renewals?date=${date}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const registrations = await resp.json();
      setAllRenewals(registrations.response);
      setLoading(false);
    } catch (error) {
      console.log("Something went wrong!");
    }
  };

  return (
    <Box>
      <Box>
        <DatePicker
          views={["year", "month"]}
          value={selectedDate}
          label="Select Year/Month"
          onChange={(newValue) => {
            setSelectedDate(moment(newValue).toISOString());
            getRenewals(moment(newValue).toISOString());
          }}
          renderInput={(params) => (
            <TextField
              style={{ width: "100%" }}
              {...params}
              helperText={null}
            />
          )}
        />
      </Box>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box mt="10px">
          <div style={{ height: 550, width: "100%" }}>
            <DataGrid
              columns={columns}
              rows={allRenewals}
              pageSize={100}
              rowsPerPageOptions={[5]}
              sx={{ overflowX: "scroll" }}
              checkboxSelection
              onSelectionModelChange={(ids) => setSelectedIds(ids)}
            />
          </div>
        </Box>
      )}
    </Box>
  );
}

export default Renewals;

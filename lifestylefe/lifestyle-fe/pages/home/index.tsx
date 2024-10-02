import {
  Box,
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { Container } from "@mui/system";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers";
import { Member, MembershipType, Report } from "common/types/Common";
import { BASE_URL } from "common/utils/constants";
import Card from "components/common/Card";
import Dialog from "components/common/Dialog";
import moment from "moment";
import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import styles from "styles/common.module.css";

export const getServerSideProps: GetServerSideProps<any> = async (context) => {
  let response = [];
  let renewalsResp = [];
  let membershipTypesResponse = [];
  let error = {};
  const token = context.req.cookies?.token;
  try {
    const startDate = moment().startOf("month").toISOString();
    const endDate = moment().endOf("month").toISOString();
    const resp = await fetch(
      `${BASE_URL}/report?startDate=${startDate}&endDate=${endDate}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const reportData = await resp.json();
    response = reportData.response;

    const renewals = await fetch(
      `${BASE_URL}/registration/renewals?date=${moment().toISOString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const monthlyRenewals = await renewals.json();
    renewalsResp = monthlyRenewals.response;

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
      report: response,
      renewals: renewalsResp,
      membershipTypes: membershipTypesResponse,
      error,
      token,
    },
  };
};

interface ReportProps {
  token: string;
  report: Report;
  renewals: any;
}

function Home({ token, report, renewals, membershipTypes }: ReportProps) {
  const [data, setData] = useState<Report>();
  const [renewalData, setRenewalData] = useState<any>();
  const [startDate, setStartDate] = useState<moment.Moment | null>(moment());
  const [endDate, setEndDate] = useState<moment.Moment | null>(moment());
  const [isRenewalOpen, setIsRenewalOpen] = useState<boolean>(false);

  useEffect(() => {
    setData(report);
    setRenewalData(renewals);
  }, []);

  useEffect(() => {
    getCustomReport();
    getRenewals();
  }, [startDate, endDate]);

  const getCustomReport = async () => {
    const start = startDate?.startOf("month").toISOString();
    const end = endDate?.endOf("month").toISOString();
    const resp = await fetch(
      `${BASE_URL}/report?startDate=${start}&endDate=${end}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await resp.json();
    if (data) {
      setData(data.response);
    }
  };

  const getRenewals = async () => {
    const start = endDate?.toISOString();
    const renewals = await fetch(
      `${BASE_URL}/registration/renewals?date=${start}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await renewals.json();
    if (data) {
      setRenewalData(data.response);
    }
  };

  const getTotalIncome = () => {
    return data?.membershipSummary.reduce((accumulator, obj) => {
      return accumulator + obj.membershipType.price * obj.count;
    }, 0);
  };

  const getTotalRegistrations = () => {
    return data?.membershipSummary.reduce((accumulator, obj) => {
      return accumulator + obj.count;
    }, 0);
  };
  
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
  ];

  if (!data) {
    return <CircularProgress />;
  }
  return (
    <>
      <Container maxWidth="lg">
        <Typography
          variant="h5"
          m="10px"
          fontWeight="700"
          fontSize="14px"
          color="black"
        >
          This month...
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Card backgroundColor="#393E46">
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                height="100%"
                textAlign="center"
              >
                <Typography
                  variant="h3"
                  fontSize="1.875rem"
                  color="#EEEEEE"
                  fontWeight="700"
                >
                  {getTotalRegistrations()}
                </Typography>
                <Typography
                  variant="h6"
                  fontSize="0.875rem"
                  color="#EEEEEE"
                  fontWeight="600"
                  sx={{ opacity: 0.72 }}
                >
                  New Registrations
                </Typography>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card backgroundColor="#222831">
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                height="100%"
                textAlign="center"
              >
                <Typography
                  variant="h3"
                  fontSize="1.275rem"
                  color="#00ADB5"
                  fontWeight="700"
                >
                  {getTotalIncome()?.toLocaleString("si-LK", {
                    style: "currency",
                    currency: "LKR",
                  })}
                </Typography>
                <Typography
                  variant="h6"
                  fontSize="0.875rem"
                  color="#00ADB5"
                  fontWeight="600"
                  sx={{ opacity: 0.72 }}
                >
                  Membership Income
                </Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>
        <Typography
          variant="h5"
          mt="20px"
          m="10px"
          fontWeight="700"
          fontSize="14px"
          color="black"
        >
          Registrations...
        </Typography>
        <Box mt="20px">
          <Box
            display="flex"
            justifyContent="space-between"
            mb={2}
            alignItems="center"
            className={styles["filter-dates"]}
          >
            <DatePicker
              views={["year", "month"]}
              label="Select Report Start Date"
              value={startDate}
              onChange={(newValue) => {
                setStartDate(newValue);
              }}
              renderInput={(params) => (
                <TextField fullWidth {...params} helperText={null} />
              )}
            />
            <Box ml="10px" mr="10px">
              <Typography>to</Typography>
            </Box>
            <DatePicker
              views={["year", "month"]}
              label="Select Report End Date"
              value={endDate}
              onChange={(newValue) => {
                setEndDate(newValue);
              }}
              renderInput={(params) => (
                <TextField fullWidth {...params} helperText={null} />
              )}
            />
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Card backgroundColor="#00ADB5">
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  height="100%"
                  textAlign="center"
                  onClick={() => setIsRenewalOpen(true)}
                  sx={{ cursor: "pointer" }}
                >
                  <Typography
                    variant="h3"
                    fontSize="1.875rem"
                    color="#222831"
                    fontWeight="700"
                  >
                    {renewalData?.length}
                  </Typography>
                  <Typography
                    variant="h6"
                    fontSize="0.875rem"
                    color="#222831"
                    fontWeight="600"
                    sx={{ opacity: 0.72 }}
                  >
                    Expiring Registrations
                  </Typography>
                </Box>
              </Card>
            </Grid>
            {data?.membershipSummary.map((item, key) => {
              return (
                <Grid key={item.membershipType.id} item xs={12} md={6} sm={6}>
                  <Card backgroundColor="#222831">
                    <Box
                      display="flex"
                      flexDirection="column"
                      justifyContent="center"
                      alignItems="center"
                      height="100%"
                      textAlign="center"
                    >
                      <Typography
                        variant="h3"
                        fontSize="1.275rem"
                        color="#00ADB5"
                        fontWeight="700"
                      >
                        {item.count}
                      </Typography>
                      <Typography
                        variant="h6"
                        fontSize="0.875rem"
                        color="#00ADB5"
                        fontWeight="600"
                        sx={{ opacity: 0.72 }}
                      >
                        {item.membershipType.membershipName}
                      </Typography>
                      <Typography
                        variant="h3"
                        fontSize="1.275rem"
                        color="#00ADB5"
                        fontWeight="700"
                      >
                        {(
                          item.count * item.membershipType.price
                        ).toLocaleString("si-LK", {
                          style: "currency",
                          currency: "LKR",
                        })}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Container>
      <Dialog
        fullWidth
        maxWidth="md"
        open={isRenewalOpen}
        onClose={(_, type) =>
          (type !== "backdropClick" || type !== "backdropClick") &&
          setIsRenewalOpen(false)
        }
        primaryLabel="Membership Renewals"
        primaryAction={{
          label: "Close",
          onClick: () => setIsRenewalOpen(false),
        }}
      >
        <div style={{ height: 520, width: "100%" }}>
          <DataGrid
            columns={columns}
            rows={renewalData}
            pageSize={100}
            rowsPerPageOptions={[5]}
            sx={{ overflowX: "scroll" }}
          />
        </div>
      </Dialog>
    </>
  );
}

export default Home;

import {
  Box,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { Container } from "@mui/system";
import { DatePicker } from "@mui/x-date-pickers";
import { Report } from "common/types/Common";
import { BASE_URL } from "common/utils/constants";
import Card from "components/common/Card";
import moment from "moment";
import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import styles from 'styles/common.module.css';

export const getServerSideProps: GetServerSideProps<any> = async (context) => {
  let response = [];
  let renewalsResp = [];
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

function Home({ token, report, renewals }: ReportProps) {
  const [data, setData] = useState<Report>();
  const [renewalData, setRenewalData] = useState<any>();
  const [startDate, setStartDate] = useState<moment.Moment | null>(moment());
  const [endDate, setEndDate] = useState<moment.Moment | null>(moment());

  useEffect(() => {
    setData(report);
    setRenewalData(renewals);
  }, []);

  useEffect(() => {
    getCustomReport();
    getRenewals();
  }, [startDate, endDate])

  const getCustomReport = async () => {
    const start = startDate?.startOf('month').toISOString();
    const end = endDate?.endOf('month').toISOString();
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
  }

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
  }

  if (!data) {
    return <CircularProgress />;
  }


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

  return (
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
          <Card backgroundColor="rgb(255, 247, 205)">
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
                color="rgb(16, 57, 150)"
                fontWeight="700"
              >
                {getTotalRegistrations()}
              </Typography>
              <Typography
                variant="h6"
                fontSize="0.875rem"
                color="rgb(16, 57, 150)"
                fontWeight="600"
                sx={{ opacity: 0.72 }}
              >
                New Registrations
              </Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card backgroundColor="rgb(209, 233, 252)">
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
                color="rgb(16, 57, 150)"
                fontWeight="700"
              >
                {renewalData.length}
              </Typography>
              <Typography
                variant="h6"
                fontSize="0.875rem"
                color="rgb(16, 57, 150)"
                fontWeight="600"
                sx={{ opacity: 0.72 }}
              >
                Expiring Registrations
              </Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card backgroundColor="rgb(208, 242, 255)">
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
                color="rgb(16, 57, 150)"
                fontWeight="700"
              >
                {getTotalIncome().toLocaleString("si-LK", {
                  style: "currency",
                  currency: "LKR",
                })}
              </Typography>
              <Typography
                variant="h6"
                fontSize="0.875rem"
                color="rgb(16, 57, 150)"
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
        <Box display='flex' justifyContent='space-between' mb={2} alignItems="center" className={styles['filter-dates']}>
          <DatePicker
            views={['year', 'month']}
            label="Select Report Start Date"
            value={startDate}
            onChange={(newValue) => {
              setStartDate(newValue);
            }}
            renderInput={(params) => <TextField fullWidth {...params} helperText={null} />}            
          />
          <Box ml='10px' mr='10px'>
            <Typography>to</Typography>
          </Box>
          <DatePicker
            views={['year', 'month']}
            label="Select Report End Date"
            value={endDate}
            onChange={(newValue) => {
              setEndDate(newValue);
            }}
            renderInput={(params) => <TextField fullWidth {...params} helperText={null} />}
          />
        </Box>
        <Grid container spacing={3}>
          {data?.membershipSummary.map((item, key) => {
            return (
              <Grid key={item.membershipType.id} item xs={12} md={6} sm={6}>
                <Card backgroundColor="rgb(208, 242, 255)">
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
                      color="rgb(16, 57, 150)"
                      fontWeight="700"
                    >
                      {item.count}
                    </Typography>
                    <Typography
                      variant="h6"
                      fontSize="0.875rem"
                      color="rgb(16, 57, 150)"
                      fontWeight="600"
                      sx={{ opacity: 0.72 }}
                    >
                      {item.membershipType.membershipName}
                    </Typography>
                    <Typography
                      variant="h3"
                      fontSize="1.275rem"
                      color="rgb(16, 57, 150)"
                      fontWeight="700"
                    >
                      {(item.count * item.membershipType.price).toLocaleString(
                        "si-LK",
                        {
                          style: "currency",
                          currency: "LKR",
                        }
                      )}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Container>
  );
}

export default Home;

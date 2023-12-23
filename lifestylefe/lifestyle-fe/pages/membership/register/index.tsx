import {
  Box,
  Button,
  CircularProgress,
  Container,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../../common/utils/constants";
import { Member, RegisterTypes } from "../../../common/types/Common";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import moment from "moment";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps<any> = async (context) => {
  let response: any[] = [];
  let pages: number = 0;
  let totalElements: number = 0;
  let error = {};
  const token = context.req.cookies?.token;
  try {
    const resp = await fetch(`${BASE_URL}/registration/active?pageNum=0`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const members = await resp.json();
    const allRegistrations: RegisterTypes[] = members.response.content;
    pages = members.response.totalPages;
    totalElements = members.response.totalElements;
    allRegistrations.map((reg) => {
      if (moment(reg.endDate).isAfter(moment(new Date()))) {
        response.push(reg);
      }
    });
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
      pages,
      totalElements,
      error,
      token,
    },
  };
};

interface RegisterProps {
  registrations: RegisterTypes[];
  token: string;
  totalElements: number;
  pages: number;
}

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: any) => string;
}

function Registrations({
  registrations,
  pages,
  totalElements,
  token,
}: RegisterProps) {
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [allRegs, setAllRegs] = useState<RegisterTypes[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const route = useRouter();

  useEffect(() => {
    setAllRegs(registrations);
  }, []);

  const columns: Column[] = [
    {
      id: "users",
      label: "Member(s)",
      minWidth: 350,
      format: (members) => {
        console.log(members)
        let memberNames: string[] = [];
        members.forEach((member: Member) => {
          memberNames.push(`${member?.firstName} ${member?.lastName}`);
        });
        return memberNames.join(", ");
      },
    },
    {
      id: "membershipType",
      label: "Membership Type",
      minWidth: 200,
      format: (membershipType) => {
        return membershipType?.membershipName;
      },
    },
    {
      id: "startDate",
      label: "Start Date",
      minWidth: 150,
      format: (startDate: any) => moment(startDate?.value).format("YYYY-MM-DD"),
    },
    {
      id: "endDate",
      label: "End Date",
      minWidth: 150,
      format: (endDate: any) => moment(endDate?.value).format("YYYY-MM-DD"),
    },
    { id: "amount", label: "Amount", minWidth: 150 },
  ];

  const getRegistrations = async (page: number) => {
    let response: any[] = [];
    setLoading(true);
    setPageNumber(page);
    await fetch(`${BASE_URL}/registration/active?pageNum=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        return response.response;
      })
      .then((resp: any) => {
        const allRegistrations: RegisterTypes[] = resp.content;
        allRegistrations.map((reg) => {
          if (moment(reg.endDate).isAfter(moment(new Date()))) {
            response.push(reg);
          }
        });
        setAllRegs(response);
      })
      .catch(() => route.push("/login"))
      .finally(() => setLoading(false))
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
          onClick={() => route.push("/membership/register/type")}
        >
          Create Registration
        </Button>
      </div>
      <div style={{ height: 550, width: "100%" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead color="primary">
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody sx={{height: '400px'}}>
              {loading ? <Box position='absolute' top='50%' left='50%'><CircularProgress/></Box> : allRegs.map((row: any) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={`${row.name}${row.startDate}`}>
                    {columns.map((column: any) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format ? column.format(value) : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          rowsPerPageOptions={[]}
          count={totalElements}
          rowsPerPage={10}
          page={pageNumber}
          onPageChange={(event: unknown, newPage: number) =>
            getRegistrations(newPage)
          }
        />
      </div>
    </Container>
  );
}

export default Registrations;

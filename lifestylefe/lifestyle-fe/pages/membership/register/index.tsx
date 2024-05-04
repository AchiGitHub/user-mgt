import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../../common/utils/constants";
import { Member, RegisterTypes } from "../../../common/types/Common";
import moment from "moment";
import { GetServerSideProps } from "next";
import { Delete } from "@mui/icons-material";

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
  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>();
  const route = useRouter();

  useEffect(() => {
    setAllRegs(registrations);
    getAllMembers();
  }, []);

  const getAllMembers = async () => {
    try {
      const resp = await fetch(`${BASE_URL}/member`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const members = await resp.json();
      setAllMembers(members.response);
    } catch (error) {
      console.log(error);
    }
  };

  const columns: Column[] = [
    {
      id: "users",
      label: "Member(s)",
      minWidth: 350,
      format: (members) => {
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
      format: (startDate: any) => moment(startDate).format("YYYY-MM-DD"),
    },
    {
      id: "endDate",
      label: "End Date",
      minWidth: 150,
      format: (endDate: any) => moment(endDate).format("YYYY-MM-DD"),
    },
    { id: "amount", label: "Amount", minWidth: 150 },
    { id: "delete", label: "Delete" },
  ];

  const getRegistrations = async (
    page: number,
    filterId: null | string = null
  ) => {
    let response: any[] = [];
    setLoading(true);
    setPageNumber(page);
    await fetch(
      `${BASE_URL}/registration/active?pageNum=${page}${
        !!filterId ? `&id=${filterId}` : ""
      }`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )
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
      .finally(() => setLoading(false));
  };

  const handleDeleteRegistration = async (id: string) => {
    let response = await fetch(`${BASE_URL}/registration/${id}`, {
      method: "DELETE",
      mode: "cors",
      cache: "no-cache",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    // filter available filteredMembers
    const filteredRegs = allRegs.filter((item) => item.id !== id);
    setAllRegs(filteredRegs);
  };

  return (
    <Container>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          margin: "0 0 10px 0",
        }}
      >
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          value={selectedMember}
          options={allMembers.map((member) => ({
            ...member,
            label: `${member.firstName} ${member.lastName}`,
          }))}
          sx={{ width: 300 }}
          renderOption={(props, option) => {
            return (
              <li {...props} key={option.id}>
                {`${option.firstName} ${option.lastName}`}
              </li>
            );
          }}
          renderInput={(params) => <TextField {...params} label="Member" />}
          onChange={(_, v) => {
            if (v) {
              setPageNumber(0);
              getRegistrations(0, v.id);
              setSelectedMember(v);
            } else {
              setPageNumber(0);
              getRegistrations(0);
              setSelectedMember(null);
            }
          }}
        />
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
            <TableBody sx={{ height: "400px" }}>
              {loading ? (
                <Box position="absolute" top="50%" left="50%">
                  <CircularProgress />
                </Box>
              ) : (
                allRegs.map((row: any) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={`${row.name}${row.startDate}`}
                      sx={{ maxHeight: 3 }}
                    >
                      {columns.map((column: any) => {
                        if (column.id === "delete") {
                          return (
                            <TableCell key={column.id} align={column.align}>
                              <IconButton
                                key={column.id}
                                onClick={() => handleDeleteRegistration(row.id)}
                              >
                                <Delete />
                              </IconButton>
                            </TableCell>
                          );
                        } else {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.format ? column.format(value) : value}
                            </TableCell>
                          );
                        }
                      })}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          rowsPerPageOptions={[]}
          count={totalElements}
          rowsPerPage={10}
          page={pageNumber}
          onPageChange={(event: unknown, newPage: number) => {
            getRegistrations(newPage);
            setSelectedMember(null);
          }}
        />
      </div>
    </Container>
  );
}

export default Registrations;

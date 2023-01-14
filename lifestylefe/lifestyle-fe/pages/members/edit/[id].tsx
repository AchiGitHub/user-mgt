import { Button, Container, Grid, MenuItem, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { Form, Formik, FormikValues } from "formik";
import { GetServerSideProps } from "next";
import React, { useState } from "react";
import { Member } from "../../../common/types/Common";
import {
  BASE_URL,
  Gender,
} from "../../../common/utils/constants";
import { memberValidation } from "../../../common/utils/validations";
import styles from "styles/common.module.css";
import { useRouter } from "next/router";
import { ToastType } from "common/types/Common";
import Toast from "components/ui/Toast/Toast";

interface EditMemberProps {
  token: string;
  member: Member;
}

const genderMap: { [key: string]: number } = {
  MALE: 0,
  FEMALE: 1,
};

export const getServerSideProps: GetServerSideProps<any> = async (context) => {
  let response = {};
  let error = {};
  const token = context.req.cookies?.token;
  try {
    const member = await fetch(`${BASE_URL}/member/${context.params?.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await member.json();
    response = data.response;
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
      member: response,
      error,
      token,
    },
  };
};

function EditMember({ member, token }: EditMemberProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState<ToastType>({
    open: false,
    severity: "success",
    message: "",
  });

  const handleToastClose = () => {
    setOpenSnackbar({
      ...openSnackbar,
      open: false,
      severity: "success",
      message: "",
    });
  };

  const handleSubmit = async (values: FormikValues) => {
    setLoading(true);
    try {
      const resp = await fetch(`${BASE_URL}/member/${values.id}`, {
        method: "PUT",
        mode: "cors",
        cache: "no-cache",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (resp.ok) {
        setLoading(false);
        let created: ToastType = {
          ...openSnackbar,
          open: true,
          severity: "success",
          message: "Member edited successfully!",
        };
        setOpenSnackbar(created);
        router.push("/members");
      } else {
        throw new Error("Something went wrong!");
      }
    } catch (error) {
      let created: ToastType = {
        ...openSnackbar,
        open: true,
        severity: "error",
        message: "Error editing Member!",
      };
      setOpenSnackbar(created);
      setLoading(false);
    }
  };

  return (
    <>
      <Formik
        initialValues={{
          ...member,
          gender: genderMap[member.gender],
        }}
        onSubmit={handleSubmit}
        validationSchema={memberValidation}
      >
        {({ values, touched, errors, handleChange, setFieldValue }) => (
          <Form>
            <Container maxWidth="md">
              <div className={styles.formContainer}>
                <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                  <Box sx={{ flex: "1 1 auto" }}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          className={styles.formItem}
                          fullWidth
                          hiddenLabel
                          id="firstName"
                          name="firstName"
                          label="First Name"
                          value={values.firstName}
                          error={touched.firstName && Boolean(errors.firstName)}
                          helperText={touched.firstName && errors.firstName}
                          onChange={handleChange}
                          disabled={false}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          className={styles.formItem}
                          fullWidth
                          hiddenLabel
                          id="lastName"
                          name="lastName"
                          label="Last Name"
                          value={values.lastName}
                          error={touched.lastName && Boolean(errors.lastName)}
                          helperText={touched.lastName && errors.lastName}
                          onChange={handleChange}
                          disabled={false}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          select
                          fullWidth
                          hiddenLabel
                          name="gender"
                          value={values.gender}
                          label="Gender"
                          error={touched.gender && Boolean(errors.gender)}
                          helperText={touched.gender && errors.gender}
                          onChange={handleChange}
                        >
                          {Gender.map((item) => (
                            <MenuItem key={item.id} value={item.id}>
                              {item.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          hiddenLabel
                          name="mobileNumber"
                          value={values.mobileNumber}
                          label="Mobile Number"
                          onChange={handleChange}
                          error={
                            touched.mobileNumber && Boolean(errors.mobileNumber)
                          }
                          helperText={
                            touched.mobileNumber && errors.mobileNumber
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          hiddenLabel
                          name="occupation"
                          value={values.occupation}
                          label="Occupation"
                          onChange={handleChange}
                          error={
                            touched.occupation && Boolean(errors.occupation)
                          }
                          helperText={touched.occupation && errors.occupation}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          hiddenLabel
                          name="address"
                          value={values.address}
                          label="Address"
                          onChange={handleChange}
                          error={touched.address && Boolean(errors.address)}
                          helperText={touched.address && errors.address}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }} mt={5}>
                  <Button onClick={() => router.push('/members')} variant="outlined">
                    Back
                  </Button>
                  <Button type="submit" variant="contained">
                    Submit
                  </Button>
                </Box>
              </div>
            </Container>
          </Form>
        )}
      </Formik>
      <Toast
        severity={openSnackbar.severity}
        open={openSnackbar.open}
        message={openSnackbar.message}
        handleClose={() => handleToastClose()}
      />
    </>
  );
}

export default EditMember;

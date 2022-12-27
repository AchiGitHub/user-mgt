import {
  Container,
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Grid,
  TextField,
  MenuItem,
  Autocomplete,
} from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { Form, Formik, FormikValues, useFormikContext } from "formik";
import moment from "moment";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import {
  AutoCompleteProps,
  Member,
  MembershipType,
  RenewType,
  ToastType,
} from "../../../../common/types/Common";
import {
  BASE_URL,
  PaymentInitialValues,
  PaymentTypes,
  RenewFormModel,
  RenewValues,
} from "../../../../common/utils/constants";
import RenewValidationSchema from "../../../../common/utils/RenewValidationSchema";
import Toast from "../../../../components/ui/Toast/Toast";

export const getServerSideProps: GetServerSideProps<any> = async (context) => {
  let response = [];
  let membershipTypesData = [];
  let error = {};
  const token = context.req.cookies?.token;
  try {
    const resp = await fetch(`${BASE_URL}/member`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
    const data = await resp.json();
    const membershipTypes = await fetch(`${BASE_URL}/membership/type`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
    membershipTypesData = await membershipTypes.json();
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
      members: response,
      membershipTypes: membershipTypesData.response,
      error,
      token
    },
  };
}

interface RenewProps {
  members: Member[];
  membershipTypes: MembershipType[];
  token: string;
}

interface RegistrationDetailsProps {
  members: Member[];
  token: string;
  membershipTypes: MembershipType[];
  handleNext: (registrationId: string) => void;
}

interface PaymentProps {
  registrationId: string;
  token: string;
  handleSubmit: () => void;
}

const steps = ["Package Details", "Payment"];

function Renew({ members, token, membershipTypes }: RenewProps) {
  const router = useRouter();
  const [activeStep, setActiveStep] = React.useState(0);
  const [registrationId, setRegistrationId] = useState("");
  const { formId, formField } = RenewFormModel;
  const isLastStep = activeStep === steps.length - 1;

  const handleRenew = (registrationId: string) => {
    setActiveStep(1);
    setRegistrationId(registrationId);
  };

  const _renderForm = (step: number) => {
    switch (step) {
      case 0:
        return (
          <RegistrationDetails
            members={members}
            token={token}
            membershipTypes={membershipTypes}
            handleNext={handleRenew}
          />
        );
      case 1:
        return (
          <PaymentDetails
            token={token}
            registrationId={registrationId}
            handleSubmit={() => router.push("/membership/register")}
          />
        );
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ width: "100%" }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps: { completed?: boolean } = {};
            const labelProps: {
              optional?: React.ReactNode;
            } = {};
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        <Container style={{ marginTop: 15 }}>
          {_renderForm(activeStep)}
        </Container>
      </Box>
    </Container>
  );
}

// Register form
const RegistrationDetails = ({
  members,
  token,
  membershipTypes,
  handleNext,
}: RegistrationDetailsProps) => {
  const [selectedMembers, setSelectedMembers] = useState<AutoCompleteProps[]>(
    []
  );
  const [loading, setLoading] = React.useState(false);
  const [openSnackbar, setOpenSnackbar] = React.useState<ToastType>({
    open: false,
    severity: "success",
    message: "",
  });
  const { formId, formField } = RenewFormModel;
  const { membershipType, amount, endDate, startDate, users } = formField;

  const handleSubmit = async (values: FormikValues) => {
    setLoading(true);
    try {
      const resp = await fetch(`${BASE_URL}/registration`, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values),
      });
      const data = await resp.json();

      if (resp.ok) {
        setLoading(false);
        let created: ToastType = {
          ...openSnackbar,
          open: true,
          severity: "success",
          message: "Registration renewed successfully!",
        };
        setOpenSnackbar(created);
        handleNext(data.id);
      } else {
        throw new Error("Something went wrong!");
      }
    } catch (error) {
      let created: ToastType = {
        ...openSnackbar,
        open: true,
        severity: "error",
        message: "Error renewing registration!",
      };
      setOpenSnackbar(created);
      setLoading(false);
    }
  };

  const handleToastClose = () => {
    setOpenSnackbar({
      ...openSnackbar,
      open: false,
      severity: "success",
      message: "",
    });
  };

  const getOptions = () => {
    return members.map((member: Member) => ({
      id: member.id,
      label: `${member.firstName} ${member.lastName}`,
    }));
  };

  const handleMembershipType = (value: any, setValue: any) => {
    const selectedMembership = membershipTypes.filter(
      (item) => item.id === value
    )[0];
    setValue(amount.name, selectedMembership.price);
    setValue(membershipType.name, value);
  };

  const handleMembers = (
    value: AutoCompleteProps[],
    setValue: (
      field: string,
      value: any,
      shouldValidate?: boolean | undefined
    ) => void
  ) => {
    if (value.length > 0) {
      const ids = value.map((member) => member.id);
      setSelectedMembers(value);
      setValue("users", ids);
      setValue("name", value[0].label);
    } else {
      setSelectedMembers([]);
      setValue("users", []);
      setValue("name", "");
    }
  };

  return (
    <>
      <Formik
        initialValues={RenewValues}
        onSubmit={handleSubmit}
        validationSchema={RenewValidationSchema[0]}
      >
        {({ values, touched, errors, handleChange, setFieldValue }) => (
          <Form id={formId}>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Box sx={{ flex: "1 1 auto" }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      fullWidth
                      hiddenLabel
                      id={membershipType.name}
                      name={membershipType.name}
                      label={membershipType.label}
                      value={values.membershipType}
                      onChange={(e) =>
                        handleMembershipType(e.target.value, setFieldValue)
                      }
                      error={
                        touched.membershipType && Boolean(errors.membershipType)
                      }
                      helperText={
                        touched.membershipType && errors.membershipType
                      }
                    >
                      {membershipTypes.map((item: MembershipType) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.membershipName}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Autocomplete
                      disablePortal
                      fullWidth
                      id="combo-box-demo"
                      options={getOptions()}
                      multiple
                      value={selectedMembers}
                      isOptionEqualToValue={(option, value) =>
                        option.id === value.id
                      }
                      onChange={(e, value) =>
                        handleMembers(value, setFieldValue)
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={Boolean(touched.users && errors.users)}
                          fullWidth
                          helperText={touched.users && errors.users}
                          label="User(s)"
                          name="users"
                          variant="outlined"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <DesktopDatePicker
                      label={startDate.label}
                      inputFormat="MM/DD/YYYY"
                      value={values.startDate}
                      onChange={(value) =>
                        setFieldValue(
                          startDate.name,
                          moment(value).toISOString()
                        )
                      }
                      renderInput={(params) => (
                        <TextField
                          id={startDate.name}
                          label={startDate.label}
                          margin="normal"
                          name={startDate.name}
                          variant="standard"
                          fullWidth
                          error={touched.startDate && Boolean(errors.startDate)}
                          helperText={touched.startDate && errors.startDate}
                          {...params}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <DesktopDatePicker
                      label={endDate.label}
                      inputFormat="MM/DD/YYYY"
                      value={values.endDate}
                      onChange={(value) =>
                        setFieldValue(endDate.name, moment(value).toISOString())
                      }
                      renderInput={(params) => (
                        <TextField
                          id={endDate.name}
                          label={endDate.label}
                          margin="normal"
                          name={endDate.name}
                          variant="standard"
                          fullWidth
                          error={touched.endDate && Boolean(errors.endDate)}
                          helperText={touched.endDate && errors.endDate}
                          {...params}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      fullWidth
                      hiddenLabel
                      id={amount.name}
                      name={amount.name}
                      label={amount.label}
                      value={values.amount}
                      onChange={handleChange}
                      error={touched.amount && Boolean(errors.amount)}
                      helperText={touched.amount && errors.amount}
                      disabled={false}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "end" }} mt={5}>
              <Button type="submit" variant="contained">
                Next
              </Button>
            </Box>
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
};

// Payments form
const PaymentDetails = ({ registrationId, token, handleSubmit }: PaymentProps) => {
  const [loading, setLoading] = React.useState(false);
  const [openSnackbar, setOpenSnackbar] = React.useState<ToastType>({
    open: false,
    severity: "success",
    message: "",
  });
  const { formId, formField } = RenewFormModel;
  const { paymentType, paymentAmount } = formField;

  const submit = async (values: FormikValues) => {
    setLoading(true);
    try {
      const resp = await fetch(`${BASE_URL}/payment`, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({...values, registrationId}),
      });

      if (resp.ok) {
        setLoading(false);
        let created: ToastType = {
          ...openSnackbar,
          open: true,
          severity: "success",
          message: "Payment recieved successfully!",
        };
        setOpenSnackbar(created);
        handleSubmit();
      } else {
        throw new Error("Something went wrong!");
      }
    } catch (error) {
      let created: ToastType = {
        ...openSnackbar,
        open: true,
        severity: "error",
        message: "Error renewing registration!",
      };
      setOpenSnackbar(created);
      setLoading(false);
    }
  };

  const handleToastClose = () => {
    setOpenSnackbar({
      ...openSnackbar,
      open: false,
      severity: "success",
      message: "",
    });
  };

  return (
    <>
      <Formik initialValues={PaymentInitialValues} validationSchema={RenewValidationSchema[1]} onSubmit={submit}>
        {({ values, touched, errors, handleChange, setFieldValue }) => (
          <Form>
            <Box sx={{ flex: "1 1 auto" }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    hiddenLabel
                    id={paymentType.name}
                    name={paymentType.name}
                    label={paymentType.label}
                    value={values.paymentType}
                    onChange={handleChange}
                    error={touched.paymentType && Boolean(errors.paymentType)}
                    helperText={touched.paymentType && errors.paymentType}
                  >
                    {PaymentTypes.map((item: any) => (
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
                    type="number"
                    id={paymentAmount.name}
                    name={paymentAmount.name}
                    label={paymentAmount.label}
                    value={values.paymentAmount}
                    onChange={handleChange}
                    error={
                      touched.paymentAmount && Boolean(errors.paymentAmount)
                    }
                    helperText={touched.paymentAmount && errors.paymentAmount}
                    disabled={false}
                  />
                </Grid>
              </Grid>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                pt: 2,
              }}
            >
              <Button type="submit" variant="contained">
                Next
              </Button>
            </Box>
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
};

export default Renew;

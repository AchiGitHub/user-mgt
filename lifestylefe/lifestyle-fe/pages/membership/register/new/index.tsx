import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Container } from "@mui/system";
import { Form, Formik, FormikConfig, FormikValues } from "formik";
import MembershipSelection from "../../../../components/ui/Register/MembershipSelection";
import Members from "../../../../components/ui/Register/Members";
import Payment from "../../../../components/ui/Register/Payments";
import {
  BASE_URL,
  RegisterFormModel,
  RegisterValues,
} from "../../../../common/utils/constants";
import {
  MembershipType,
  RegisterTypes,
  ToastType,
} from "../../../../common/types/Common";
import validationSchema from "../../../../common/utils/validationSchema";
import { useRouter } from "next/router";
import Toast from "../../../../components/ui/Toast/Toast";
import { GetServerSideProps } from "next";

interface RegisterProps {
  response: MembershipType[];
  token: string;
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
    };
  }
  return {
    props: {
      response,
      error,
      token
    },
  };
}

const steps = ["General", "Add Members", "Payment"];

export default function Register({ response, token }: RegisterProps) {
  const router = useRouter();
  const { formId, formField } = RegisterFormModel;

  const [activeStep, setActiveStep] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [openSnackbar, setOpenSnackbar] = React.useState<ToastType>({
    open: false,
    severity: "success",
    message: "",
  });

  const isLastStep = activeStep === steps.length - 1;

  const currentValidationSchema = validationSchema[activeStep];

  const _renderForm = (step: number) => {
    switch (step) {
      case 0:
        return (
          <MembershipSelection
            membershipTypes={response}
            formField={formField}
          />
        );
      case 1:
        return <Members membershipTypes={response} />;
      case 2:
        return <Payment formField={formField} membershipTypes={response} />;
      default:
        return <div>not found</div>;
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleSubmit = (values: FormikValues, actions: any) => {
    if (isLastStep) {
      handleRegister(values);
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
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

  const handleRegister = async (values: FormikValues) => {
    const payload = {
      ...values,
      name: `${values.users[0]?.firstName} ${values.users[0]?.lastName}`,
    };
    setLoading(true);
    try {
      const resp = await fetch(`${BASE_URL}/registration/new`, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
      });

      if (resp.ok) {
        setLoading(false);
        let created: ToastType = {
          ...openSnackbar,
          open: true,
          severity: "success",
          message: "Registration created successfully!",
        };
        setOpenSnackbar(created);
        router.push("/membership/register");
      } else {
        throw new Error("Something went wrong!");
      }
    } catch (error) {
      let created: ToastType = {
        ...openSnackbar,
        open: true,
        severity: "error",
        message: "Error creating registration!",
      };
      setOpenSnackbar(created);
      setLoading(false);
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
          <Formik
            initialValues={RegisterValues}
            validationSchema={currentValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }: any) => (
              <Form id={formId}>
                {_renderForm(activeStep)}
                <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                  >
                    Back
                  </Button>
                  <Box sx={{ flex: "1 1 auto" }} />
                  <Button type="submit" variant="contained">
                    {activeStep === steps.length - 1 ? "Finish" : "Next"}
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </Container>
      </Box>
      <Toast
        severity={openSnackbar.severity}
        open={openSnackbar.open}
        message={openSnackbar.message}
        handleClose={() => handleToastClose()}
      />
    </Container>
  );
}

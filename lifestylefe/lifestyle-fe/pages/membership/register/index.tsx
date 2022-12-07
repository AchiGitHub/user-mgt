import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Container } from "@mui/system";
import { Form, Formik, FormikConfig, FormikValues } from "formik";
import MembershipSelection from "../../../components/ui/Register/MembershipSelection";
import Members from "../../../components/ui/Register/Members";
import Summary from "../../../components/ui/Register/Summary";
import { BASE_URL, RegisterFormModel } from "../../../common/utils/constants";
import { MembershipType } from "../../../common/types/Common";
import validationSchema from "../../../common/utils/validationSchema";

interface RegisterProps {
  response: MembershipType[]
}

export async function getServerSideProps() {
  let response = {};
  let error = {};
  try {
    const membershipTypes = await fetch(`${BASE_URL}/membership/type`);
    const data = await membershipTypes.json();
    response = data.response;
  } catch (error) {
    error = "Something went wrong!";
  }
  return {
    props: {
      response,
      error,
    },
  };
}

const steps = ["General", "Add Members", "Summary", "Payment"];

export default function Register({ response }: RegisterProps) {
  const { formId, formField } = RegisterFormModel;

  const [activeStep, setActiveStep] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  
  const isLastStep = activeStep === steps.length - 1;

  const currentValidationSchema = validationSchema[activeStep];
  
  const _renderForm = (step: number) => {
    switch (step) {
      case 0:
        return <MembershipSelection membershipTypes={response} formField={formField} />;
        case 1:
          return <Members formField={formField} />;
          case 2:
            return <Summary />;
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
      console.log("Last step to create");
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
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
        {activeStep === steps.length ? (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you&apos;re finished
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Formik
              initialValues={{
                name: ""
              }}
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
          </React.Fragment>
        )}
      </Box>
    </Container>
  );
}

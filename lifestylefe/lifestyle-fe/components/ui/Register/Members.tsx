import React from "react";
import { ExpandCircleDown } from "@mui/icons-material";
import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Grid,
  TextField,
  MenuItem,
} from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { FieldArray, Form, Formik, useFormikContext } from "formik";
import moment from "moment";
import { MembershipType, RegisterTypes } from "../../../common/types/Common";
import { Gender, RegisterValues } from "../../../common/utils/constants";
import { getUsersArray } from "../../../common/utils/validations";

const Members = ({
  membershipTypes,
}: {
  membershipTypes: MembershipType[];
}) => {
  const formikContext = useFormikContext<RegisterTypes>();

  return (
    <FieldArray
      name="users"
      render={({ push, remove }) => {
        return (
          <div>
            {formikContext.values.users.map((p, index) => {
              const firstName = `users[${index}].firstName`;
              const lastName = `users[${index}].lastName`;
              const gender = `users[${index}].gender`;
              const mobileNumber = `users[${index}].mobileNumber`;
              const nic = `users[${index}].nic`;
              const address = `users[${index}].address`;
              const dob = `users[${index}].dob`;
              const occupation = `users[${index}].occupation`;
              const weight = `users[${index}].weight`;
              const height = `users[${index}].height`;

              return (
                <div key={index}>
                  <Accordion
                    style={{ margin: "10px 0" }}
                    defaultExpanded={index === 0}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandCircleDown />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography>
                        {index === 0
                          ? `Member ${index + 1} (Required)`
                          : `Member ${index + 1}`}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            margin="normal"
                            variant="outlined"
                            label="First name"
                            name={firstName}
                            value={p.firstName}
                            onChange={formikContext.handleChange}
                            onBlur={formikContext.handleBlur}
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            margin="normal"
                            variant="outlined"
                            label="Last name"
                            name={lastName}
                            value={p.lastName}
                            onChange={formikContext.handleChange}
                            onBlur={formikContext.handleBlur}
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            select
                            fullWidth
                            hiddenLabel
                            name={gender}
                            value={p.gender}
                            label="Gender"
                            onChange={formikContext.handleChange}
                            onBlur={formikContext.handleBlur}
                          >
                            {Gender.map((item) => (
                              <MenuItem key={item.id} value={item.id}>
                                {item.label}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <DesktopDatePicker
                            label="Date of Birth"
                            inputFormat="MM/DD/YYYY"
                            value={p.dob}
                            maxDate={new Date()}
                            onChange={(value) =>
                              formikContext.setFieldValue(
                                dob,
                                moment(value).toISOString()
                              )
                            }
                            renderInput={(params) => (
                              <TextField
                                label="Date of Birth"
                                margin="normal"
                                name={dob}
                                variant="standard"
                                fullWidth
                                {...params}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            margin="normal"
                            variant="outlined"
                            label="Mobile Number"
                            name={mobileNumber}
                            value={p.mobileNumber}
                            onChange={formikContext.handleChange}
                            onBlur={formikContext.handleBlur}
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            margin="normal"
                            variant="outlined"
                            label="Occupation"
                            name={occupation}
                            value={p.occupation}
                            onChange={formikContext.handleChange}
                            onBlur={formikContext.handleBlur}
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            type="number"
                            margin="normal"
                            variant="outlined"
                            label="Weight(kg)"
                            name={weight}
                            value={p.weight}
                            onChange={formikContext.handleChange}
                            onBlur={formikContext.handleBlur}
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            type="number"
                            margin="normal"
                            variant="outlined"
                            label="height(cm)"
                            name={height}
                            value={p.height}
                            onChange={formikContext.handleChange}
                            onBlur={formikContext.handleBlur}
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                          <TextField
                            margin="normal"
                            variant="outlined"
                            label="Home Address"
                            name={address}
                            value={p.address}
                            onChange={formikContext.handleChange}
                            onBlur={formikContext.handleBlur}
                            fullWidth
                          />
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </div>
              );
            })}
          </div>
        );
      }}
    />
  );
};

export default Members;

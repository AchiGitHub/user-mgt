import { Card, Grid, MenuItem, TextField, Typography } from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { useField, useFormikContext } from "formik";
import moment from "moment";
import React from "react";
import { MembershipType, RegisterTypes } from "../../../common/types/Common";
import { RegisterFormModel } from "../../../common/utils/constants";
import { getUsersArray } from "../../../common/utils/validations";

interface MembershipSelectionProps {
  membershipTypes: MembershipType[];
  formField: typeof RegisterFormModel.formField;
}

function MembershipSelection({
  membershipTypes,
  formField,
}: MembershipSelectionProps) {
  const { name, membershipType, startDate, endDate, amount, paymentAmount } = formField;
  const { values, touched, errors, handleChange, setFieldValue } =
    useFormikContext<RegisterTypes>();

  const handleMembershipTypeChange = (value: string) => {
    const selectedMembershipType = membershipTypes.findIndex(
      (item: MembershipType) => item.id === value
    );
    if (selectedMembershipType > -1) {
      setFieldValue(membershipType.name, value);
      setFieldValue(amount.name, membershipTypes[selectedMembershipType].price);
      setFieldValue(paymentAmount.name, membershipTypes[selectedMembershipType].price);
      setFieldValue("users", getUsersArray(membershipTypes[selectedMembershipType].numberOfMembers));
    }
  };

  const handleAmountChange = (e: any) => {
    setFieldValue(amount.name, e.target.value);
    setFieldValue("paymentAmount", e.target.value);
  }

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom sx={{ padding: 1 }}>
        Package Details
      </Typography>
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
            onChange={(e) => handleMembershipTypeChange(e.target.value)}
            error={touched.membershipType && Boolean(errors.membershipType)}
            helperText={touched.membershipType && errors.membershipType}
          >
            {membershipTypes.map((item: MembershipType) => (
              <MenuItem key={item.id} value={item.id}>
                {item.membershipName}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            hiddenLabel
            type="number"
            id={amount.name}
            name={amount.name}
            label={amount.label}
            value={values.amount}
            onChange={handleAmountChange}
            error={touched.amount && Boolean(errors.amount)}
            helperText={touched.amount && errors.amount}
            disabled={false}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <DesktopDatePicker
            label={startDate.label}
            inputFormat="MM/DD/YYYY"
            value={values.startDate}
            onChange={(value) => setFieldValue(startDate.name, moment(value).toISOString())}
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
            onChange={(value) => setFieldValue(endDate.name, moment(value).toISOString())}
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
      </Grid>
    </React.Fragment>
  );
}

export default MembershipSelection;

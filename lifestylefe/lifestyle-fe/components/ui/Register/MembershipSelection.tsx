import { Card, Grid, MenuItem, TextField, Typography } from "@mui/material";
import { useField } from "formik";
import React from "react";
import { MembershipType } from "../../../common/types/Common";
import { RegisterFormModel } from "../../../common/utils/constants";
import InputField from "../../common/Fields/InputField";

interface MembershipSelectionProps {
  membershipTypes: MembershipType[];
  formField: typeof RegisterFormModel.formField;
}

function MembershipSelection({
  membershipTypes,
  formField,
}: MembershipSelectionProps) {
  const { name, membershipType, startDate, endDate, amount } = formField;
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Package Details
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <InputField name={name.name} label={name.label} fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            hiddenLabel
            id={membershipType.name}
            name={membershipType.name}
            label={membershipType.label}
            disabled={false}
          >
            {membershipTypes.map((type: MembershipType) => (
              <MenuItem key={type.id} value={type.id}>
                {type.membershipName}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default MembershipSelection;

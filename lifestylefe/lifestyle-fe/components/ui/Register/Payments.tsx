import * as React from "react";
import { useFormikContext } from "formik";
import { PaymentTypes, RegisterFormModel } from "../../../common/utils/constants";
import {
  Box,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { MembershipType, RegisterTypes } from "../../../common/types/Common";

interface PaymentsProps {
  membershipTypes: MembershipType[];
  formField: typeof RegisterFormModel.formField;
}

function Payments({ membershipTypes, formField }: PaymentsProps) {
  const { values, touched, errors, handleChange } = useFormikContext<RegisterTypes>();
  const { paymentType, paymentAmount } = formField;
  return (
    <Box>
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
            error={touched.paymentAmount && Boolean(errors.paymentAmount)}
            helperText={touched.paymentAmount && errors.paymentAmount}
            disabled={false}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Payments;

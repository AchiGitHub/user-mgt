import { useFormik } from "formik";
import React from "react";
import styles from "./Duration.module.css";
import { Duration } from "../../../common/types/Durations";
import { DurationInitialValues } from "../../../common/utils/constants";
import { durationsValidation } from "../../../common/utils/validations";
import {
  Button,
  CircularProgress,
  IconButton,
  MenuItem,
  TextField,
} from "@mui/material";
import { useRouter } from "next/router";

interface DurationFormProps {
  loading: boolean;
  handleSubmit: (values: Duration) => void;
}

function DurationForm({ loading, handleSubmit }: DurationFormProps) {
  const route = useRouter();

  const formik = useFormik<Duration>({
    initialValues: DurationInitialValues,
    validationSchema: durationsValidation,
    enableReinitialize: true,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  return (
    <div className={styles.formContainer}>
      <form onSubmit={formik.handleSubmit}>
        <div className={styles.inputRow}>
          <div className={styles.formLabel}>
            Duration<span className={styles.mandatory}>*</span>
          </div>
          <TextField
            className={styles.formItem}
            fullWidth
            hiddenLabel
            id="duration"
            name="duration"
            label="Duration"
            type="number"
            value={formik.values.duration || ""}
            onChange={formik.handleChange}
            error={formik.touched.duration && Boolean(formik.errors.duration)}
            helperText={formik.touched.duration && formik.errors.duration}
            disabled={false}
          />
        </div>
        <div className={styles.inputRow}>
          <div className={styles.formLabel}>
            Duration Type<span className={styles.mandatory}>*</span>
          </div>
          <TextField
            select
            className={styles.formItem}
            fullWidth
            hiddenLabel
            id="durationType"
            name="durationType"
            label="Duration Type"
            value={formik.values.durationType || ""}
            onChange={formik.handleChange}
            error={
              formik.touched.durationType && Boolean(formik.errors.durationType)
            }
            helperText={
              formik.touched.durationType && formik.errors.durationType
            }
            disabled={false}
          >
            <MenuItem value="DAY">Day</MenuItem>
            <MenuItem value="MONTH">Month</MenuItem>
            <MenuItem value="YEAR">Year</MenuItem>
          </TextField>
        </div>
        <div className={styles.action}>
          {loading ? (
            <IconButton>
              <CircularProgress />
            </IconButton>
          ) : (
            <>
              <Button onClick={() => route.push("/duration")}>Back</Button>
              <Button type="submit" variant="outlined">
                Submit
              </Button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}

export default DurationForm;

import { useFormik } from "formik";
import React from "react";
import styles from "./MembershipType.module.css";
import {
  Button,
  CircularProgress,
  IconButton,
  MenuItem,
  TextField,
} from "@mui/material";
import { useRouter } from "next/router";
import { MembershipType } from "../../../common/types/Common";
import { membershiptypeValidation } from "../../../common/utils/validations";
import { Duration } from "../../../common/types/Durations";

interface MembershipTypeFormProps {
  loading: boolean;
  durations: Duration[];
  initialValues: MembershipType;
  handleSubmit: (values: MembershipType) => Promise<void>;
}

function MembershipTypeForm({
  loading,
  durations,
  initialValues,
  handleSubmit,
}: MembershipTypeFormProps) {
  const route = useRouter();

  const formik = useFormik<MembershipType>({
    initialValues: initialValues,
    validationSchema: membershiptypeValidation,
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
            Membership Name<span className={styles.mandatory}>*</span>
          </div>
          <TextField
            className={styles.formItem}
            fullWidth
            hiddenLabel
            id="membershipName"
            name="membershipName"
            label="Membership Name"
            value={formik.values.membershipName || ""}
            onChange={formik.handleChange}
            error={
              formik.touched.membershipName &&
              Boolean(formik.errors.membershipName)
            }
            helperText={
              formik.touched.membershipName && formik.errors.membershipName
            }
            disabled={false}
          />
        </div>
        <div className={styles.inputRow}>
          <div className={styles.formLabel}>
            Price<span className={styles.mandatory}>*</span>
          </div>
          <TextField
            className={styles.formItem}
            fullWidth
            hiddenLabel
            id="price"
            name="price"
            label="Price"
            type="number"
            value={formik.values.price || ""}
            onChange={formik.handleChange}
            error={formik.touched.price && Boolean(formik.errors.price)}
            helperText={formik.touched.price && formik.errors.price}
            disabled={false}
          />
        </div>
        <div className={styles.inputRow}>
          <div className={styles.formLabel}>
            Number of members<span className={styles.mandatory}>*</span>
          </div>
          <TextField
            className={styles.formItem}
            fullWidth
            hiddenLabel
            id="numberOfMembers"
            name="numberOfMembers"
            label="Number of members"
            type="number"
            value={formik.values.numberOfMembers || ""}
            onChange={formik.handleChange}
            error={
              formik.touched.numberOfMembers &&
              Boolean(formik.errors.numberOfMembers)
            }
            helperText={
              formik.touched.numberOfMembers && formik.errors.numberOfMembers
            }
            disabled={false}
          />
        </div>
        <div className={styles.inputRow}>
          <div className={styles.formLabel}>
            Duration<span className={styles.mandatory}>*</span>
          </div>
          <TextField
            select
            className={styles.formItem}
            fullWidth
            hiddenLabel
            id="durationId"
            name="durationId"
            label="Duration Type"
            value={formik.values.durationId || ""}
            onChange={formik.handleChange}
            error={
              formik.touched.durationId && Boolean(formik.errors.durationId)
            }
            helperText={formik.touched.durationId && formik.errors.durationId}
            disabled={false}
          >
            {durations.map((item: Duration, idx) => {
              return (
                <MenuItem
                  key={item.id}
                  value={item.id}
                >{`${item.duration} ${item.durationType}`}</MenuItem>
              );
            })}
          </TextField>
        </div>
        <div className={styles.action}>
          {loading ? (
            <IconButton>
              <CircularProgress />
            </IconButton>
          ) : (
            <>
              <Button onClick={() => route.push("/membership")}>Back</Button>
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

export default MembershipTypeForm;

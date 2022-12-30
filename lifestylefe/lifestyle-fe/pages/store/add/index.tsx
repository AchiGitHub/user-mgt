import {
  Button,
  CircularProgress,
  IconButton,
  MenuItem,
  TextField,
} from "@mui/material";
import { FormikValues, useFormik } from "formik";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Product, ToastType } from "../../../common/types/Common";
import {
  BASE_URL,
  ProductInitialValues,
  ProductTypes,
} from "../../../common/utils/constants";
import { productValidation } from "../../../common/utils/validations";
import Toast from "../../../components/ui/Toast/Toast";
import styles from "../product.module.css";

export const getServerSideProps: GetServerSideProps<any> = async (context) => {
  const token = context.req.cookies?.token;

  if (token) {
    return {
      props: {
        token,
      },
    };
  } else {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }
};

function AddProduct({ token }: { token: string }) {
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

  const handleSubmit = async (values: Product) => {
    setLoading(true);
    try {
      const resp = await fetch(`${BASE_URL}/product`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...values, sold: 0 }),
      });

      if (resp.ok) {
        setLoading(false);
        let created: ToastType = {
          ...openSnackbar,
          open: true,
          severity: "success",
          message: "Product created successfully!",
        };
        setOpenSnackbar(created);
        router.push("/store");
      }
      throw new Error("Something went wrong!");
    } catch (error) {
      let created: ToastType = {
        ...openSnackbar,
        open: true,
        severity: "error",
        message: "Error creating product!",
      };
      setOpenSnackbar(created);
      setLoading(false);
    }
  };

  const formik = useFormik<Product>({
    initialValues: ProductInitialValues,
    validationSchema: productValidation,
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
            Product Name<span className={styles.mandatory}>*</span>
          </div>
          <TextField
            className={styles.formItem}
            fullWidth
            hiddenLabel
            id="productName"
            name="productName"
            label="Product Name"
            value={formik.values.productName || ""}
            onChange={formik.handleChange}
            error={
              formik.touched.productName && Boolean(formik.errors.productName)
            }
            helperText={formik.touched.productName && formik.errors.productName}
            disabled={false}
          />
        </div>
        <div className={styles.inputRow}>
          <div className={styles.formLabel}>
            Product Type<span className={styles.mandatory}>*</span>
          </div>
          <TextField
            select
            className={styles.formItem}
            fullWidth
            hiddenLabel
            id="productType"
            name="productType"
            label="Product Type"
            value={formik.values.productType}
            onChange={formik.handleChange}
            error={
              formik.touched.productType && Boolean(formik.errors.productType)
            }
            helperText={formik.touched.productType && formik.errors.productType}
            disabled={false}
          >
            {ProductTypes.map((item, idx) => {
              return (
                <MenuItem key={item.id} value={item.id}>
                  {item.label}
                </MenuItem>
              );
            })}
          </TextField>
        </div>
        <div className={styles.inputRow}>
          <div className={styles.formLabel}>
            Quantity<span className={styles.mandatory}>*</span>
          </div>
          <TextField
            className={styles.formItem}
            fullWidth
            hiddenLabel
            type="number"
            id="quantity"
            name="quantity"
            label="Quantity"
            value={formik.values.quantity}
            onChange={formik.handleChange}
            error={formik.touched.quantity && Boolean(formik.errors.quantity)}
            helperText={formik.touched.quantity && formik.errors.quantity}
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
            type="number"
            id="price"
            name="price"
            label="Price"
            value={formik.values.price}
            onChange={formik.handleChange}
            error={formik.touched.price && Boolean(formik.errors.price)}
            helperText={formik.touched.price && formik.errors.price}
            disabled={false}
          />
        </div>
        <div className={styles.inputRow}>
          <div className={styles.formLabel}>
            Selling Price<span className={styles.mandatory}>*</span>
          </div>
          <TextField
            className={styles.formItem}
            fullWidth
            type="number"
            hiddenLabel
            id="sellingPrice"
            name="sellingPrice"
            label="Price"
            value={formik.values.sellingPrice}
            onChange={formik.handleChange}
            error={
              formik.touched.sellingPrice && Boolean(formik.errors.sellingPrice)
            }
            helperText={
              formik.touched.sellingPrice && formik.errors.sellingPrice
            }
            disabled={false}
          />
        </div>
        <div className={styles.action}>
          {loading ? (
            <IconButton>
              <CircularProgress />
            </IconButton>
          ) : (
            <>
              <Button onClick={() => router.push("/store")}>Back</Button>
              <Button type="submit" variant="outlined">
                Submit
              </Button>
            </>
          )}
        </div>
      </form>
      <Toast
        severity={openSnackbar.severity}
        open={openSnackbar.open}
        message={openSnackbar.message}
        handleClose={() => handleToastClose()}
      />
    </div>
  );
}

export default AddProduct;

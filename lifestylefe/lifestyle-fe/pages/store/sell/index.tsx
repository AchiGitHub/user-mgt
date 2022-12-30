import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  Button,
  CircularProgress,
  IconButton,
  MenuItem,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import * as yup from "yup";
import { Product, ToastType } from "../../../common/types/Common";
import { BASE_URL } from "../../../common/utils/constants";
import styles from "../product.module.css";

export const getServerSideProps: GetServerSideProps<any> = async (context) => {
  const token = context.req.cookies?.token;

  let response = {};
  let error = {};
  try {
    const res = await fetch(`${BASE_URL}/product`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const product: Product = await res.json();
    response = product;
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
      products: response,
      token,
    },
  };
};

function SellProduct({
  token,
  products,
}: {
  token: string;
  products: Product[];
}) {
  const router = useRouter();

  const [loading, setLoading] = React.useState(false);
  const [allProducts, setAllProducts] = React.useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = React.useState({});

  useEffect(() => {
    const data = products.filter(product => product.quantity > product.sold);
    setAllProducts(data);
  }, [products]);
  

  const handleSubmit = async (values: { id: string; quantity: number }) => {
    setLoading(true);
    try {
      const resp = await fetch(`${BASE_URL}/product/sell`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (resp.ok) {
        setLoading(false);
        router.push("/store");
      }
      throw new Error("Something went wrong!");
    } catch (error) {
      setLoading(false);
    }
  };

  const formik = useFormik<{ id: string; quantity: number }>({
    initialValues: {
      id: "",
      quantity: 0,
    },
    validationSchema: yup.object({
        id: yup.string().required("Product is required!"),
        quantity: yup.number().required("Quantity is required!"),
    }),
    enableReinitialize: true,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const getOptions = () => {
    return allProducts.map((product: Product) => ({
      id: product.id,
      label: product.productName,
    }));
  };

  const getSelectedOption = (id: string) => {
    if (id) {
      const prod = allProducts.filter((item) => item.id === id)[0];
      return { id: prod.id, label: prod.productName };
    } else {
      return null;
    }
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={formik.handleSubmit}>
        <div className={styles.inputRow}>
          <Autocomplete
            disablePortal
            fullWidth
            options={getOptions()}
            value={getSelectedOption(formik.values.id)}
            onChange={(e, value) => formik.setFieldValue("id", value!.id)}
            isOptionEqualToValue={(option, value) =>
              option.id === formik.values.id
            }
            renderInput={(params) => (
              <TextField
                {...params}
                error={Boolean(formik.touched.id && formik.errors.id)}
                fullWidth
                helperText={formik.touched.id && formik.errors.id}
                label="Product"
                name="id"
                variant="outlined"
              />
            )}
          />
        </div>
        <div className={styles.inputRow}>
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
    </div>
  );
}

export default SellProduct;

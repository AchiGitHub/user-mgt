import { Container } from "@mui/material";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";

import { ToastType } from "../../../common/types/Common";
import { Duration } from "../../../common/types/Durations";
import { BASE_URL } from "../../../common/utils/constants";
import DurationForm from "../../../components/ui/DurationForm/DurationForm";
import Toast from "../../../components/ui/Toast/Toast";

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

function AddDuration({ token }: { token: string }) {
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

  const handleAddDuration = async (values: Duration) => {
    setLoading(true);
    try {
      const resp = await fetch(`${BASE_URL}/membership/duration`, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values),
      });

      if (resp.ok) {
        setLoading(false);
        let created: ToastType = {
          ...openSnackbar,
          open: true,
          severity: "success",
          message: "Duration created successfully!",
        };
        setOpenSnackbar(created);
        router.push("/duration");
      }
      throw new Error("Something went wrong!");
    } catch (error) {
      let created: ToastType = {
        ...openSnackbar,
        open: true,
        severity: "error",
        message: "Error creating duration!",
      };
      setOpenSnackbar(created);
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <DurationForm loading={loading} handleSubmit={handleAddDuration} />
      <Toast
        severity={openSnackbar.severity}
        open={openSnackbar.open}
        message={openSnackbar.message}
        handleClose={() => handleToastClose()}
      />
    </Container>
  );
}

export default AddDuration;

import { Container } from "@mui/material";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { MembershipType, ToastType } from "../../../common/types/Common";
import { Duration } from "../../../common/types/Durations";
import {
  BASE_URL,
  MembershipTypeInitialValues,
} from "../../../common/utils/constants";
import MembershipTypeForm from "../../../components/ui/MembershipTypeForm/MembershipTypeForm";
import Toast from "../../../components/ui/Toast/Toast";

interface AddMembershipTypeProps {
  durations: Duration[];
  token: string;
}

export const getServerSideProps: GetServerSideProps<any> = async (context) => {
  let durations = [];
  let error = {};
  const token = context.req.cookies?.token;
  try {
    const data = await fetch(`${BASE_URL}/membership/duration`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
    const durationsList = await data.json();
    durations = durationsList.response;
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
      durations,
      token
    },
  };
};

function AddMembershipType({ durations, token }: AddMembershipTypeProps) {
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

  const handleAddMembershipType = async (values: MembershipType) => {
    setLoading(true);
    try {
      let requestPayload = {
        durationId: values.durationId,
        membershipName: values.membershipName,
        numberOfMembers: values.numberOfMembers,
        price: values.price,
      };
      const resp = await fetch(`${BASE_URL}/membership/type`, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestPayload),
      });

      if (resp.ok) {
        setLoading(false);
        let created: ToastType = {
          ...openSnackbar,
          open: true,
          severity: "success",
          message: "Membership type created successfully!",
        };
        setOpenSnackbar(created);
        router.push("/membership");
      }
      throw new Error("Something went wrong!");
    } catch (error) {
      let created: ToastType = {
        ...openSnackbar,
        open: true,
        severity: "error",
        message: "Error creating membership type!",
      };
      setOpenSnackbar(created);
      setLoading(false);
    }
  };
  return (
    <Container>
      <MembershipTypeForm
        loading={loading}
        durations={durations}
        initialValues={MembershipTypeInitialValues}
        handleSubmit={handleAddMembershipType}
      />
      <Toast
        severity={openSnackbar.severity}
        open={openSnackbar.open}
        message={openSnackbar.message}
        handleClose={() => handleToastClose()}
      />
    </Container>
  );
}

export default AddMembershipType;

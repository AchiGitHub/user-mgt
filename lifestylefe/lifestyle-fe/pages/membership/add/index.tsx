import { Container } from "@mui/material";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { MembershipType, ToastType } from "../../../common/types/Common";
import { Duration } from "../../../common/types/Durations";
import { BASE_URL, MembershipTypeInitialValues } from "../../../common/utils/constants";
import MembershipTypeForm from "../../../components/ui/MembershipTypeForm/MembershipTypeForm";
import Toast from "../../../components/ui/Toast/Toast";

interface AddMembershipTypeProps {
  durations: Duration[];
}

export async function getServerSideProps() {
  let durations = [];
  let error = {};
  try {
    const data = await fetch(`${BASE_URL}/membership/duration`);
    const durationsList = await data.json();
    durations = durationsList.response;
  } catch (error) {
    error = "Something went wrong!";
  }
  return {
    props: {
      durations,
    },
  };
}

function AddMembershipType({ durations }: AddMembershipTypeProps) {
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
          "Content-Type": "application/json",
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

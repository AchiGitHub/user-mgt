import { Container } from "@mui/material";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { MembershipType, ToastType } from "../../../common/types/Common";
import { Duration } from "../../../common/types/Durations";
import { BASE_URL } from "../../../common/utils/constants";
import MembershipTypeForm from "../../../components/ui/MembershipTypeForm/MembershipTypeForm";
import Toast from "../../../components/ui/Toast/Toast";

interface EditMembershipTypeProps {
  durations: Duration[];
  membership: MembershipType;
}

export async function getServerSideProps({ params }: any) {
  let durations = [];
  let membershipType;
  let error = {};
  try {
    const data = await fetch(`${BASE_URL}/membership/duration`);
    const membershipData = await fetch(
      `${BASE_URL}/membership/type/${params.id}`
    );
    const durationsList = await data.json();
    membershipType = await membershipData.json();
    durations = durationsList.response;
  } catch (error) {
    error = "Something went wrong!";
  }
  return {
    props: {
      durations,
      membership: membershipType.response,
    },
  };
}

function EditMembershipType({
  durations,
  membership,
}: EditMembershipTypeProps) {
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

  const handleEditMembershipType = async (values: MembershipType) => {
    setLoading(true);
    try {
      let requestPayload = {
        durationId: values.durationId,
        membershipName: values.membershipName,
        numberOfMembers: values.numberOfMembers,
        price: values.price,
      };
      const resp = await fetch(`${BASE_URL}/membership/type/${values.id}`, {
        method: "PUT",
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
          message: "Membership type edited successfully!",
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
        initialValues={membership}
        handleSubmit={handleEditMembershipType}
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

export default EditMembershipType;

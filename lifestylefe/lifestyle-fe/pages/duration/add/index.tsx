import { Container } from "@mui/material";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Duration } from "../../../common/types/Durations";
import { BASE_URL } from "../../../common/utils/constants";
import DurationForm from "../../../components/ui/DurationForm/DurationForm";

function AddDuration() {

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAddDuration = async (values: Duration) => {
    setLoading(true);
    try {
      await fetch(`${BASE_URL}/membership/duration`, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("🚀 ~ file: index.tsx:28 ~ .then ~ data", data)
          setLoading(false);
          router.push("/duration")
        });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <DurationForm loading={loading} handleSubmit={handleAddDuration} />
    </Container>
  );
}

export default AddDuration;

import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Form, Formik, FormikValues } from "formik";
import { BASE_URL } from "../../common/utils/constants";
import { useRouter } from "next/router";

export default function SignIn() {

  const router = useRouter();

  const handleSubmit = async (values: FormikValues) => {
    const buffer = Buffer.from(`${values.username}:${values.password}`);
    const encodedString = buffer.toString("base64");
    const resp = await fetch(`${BASE_URL}/auth/token`, {
      method: "POST",    
      headers: new Headers({
        Authorization: `Basic ${encodedString}`,
        'Content-Type': 'application/json'
      }),
      credentials: 'include'
    })
      .then((response) => { 
        if (response.status === 200) {
          router.push("/");
        }
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" sx={{ color: "#000" }}>
          Sign in
        </Typography>
        <Box>
          <Formik
            initialValues={{
              username: "",
              password: "",
            }}
            onSubmit={handleSubmit}
          >
            {({ values, handleChange }) => (
              <Form>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  onChange={handleChange}
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  onChange={handleChange}
                  autoComplete="current-password"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign In
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      </Box>
    </Container>
  );
}

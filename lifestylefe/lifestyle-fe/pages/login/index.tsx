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
import Cookie from "js-cookie";
import { CircularProgress, IconButton } from "@mui/material";
import Image from "next/image";

export default function SignIn() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (values: FormikValues) => {
    setLoading(true);
    const buffer = Buffer.from(`${values.username}:${values.password}`);
    const encodedString = buffer.toString("base64");
    const resp = await fetch(`${BASE_URL}/auth/token`, {
      method: "POST",
      headers: new Headers({
        Authorization: `Basic ${encodedString}`,
        "Content-Type": "application/json",
      }),
      credentials: "include",
    })
      .then((res) => res.json())
      .then((response) => {
        Cookie.set("token", response.response);
        router.push("/");
        setLoading(false);
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
        <Box
          sx={{
            borderRadius: "10px",
          }}
        >
          <Image
            width={400}
            height={170}
            src={require("../../public/logo.jpeg")}
            alt="system logo"
            style={{ borderRadius: '5px' }}
          />
        </Box>
        <Typography component="h1" variant="h5" sx={{ color: "#000" }} mt={2}>
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
                {loading ? (
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <IconButton>
                      <CircularProgress />
                    </IconButton>
                  </Box>
                ) : (
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Sign In
                  </Button>
                )}
              </Form>
            )}
          </Formik>
        </Box>
      </Box>
    </Container>
  );
}

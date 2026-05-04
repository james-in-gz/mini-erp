import { useState } from "react";
import { Box, TextField, Button, Typography, Container } from "@mui/material";
import { login } from "../api/auth";
import { setToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Login() {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await login(username, password);
    setToken(res.token);
    navigate("/");
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 10, display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h5">{t("login.title")}</Typography>
        <TextField label={t("login.username")} value={username} onChange={e => setUsername(e.target.value)} />
        <TextField label={t("login.password")} type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <Button variant="contained" onClick={handleLogin}>{t("login.loginButton")}</Button>
      </Box>
    </Container>
  );
}

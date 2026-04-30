import { useState } from "react";
import { Box, TextField, Button, Typography, Container } from "@mui/material";
import { login } from "../api/auth";
import { setToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
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
        <Typography variant="h5">登录</Typography>
        <TextField label="用户名" value={username} onChange={e => setUsername(e.target.value)} />
        <TextField label="密码" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <Button variant="contained" onClick={handleLogin}>登录</Button>
      </Box>
    </Container>
  );
}
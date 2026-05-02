import { Container, Typography, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <Container sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom>
        CRM Dashboard
      </Typography>

      <Stack spacing={2} sx={{ mt: 4 }}>
        <Button
          variant="contained"
          onClick={() => navigate("/customers")}
        >
          Customer List
        </Button>

        {/* Temporary shortcut (for testing) */}
        <Button
          variant="outlined"
          onClick={() => navigate("/customers/1")}
        >
          Go to Customer #1
        </Button>
      </Stack>
    </Container>
  );
}

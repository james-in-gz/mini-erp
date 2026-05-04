import { Container, Typography, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Container sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom>
        {t("dashboard.title")}
      </Typography>

      <Stack spacing={2} sx={{ mt: 4 }}>
        <Button
          variant="contained"
          onClick={() => navigate("/customers")}
        >
          {t("menu.customers")}
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

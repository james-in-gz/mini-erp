import { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Stack,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { createCustomer } from "@/api/customer";

export default function CreateCustomerPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !phone) return;

    setLoading(true);

    try {
      await createCustomer({ name, phone, source });

      // 👉 after success
      navigate("/customers");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom>
          {t("customer.createNew")}
        </Typography>

        <Stack spacing={2} sx={{ mt: 2 }}>
          <TextField
            label={t("customer.name")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />

          <TextField
            label={t("customer.phone")}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
          />

          <TextField
            label={t("customer.source")}
            value={source}
            onChange={(e) => setSource(e.target.value)}
            fullWidth
          />

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
          >
            {t("common.create")}
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
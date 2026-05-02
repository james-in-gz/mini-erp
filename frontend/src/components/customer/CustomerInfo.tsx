import { Card, CardContent, Typography, Chip, Stack } from "@mui/material";
import { Customer } from "@/types/customer";

interface Props {
  customer: Customer;
}

export default function CustomerInfo({ customer }: Props) {
  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h5">{customer.name}</Typography>

        <Typography color="text.secondary">
          {customer.phone}
        </Typography>

        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          <Chip label={customer.status} color="primary" />
          <Chip label={customer.source || "unknown"} />
        </Stack>
      </CardContent>
    </Card>
  );
}

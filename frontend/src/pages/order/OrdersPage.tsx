import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { getOrders } from "@/api/order";

const statusColor: any = {
  pending: "default",
  partial: "warning",
  partial_shipped: "warning",
  shipped: "info",
  completed: "success",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const nav = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    getOrders().then(setOrders);
  }, []);

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5">{t("order.orders")}</Typography>

        <Button
          variant="contained"
          onClick={() => nav("/orders/create")}
        >
          + {t("order.create")}
        </Button>
      </Box>

      {/* ✅ 用 CSS Grid 替代 MUI Grid */}
      <Box
        sx={{
          display: "grid",
          gap: 2,
        }}
      >
        {orders.map((o) => (
          <Card key={o.id} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack sx={{ flexDirection: "row", justifyContent: "space-between" }}>

                {/* 左侧 */}
                <Box>
                  <Typography variant="subtitle1">
                    Order #{o.id}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {t("order.customer")}: {o.customer?.name || "N/A"}
                  </Typography>

                  <Typography variant="body2">
                    {t("order.amount")}: ¥{o.totalAmount}
                  </Typography>
                </Box>

                {/* 右侧 */}
                <Stack sx={{ alignItems: "flex-end"}} spacing={1}>
                  <Chip
                    size="small"
                    label={t(`order.${o.status}`)}
                    color={statusColor[o.status] || "default"}
                  />

                  <Stack sx={{ flexDirection: "row", }} spacing={1}>
                    <Button
                      size="small"
                      onClick={() => nav(`/orders/${o.id}`)}
                    >
                      {t("order.detail")}
                    </Button>

                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => nav(`/orders/${o.id}/ship`)}
                    >
                      {t("order.ship")}
                    </Button>
                  </Stack>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Divider,
  Button,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

import { getOrderDetail } from "@/api/order";

const statusColor: any = {
  pending: "default",
  partial: "warning",
  partial_shipped: "warning",
  shipped: "info",
  completed: "success",
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const { t } = useTranslation();

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (id) {
      const orderId = Number(id);
      if (!Number.isNaN(orderId)) {
        getOrderDetail(orderId).then(setData);
      }
    }
  }, [id]);

  if (!data) return null;

  return (
    <Box>
      {/* 🧾 订单基本信息 */}
      <Card sx={{ borderRadius: 3, mb: 2 }}>
        <CardContent>
          <Stack sx={{ direction: "row", justifyContent: "space-between" }}>
            <Box>
              <Typography variant="h6">
                Order <div id={data.orderNo?data.orderNo: data.id}></div>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("order.customer")}: {data.customer?.name || "N/A"}
              </Typography>
              <Typography>
                {t("order.amount")}: ¥{data.totalAmount}
              </Typography>
            </Box>

            <Stack sx={{ alignItems: "flex-end", spacing: 1 }}>
              <Chip
                size="small"
                label={t(`order.${data.status}`)}
                color={statusColor[data.status] || "default"}
              />

              <Button
                size="small"
                variant="contained"
                onClick={() => nav(`/orders/${data.id}/ship`)}
              >
                {t("order.ship")}
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* 📦 商品列表 */}
      <Card sx={{ borderRadius: 3, mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle1">{t("order.address")}</Typography>

          <Stack sx={{ spacing: 1, mt: 1 }}>
            <Typography variant="body2">
              {data.defaultName} / {data.defaultPhone}
            </Typography>
            <Typography variant="body2">
              {data.defaultProvince} {data.defaultCity} {data.defaultDistrict} {data.defaultAddress}
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      {/* 📦 商品列表 */}
      <Card sx={{ borderRadius: 3, mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle1">{t("order.items")}</Typography>

          <Stack sx={{ spacing: 1, mt: 2 }}>
            {data.items.map((i: any) => (
              <Box key={i.id}>
                <Stack sx={{ direction: "row", justifyContent: "space-between" }}>
                  <Typography>
                    {i.skuName || i.skuCode || `SKU ${i.skuid || i.SKUID}`}
                  </Typography>

                  <Typography>
                    {i.shippedQuantity !== undefined ? i.shippedQuantity : 0} / {i.quantity}
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  ¥{i.price} x {i.quantity} = ¥{i.subtotal}
                </Typography>
                <Divider sx={{ mt: 1 }} />
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* 🚚 发货记录 */}
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="subtitle1">{t("order.shipments")}</Typography>

          <Stack sx={{ spacing: 2, mt: 2 }}>
            {data.shipments?.map((s: any) => (
              <Card key={s.id} variant="outlined">
                <CardContent>
                  <Stack spacing={1}>
                    <Stack sx={{ direction: "row", justifyContent: "space-between" }}>
                      <Typography>
                        {s.carrier} - {s.tracking_number}
                      </Typography>

                      <Chip
                        size="small"
                        label={s.status}
                        color="info"
                      />
                    </Stack>

                    {/* 地址快照 */}
                    <Typography variant="body2" color="text.secondary">
                      {s.receiver_name} / {s.receiver_phone}
                    </Typography>

                    <Typography variant="body2">
                      {s.receiver_addr}
                    </Typography>

                    {/* 商品 */}
                    <Stack sx={{ mt: 1, spacing: 0.5 }}>
                      {(s.shipmentItems || s.shipment_items || []).map((si: any) => (
                        <Typography key={si.id} variant="body2">
                          {si.sku || `SKU ${si.productID}`} x {si.quantity}
                        </Typography>
                      ))}
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
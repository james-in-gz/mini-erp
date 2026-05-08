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
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { Order, OrderItem } from "@/types/order";

import { cancelOrder, getOrderDetail, updateOrderAddress } from "@/api/order";
import { Shipment } from "@/types/shipment";
import OrderAddressSelectDialog from "@/components/customer/OrderAddressSelectDialog";

const statusColor: Record<
  string,
  "default" | "primary" | "secondary" | "success" | "error" | "warning" | "info"
> = {
  pending: "default",
  partial: "warning",
  partial_shipped: "warning",
  shipped: "info",
  completed: "success",
  cancelled: "error",
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const { t } = useTranslation();

  const [data, setData] = useState<Order | null>(null);
  const [openAddressDialog, setOpenAddressDialog] = useState(false);

  const handleCancel = async () => {
    if (!data) return;

    try {
      await cancelOrder(data.id);

      setData({
        ...data,
        status: "cancelled",
      });
    } catch (err) {
      console.error(err);
    }
  };

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
                Order {data.orderNo ? data.orderNo : data.id}
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
              <Stack sx={{ direction: "row", justifyContent: "space-between" ,mt:2,flexWrap:"wrap"}}
                spacing={2}
              >
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => nav(`/orders/${data.id}/ship`)}
                >
                  {t("order.ship")}
                </Button>
                {["pending", "partial"].includes(data.status) && (
                  <Button
                    color="error"
                    variant="outlined"
                    onClick={handleCancel}
                  >
                     {t("order.cancel")}
                  </Button>
                )}
              </Stack>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* 📦 商品列表 */}
      <Card sx={{ borderRadius: 3, mb: 2 }}>
        <CardContent>
          <Stack
            sx={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="subtitle1">{t("order.address")}</Typography>

            <Button
              size="small"
              variant="outlined"
              onClick={() => setOpenAddressDialog(true)}
            >
              {t("common.change_address")}
            </Button>
          </Stack>

          <Stack spacing={1} sx={{ mt: 1 }}>
            <Typography variant="body2">
              {data.defaultName} / {data.defaultPhone}
            </Typography>
            <Typography variant="body2">
              {data.defaultProvince} {data.defaultCity} {data.defaultDistrict}{" "}
              {data.defaultAddress}
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      {/* 📦 商品列表 */}
      <Card sx={{ borderRadius: 3, mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle1">{t("order.items")}</Typography>

          <Stack spacing={1} sx={{ mt: 2 }}>
            {data.items.map((i: OrderItem) => (
              <Box key={i.id}>
                <Stack
                  sx={{ direction: "row", justifyContent: "space-between" }}
                >
                  <Typography>{i.skuName || i.skuCode}</Typography>

                  <Typography>
                    {i.shippedQuantity !== undefined ? i.shippedQuantity : 0} /{" "}
                    {i.quantity}
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  ¥{i.price} x {i.quantity} = ¥
                  {i.subtotal || i.price * i.quantity}
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

          <Stack spacing={1} sx={{ mt: 2 }}>
            {data.shipments?.map((s: Shipment) => (
              <Card key={s.id} variant="outlined">
                <CardContent>
                  <Stack spacing={1}>
                    <Stack
                      sx={{ direction: "row", justifyContent: "space-between" }}
                    >
                      <Typography>
                        {s.carrier} - {s.trackingNumber}
                      </Typography>

                      <Chip size="small" label={s.status} color="info" />
                    </Stack>

                    {/* 地址快照 */}
                    <Typography variant="body2" color="text.secondary">
                      {s.receiverName} / {s.receiverPhone}
                    </Typography>

                    <Typography variant="body2">
                      {s.receiverProvince} {s.receiverCity} {s.receiverDistrict}{" "}
                      {s.receiverAddress}
                    </Typography>

                    {/* 商品 */}
                    <Stack spacing={1} sx={{ mt: 1 }}>
                      {(s.shipmentItems || []).map((si: any) => (
                        <Typography key={si.id} variant="body2">
                          {`SKU ${si.sku}`} x {si.quantity}
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

      <OrderAddressSelectDialog
        open={openAddressDialog}
        customerId={data.customer.id}
        onClose={() => setOpenAddressDialog(false)}
        onConfirm={async (addr) => {
          await updateOrderAddress(data.id, {
            customerAddressId: addr.id,
          });

          setData({
            ...data,

            defaultName: addr.name,
            defaultPhone: addr.phone,

            defaultProvince: addr.province,
            defaultCity: addr.city,
            defaultDistrict: addr.district,

            defaultAddress: addr.address,
          });

          setOpenAddressDialog(false);
        }}
      />
    </Box>
  );
}

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
  IconButton,
} from "@mui/material";
import { Edit as EditIcon, Event as EventIcon } from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { Order, OrderItem } from "@/types/order";
import { DatePicker , LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import {
  cancelOrder,
  getOrderDetail,
  updateOrderAddress,
  updateOrderNextDeliveryTime,
} from "@/api/order";
import { Shipment } from "@/types/shipment";
import OrderAddressSelectDialog from "@/components/customer/OrderAddressSelectDialog";
import PaymentCard from "@/components/order/PaymentCard";

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
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [nextDeliveryTime, setNextDeliveryTime] = useState<Dayjs | null>(null);
  const [editTime, setEditTime] = useState<Dayjs | null>(null);
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

  const fetchOrder = async () => {
    const data = await getOrderDetail(Number(id));

    setData(data);
    setNextDeliveryTime(
      data.nextDeliveryAt ? dayjs(data.nextDeliveryAt) : null,
    );
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  if (!data) return null;

  return (
    <Stack sx={{ height: "100%", overflowY: "auto", mb: 2 }}>
      {/* 🧾 订单基本信息 */}
      <Card sx={{ borderRadius: 3, mb: 2 }}>
        <CardContent>
          <Stack sx={{ flexDirection: "row", justifyContent: "space-between" }}>
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

              {/* 下次发货时间 - 可编辑版本 */}
              <Stack
                spacing={1}
                sx={{ mt: 1, flexDirection: "row", alignItems: "center" }}
              >
                {isEditingTime ? (
                  <>
                    <Box sx={{ mt: 2 }}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label={t("order.nextShipTime")}
                          value={editTime}
                          onChange={(v) => setEditTime(v)}
                        />
                      </LocalizationProvider>
                    </Box>
                    <Button
                      size="small"
                      onClick={async () => {
                        await updateOrderNextDeliveryTime(
                          data.id,
                          editTime ? editTime.toISOString() : null,
                        );
                        setNextDeliveryTime(editTime);
                        setIsEditingTime(false);
                      }}
                    >
                      {t("common.save")}
                    </Button>
                    <Button
                      size="small"
                      onClick={() => setIsEditingTime(false)}
                    >
                      {t("common.cancel")}
                    </Button>
                  </>
                ) : (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <EventIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {t("order.nextShipTime")}:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {nextDeliveryTime
                        ? nextDeliveryTime.format("YYYY-MM-DD")
                        : t("order.notSet")}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => setIsEditingTime(true)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Stack>
            </Box>

            <Stack sx={{ alignItems: "flex-end", spacing: 1 }}>
              <Chip
                size="small"
                label={t(`order.${data.status}`)}
                color={statusColor[data.status] || "default"}
              />
              <Stack
                sx={{
                  direction: "row",
                  justifyContent: "space-between",
                  mt: 2,
                  flexWrap: "wrap",
                }}
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

      {/* 地址列表 */}
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

      {/* 商品列表 */}
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
      <Box>
        <PaymentCard order={data} onRefresh={fetchOrder} />
      </Box>
      {/* 🚚 发货记录 */}
      <Card sx={{ borderRadius: 3 ,my: 2}}>
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
                      <Box>
                        <Typography>
                          {s.carrier} - {s.trackingNumber}
                        </Typography>

                        {/* 👇 时间 */}
                        <Typography variant="caption" color="text.secondary">
                          {s.shippedAt
                            ? new Date(s.shippedAt).toLocaleString()
                            : "-"}
                        </Typography>
                      </Box>

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
    </Stack>
  );
}

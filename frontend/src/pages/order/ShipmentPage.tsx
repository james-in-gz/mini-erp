import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Stack,
  Typography,
} from "@mui/material";

import request from "@/api/request";

export default function ShipmentPage() {
  const { id } = useParams(); // ⭐ 从路由拿 orderId
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);

  const [form, setForm] = useState({
    trackingNumber: "",
    carrier: "",
    receiverName: "",
    receiverPhone: "",
    receiverProvince: "",
    receiverCity: "",
    receiverDistrict: "",
    receiverAddress: "",
  });

  // 🔥 加载订单
  useEffect(() => {
    const fetchOrder = async () => {
      const res = await request.get(`/orders/${id}`);

      if (res.data.code !== 0) {
        alert(t("order.loadFailed"));
        navigate(`/orders/${id}`); // ⭐ 回到订单详情页
        return;
      }

      const orderData = res.data.data;

      setOrder(orderData);

      // ⭐ 初始化发货商品
      setItems(
        orderData.items.map((i: any) => ({
          orderItemId: i.id,
          quantity: i.quantity - (i.shippedQuantity || 0), // 只能发未发货的数量
          name: i.skuName,
          orderedQuantity: i.quantity,
          shippedQuantity: i.shippedQuantity || 0,
        })),
      );

      // ⭐ 自动填收货地址（推荐）
      setForm((prev) => ({
        ...prev,
        receiverName: orderData.defaultName || "",
        receiverPhone: orderData.defaultPhone || "",
        receiverProvince: orderData.defaultProvince || "",
        receiverCity: orderData.defaultCity || "",
        receiverDistrict: orderData.defaultDistrict || "",
        receiverAddress: orderData.defaultAddress || "",
      }));
    };
    fetchOrder();
  }, [id]);

  const handleSubmit = async () => {
    const payload = {
      trackingNumber: form.trackingNumber,
      carrier: form.carrier,
      receiverName: form.receiverName,
      receiverPhone: form.receiverPhone,
      receiverProvince: form.receiverProvince,
      receiverCity: form.receiverCity,
      receiverDistrict: form.receiverDistrict,
      receiverAddress: form.receiverAddress,
      items: items.filter((i) => i.quantity > 0),
    };

    if (payload.items.length === 0) {
      alert(t("order.fillShipQuantity"));
      return;
    }

    request.post(`/orders/${id}/shipments`, payload).then((res) => {
      if (res.data.code === 0) {
        alert(t("order.shipSuccess"));
        navigate(`/orders/${id}`); // ⭐ 回到订单详情页
      } else {
        alert(t("error." + res.data.message));
        return;
      }
    });
  };

  if (!order) return <div>Loading...</div>;

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6">
            {t("order.ship")} #{order.orderNo || order.id}
          </Typography>

          {/* 物流 */}
          <TextField
            label={t("order.trackingNumber")}
            value={form.trackingNumber}
            onChange={(e) =>
              setForm({ ...form, trackingNumber: e.target.value })
            }
          />

          <TextField
            label={t("order.carrier")}
            value={form.carrier}
            onChange={(e) => setForm({ ...form, carrier: e.target.value })}
          />

          {/* 收件人 */}
          <TextField
            label={t("order.receiverName")}
            value={form.receiverName}
            onChange={(e) => setForm({ ...form, receiverName: e.target.value })}
          />

          <TextField
            label={t("order.phone")}
            value={form.receiverPhone}
            onChange={(e) =>
              setForm({ ...form, receiverPhone: e.target.value })
            }
          />

          {/* 收货地址 */}
          <TextField
            label={t("order.province")}
            value={form.receiverProvince}
            onChange={(e) =>
              setForm({ ...form, receiverProvince: e.target.value })
            }
          />

          <TextField
            label={t("order.city")}
            value={form.receiverCity}
            onChange={(e) => setForm({ ...form, receiverCity: e.target.value })}
          />

          <TextField
            label={t("order.district")}
            value={form.receiverDistrict}
            onChange={(e) =>
              setForm({ ...form, receiverDistrict: e.target.value })
            }
          />

          <TextField
            label={t("order.address")}
            value={form.receiverAddress}
            onChange={(e) =>
              setForm({ ...form, receiverAddress: e.target.value })
            }
          />

          {/* 商品发货 */}
          <Typography>{t("order.shipProducts")}</Typography>

          {items.map((i) => (
            <TextField
              key={i.orderItemId}
              label={`${i.name}（已发 ${i.shippedQuantity}/${i.orderedQuantity}，剩余 ${
                i.orderedQuantity - i.shippedQuantity
              }）`}
              type="number"
              value={i.quantity}
              slotProps={{
                htmlInput: {
                  min: 0,
                  max: i.orderedQuantity - i.shippedQuantity,
                },
              }}
              disabled={i.shippedQuantity >= i.orderedQuantity} // 已全部发货的商品不能再修改数量了
              onChange={(e) => {
                const val = Number(e.target.value);

                setItems((prev) =>
                  prev.map((p) =>
                    p.orderItemId === i.orderItemId
                      ? { ...p, quantity: val }
                      : p,
                  ),
                );
              }}
            />
          ))}

          <Button variant="contained" onClick={handleSubmit}>
            {t("order.ship")}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

import { useEffect, useState } from "react";
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

  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);

  const [form, setForm] = useState({
    tracking_number: "",
    carrier: "",
    receiver_name: "",
    receiver_phone: "",
    receiver_addr: "",
  });

  // 🔥 加载订单
  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    const res = await request.get(`/orders/${id}`);
    setOrder(res.data);

    // ⭐ 初始化发货商品
    setItems(
      res.data.items.map((i: any) => ({
        order_item_id: i.id,
        quantity: 0,
        name: i.product?.name,
      }))
    );

    // ⭐ 自动填收货地址（推荐）
    setForm((prev) => ({
      ...prev,
      receiver_name: res.data.receiver_name,
      receiver_phone: res.data.receiver_phone,
      receiver_addr: `${res.data.province} ${res.data.city} ${res.data.district} ${res.data.address}`,
    }));
  };

  const handleSubmit = async () => {
    const payload = {
      ...form,
      items: items.filter((i) => i.quantity > 0),
    };

    if (payload.items.length === 0) {
      alert("请填写发货数量");
      return;
    }

    await request.post(`/orders/${id}/shipments`, payload);

    alert("发货成功");

    navigate(`/orders/${id}`); // ⭐ 回到订单详情页
  };

  if (!order) return <div>Loading...</div>;

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6">
            发货订单 #{order.id}
          </Typography>

          {/* 物流 */}
          <TextField
            label="Tracking Number"
            value={form.tracking_number}
            onChange={(e) =>
              setForm({ ...form, tracking_number: e.target.value })
            }
          />

          <TextField
            label="Carrier"
            value={form.carrier}
            onChange={(e) =>
              setForm({ ...form, carrier: e.target.value })
            }
          />

          {/* 收件人 */}
          <TextField
            label="Receiver Name"
            value={form.receiver_name}
            onChange={(e) =>
              setForm({ ...form, receiver_name: e.target.value })
            }
          />

          <TextField
            label="Phone"
            value={form.receiver_phone}
            onChange={(e) =>
              setForm({ ...form, receiver_phone: e.target.value })
            }
          />

          <TextField
            label="Address"
            value={form.receiver_addr}
            onChange={(e) =>
              setForm({ ...form, receiver_addr: e.target.value })
            }
          />

          {/* 商品发货 */}
          <Typography>发货商品</Typography>

          {items.map((i) => (
            <TextField
              key={i.order_item_id}
              label={i.name}
              type="number"
              value={i.quantity}
              onChange={(e) => {
                const val = Number(e.target.value);

                setItems((prev) =>
                  prev.map((p) =>
                    p.order_item_id === i.order_item_id
                      ? { ...p, quantity: val }
                      : p
                  )
                );
              }}
            />
          ))}

          <Button variant="contained" onClick={handleSubmit}>
            发货
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

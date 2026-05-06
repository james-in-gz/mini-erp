import { useEffect, useState } from "react";
import {
  Card, CardContent, TextField, Button, MenuItem, Stack
} from "@mui/material";
import request from "@/api/request";

export default function SKUPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [form, setForm] = useState({
    product_id: "",
    name: "",
    price: 0,
  });

  useEffect(() => {
    request.get("/products").then(res => setProducts(res.data));
  }, []);

  const handleCreate = async () => {
    await request.post("/skus", form);
    alert("创建成功");
  };

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <TextField
            select
            label="产品"
            value={form.product_id}
            onChange={(e) =>
              setForm({ ...form, product_id: e.target.value })
            }
          >
            {products.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="SKU名称"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <TextField
            label="价格"
            type="number"
            onChange={(e) =>
              setForm({ ...form, price: Number(e.target.value) })
            }
          />

          <Button variant="contained" onClick={handleCreate}>
            创建SKU
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
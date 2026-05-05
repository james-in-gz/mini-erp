import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import { getProducts, createProduct } from "@/api/product";

export default function ProductPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const [form, setForm] = useState({
    name: "",
    sku: "",
    price: 0,
    stock: 0,
  });

  const load = () => {
    getProducts().then(setProducts);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async () => {
    await createProduct(form);
    setOpen(false);
    setForm({ name: "", sku: "", price: 0, stock: 0 });
    load();
  };

  return (
    <Box>
      {/* 顶部 */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5">{t("product.products")}</Typography>

        <Button variant="contained" onClick={() => setOpen(true)}>
          + {t("product.newProduct")}
        </Button>
      </Box>

      {/* 列表 */}
      <Box sx={{ display: "grid", gap: 2 }}>
        {products.map((p) => (
          <Card key={p.id} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack sx={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Box>
                  <Typography>{p.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    SKU: {p.sku}
                  </Typography>
                </Box>

                <Box sx={{ textAlign: "right" }}>
                  <Typography>¥{p.price}</Typography>
                  <Typography variant="body2">
                    {t("product.stock")}: {p.stock}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* 弹窗 */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{t("product.newProduct")}</DialogTitle>

        <DialogContent>
          <Stack sx={{ spacing: 2, mt: 1 }}>
            <TextField
              label={t("product.name")}
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <TextField
              label={t("product.sku")}
              value={form.sku}
              onChange={(e) =>
                setForm({ ...form, sku: e.target.value })
              }
            />

            <TextField
              label={t("product.price")}
              type="number"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: Number(e.target.value) })
              }
            />

            <TextField
              label={t("product.stock")}
              type="number"
              value={form.stock}
              onChange={(e) =>
                setForm({ ...form, stock: Number(e.target.value) })
              }
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>{t("product.cancel")}</Button>
          <Button variant="contained" onClick={handleCreate}>
            {t("product.create")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
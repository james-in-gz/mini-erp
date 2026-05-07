import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { deleteSKU, getSKUDetail, updateSKU } from "@/api/sku";

interface SKU {
  id: number;
  code: string;
  productId: number;

  image?: string;

  price: number;
  costPrice: number;

  weight?: number;

  unit: string;

  status: number;

  specs: {
    name: string;
    value: string;
  }[];
}

export default function SKUEditPage() {
  const { id, productId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<SKU>({
    id: 0,
    code: "",
    productId: 0,
    image: "",
    price: 0,
    costPrice: 0,
    weight: 0,
    unit: "",
    status: 1,
    specs: [],
  });

  useEffect(() => {
    fetchDetail();
  }, []);

  const fetchDetail = async () => {
    if (!id) return;

    const data = await getSKUDetail(id);

    setForm(data);
  };
  const handleDelete = async () => {
    if (!id) return;

    const confirmed = window.confirm(
      "确定删除这个SKU吗？"
    );

    if (!confirmed) return;

    try {
      setLoading(true);

      await deleteSKU(id);

      alert("删除成功");

      navigate(`/products/${productId}`);
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (key: keyof SKU, value: any) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!id) return;

      setLoading(true);

      await updateSKU(id, form);

      alert("修改成功");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          mb: 2,
        }}
      >
        SKU 编辑
      </Typography>

      <Card>
        <CardContent>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr 1fr",
              },
              gap: 3,
            }}
          >
            {/* 左侧 */}
            <Stack sx={{ gap: 2 }}>
              <TextField
                label="SKU编码"
                value={form.code}
                disabled
                fullWidth
              />

              <TextField
                label="销售价格"
                type="number"
                value={form.price ?? 0}
                onChange={(e) =>
                  handleChange("price", Number(e.target.value))
                }
                fullWidth
              />

              <TextField
                label="成本价格"
                type="number"
                value={form.costPrice ?? 0}
                onChange={(e) =>
                  handleChange("costPrice", Number(e.target.value))
                }
                fullWidth
              />

              <TextField
                label="重量(g)"
                type="number"
                value={form.weight ?? 0}
                onChange={(e) =>
                  handleChange("weight", Number(e.target.value))
                }
                fullWidth
              />

              <TextField
                label="单位"
                value={form.unit ?? ""}
                onChange={(e) =>
                  handleChange("unit", e.target.value)
                }
                fullWidth
              />

              <TextField
                select
                label="状态"
                value={form.status ?? 1}
                onChange={(e) =>
                  handleChange("status", Number(e.target.value))
                }
                fullWidth
              >
                <MenuItem value={1}>
                  启用
                </MenuItem>

                <MenuItem value={0}>
                  禁用
                </MenuItem>
              </TextField>
            </Stack>

            {/* 右侧 */}
            <Box>
              <Typography
                sx={{
                  fontWeight: 700,
                  mb: 2,
                }}
              >
                SKU规格（只读）
              </Typography>

              <Stack sx={{ gap: 2 }}>
                {form.specs.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      gap: 2,
                    }}
                  >
                    <TextField
                      label="规格名"
                      value={item.name}
                      disabled
                      fullWidth
                    />

                    <TextField
                      label="规格值"
                      value={item.value}
                      disabled
                      fullWidth
                    />
                  </Box>
                ))}
              </Stack>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button
              color="error"
              variant="outlined"
              onClick={handleDelete}
              disabled={loading}
            >
              删除SKU
            </Button>

            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
            >
              保存修改
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
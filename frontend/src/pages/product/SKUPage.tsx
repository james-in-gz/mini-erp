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
import axios from "axios";
import { useParams } from "react-router-dom";
import { getSKUDetail, updateSKU } from "@/api/sku";

interface SKU {
  id: number;

  skuCode: string;

  spuId: number;

  image?: string;

  // 金额建议后端用分
  price: number;

  costPrice: number;

  // 重量(g)
  weight?: number;

  // 单位
  unit: string;

  status: number;

  specs: {
    name: string;
    value: string;
  }[];
}

export default function SKUEditPage() {
  const { id } = useParams();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<SKU>({
    id: 0,
    skuCode: "",
    spuId: 0,
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

  const handleChange = (key: keyof SKU, value: any) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSpecChange = (
    index: number,
    key: "name" | "value",
    value: string
  ) => {
    const newSpecs = [...form.specs];

    newSpecs[index] = {
      ...newSpecs[index],
      [key]: value,
    };

    setForm((prev) => ({
      ...prev,
      specs: newSpecs,
    }));
  };

  const addSpec = () => {
    setForm((prev) => ({
      ...prev,
      specs: [
        ...prev.specs,
        {
          name: "",
          value: "",
        },
      ],
    }));
  };

  const removeSpec = (index: number) => {
    const newSpecs = [...form.specs];

    newSpecs.splice(index, 1);

    setForm((prev) => ({
      ...prev,
      specs: newSpecs,
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
    <Box
      sx={{
        p: 2,
      }}
    >
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
            <Stack
              sx={{
                gap: 2,
              }}
            >
              <TextField
                label="SKU编码"
                value={form.skuCode}
                disabled
                fullWidth
              />

              <TextField
                label="销售价格"
                type="number"
                value={form.price}
                onChange={(e) =>
                  handleChange("price", Number(e.target.value))
                }
                fullWidth
              />

              <TextField
                label="成本价格"
                type="number"
                value={form.costPrice}
                onChange={(e) =>
                  handleChange("costPrice", Number(e.target.value))
                }
                fullWidth
              />

              <TextField
                label="重量(g)"
                type="number"
                value={form.weight}
                onChange={(e) =>
                  handleChange("weight", Number(e.target.value))
                }
                fullWidth
              />

              <TextField
                label="单位"
                value={form.unit}
                onChange={(e) =>
                  handleChange("unit", e.target.value)
                }
                placeholder="瓶 / 箱 / 个 / 件"
                fullWidth
              />

              <TextField
                select
                label="状态"
                value={form.status}
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
                SKU规格
              </Typography>

              <Stack
                sx={{
                  gap: 2,
                }}
              >
                {form.specs.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      gap: 2,
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      label="规格名"
                      value={item.name}
                      onChange={(e) =>
                        handleSpecChange(
                          index,
                          "name",
                          e.target.value
                        )
                      }
                      fullWidth
                    />

                    <TextField
                      label="规格值"
                      value={item.value}
                      onChange={(e) =>
                        handleSpecChange(
                          index,
                          "value",
                          e.target.value
                        )
                      }
                      fullWidth
                    />

                    <Button
                      color="error"
                      variant="outlined"
                      onClick={() => removeSpec(index)}
                    >
                      删除
                    </Button>
                  </Box>
                ))}

                <Button
                  variant="outlined"
                  onClick={addSpec}
                >
                  添加规格
                </Button>
              </Stack>
            </Box>
          </Box>

          <Divider
            sx={{
              my: 3,
            }}
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
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
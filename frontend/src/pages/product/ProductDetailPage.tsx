import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Box,
    Tabs,
    Tab,
    Typography,
    Card,
    CardContent,
    Stack,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from "@mui/material";

import { getProductDetail } from "@/api/product";
import { getSKUs, createSKU, generateSKUs } from "@/api/sku";

export default function ProductDetailPage() {
    const { id } = useParams();

    const [tab, setTab] = useState(0);
    const [product, setProduct] = useState<any>(null);
    const [skus, setSkus] = useState<any[]>([]);

    const [open, setOpen] = useState(false);

    const [form, setForm] = useState({
        name: "",
        price: "",
        stock: "",
    });

    const [specs, setSpecs] = useState<
        { key: string; values: string[] }[]
    >([
        { key: "weight", values: ["50g", "100g"] },
    ]);

    const productId = Number(id);
    // 加载数据
    const load = async () => {
        const p = await getProductDetail(productId);
        setProduct(p);

        const s = await getSKUs(productId);
        setSkus(s);
    };

    useEffect(() => {
        if (id) load();
    }, [id]);


    const buildSpecs = () => {
  const obj: Record<string, string[]> = {};

  specs.forEach((s) => {
    if (s.key && s.values.length) {
      obj[s.key] = s.values.map((v) => v.trim());
    }
  });

  return obj;
};

    // 创建SKU
    const handleCreateSku = async () => {
        await generateSKUs(productId, {
  specs: buildSpecs(),
});

        setOpen(false);
        setForm({ name: "", price: "", stock: "" });
        load();
    };

    if (!product) return <div>Loading...</div>;

    return (
        <Box>
            {/* Tabs */}
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
                <Tab label="基本信息" />
                <Tab label="SKU" />
            </Tabs>

            {/* 基本信息 */}
            {tab === 0 && (
                <Card sx={{ borderRadius: 3 }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            商品信息
                        </Typography>

                        <Stack spacing={1.5}>
                            <Typography>名称：{product.name}</Typography>
                            <Typography>创建时间：{product.createdAt}</Typography>
                        </Stack>
                    </CardContent>
                </Card>
            )}

            {/* SKU管理 */}
            {tab === 1 && (
                <Card sx={{ borderRadius: 3 }}>
                    <CardContent>
                        <Stack sx={{ spacing: 2, mb: 2, justifyContent: "space-between", direction: "row" }}>
                            <Typography variant="h6">SKU列表</Typography>

                            <Button
                                variant="contained"
                                onClick={() => setOpen(true)}
                            >
                                + 新增SKU
                            </Button>
                        </Stack>

                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>名称</TableCell>
                                    <TableCell>价格</TableCell>
                                    <TableCell>库存</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {skus.map((sku) => (
                                    <TableRow key={sku.id}>
                                        <TableCell>{sku.name}</TableCell>
                                        <TableCell>¥{sku.price}</TableCell>
                                        <TableCell>{sku.stock}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            {/* 新增SKU弹窗 */}
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>新增SKU</DialogTitle>

                <DialogContent>
                    <Stack sx={{ spacing: 2 , mt: 1}}>
                        {specs.map((spec, i) => (
                            <Stack key={i} direction="row" sx={{ spacing: 2.5 , mb: 1}}>
                                <TextField
                                    label="规格名"
                                    value={spec.key}
                                    onChange={(e) => {
                                        const newSpecs = [...specs];
                                        newSpecs[i].key = e.target.value;
                                        setSpecs(newSpecs);
                                    }}
                                    
                                />

                                <TextField
                                    label="选项（逗号分隔）"
                                    value={spec.values.join(",")}
                                    onChange={(e) => {
                                        const newSpecs = [...specs];
                                        newSpecs[i].values = e.target.value.split(",");
                                        setSpecs(newSpecs);
                                    }}
                                    fullWidth
                                />
                            </Stack>
                        ))}

                        <Button
                            onClick={() =>
                                setSpecs([...specs, { key: "", values: [] }])
                            }
                        >
                            + 添加规格
                        </Button>
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setOpen(false)}>取消</Button>
                    <Button variant="contained" onClick={handleCreateSku}>
                        创建
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
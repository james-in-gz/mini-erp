import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { useTranslation } from "react-i18next";

import { getProductDetail } from "@/api/product";
import { getSKUs, createSKU, generateSKUs } from "@/api/sku";

export default function ProductDetailPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
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




    // 创建SKU
    const handleCreateSku = async () => {
        const payload = {
            specs: specs
                .filter((s) => s.key.trim())
                .map((s) => ({
                    key: s.key.trim(),

                    values: s.values
                        .map((v) => v.trim())
                        .filter(Boolean),
                })),
        };

        await generateSKUs(productId, payload);

        setOpen(false);

        load();
    };

    if (!product) return <div>{t("common.loading")}</div>;

    return (
        <Box>
            {/* Tabs */}
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
                <Tab label={t("product.detail.tabs.basic")} />
                <Tab label={t("product.detail.tabs.sku")} />
            </Tabs>

            {/* 基本信息 */}
            {tab === 0 && (
                <Card sx={{ borderRadius: 3 }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            {t("product.detail.infoTitle")}
                        </Typography>

                        <Stack spacing={1.5}>
                            <Typography>{t("product.detail.name")}：{product.name}</Typography>
                            <Typography>{t("product.detail.createdAt")}：{new Date(product.createdAt).toLocaleDateString()}</Typography>
                        </Stack>
                    </CardContent>
                </Card>
            )}

            {/* SKU管理 */}
            {tab === 1 && (
                <Card sx={{ borderRadius: 3 }}>
                    <CardContent>
                        <Stack spacing={2} sx={{ mb: 2, justifyContent: "space-between", direction: "row" }}>
                            <Typography variant="h6">{t("product.detail.skuListTitle")}</Typography>

                            <Button
                                variant="contained"
                                onClick={() => setOpen(true)}
                            >
                                + {t("product.detail.addSku")}
                            </Button>
                        </Stack>

                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>{t("product.detail.name")}</TableCell>
                                    <TableCell>{t("product.price")}</TableCell>
                                    <TableCell>{t("product.stock")}</TableCell>
                                    <TableCell>{t("product.detail.actions")}</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {skus.map((sku) => (
                                    <TableRow key={sku.id}>
                                        <TableCell>{sku.name}</TableCell>
                                        <TableCell>¥{sku.price}</TableCell>
                                        <TableCell>{sku.stock}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={() => {
                                                    // Handle edit action
                                                    navigate(`/products/${productId}/sku/${sku.id}`);
                                                }}
                                            >
                                                {t("product.detail.edit")}
                                            </Button>
                                        </TableCell>
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
                <DialogTitle>{t("product.detail.addSkuDialogTitle")}</DialogTitle>

                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        {specs.map((spec, i) => (
                            <Stack key={i} direction="row" spacing={2} sx={{ mb: 1 }}>
                                <TextField
                                    label={t("product.detail.specName")}
                                    value={spec.key}
                                    onChange={(e) => {
                                        const newSpecs = [...specs];
                                        newSpecs[i].key = e.target.value;
                                        setSpecs(newSpecs);
                                    }}

                                />

                                <TextField
                                    label={t("product.detail.specOptions")}
                                    value={spec.values.join(",")}
                                    onChange={(e) => {
                                        const newSpecs = [...specs];

                                        newSpecs[i].values = e.target.value
                                            .split(/[,， ;\n]/);

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
                            + {t("product.detail.addSpec")}
                        </Button>
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setOpen(false)}>{t("common.cancel")}</Button>
                    <Button variant="contained" onClick={handleCreateSku}>
                        {t("common.create")}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
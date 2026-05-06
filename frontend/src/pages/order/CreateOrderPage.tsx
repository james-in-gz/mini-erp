import { useEffect, useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Stack,
    TextField,
    Button,
    MenuItem,
    Autocomplete,
    debounce,
} from "@mui/material";

import { createOrder } from "@/api/order";
import { getCustomers, searchCustomers } from "@/api/customer";
import { getProducts } from "@/api/product";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function CreateOrderPage() {
    const { t } = useTranslation();
    const [customers, setCustomers] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
    const navigate = useNavigate();
    const [form, setForm] = useState({
        customer_id: 0,
        address_id: 0,
    });

    const [items, setItems] = useState<any[]>([
        { product_id: 0, quantity: 1, price: 0 },
    ]);

    const [options, setOptions] = useState([]);

    const handleSearch = debounce(async (value: string) => {
        const customers = await searchCustomers(value);
        setOptions(customers);
    }, 300);

    // 加载数据
    useEffect(() => {
        getCustomers().then((res) => setCustomers(res.list || res));
        getProducts().then((res) => setProducts(res.list || res));
    }, []);


    // 商品变化
    const handleItemChange = (index: number, key: string, value: any) => {
        const newItems = [...items];

        if (key === "product_id") {
            const product = products.find((p) => p.id === value);
            newItems[index] = {
                ...newItems[index],
                product_id: value,
                price: product?.price || 0,
            };
        } else {
            newItems[index][key] = value;
        }

        setItems(newItems);
    };

    // 添加商品
    const addItem = () => {
        setItems([...items, { product_id: 0, quantity: 1, price: 0 }]);
    };

    // 总价
    const total = items.reduce(
        (sum, i) => sum + i.quantity * i.price,
        0
    );

    const handleSubmit = async () => {
        if (!form.customer_id || !form.address_id || !items.length) {
            alert(t("order.fillRequired"));
            return;
        }

        try {
           const res = await createOrder({
                customer_id: form.customer_id,
                address_id: form.address_id,
                items: items.map((i) => ({
                    product_id: i.product_id,
                    quantity: i.quantity,
                })),
            });

            alert(t("order.orderCreated"));
            navigate(`/orders/${res.id}`);
        } catch (error) {
            alert(t("order.createFailed"));
        };
    }
    return (
        <Box>
            <Typography sx={{ variant: "h5", mb: 2 }}>
                {t("order.create")}
            </Typography>

            <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                    <Stack spacing={2}>
                        {/* 客户 */}
                        <Autocomplete
                            options={options}
                            value={
                                options.find((c: any) => c.id === form.customer_id) || null
                            }
                            inputValue={inputValue}
                            onInputChange={(_, value, reason) => {
                                setInputValue(value);

                                if (reason === "input") {
                                    handleSearch(value);
                                }
                            }}
                            onChange={(_, newValue: any) => {

                                setSelectedCustomer(newValue);
                                setForm({
                                    ...form,
                                    customer_id: newValue?.id || "",
                                });

                                // ⭐ 选中后同步输入框（关键）
                                setInputValue(
                                    newValue ? `${newValue.name} (${newValue.phone})` : ""
                                );
                            }}
                            getOptionLabel={(option: any) =>
                                `${option.name} (${option.phone})`
                            }
                            renderInput={(params) => (
                                <TextField {...params} label={t("order.customer")} />
                            )}
                        />

                        {/* 地址 */}
                        <TextField
                            select
                            label={t("order.address")}
                            value={form.address_id}
                            onChange={(e) =>
                                setForm({ ...form, address_id: Number(e.target.value) })
                            }
                            fullWidth
                        >
                            {selectedCustomer?.addresses?.map((a: any) => (
                                <MenuItem key={a.id} value={a.id}>
                                    {a.name} / {a.phone} - {a.province} {a.city} {a.district} {a.address}
                                </MenuItem>
                            ))}
                        </TextField>

                        {/* 商品 */}
                        <Typography variant="subtitle1">{t("order.items")}</Typography>

                        {items.map((item, index) => (
                            <Stack direction="row" spacing={2} key={index}>
                                <TextField
                                    select
                                    label={t("order.product")}
                                    fullWidth
                                    value={item.product_id}
                                    onChange={(e) =>
                                        handleItemChange(
                                            index,
                                            "product_id",
                                            Number(e.target.value)
                                        )
                                    }
                                >
                                    {products.map((p) => (
                                        <MenuItem key={p.id} value={p.id}>
                                            {p.name}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <TextField
                                    label={t("order.quantity")}
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) =>
                                        handleItemChange(
                                            index,
                                            "quantity",
                                            Number(e.target.value)
                                        )
                                    }
                                    sx={{ width: 100 }}
                                />

                                <TextField
                                    label={t("order.price")}
                                    value={item.price}
                                    disabled
                                    sx={{ width: 120 }}
                                />
                            </Stack>
                        ))}

                        <Button onClick={addItem}>{t("order.addItem")}</Button>

                        {/* 总价 */}
                        <Typography>
                            {t("order.total")}: ¥{total}
                        </Typography>

                        {/* 提交 */}
                        <Button variant="contained" onClick={handleSubmit}>
                            {t("order.createOrder")}
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
}
import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useParams } from "react-router-dom";
import axios from "axios";
import { getOrderDetail } from "@/api/order";
import { listWareHouses } from "@/api/warehouses";
import { Order } from "@/types/order";
import { Warehouse } from "@/types/warehouse";

type ShipmentResult = {
  shipmentNo: string;

  waybillNo: string;

  status: string;

  labelURL: string;
};

/**
 * =========================
 * Constants
 * =========================
 */

const serviceTypes = [
  {
    value: "STANDARD",
    label: "顺丰标快",
  },

  {
    value: "EXPRESS",
    label: "顺丰特快",
  },

  {
    value: "SAME_DAY",
    label: "同城即日",
  },
];

const paymentTypes = [
  {
    value: "SENDER",
    label: "寄付",
  },

  {
    value: "RECEIVER",
    label: "到付",
  },
];

/**
 * =========================
 * Page
 * =========================
 */
interface ExpressShipmentFormProps {
    orderId: number;
    }

export default function ExpressShipmentForm({ orderId }: ExpressShipmentFormProps) {


  /**
   * =========================
   * States
   * =========================
   */

  const [loading, setLoading] = useState(false);

  const [creating, setCreating] = useState(false);

  const [open, setOpen] = useState(false);

  const [order, setOrder] = useState<Order | null>(null);

  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);

  const [shipmentResult, setShipmentResult] = useState<ShipmentResult | null>(
    null,
  );

  const [form, setForm] = useState({
    warehouseID: 0,

    carrier: "SF",

    serviceType: "STANDARD",

    paymentType: "SENDER",

    weight: 1,

    parcelCount: 1,

    remark: "",
  });

  /**
   * =========================
   * Fetch Order
   * =========================
   */

  const fetchOrder = async () => {
    try {
      setLoading(true);
      if(orderId === undefined) {
        throw new Error("订单ID不存在");
      }
      const data = await getOrderDetail(parseInt(orderId.toString()));
    
      setOrder(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * =========================
   * Fetch Warehouses
   * =========================
   */

  const fetchWarehouses = async () => {
      const data = await listWareHouses();

      setWarehouses(data);

      if (data.length > 0 && !form.warehouseID) {
        setForm((prev) => ({
          ...prev,
          warehouseID: data[0].id,
        }));
      }

  };

  /**
   * =========================
   * Init
   * =========================
   */

  useEffect(() => {
    fetchOrder();

    fetchWarehouses();
  }, []);

  /**
   * =========================
   * Current Warehouse
   * =========================
   */

  const selectedWarehouse = useMemo(() => {
    return warehouses.find((w) => w.id === form.warehouseID);
  }, [warehouses, form.warehouseID]);

  /**
   * =========================
   * Update Form
   * =========================
   */

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  /**
   * =========================
   * Create Shipment
   * =========================
   */

  const handleCreateShipment = async () => {
    try {
      setCreating(true);

      const payload = {
        orderID: order?.id,

        warehouseID: form.warehouseID,

        carrier: form.carrier,

        serviceType: form.serviceType,

        paymentType: form.paymentType,

        weight: form.weight,

        parcelCount: form.parcelCount,

        remark: form.remark,
      };

      const res = await axios.post("/shipments", payload);

      setShipmentResult(res.data);

      setOpen(false);

      alert("创建成功");
    } catch (err: any) {
      console.error(err);

      alert(err?.response?.data?.error || "创建失败");
    } finally {
      setCreating(false);
    }
  };

  /**
   * =========================
   * Loading
   * =========================
   */

  if (loading || !order) {
    return (
      <Box
        sx={{
          p: 6,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* ========================= */}
      {/* Header */}
      {/* ========================= */}

      <Typography sx={{ mb: 3, fontVariant: "h4", fontWeight: 700 }}>
        Order Shipment
      </Typography>

      {/* ========================= */}
      {/* Order */}
      {/* ========================= */}

      <Card
        sx={{
          borderRadius: 4,
          mb: 3,
        }}
      >
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h6">订单信息</Typography>

            <Divider />

            <Grid container spacing={2}>
              <Grid
                size={{
                  xs: 12,
                  md: 4,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  订单号
                </Typography>

                <Typography>{order.orderNo}</Typography>
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  md: 4,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  客户
                </Typography>

                <Typography>{order.customer?.name}</Typography>
              </Grid>
            </Grid>

            <Divider />

            <Typography variant="subtitle1">商品</Typography>

            <Stack spacing={1}>
              {order.items?.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography>{item.skuName}</Typography>

                  <Typography>x{item.quantity}</Typography>
                </Box>
              ))}
            </Stack>

            <Divider />

            <Button variant="contained" onClick={() => setOpen(true)}>
              创建 Shipment
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* ========================= */}
      {/* Shipment Result */}
      {/* ========================= */}

      {shipmentResult && (
        <Card
          sx={{
            borderRadius: 4,
            mb: 3,
          }}
        >
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h6">Shipment</Typography>

              <Divider />

              <Grid container spacing={2}>
                <Grid
                  size={{
                    xs: 12,
                    md: 4,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Shipment No
                  </Typography>

                  <Typography>{shipmentResult.shipmentNo}</Typography>
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    md: 4,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Waybill No
                  </Typography>

                  <Typography>{shipmentResult.waybillNo}</Typography>
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    md: 4,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Status
                  </Typography>

                  <Chip label="已创建" color="success" size="small" />
                </Grid>
              </Grid>

              <Divider />

              <Stack
                sx={{ flexDirection: "row", gap: 2, flexWrap: "wrap" }}
                spacing={2}
              >
                <Button
                  variant="outlined"
                  onClick={() => window.open(shipmentResult.labelURL)}
                >
                  打印面单
                </Button>

                <Button variant="outlined">查看物流轨迹</Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* ========================= */}
      {/* Dialog */}
      {/* ========================= */}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>创建 Shipment</DialogTitle>

        <DialogContent dividers>
          <Grid container spacing={3}>
            {/* ========================= */}
            {/* 收件信息 */}
            {/* ========================= */}

            <Grid
              size={{
                xs: 12,
                md: 4,
              }}
            >
              <Stack spacing={2}>
                <Typography variant="h6">收件信息</Typography>

                <Divider />

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    收件人
                  </Typography>

                  <Typography>{order.customer?.name}</Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    联系电话
                  </Typography>

                  <Typography>{order.defaultPhone}</Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    收件地址
                  </Typography>

                  <Typography>
                    {order.defaultProvince}{" "}
                    {order.defaultCity}{" "}
                    {order.defaultDistrict}{" "}
                    {order.defaultAddress}
                  </Typography>
                </Box>

                <Chip label="来自订单" size="small" />
              </Stack>
            </Grid>

            {/* ========================= */}
            {/* 仓库 */}
            {/* ========================= */}

            <Grid
              size={{
                xs: 12,
                md: 4,
              }}
            >
              <Stack spacing={2}>
                <Typography variant="h6">发货仓库</Typography>

                <Divider />

                <TextField
                  select
                  label="仓库"
                  value={form.warehouseID}
                  onChange={(e) =>
                    handleChange("warehouseID", Number(e.target.value))
                  }
                  fullWidth
                >
                  {warehouses.map((warehouse) => (
                    <MenuItem key={warehouse.id} value={warehouse.id}>
                      {warehouse.name}
                    </MenuItem>
                  ))}
                </TextField>

                {selectedWarehouse && (
                  <>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        发件人
                      </Typography>

                      <Typography>{selectedWarehouse.contactName}</Typography>
                    </Box>

                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        联系电话
                      </Typography>

                      <Typography>{selectedWarehouse.phone}</Typography>
                    </Box>

                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        发货地址
                      </Typography>

                      <Typography>
                        {selectedWarehouse.province} {selectedWarehouse.city}{" "}
                        {selectedWarehouse.district} {selectedWarehouse.address}
                      </Typography>
                    </Box>
                  </>
                )}
              </Stack>
            </Grid>

            {/* ========================= */}
            {/* 物流配置 */}
            {/* ========================= */}

            <Grid
              size={{
                xs: 12,
                md: 4,
              }}
            >
              <Stack spacing={2}>
                <Typography variant="h6">物流配置</Typography>

                <Divider />

                <TextField
                  select
                  label="物流产品"
                  value={form.serviceType}
                  onChange={(e) => handleChange("serviceType", e.target.value)}
                  fullWidth
                >
                  {serviceTypes.map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  label="付款方式"
                  value={form.paymentType}
                  onChange={(e) => handleChange("paymentType", e.target.value)}
                  fullWidth
                >
                  {paymentTypes.map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  label="重量(KG)"
                  type="number"
                  value={form.weight}
                  onChange={(e) =>
                    handleChange("weight", Number(e.target.value))
                  }
                  fullWidth
                />

                <TextField
                  label="包裹数量"
                  type="number"
                  value={form.parcelCount}
                  onChange={(e) =>
                    handleChange("parcelCount", Number(e.target.value))
                  }
                  fullWidth
                />

                <TextField
                  label="备注"
                  value={form.remark}
                  onChange={(e) => handleChange("remark", e.target.value)}
                  fullWidth
                  multiline
                  rows={4}
                />
              </Stack>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>取消</Button>

          <Button
            variant="contained"
            disabled={creating}
            onClick={handleCreateShipment}
          >
            {creating ? "创建中..." : "创建运单"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

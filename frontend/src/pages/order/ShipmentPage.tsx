import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import request from "@/api/request";

export default function ShipmentPage() {
  const { t } = useTranslation();
  const [deliveryTasks, setDeliveryTasks] = useState<any[]>([]);

  useEffect(() => {
    loadDeliveryTasks();
  }, []);

  const loadDeliveryTasks = async () => {
    const res = await request.get('/delivery-tasks');
    if (res.data.code === 0) {
      setDeliveryTasks(res.data.data);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'waiting_stock': return 'error';
      case 'ready': return 'info';
      case 'packing': return 'primary';
      case 'shipped': return 'success';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Shipments by Delivery Tasks
      </Typography>

      {deliveryTasks.map((task: any) => (
        <Accordion key={task.id} sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
              <Typography variant="h6">
                Task {task.taskNo}
              </Typography>
              <Chip label={task.status} color={getStatusColor(task.status)} size="small" />
              <Typography variant="body2" color="text.secondary">
                Customer: {task.customer?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Warehouse: {task.warehouseID || 'N/A'}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="subtitle1" gutterBottom>
              Shipments
            </Typography>
            {task.shipments && task.shipments.length > 0 ? (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Shipment No</TableCell>
                      <TableCell>Carrier</TableCell>
                      <TableCell>Tracking Number</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Shipped At</TableCell>
                      <TableCell>Receiver</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {task.shipments.map((shipment: any) => (
                      <TableRow key={shipment.id}>
                        <TableCell>{shipment.shipmentNo}</TableCell>
                        <TableCell>{shipment.carrier}</TableCell>
                        <TableCell>{shipment.trackingNumber}</TableCell>
                        <TableCell>
                          <Chip label={shipment.status} color={getStatusColor(shipment.status)} size="small" />
                        </TableCell>
                        <TableCell>{shipment.shippedAt}</TableCell>
                        <TableCell>
                          {shipment.receiverName} {shipment.receiverPhone}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No shipments yet
              </Typography>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}

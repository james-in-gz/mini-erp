import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Box,
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { warehouseApi } from '@/api/warehouses';
import { Warehouse, CreateWarehouseDto } from '@/types/warehouse';

// 地址子组件
const AddressFields: React.FC<{
  formData: CreateWarehouseDto;
  setFormData: React.Dispatch<React.SetStateAction<CreateWarehouseDto>>;
}> = ({ formData, setFormData }) => (
  <>
    <TextField
      label="Province"
      fullWidth
      margin="normal"
      value={formData.province}
      onChange={(e) => setFormData({ ...formData, province: e.target.value })}
      required
    />
    <TextField
      label="City"
      fullWidth
      margin="normal"
      value={formData.city}
      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
      required
    />
    <TextField
      label="District"
      fullWidth
      margin="normal"
      value={formData.district}
      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
      required
    />
    <TextField
      label="Detail Address"
      fullWidth
      margin="normal"
      value={formData.address}
      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
      required
    />
  </>
);

const WarehousePage: React.FC = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CreateWarehouseDto>({
    name: '',
    contactName: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    address: '',
  });
  const [error, setError] = useState<string>('');

  const fetchWarehouses = async (): Promise<void> => {

      const data = await warehouseApi.getAll();
      setWarehouses(data);

  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const handleOpen = (warehouse?: Warehouse): void => {
    setError('');
    if (warehouse) {
      setEditingId(warehouse.id);
      setFormData({
        name: warehouse.name,
        contactName: warehouse.contactName,
        phone: warehouse.phone,
        province: warehouse.province,
        city: warehouse.city,
        district: warehouse.district,
        address: warehouse.address,
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        contactName:"",
        phone: '',
        province: '',
        city: '',
        district: '',
        address: '',
      });
    }
    setOpenDialog(true);
  };

  const handleClose = (): void => {
    setOpenDialog(false);
    setError('');
  };

  const handleSubmit = async (): Promise<void> => {

      if (editingId !== null) {
        await warehouseApi.update(editingId, formData);
      } else {
        await warehouseApi.create(formData);
      }
      await fetchWarehouses();
      handleClose();

  };

  const handleDelete = async (id: number): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this warehouse?')) {

        await warehouseApi.delete(id);
        await fetchWarehouses();

    }
  };

  // 简单错误展示（生产环境应使用 i18n）
  const displayError = (errorCode: string): string => {
    const map: Record<string, string> = {
      warehouse_name_is_required: 'Warehouse name is required',
      warehouse_not_found: 'Warehouse not found',
      invalid_warehouse_id: 'Invalid warehouse ID',
      invalid_request_body: 'Invalid request body',
      failed_to_fetch_warehouses: 'Failed to fetch warehouses',
      unknown_error: 'An unknown error occurred',
    };
    return map[errorCode] || errorCode;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Warehouse Management
      </Typography>
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => handleOpen()}
        sx={{ mb: 2 }}
      >
        Add Warehouse
      </Button>
      <Paper sx={{ overflow: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Province</TableCell>
              <TableCell>City</TableCell>
              <TableCell>District</TableCell>
              <TableCell>Detail Address</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {warehouses?.map?.((wh) => (
              <TableRow key={wh.id}>
                <TableCell>{wh.id}</TableCell>
                <TableCell>{wh.name}</TableCell>
                <TableCell>{wh.province}</TableCell>
                <TableCell>{wh.city}</TableCell>
                <TableCell>{wh.district}</TableCell>
                <TableCell>{wh.address}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(wh)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(wh.id)} color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {warehouses.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No warehouses found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId !== null ? 'Edit Warehouse' : 'Add Warehouse'}</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2, mt: 1 }}>
              {displayError(error)}
            </Alert>
          )}
          <TextField
            label="Warehouse Name"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <TextField
            label="Contact Name"
            fullWidth
            margin="normal"
            value={formData.contactName}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <TextField
            label="contact number"
            fullWidth
            margin="normal"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <AddressFields formData={formData} setFormData={setFormData} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingId !== null ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default WarehousePage;
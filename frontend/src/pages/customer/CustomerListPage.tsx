import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  CircularProgress,
  TablePagination,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { getCustomers } from "@/api/customer";
import { Customer } from "@/types/customer";

export default function CustomerListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(0); // MUI starts from 0
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchData = async () => {
    setLoading(true);
    const res = await getCustomers(page + 1, rowsPerPage);
    setCustomers(res.list);
    setTotal(res.total);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage]);

  const handleRowClick = (id: number) => {
    navigate(`/customers/${id}`);
  };

  if (loading) return <CircularProgress />;

  return (
    <Container sx={{ mt: 4 }}>
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
      >
        <Typography variant="h5">{t("customer.list")}</Typography>

        <Button
          variant="contained"
          onClick={() => navigate("/customers/create")}
        >
          + {t("customer.createNew")}
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t("customer.name")}</TableCell>
              <TableCell>{t("customer.phone")}</TableCell>
              <TableCell>{t("customer.status")}</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {customers.map((c) => (
              <TableRow
                key={c.id}
                hover
                sx={{ cursor: "pointer" }}
                onClick={() => handleRowClick(c.id)}
              >
                <TableCell>{c.name}</TableCell>
                <TableCell>{c.phone}</TableCell>
                <TableCell>{t(`status.${c.status}`)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={total}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>
    </Container>
  );
}

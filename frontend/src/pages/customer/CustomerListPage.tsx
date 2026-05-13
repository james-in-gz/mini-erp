import { useEffect, useMemo, useState } from "react";
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
  TextField,
  debounce,
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
  const [searchText, setSearchText] = useState("");

  const fetchData = useMemo(
    () =>
      debounce(async (page: number, rows: number, search: string) => {
        setLoading(true);

        const data = await getCustomers(page + 1, rows, search);

        setCustomers(data.list);
        setTotal(data.total);

        setLoading(false);
      }, 300),
    [],
  );

  useEffect(() => {
    fetchData(page, rowsPerPage, searchText);

    return () => {
      fetchData.clear();
    };
  }, [page, rowsPerPage, searchText]);

  const handleRowClick = (id: number) => {
    navigate(`/customers/${id}`);
  };

  {
    loading && (
      <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5">{t("customer.list")}</Typography>

        <Button
          variant="contained"
          onClick={() => navigate("/customers/create")}
        >
          + {t("customer.createNew")}
        </Button>
      </Box>

      <Box sx={{ mb: 2 }}>
        <TextField
          size="small"
          placeholder="Search customer..."
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setPage(0);
          }}
          fullWidth
        />
      </Box>
      <TableContainer
        component={Paper}
        sx={{
          overflowX: "auto",
        }}
      >
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
          rowsPerPageOptions={[10, 20, 50]}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          sx={{
            ".MuiTablePagination-toolbar": {
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 1,
              px: 1,
            },

            ".MuiTablePagination-selectLabel": {
              display: { xs: "none", sm: "block" },
            },

            ".MuiTablePagination-input": {
              display: { xs: "none", sm: "flex" },
            },

            ".MuiTablePagination-displayedRows": {
              margin: 0,
            },
          }}
        />
      </TableContainer>
    </Container>
  );
}

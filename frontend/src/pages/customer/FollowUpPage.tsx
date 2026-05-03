import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getTodayFollowUps } from "@/api/customer";
import { Customer } from "@/types/customer";

export default function FollowUpPage() {
  const [list, setList] = useState<Customer[]>([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    const res = await getTodayFollowUps();
    setList(res.data.list);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Today Follow-ups
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Next Follow-up</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {list.map((c) => (
            <TableRow key={c.id}>
              <TableCell>{c.name}</TableCell>
              <TableCell>{c.phone}</TableCell>
              <TableCell>
                {c.nextFollowUpAt
                  ? new Date(c.nextFollowUpAt).toLocaleString()
                  : "-"}
              </TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  onClick={() => navigate(`/customers/${c.id}`)}
                >
                  Follow
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}
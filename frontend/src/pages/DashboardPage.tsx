import { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Box,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import getDashboard from "@/api/dashboard";

export default function DashboardPage() {
  const [data, setData] = useState({
    today: 0,
    done: 0,
    overdue: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await getDashboard();
    setData(res.data);
  };

  const Card = ({
    title,
    value,
    color,
    onClick,
  }: any) => (
    <Paper
      onClick={onClick}
      sx={{
        p: 3,
        cursor: "pointer",
        borderLeft: `6px solid ${color}`,
      }}
    >
      <Typography variant="subtitle2">{title}</Typography>
      <Typography variant="h4">{value}</Typography>
    </Paper>
  );

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Dashboard
      </Typography>

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(3, minmax(0, 1fr))",
          },
        }}
      >
        <Box>
          <Card
            title="Today Follow-ups"
            value={data.today}
            color="#1976d2"
            onClick={() => navigate("/follow-ups")}
          />
        </Box>

        <Box>
          <Card
            title="Completed"
            value={data.done}
            color="#2e7d32"
          />
        </Box>

        <Box>
          <Card
            title="Overdue"
            value={data.overdue}
            color="#d32f2f"
            onClick={() => navigate("/follow-ups")}
          />
        </Box>
      </Box>
    </Box>
  );
}
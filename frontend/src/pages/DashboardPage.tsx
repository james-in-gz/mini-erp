import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  CircularProgress,
} from "@mui/material";
import Grid from "@mui/material/Grid";

import  getDashboard  from "@/api/dashboard";

type Dashboard = {
  today: {
    overdue: number;
    today: number;
    upcoming: number;
  };
  pipeline: { status: string; count: number }[];
  sources: { source: string; count: number }[];
  owners: { name: string; count: number }[];
};

export default function DashboardPage() {
  const [data, setData] = useState<Dashboard | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getDashboard();
      setData(res);
    };
    fetchData();
  }, []);

  if (!data) return <CircularProgress />;

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography color="error">Overdue</Typography>
              <Typography variant="h5">{data.today.overdue}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography color="warning.main">Today</Typography>
              <Typography variant="h5">{data.today.today}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography>Upcoming</Typography>
              <Typography variant="h5">{data.today.upcoming}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Pipeline */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6">Pipeline</Typography>
          <Stack sx={{ direction: "row", spacing: 2, mt: 2 }}>
            {data.pipeline.map((p) => (
              <Box key={p.status}>
                <Typography>{p.status}</Typography>
                <Typography variant="h6">{p.count}</Typography>
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
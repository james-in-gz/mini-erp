import { useEffect, useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
} from "@mui/material";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { getFollowUps } from "@/api/customer";
import { Customer } from "@/types/customer";


interface FollowUpGroup {
  overdue: Customer[];
  today: Customer[];
  upcoming: Customer[];
}

export default function FollowUpPage() {
  const { t } = useTranslation();
  const [data, setData] = useState<FollowUpGroup>({
    overdue: [],
    today: [],
    upcoming: [],
  });

  const [tab, setTab] = useState(0);
  const navigate = useNavigate();

  const fetchData = async () => {
    const res = await getFollowUps();
    setData(res);
  };

  useEffect(() => {
   fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "interested":
        return "primary";
      case "negotiating":
        return "warning";
      case "won":
        return "success";
      case "lost":
        return "error";
      default:
        return "default";
    }
  };

  const renderList = (list: Customer[], isOverdue = false) => {
    if (list.length === 0) {
      return <Typography sx={{ mt: 2 }}>{t("common.no-data")}</Typography>;
    }

    return list.map((c) => (
      <Card key={c.id} sx={{ mb: 2, borderRadius: 3 }}>
        <CardContent>
          {/* 顶部 */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6">{c.name}</Typography>

            <Chip
              label={c.status}
              color={getStatusColor(c.status) as any}
              size="small"
            />
          </Box>

          {/* 时间 */}
          <Typography
            variant="body2"
            sx={{ mt: 1 }}
            color={isOverdue ? "error" : "text.secondary"}
          >
            Next:{" "}
            {c.nextFollowUpAt
              ? dayjs(c.nextFollowUpAt).format("YYYY-MM-DD HH:mm")
              : t("followup.notScheduled")}
            {isOverdue && ` (${t("status.overdue")})`}
          </Typography>

          {/* 操作区 */}
          <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
            <Button
              size="small"
              variant="contained"
              onClick={() => navigate(`/customers/${c.id}`)}
            >
              {t("followup.title")}
            </Button>

            <Button
              size="small"
              variant="outlined"
              onClick={() => navigate(`/customers/${c.id}`)}
            >
              Reschedule
            </Button>
          </Box>
        </CardContent>
      </Card>
    ));
  };

  const lists = [data.overdue, data.today, data.upcoming];

  return (
    <Box>
      {/* 顶部统计 */}
      <Box
        sx={{
          mb: 2,
          display: "grid",
          gap: 2,
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        }}
      >
        <Card>
          <CardContent>
            <Typography color="error">{t("status.overdue")}</Typography>
            <Typography variant="h5">{data.overdue.length}</Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography color="warning.main">{t("status.today")}</Typography>
            <Typography variant="h5">{data.today.length}</Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography>{t("status.upcoming")}</Typography>
            <Typography variant="h5">{data.upcoming.length}</Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Tabs */}
      <Tabs value={tab} onChange={(_, v) => setTab(v)}>
        <Tab label={`${t("status.overdue")} (${data.overdue.length})`} />
        <Tab label={`${t("status.today")} (${data.today.length})`} />
        <Tab label={`${t("status.upcoming")} (${data.upcoming.length})`} />
      </Tabs>

      {/* 内容 */}
      <Box sx={{ mt: 2 }}>
        {tab === 0 && renderList(data.overdue, true)}
        {tab === 1 && renderList(data.today)}
        {tab === 2 && renderList(data.upcoming)}
      </Box>
    </Box>
  );
}
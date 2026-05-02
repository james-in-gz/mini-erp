import { useEffect, useState } from "react";
import { Grid, CircularProgress } from "@mui/material";
import { useParams } from "react-router-dom";

import CustomerInfo from "@/components/customer/CustomerInfo";
import FollowUpPanel from "@/components/customer/FollowUpPanel";
import NotesTimeline from "@/components/customer/NotesTimeline";

import { getCustomerDetail, addCustomerNote } from "@/api/customer";
import { CustomerDetail } from "@/types/customer";

export default function CustomerDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState<CustomerDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!id) return;
    const res = await getCustomerDetail(Number(id));
    setData(res);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleAddNote = async (content: string) => {
    if (!id) return;
    await addCustomerNote(Number(id), { content });
    fetchData(); // refresh
  };

  if (loading || !data) return <CircularProgress />;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <CustomerInfo customer={data.customer} />
      </Grid>

      <Grid item xs={12} md={6}>
        <FollowUpPanel data={data} onSubmit={handleAddNote} />
      </Grid>

      <Grid item xs={12}>
        <NotesTimeline notes={data.notes} />
      </Grid>
    </Grid>
  );
}

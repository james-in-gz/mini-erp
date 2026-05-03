import { useEffect, useState } from "react";
import { CircularProgress, Box } from "@mui/material";
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

  const handleAddNote = async (content: string, nextFollowUpAt: string | null ) => {
    if (!id) return;
    await addCustomerNote(Number(id), { content: content ,nextFollowUpAt: nextFollowUpAt});
    fetchData(); // refresh
  };

  if (loading || !data) return <CircularProgress />;

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
      <Box>
        <CustomerInfo customer={data.customer} />
      </Box>

      <Box>
        <FollowUpPanel data={data} onSubmit={handleAddNote} />
      </Box>

      <Box sx={{ gridColumn: { xs: '1 / -1', md: '1 / -1' } }}>
        <NotesTimeline notes={data.notes} />
      </Box>
    </Box>
  );
}

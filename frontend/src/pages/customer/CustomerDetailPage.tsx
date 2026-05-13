import { useEffect, useState } from "react";
import { CircularProgress, Box } from "@mui/material";
import { useParams } from "react-router-dom";

import CustomerInfo from "@/components/customer/CustomerInfo";
import FollowUpPanel from "@/components/customer/FollowUpPanel";
import NotesTimeline from "@/components/customer/NotesTimeline";

import { getCustomerDetail, addCustomerNote } from "@/api/customer";
import { CustomerDetail } from "@/types/customer";
import CustomerAddressManager from "@/components/customer/CustomerAddressManager";

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

  const handleAddNote = async (
    content: string,
    nextFollowUpAt: string | null,
  ) => {
    if (!id) return;
    await addCustomerNote(Number(id), {
      content: content,
      nextFollowUpAt: nextFollowUpAt,
    });
    fetchData(); // refresh
  };

  if (loading || !data) return <CircularProgress />;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          lg: "2fr 1fr",
        },
        gap: 2,
        alignItems: "start",
        mb:10
      }}
    >
      {/* LEFT */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CustomerInfo customer={data.customer} onUpdated={fetchData} />

        <NotesTimeline notes={data.notes} />
      </Box>

      {/* RIGHT */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          position: { lg: "sticky" },
          top: { lg: 16 },
          alignSelf: "start",
        }}
      >
        <CustomerAddressManager customerId={data.customer.id} />

        <FollowUpPanel data={data} onSubmit={handleAddNote} />
      </Box>
    </Box>
  );
}

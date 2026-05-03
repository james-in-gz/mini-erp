import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import Column from "@/components/pipeline/Column";
import { getCustomers, updateCustomerStatus } from "@/api/customer";
import { Customer } from "@/types/customer";

const STATUSES = ["new", "interested", "negotiating", "won", "lost"];

export default function PipelinePage() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      const res = await getCustomers(1, 100);
      setCustomers(res.list);
    };

    fetchCustomers();
  }, []);

  const grouped = STATUSES.reduce((acc, status) => {
    acc[status] = customers.filter((c) => c.status === status);
    return acc;
  }, {} as Record<string, Customer[]>);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const customerId = Number(active.id);
    const newStatus = over.id as string;
    const customer = customers.find((c) => c.id === customerId);
    if (!customer || customer.status === newStatus) return;

    setCustomers((prev) =>
      prev.map((c) =>
        c.id === customerId ? { ...c, status: newStatus } : c
      )
    );

    try {
      await updateCustomerStatus(customerId, { status: newStatus });
    } catch (error) {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === customerId ? { ...c, status: customer.status } : c
        )
      );
      console.error("Failed to update customer status", error);
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <Box sx={{ display: "flex", gap: 2, overflowX: "auto", p: 2 }}>
        {STATUSES.map((status) => (
          <Column key={status} status={status} items={grouped[status] ?? []} />
        ))}
      </Box>
    </DndContext>
  );
}

export interface Customer {
  id: number;
  name: string;
  phone: string;
  status: string;
  source?: string;
  next_follow_up_at?: string | null;
}

export interface CustomerNote {
  id: number;
  content: string;
  created_at: string;
  type?: string;
}

export interface CustomerDetail {
  customer: Customer;
  notes: CustomerNote[];
  latest_note?: CustomerNote;
  next_follow_up_at?: string | null;
  is_overdue: boolean;
}

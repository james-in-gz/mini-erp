export interface Customer {
  id: number;
  name: string;
  phone: string;
  status: string;
  source?: string;
  nextFollowUpAt?: string | null;
}

export interface CustomerNote {
  id: number;
  content: string;
  createdAt: string;
  type?: string;
}

export interface CustomerDetail {
  customer: Customer;
  notes: CustomerNote[];
  latestNote?: CustomerNote;
  nextFollowUpAt?: string | null;
  isOverdue: boolean;
}


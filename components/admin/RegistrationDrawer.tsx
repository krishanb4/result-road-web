// components/admin/RegistrationDrawer.tsx
"use client";

import { Button, Card } from "@/components/ui";

export type Registration = {
  uid: string;
  email: string;
  displayName: string;
  role: string;
  phoneNumber?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postcode?: string;
  };
  physicalInfo?: { height?: number | null; weight?: number | null };
  representative?: any;
  ndis?: {
    planType?: string;
    planManagerName?: string | null;
    planManagerAgency?: string | null;
    ndisNumber?: string;
    availableFunding?: string | null;
    planStartDate?: string;
    planReviewDate?: string;
    goals?: string;
    planDocumentUrl?: string | null;
  };
  referrer?: any;
  referral?: { type?: string; medicalInformation?: string };
  status?: string;
  createdAt?: any;
  updatedAt?: any;
};

export default function RegistrationDrawer({
  open,
  onClose,
  data,
}: {
  open: boolean;
  onClose: () => void;
  data: Registration | null;
}) {
  if (!open || !data) return null;

  const Row = ({ label, value }: { label: string; value?: any }) => (
    <div className="grid grid-cols-[160px_1fr] gap-3">
      <div className="text-white/60">{label}</div>
      <div className="text-white">{value ?? "-"}</div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <aside className="relative ml-auto h-full w-full max-w-[720px] overflow-y-auto border-l border-white/10 bg-neutral-950 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold">Registration Details</h3>
          <Button onClick={onClose}>Close</Button>
        </div>

        <Card className="mb-6">
          <h4 className="mb-3 text-lg font-semibold text-white">Identity</h4>
          <div className="grid gap-2">
            <Row label="Name" value={data.displayName} />
            <Row label="Email" value={data.email} />
            <Row label="Role" value={data.role} />
            <Row label="Phone" value={data.phoneNumber} />
          </div>
        </Card>

        <Card className="mb-6">
          <h4 className="mb-3 text-lg font-semibold text-white">Address</h4>
          <div className="grid gap-2">
            <Row label="Street" value={data.address?.street} />
            <Row label="City" value={data.address?.city} />
            <Row label="State" value={data.address?.state} />
            <Row label="Postcode" value={data.address?.postcode} />
          </div>
        </Card>

        <Card className="mb-6">
          <h4 className="mb-3 text-lg font-semibold text-white">Physical</h4>
          <div className="grid gap-2">
            <Row label="Height (cm)" value={data.physicalInfo?.height ?? "-"} />
            <Row label="Weight (kg)" value={data.physicalInfo?.weight ?? "-"} />
          </div>
        </Card>

        <Card className="mb-6">
          <h4 className="mb-3 text-lg font-semibold text-white">NDIS</h4>
          <div className="grid gap-2">
            <Row label="Plan Type" value={data.ndis?.planType} />
            <Row label="NDIS Number" value={data.ndis?.ndisNumber} />
            <Row label="Funding" value={data.ndis?.availableFunding} />
            <Row label="Plan Start" value={data.ndis?.planStartDate} />
            <Row label="Plan Review" value={data.ndis?.planReviewDate} />
            <Row label="Goals" value={data.ndis?.goals} />
            {data.ndis?.planDocumentUrl ? (
              <Row
                label="Plan Document"
                value={
                  <a
                    className="underline text-indigo-400"
                    href={data.ndis.planDocumentUrl}
                    target="_blank"
                  >
                    Open file
                  </a>
                }
              />
            ) : null}
          </div>
        </Card>

        <Card className="mb-6">
          <h4 className="mb-3 text-lg font-semibold text-white">Referrer</h4>
          <pre className="whitespace-pre-wrap text-sm text-white/80">
            {JSON.stringify(data.referrer ?? {}, null, 2)}
          </pre>
        </Card>

        <Card className="mb-6">
          <h4 className="mb-3 text-lg font-semibold text-white">Referral</h4>
          <div className="grid gap-2">
            <Row label="Referred For" value={data.referral?.type} />
            <div>
              <div className="text-white/60 mb-1">Medical Information</div>
              <div className="rounded-lg bg-white/5 p-3 text-sm text-white/80">
                {data.referral?.medicalInformation ?? "-"}
              </div>
            </div>
          </div>
        </Card>
      </aside>
    </div>
  );
}

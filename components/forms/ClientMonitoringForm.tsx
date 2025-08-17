// components/forms/ClientMonitoringForm.tsx
"use client";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Button, Input, Label, Card } from "@/components/ui";
import { useState } from "react";

export default function ClientMonitoringForm({ uid }: { uid: string }) {
  const [clientId, setClientId] = useState("");
  const [observation, setObservation] = useState("");
  const [sending, setSending] = useState(false);

  async function submit() {
    setSending(true);
    await addDoc(collection(db, "monitoring"), {
      uid,
      clientId,
      observation,
      createdAt: serverTimestamp(),
    });
    setSending(false);
    setClientId("");
    setObservation("");
    alert("Saved!");
  }

  return (
    <Card>
      <h3 className="mb-4 text-white">Client Monitoring Form</h3>
      <div className="grid gap-3">
        <div>
          <Label>Client ID</Label>
          <Input
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
          />
        </div>
        <div>
          <Label>Observation</Label>
          <Input
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
            placeholder="Progress, risks, next steps…"
          />
        </div>
        <Button
          onClick={submit}
          loading={sending}
          disabled={!clientId || observation.length < 3}
        >
          Submit
        </Button>
      </div>
    </Card>
  );
}

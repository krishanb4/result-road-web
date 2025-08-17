// components/forms/FeedbackForm.tsx
"use client";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Button, Input, Label, Card } from "@/components/ui";
import { useState } from "react";

export default function FeedbackForm({
  uid,
  kind = "service_provider",
}: {
  uid: string;
  kind?: "service_provider" | "fitness_partner";
}) {
  const [sessionId, setSessionId] = useState("");
  const [feedback, setFeedback] = useState("");
  const [sending, setSending] = useState(false);
  const canSubmit = sessionId && feedback.length > 5;

  async function submit() {
    setSending(true);
    await addDoc(collection(db, "feedback"), {
      uid,
      sessionId,
      feedback,
      role: kind,
      createdAt: serverTimestamp(),
    });
    setSending(false);
    setSessionId("");
    setFeedback("");
    alert("Feedback sent!");
  }

  return (
    <Card>
      <h3 className="mb-4 text-white">
        {kind === "fitness_partner" ? "Group Feedback" : "Feedback"} Form
      </h3>
      <div className="grid gap-3">
        <div>
          <Label>Session / Class ID</Label>
          <Input
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
          />
        </div>
        <div>
          <Label>Your feedback</Label>
          <Input
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="What went well? What to improve?"
          />
        </div>
        <Button onClick={submit} disabled={!canSubmit} loading={sending}>
          Submit
        </Button>
      </div>
    </Card>
  );
}

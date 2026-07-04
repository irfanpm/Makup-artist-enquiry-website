"use client";

import { useState } from "react";
import { createFaq, updateFaq, deleteFaq } from "@/actions/faqs";

interface FaqsManagerProps {
  initialFaqs: any[];
}

export default function FaqsManager({ initialFaqs }: FaqsManagerProps) {
  const [faqs, setFaqs] = useState(initialFaqs);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEdit = (faq: any) => {
    setEditingId(faq._id);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setError("");
  };

  const handleCancel = () => {
    setEditingId(null);
    setQuestion("");
    setAnswer("");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      question,
      answer,
      isActive: true,
    };

    try {
      if (editingId) {
        const updated = await updateFaq(editingId, payload);
        setFaqs(faqs.map((f) => (f._id === editingId ? updated : f)));
      } else {
        const created = await createFaq(payload);
        setFaqs([created, ...faqs]);
      }
      handleCancel();
    } catch (err: any) {
      setError(err.message || "Failed to save FAQ");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;

    try {
      setFaqs(faqs.filter((f) => f._id !== id));
      await deleteFaq(id);
    } catch (err) {
      console.error(err);
      alert("Failed to delete FAQ");
      setFaqs(initialFaqs);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* FAQ List */}
      <div className="lg:col-span-2 space-y-4">
        <h2 className="font-serif text-xl font-bold text-secondary">Q&A list</h2>
        {faqs.length === 0 ? (
          <p className="text-sm text-foreground/50 py-4 font-medium">No FAQs created yet.</p>
        ) : (
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq._id} className="rounded-2xl border border-primary/10 p-5 space-y-2">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="font-bold text-secondary text-sm">
                    Q: {faq.question}
                  </h3>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleEdit(faq)}
                      className="rounded-lg bg-muted px-2.5 py-1 text-xs font-semibold text-secondary hover:bg-primary/10 hover:text-primary transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(faq._id)}
                      className="rounded-lg bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-100 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-xs text-foreground/75 leading-relaxed">
                  A: {faq.answer}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAQ Form */}
      <div className="rounded-2xl border border-primary/5 bg-muted/10 p-6 space-y-6">
        <h2 className="font-serif text-lg font-bold text-secondary">
          {editingId ? "Edit FAQ" : "Add FAQ"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-xl bg-red-50 p-3 text-xs text-red-600 border border-red-100 font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-secondary">Question</label>
            <input
              type="text"
              required
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. Do you travel to venues?"
              className="mt-1 block w-full rounded-full border border-primary/20 bg-white px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-secondary">Answer</label>
            <textarea
              rows={5}
              required
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Explain details..."
              className="mt-1 block w-full rounded-2xl border border-primary/20 bg-white px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-full bg-primary py-2.5 text-xs font-semibold text-white shadow-md hover:bg-primary-dark transition"
            >
              {loading ? "Saving..." : editingId ? "Update FAQ" : "Create FAQ"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-full border border-primary/20 px-4 py-2.5 text-xs font-semibold text-secondary hover:bg-white transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

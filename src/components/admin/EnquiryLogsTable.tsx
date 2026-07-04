"use client";

import { useState } from "react";

interface EnquiryLogsTableProps {
  initialEnquiries: any[];
}

export default function EnquiryLogsTable({
  initialEnquiries,
}: EnquiryLogsTableProps) {
  const [enquiries, setEnquiries] = useState(initialEnquiries);
  const [filterDate, setFilterDate] = useState("");
  const [selectedEnquiry, setSelectedEnquiry] = useState<any | null>(null);

  const handleDateFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateVal = e.target.value;
    setFilterDate(dateVal);
    
    if (dateVal) {
      // Filter list of enquiries where eventDate matches OR createdAt matches the selected date
      setEnquiries(
        initialEnquiries.filter((enq) => {
          const createdStr = new Date(enq.createdAt).toISOString().split("T")[0];
          return enq.eventDate === dateVal || createdStr === dateVal;
        })
      );
    } else {
      setEnquiries(initialEnquiries);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-primary/5 pb-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-secondary">
            Filter by Date (Event or Logged Date)
          </label>
          <input
            type="date"
            value={filterDate}
            onChange={handleDateFilterChange}
            className="mt-1 block rounded-full border border-primary/20 bg-background px-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
          />
        </div>
        {filterDate && (
          <button
            onClick={() => {
              setFilterDate("");
              setEnquiries(initialEnquiries);
            }}
            className="rounded-full bg-muted px-4 py-2 text-xs font-semibold text-secondary hover:bg-primary/10 hover:text-primary transition"
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* Table */}
      {enquiries.length === 0 ? (
        <p className="text-sm text-foreground/50 py-4 text-center">No enquiries recorded.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-primary/5 text-foreground/50 text-xs font-semibold uppercase">
                <th className="pb-3">Logged Date</th>
                <th className="pb-3">Service</th>
                <th className="pb-3">Event Date</th>
                <th className="pb-3">Estimated Total</th>
                <th className="pb-3">Location</th>
                <th className="pb-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {enquiries.map((enq) => (
                <tr key={enq._id} className="text-foreground/80 hover:bg-muted/10 transition">
                  <td className="py-4">
                    {new Date(enq.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="py-4 font-semibold text-secondary">
                    {enq.serviceName || "Quick Enquiry"}
                  </td>
                  <td className="py-4 font-medium">{enq.eventDate || "-"}</td>
                  <td className="py-4 font-bold text-secondary">
                    ₹{enq.totalPrice?.toLocaleString("en-IN") || "-"}
                  </td>
                  <td className="py-4 truncate max-w-[120px]">{enq.location || "-"}</td>
                  <td className="py-4 text-right">
                    <button
                      onClick={() => setSelectedEnquiry(enq)}
                      className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary hover:text-white transition"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Enquiry Detail Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-secondary/30 backdrop-blur-xs px-4">
          <div className="w-full max-w-md rounded-3xl border border-primary/10 bg-white p-6 shadow-2xl">
            <div className="flex justify-between items-start border-b border-primary/5 pb-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-secondary">Enquiry Details</h3>
                <p className="text-[10px] text-foreground/50 mt-0.5">
                  Logged on {new Date(selectedEnquiry.createdAt).toLocaleString("en-IN")}
                </p>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="rounded-lg p-1.5 text-foreground/50 hover:bg-muted hover:text-secondary"
                aria-label="Close modal"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="py-4 space-y-4 text-sm text-foreground/80">
              <div className="grid grid-cols-2 gap-2 border-b border-primary/5 pb-3">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-foreground/45 block">Selected Service</span>
                  <span className="font-bold text-secondary">{selectedEnquiry.serviceName || "Quick Enquiry"}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-foreground/45 block">Est. Revenue</span>
                  <span className="font-bold text-primary">₹{selectedEnquiry.totalPrice?.toLocaleString("en-IN") || "-"}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 border-b border-primary/5 pb-3">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-foreground/45 block">Event Date</span>
                  <span className="font-semibold text-secondary/80">{selectedEnquiry.eventDate || "-"}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-foreground/45 block">Persons</span>
                  <span className="font-semibold text-secondary/80">{selectedEnquiry.personCount || "-"}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-foreground/45 block">Location</span>
                  <span className="font-semibold text-secondary/80 truncate block">{selectedEnquiry.location || "-"}</span>
                </div>
              </div>

              {selectedEnquiry.referenceReelUrl && (
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-foreground/45 block mb-1">Reference Reel / Look URL</span>
                  <a
                    href={selectedEnquiry.referenceReelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-primary/5 p-3 rounded-2xl border border-primary/10 text-xs font-semibold text-primary hover:bg-primary/20 transition truncate"
                  >
                    {selectedEnquiry.referenceReelUrl}
                  </a>
                </div>
              )}

              {selectedEnquiry.addOns && selectedEnquiry.addOns.length > 0 && (
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-foreground/45 block mb-1">Add-Ons Selected</span>
                  <ul className="space-y-1.5 bg-muted/20 p-3 rounded-2xl border border-primary/5">
                    {selectedEnquiry.addOns.map((add: any, i: number) => (
                      <li key={i} className="flex justify-between text-xs font-semibold text-secondary/85">
                        <span>• {add.name}</span>
                        <span>+₹{add.price}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="rounded-full bg-primary px-5 py-2 text-xs font-semibold text-white shadow-md hover:bg-primary-dark transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

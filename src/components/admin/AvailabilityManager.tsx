"use client";

import { useState } from "react";
import { setDateStatus, bulkSetRange } from "@/actions/availability";

interface AvailabilityManagerProps {
  initialEntries: any[];
}

export default function AvailabilityManager({
  initialEntries,
}: AvailabilityManagerProps) {
  const [entries, setEntries] = useState(initialEntries);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); // 0-indexed
  
  // Single date settings
  const [selectedDate, setSelectedDate] = useState("");
  const [status, setStatus] = useState<"available" | "booked" | "holiday" | "partially_booked">("booked");
  const [maxBookings, setMaxBookings] = useState(1);
  const [bookedCount, setBookedCount] = useState(1);
  const [note, setNote] = useState("");
  
  // Bulk range settings
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");
  const [rangeStatus, setRangeStatus] = useState<"available" | "booked" | "holiday" | "partially_booked">("booked");
  const [rangeMaxBookings, setRangeMaxBookings] = useState(1);
  const [rangeBookedCount, setRangeBookedCount] = useState(1);
  const [rangeNote, setRangeNote] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Helpers to get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay(); // 0 = Sunday, 1 = Monday...
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  // Pad empty days at start of grid
  const gridCells = [];
  for (let i = 0; i < firstDay; i++) {
    gridCells.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    gridCells.push(i);
  }

  const getEntryForDate = (day: number) => {
    const formattedMonth = String(currentMonth + 1).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    const dateStr = `${currentYear}-${formattedMonth}-${formattedDay}`;
    return entries.find((e) => e.date === dateStr);
  };

  const handleCellClick = (day: number) => {
    const formattedMonth = String(currentMonth + 1).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    const dateStr = `${currentYear}-${formattedMonth}-${formattedDay}`;
    setSelectedDate(dateStr);
    
    const existing = entries.find((e) => e.date === dateStr);
    if (existing) {
      setStatus(existing.status);
      setNote(existing.note || "");
      setMaxBookings(existing.maxBookings ?? 1);
      setBookedCount(existing.bookedCount ?? (existing.status === "booked" ? 1 : 0));
    } else {
      setStatus("booked");
      setNote("");
      setMaxBookings(1);
      setBookedCount(1);
    }
    setError("");
    setSuccess("");
  };

  // Submit single date status
  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) return;

    setLoading(true);
    setError("");
    setSuccess("");

    let finalStatus = status;
    let finalBookedCount = bookedCount;
    let finalMaxBookings = maxBookings;

    if (status === "booked" || status === "partially_booked") {
      if (bookedCount === 0) {
        finalStatus = "available";
      } else if (bookedCount < maxBookings) {
        finalStatus = "partially_booked";
      } else {
        finalStatus = "booked";
      }
    } else if (status === "available") {
      finalBookedCount = 0;
    } else if (status === "holiday") {
      finalBookedCount = 0;
      finalMaxBookings = 1;
    }

    try {
      await setDateStatus(selectedDate, finalStatus, note, finalMaxBookings, finalBookedCount);
      
      let nextEntries;
      const isDefaultAvailable =
        finalStatus === "available" &&
        (!note || note.trim() === "") &&
        (!finalMaxBookings || finalMaxBookings === 1) &&
        (!finalBookedCount || finalBookedCount === 0);

      if (isDefaultAvailable) {
        nextEntries = entries.filter((e) => e.date !== selectedDate);
      } else {
        const existingIndex = entries.findIndex((e) => e.date === selectedDate);
        const newEntry = {
          date: selectedDate,
          status: finalStatus,
          note,
          maxBookings: finalMaxBookings,
          bookedCount: finalBookedCount
        };
        if (existingIndex > -1) {
          nextEntries = [...entries];
          nextEntries[existingIndex] = newEntry;
        } else {
          nextEntries = [...entries, newEntry];
        }
      }
      setEntries(nextEntries);
      setSuccess("Date updated successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to update date status");
    } finally {
      setLoading(false);
    }
  };

  // Submit bulk range status
  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rangeStart || !rangeEnd) {
      setError("Please select both start and end dates.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    let finalStatus = rangeStatus;
    let finalBookedCount = rangeBookedCount;
    let finalMaxBookings = rangeMaxBookings;

    if (rangeStatus === "booked" || rangeStatus === "partially_booked") {
      if (rangeBookedCount === 0) {
        finalStatus = "available";
      } else if (rangeBookedCount < rangeMaxBookings) {
        finalStatus = "partially_booked";
      } else {
        finalStatus = "booked";
      }
    } else if (rangeStatus === "available") {
      finalBookedCount = 0;
    } else if (rangeStatus === "holiday") {
      finalBookedCount = 0;
      finalMaxBookings = 1;
    }

    try {
      await bulkSetRange(rangeStart, rangeEnd, finalStatus, rangeNote, finalMaxBookings, finalBookedCount);
      window.location.reload(); // Hard reload is safe for bulk operations
    } catch (err: any) {
      setError(err.message || "Failed to perform bulk range update");
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Calendar Grid Section */}
      <div className="lg:col-span-2 space-y-4">
        {/* Month Header controls */}
        <div className="flex items-center justify-between border-b border-primary/5 pb-4">
          <h2 className="font-serif text-xl font-bold text-secondary">
            {monthNames[currentMonth]} {currentYear}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrevMonth}
              className="rounded-full bg-muted p-2 hover:bg-primary/10 hover:text-primary transition"
              aria-label="Previous month"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleNextMonth}
              className="rounded-full bg-muted p-2 hover:bg-primary/10 hover:text-primary transition"
              aria-label="Next month"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-secondary/60">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Calendar Cells */}
        <div className="grid grid-cols-7 gap-2">
          {gridCells.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="aspect-square" />;
            }

            const entry = getEntryForDate(day);
            const isSelected = selectedDate === `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            
            let cellBg = "bg-emerald-50 text-emerald-800 border-emerald-100 hover:bg-emerald-100/50";
            if (entry?.status === "booked") {
              cellBg = "bg-rose-50 text-rose-800 border-rose-100 hover:bg-rose-100/50";
            } else if (entry?.status === "partially_booked") {
              cellBg = "bg-amber-50 text-amber-800 border-amber-100 hover:bg-amber-100/50";
            } else if (entry?.status === "holiday") {
              cellBg = "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/50";
            }

            return (
              <button
                key={`day-${day}`}
                onClick={() => handleCellClick(day)}
                className={`aspect-square flex flex-col items-center justify-between p-2 rounded-2xl border text-sm font-semibold transition ${cellBg} ${
                  isSelected ? "ring-2 ring-primary ring-offset-1 border-primary" : ""
                }`}
              >
                <span>{day}</span>
                
                {entry && (entry.status === "booked" || entry.status === "partially_booked" || (entry.maxBookings && entry.maxBookings > 1)) && (
                  <span className="text-[9px] font-bold opacity-90 my-0.5 px-1 py-0.5 rounded bg-white/70 shadow-sm border border-black/5 text-secondary">
                    {entry.bookedCount ?? (entry.status === "booked" ? 1 : 0)}/{entry.maxBookings ?? 1} Works
                  </span>
                )}

                {entry?.note && (
                  <span className="text-[9px] truncate max-w-full font-normal opacity-70">
                    {entry.note}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-xs font-medium text-foreground/60 pt-4 border-t border-primary/5">
          <div className="flex items-center gap-1.5">
            <span className="h-3.5 w-3.5 rounded-full bg-emerald-50 border border-emerald-100 inline-block" />
            Available (Default)
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3.5 w-3.5 rounded-full bg-amber-50 border border-amber-100 inline-block" />
            Partially Booked
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3.5 w-3.5 rounded-full bg-rose-50 border border-rose-100 inline-block" />
            Booked / Filled
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3.5 w-3.5 rounded-full bg-slate-100 border border-slate-200 inline-block" />
            Holiday / Off-duty
          </div>
        </div>
      </div>

      {/* Editor Sidebar Panel */}
      <div className="space-y-8">
        {/* Editor for single date */}
        <div className="rounded-2xl border border-primary/5 bg-muted/10 p-6 space-y-6">
          <h2 className="font-serif text-lg font-bold text-secondary">
            Manage Selected Date
          </h2>
          
          {success && (
            <div className="rounded-xl bg-emerald-50 p-3 text-xs text-emerald-700 border border-emerald-100 font-semibold">
              {success}
            </div>
          )}

          {error && (
            <div className="rounded-xl bg-red-50 p-3 text-xs text-red-600 border border-red-100 font-medium">
              {error}
            </div>
          )}

          {selectedDate ? (
            <form onSubmit={handleSingleSubmit} className="space-y-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-secondary">Selected Date</span>
                <p className="text-sm font-bold text-secondary/80 mt-0.5">
                  {new Date(selectedDate).toLocaleDateString("en-IN", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-secondary">Status</label>
                <select
                  value={status === "partially_booked" ? "booked" : status}
                  onChange={(e) => {
                    const val = e.target.value;
                    setStatus(val as any);
                    if (val === "booked") {
                      if (bookedCount === 0) setBookedCount(1);
                    }
                  }}
                  className="mt-1 block w-full rounded-full border border-primary/20 bg-white px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="available">Available (Green)</option>
                  <option value="booked">Booked / Slots (Red/Orange)</option>
                  <option value="holiday">Holiday/Off (Grey)</option>
                </select>
              </div>

              {(status === "booked" || status === "partially_booked") && (
                <div className="grid gap-3 grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-secondary">Max Capacity</label>
                    <input
                      type="number"
                      min={1}
                      value={maxBookings}
                      onChange={(e) => setMaxBookings(Math.max(1, Number(e.target.value)))}
                      className="mt-1 block w-full rounded-full border border-primary/20 bg-white px-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-secondary">Booked Count</label>
                    <input
                      type="number"
                      min={0}
                      value={bookedCount}
                      onChange={(e) => setBookedCount(Math.max(0, Number(e.target.value)))}
                      className="mt-1 block w-full rounded-full border border-primary/20 bg-white px-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-secondary">Admin Note (optional)</label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Wedding photoshoot"
                  className="mt-1 block w-full rounded-full border border-primary/20 bg-white px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-primary py-2.5 text-xs font-semibold text-white shadow-md hover:bg-primary-dark transition disabled:opacity-50"
              >
                {loading ? "Updating..." : "Save Availability"}
              </button>
            </form>
          ) : (
            <p className="text-xs text-foreground/50 italic">
              Click any cell in the calendar grid to configure availability for that day.
            </p>
          )}
        </div>

        {/* Bulk Range Config */}
        <div className="rounded-2xl border border-primary/5 bg-muted/10 p-6 space-y-6">
          <h2 className="font-serif text-lg font-bold text-secondary">
            Bulk Block Dates
          </h2>
          <form onSubmit={handleBulkSubmit} className="space-y-4">
            <div className="grid gap-3 grid-cols-2">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-secondary">Start Date</label>
                <input
                  type="date"
                  required
                  value={rangeStart}
                  onChange={(e) => setRangeStart(e.target.value)}
                  className="mt-1 block w-full rounded-full border border-primary/20 bg-white px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-secondary">End Date</label>
                <input
                  type="date"
                  required
                  value={rangeEnd}
                  onChange={(e) => setRangeEnd(e.target.value)}
                  className="mt-1 block w-full rounded-full border border-primary/20 bg-white px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-secondary">Status</label>
              <select
                value={rangeStatus === "partially_booked" ? "booked" : rangeStatus}
                onChange={(e) => {
                  const val = e.target.value;
                  setRangeStatus(val as any);
                  if (val === "booked") {
                    if (rangeBookedCount === 0) setRangeBookedCount(1);
                  }
                }}
                className="mt-1 block w-full rounded-full border border-primary/20 bg-white px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                <option value="available">Available (Green)</option>
                <option value="booked">Booked / Slots (Red/Orange)</option>
                <option value="holiday">Holiday/Off (Grey)</option>
              </select>
            </div>

            {(rangeStatus === "booked" || rangeStatus === "partially_booked") && (
              <div className="grid gap-3 grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-secondary">Max Capacity</label>
                  <input
                    type="number"
                    min={1}
                    value={rangeMaxBookings}
                    onChange={(e) => setRangeMaxBookings(Math.max(1, Number(e.target.value)))}
                    className="mt-1 block w-full rounded-full border border-primary/20 bg-white px-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-secondary">Booked Count</label>
                  <input
                    type="number"
                    min={0}
                    value={rangeBookedCount}
                    onChange={(e) => setRangeBookedCount(Math.max(0, Number(e.target.value)))}
                    className="mt-1 block w-full rounded-full border border-primary/20 bg-white px-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-secondary">Admin Note (optional)</label>
              <input
                type="text"
                value={rangeNote}
                onChange={(e) => setRangeNote(e.target.value)}
                placeholder="e.g. Off-season vacation"
                className="mt-1 block w-full rounded-full border border-primary/20 bg-white px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full border border-primary/50 py-2.5 text-xs font-semibold text-secondary hover:bg-white hover:text-primary transition disabled:opacity-50 bg-white/50"
            >
              {loading ? "Processing..." : "Bulk Apply Status"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

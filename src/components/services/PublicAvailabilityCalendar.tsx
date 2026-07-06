"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { AvailabilityEntry, Service } from "@/types";
import { formatPrice } from "@/lib/utils";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { quickEnquiryUrl } from "@/lib/whatsapp";

interface PublicAvailabilityCalendarProps {
  initialEntries: AvailabilityEntry[];
  services: Service[];
  whatsappNumber?: string;
}

export default function PublicAvailabilityCalendar({
  initialEntries,
  services,
  whatsappNumber,
}: PublicAvailabilityCalendarProps) {
  const [entries] = useState(initialEntries);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); // 0-indexed
  const [selectedDate, setSelectedDate] = useState("");

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay(); // 0 = Sunday
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDate("");
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDate("");
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

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

  const selectedDateEntry = useMemo(() => {
    if (!selectedDate) return null;
    const entry = entries.find((e) => e.date === selectedDate);
    if (!entry) {
      return {
        date: selectedDate,
        status: "available" as const,
        maxBookings: 1,
        bookedCount: 0,
      };
    }
    return {
      ...entry,
      maxBookings: entry.maxBookings ?? 1,
      bookedCount: entry.bookedCount ?? (entry.status === "booked" ? 1 : 0),
    };
  }, [selectedDate, entries]);

  const handleCellClick = (day: number) => {
    const formattedMonth = String(currentMonth + 1).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    const dateStr = `${currentYear}-${formattedMonth}-${formattedDay}`;
    setSelectedDate(dateStr);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Calendar Grid card */}
      <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-md shadow-primary/5 lg:col-span-2 space-y-6">
        {/* Header navigation */}
        <div className="flex items-center justify-between border-b border-primary/5 pb-4">
          <h2 className="font-serif text-2xl font-semibold text-secondary">
            {monthNames[currentMonth]} {currentYear}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrevMonth}
              className="rounded-full bg-muted p-2.5 hover:bg-primary/10 hover:text-primary transition"
              aria-label="Previous month"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleNextMonth}
              className="rounded-full bg-muted p-2.5 hover:bg-primary/10 hover:text-primary transition"
              aria-label="Next month"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Week Days */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-secondary/60">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-2 md:gap-3">
          {gridCells.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="aspect-square" />;
            }

            const entry = getEntryForDate(day);
            const isSelected = selectedDate === `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

            // Check details
            const max = entry?.maxBookings ?? 1;
            const count = entry?.bookedCount ?? (entry?.status === "booked" ? 1 : 0);
            
            let cellBg = "bg-emerald-50/70 text-emerald-800 border-emerald-100/70 hover:bg-emerald-100/50";
            if (entry?.status === "holiday") {
              cellBg = "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/50";
            } else if (entry?.status === "booked" || count >= max) {
              cellBg = "bg-rose-50 text-rose-800 border-rose-100 hover:bg-rose-100/50";
            } else if (entry?.status === "partially_booked" || (count > 0 && count < max)) {
              cellBg = "bg-amber-50 text-amber-800 border-amber-100 hover:bg-amber-100/50";
            }

            return (
              <button
                key={`day-${day}`}
                onClick={() => handleCellClick(day)}
                className={`aspect-square flex flex-col items-center justify-between p-1.5 md:p-2.5 rounded-xl md:rounded-2xl border text-sm font-semibold transition ${cellBg} ${
                  isSelected ? "ring-2 ring-primary ring-offset-2 border-primary" : ""
                }`}
              >
                <span>{day}</span>

                {/* Show slot info */}
                {entry && (entry.status === "booked" || entry.status === "partially_booked" || max > 1) && (
                  <span className="text-[8px] md:text-[9px] font-bold opacity-80 px-1 py-0.5 rounded bg-white/70 shadow-sm border border-black/5 text-secondary">
                    {count}/{max} Booked
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Legends */}
        <div className="flex flex-wrap gap-4 text-xs font-semibold text-foreground/60 pt-6 border-t border-primary/5">
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-full bg-emerald-50 border border-emerald-100 inline-block" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-full bg-amber-50 border border-amber-100 inline-block" />
            <span>Partially Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-full bg-rose-50 border border-rose-100 inline-block" />
            <span>Fully Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-full bg-slate-100 border border-slate-200 inline-block" />
            <span>Holiday / Off</span>
          </div>
        </div>
      </div>

      {/* Interactive sidebar card */}
      <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-md shadow-primary/5 space-y-6 flex flex-col justify-between">
        {selectedDateEntry ? (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Selected Date</span>
              <h3 className="font-serif text-xl font-bold text-secondary mt-1">
                {new Date(selectedDateEntry.date).toLocaleDateString("en-IN", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </h3>
            </div>

            <div className="rounded-xl border border-primary/5 p-4 bg-muted/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground/60">Status</span>
                {selectedDateEntry.status === "available" && (
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-100">
                    Available
                  </span>
                )}
                {selectedDateEntry.status === "partially_booked" && (
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 border border-amber-100">
                    Limited Slots
                  </span>
                )}
                {selectedDateEntry.status === "booked" && (
                  <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700 border border-rose-100">
                    Fully Booked
                  </span>
                )}
                {selectedDateEntry.status === "holiday" && (
                  <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700 border border-slate-100">
                    Holiday / Off-duty
                  </span>
                )}
              </div>

              {(selectedDateEntry.status === "booked" ||
                selectedDateEntry.status === "partially_booked" ||
                selectedDateEntry.maxBookings > 1) && (
                <div className="flex items-center justify-between border-t border-primary/5 pt-2.5">
                  <span className="text-xs font-semibold text-foreground/60">Bookings / Slots</span>
                  <span className="text-sm font-bold text-secondary">
                    {selectedDateEntry.bookedCount} / {selectedDateEntry.maxBookings} Filled
                  </span>
                </div>
              )}

              {selectedDateEntry.note && (
                <div className="border-t border-primary/5 pt-2.5">
                  <span className="text-xs font-semibold text-foreground/60 block">Artist Note</span>
                  <p className="text-xs text-foreground/80 mt-1 italic">
                    &ldquo;{selectedDateEntry.note}&rdquo;
                  </p>
                </div>
              )}
            </div>

            {/* Actions block */}
            <div className="space-y-3 pt-2">
              {selectedDateEntry.status === "holiday" ? (
                <p className="text-xs text-foreground/50 text-center italic">
                  Please pick another date to proceed with booking or enquiry.
                </p>
              ) : selectedDateEntry.status === "booked" ? (
                <div className="space-y-3">
                  <p className="text-xs text-foreground/60">
                    This date is fully booked, but you can send an enquiry to join the waitlist in case slots open up.
                  </p>
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                      `Hi! I wanted to check if there are any waitlist openings for makeup services on ${new Date(
                        selectedDateEntry.date
                      ).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-md hover:bg-primary-dark transition"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    Enquire Waitlist
                  </a>
                </div>
              ) : (
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-secondary block">
                    Select a Service to Customize
                  </span>
                  <div className="max-h-56 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                    {services.map((service) => (
                      <Link
                        key={service.slug}
                        href={`/services/${service.slug}?date=${selectedDate}`}
                        className="block rounded-xl border border-primary/10 p-3 hover:border-primary/50 hover:bg-primary/5 transition text-left group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-secondary group-hover:text-primary transition">
                            {service.name}
                          </span>
                          <span className="text-xs font-bold text-primary">
                            {formatPrice(service.price)}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-14 space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/5 text-primary">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="space-y-1">
              <h4 className="font-serif text-base font-bold text-secondary">Check Date Availability</h4>
              <p className="text-xs text-foreground/50 max-w-xs mx-auto">
                Click on any date in the calendar grid to check slot status, read artist notes, and book services.
              </p>
            </div>
          </div>
        )}

        <div className="border-t border-primary/5 pt-4 text-center">
          <p className="text-[10px] text-foreground/40 leading-relaxed">
            Calendar updates in real time. Standard booking capacity is shown per day.
          </p>
        </div>
      </div>
    </div>
  );
}

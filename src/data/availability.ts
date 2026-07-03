import type { AvailabilityEntry } from "@/types";

// Dummy availability for the demo — dates relative to July 2026.
// Any date NOT listed here is treated as "available".

export const availability: AvailabilityEntry[] = [
  { date: "2026-07-05", status: "booked" },
  { date: "2026-07-11", status: "booked" },
  { date: "2026-07-12", status: "booked" },
  { date: "2026-07-18", status: "booked" },
  { date: "2026-07-20", status: "holiday" },
  { date: "2026-07-26", status: "booked" },
  { date: "2026-08-02", status: "booked" },
  { date: "2026-08-09", status: "booked" },
  { date: "2026-08-15", status: "holiday" },
  { date: "2026-08-16", status: "booked" },
  { date: "2026-08-23", status: "booked" },
];

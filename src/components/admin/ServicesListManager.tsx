"use client";

import { useState } from "react";
import Link from "next/link";
import {
  toggleServiceActive,
  toggleServiceFeatured,
  deleteService,
} from "@/actions/services";

interface ServiceProps {
  initialServices: any[];
}

export default function ServicesListManager({ initialServices }: ServiceProps) {
  const [services, setServices] = useState(initialServices);

  const handleToggleActive = async (id: string) => {
    try {
      // Optimistic update
      setServices(
        services.map((s) => (s._id === id ? { ...s, isActive: !s.isActive } : s))
      );
      await toggleServiceActive(id);
    } catch (error) {
      console.error(error);
      // Revert if error
      setServices(initialServices);
    }
  };

  const handleToggleFeatured = async (id: string) => {
    try {
      // Optimistic update
      setServices(
        services.map((s) => (s._id === id ? { ...s, isFeatured: !s.isFeatured } : s))
      );
      await toggleServiceFeatured(id);
    } catch (error) {
      console.error(error);
      // Revert
      setServices(initialServices);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      setServices(services.filter((s) => s._id !== id));
      await deleteService(id);
    } catch (error) {
      console.error(error);
      alert("Failed to delete service");
    }
  };

  if (services.length === 0) {
    return (
      <div className="py-12 text-center">
        <svg
          className="mx-auto h-12 w-12 text-foreground/30"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
          />
        </svg>
        <p className="mt-4 text-sm text-foreground/50">No services created yet.</p>
        <Link
          href="/admin/services/new"
          className="mt-4 inline-flex rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold text-primary hover:bg-primary/20 transition"
        >
          Create your first service
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-primary/5 text-foreground/50 text-xs font-semibold uppercase">
            <th className="pb-3">Service Name</th>
            <th className="pb-3">Slug</th>
            <th className="pb-3">Price</th>
            <th className="pb-3">Active</th>
            <th className="pb-3">Featured</th>
            <th className="pb-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-primary/5">
          {services.map((service) => (
            <tr key={service._id} className="text-foreground/80">
              <td className="py-4 font-semibold text-secondary">
                {service.name}
              </td>
              <td className="py-4 text-foreground/60">{service.slug}</td>
              <td className="py-4 font-medium">
                {service.priceLabel} ₹{service.price.toLocaleString("en-IN")}
              </td>
              <td className="py-4">
                <button
                  onClick={() => handleToggleActive(service._id)}
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                    service.isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {service.isActive ? "Active" : "Inactive"}
                </button>
              </td>
              <td className="py-4">
                <button
                  onClick={() => handleToggleFeatured(service._id)}
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                    service.isFeatured
                      ? "bg-amber-50 text-amber-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {service.isFeatured ? "Featured" : "No"}
                </button>
              </td>
              <td className="py-4 text-right space-x-2">
                <Link
                  href={`/admin/services/${service._id}/edit`}
                  className="rounded-lg bg-muted px-3 py-1.5 text-xs font-semibold text-secondary hover:bg-primary/10 hover:text-primary transition"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(service._id)}
                  className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

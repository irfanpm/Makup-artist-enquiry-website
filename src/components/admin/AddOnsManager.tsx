"use client";

import { useState } from "react";
import { createAddOn, updateAddOn, deleteAddOn } from "@/actions/addons";

interface AddOnsManagerProps {
  initialAddons: any[];
  services: any[];
}

export default function AddOnsManager({
  initialAddons,
  services,
}: AddOnsManagerProps) {
  const [addons, setAddons] = useState(initialAddons);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleServiceCheckbox = (id: string) => {
    if (selectedServiceIds.includes(id)) {
      setSelectedServiceIds(selectedServiceIds.filter((sid) => sid !== id));
    } else {
      setSelectedServiceIds([...selectedServiceIds, id]);
    }
  };

  const handleEdit = (addon: any) => {
    setEditingId(addon._id);
    setName(addon.name);
    setPrice(addon.price);
    setDescription(addon.description || "");
    setSelectedServiceIds(addon.serviceIds || []);
    setError("");
  };

  const handleCancel = () => {
    setEditingId(null);
    setName("");
    setPrice(0);
    setDescription("");
    setSelectedServiceIds([]);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      name,
      price: Number(price),
      description,
      serviceIds: selectedServiceIds,
      isActive: true,
    };

    try {
      if (editingId) {
        const updated = await updateAddOn(editingId, payload);
        setAddons(addons.map((a) => (a._id === editingId ? updated : a)));
      } else {
        const created = await createAddOn(payload);
        setAddons([created, ...addons]);
      }
      handleCancel();
    } catch (err: any) {
      setError(err.message || "Failed to save add-on");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this add-on?")) return;

    try {
      setAddons(addons.filter((a) => a._id !== id));
      await deleteAddOn(id);
    } catch (err) {
      console.error(err);
      alert("Failed to delete add-on");
      // Reset list
      setAddons(initialAddons);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* List section */}
      <div className="lg:col-span-2 space-y-4">
        <h2 className="font-serif text-xl font-bold text-secondary">Existing Add-Ons</h2>
        {addons.length === 0 ? (
          <p className="text-sm text-foreground/50 py-4">No add-ons created yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-primary/5 text-foreground/50 text-xs font-semibold uppercase">
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3">Applies To</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/5">
                {addons.map((addon) => {
                  const appliesToAll = !addon.serviceIds || addon.serviceIds.length === 0;
                  const serviceNames = appliesToAll
                    ? "All Services"
                    : services
                        .filter((s) => addon.serviceIds.includes(s._id))
                        .map((s) => s.name)
                        .join(", ");

                  return (
                    <tr key={addon._id} className="text-foreground/80">
                      <td className="py-4 font-semibold text-secondary">
                        {addon.name}
                        {addon.description && (
                          <span className="block text-xs font-normal text-foreground/50 mt-0.5">
                            {addon.description}
                          </span>
                        )}
                      </td>
                      <td className="py-4 font-medium">
                        ₹{addon.price.toLocaleString("en-IN")}
                      </td>
                      <td className="py-4 text-xs max-w-[180px] truncate text-foreground/60">
                        {serviceNames}
                      </td>
                      <td className="py-4 text-right space-x-2">
                        <button
                          onClick={() => handleEdit(addon)}
                          className="rounded-lg bg-muted px-2.5 py-1.5 text-xs font-semibold text-secondary hover:bg-primary/10 hover:text-primary transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(addon._id)}
                          className="rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form section */}
      <div className="rounded-2xl border border-primary/5 bg-muted/10 p-6 space-y-6">
        <h2 className="font-serif text-lg font-bold text-secondary">
          {editingId ? "Edit Add-On" : "Add New Add-On"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-xl bg-red-50 p-3 text-xs text-red-600 border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-secondary">Add-On Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Saree Draping"
              className="mt-1 block w-full rounded-full border border-primary/20 bg-white px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-secondary">Price (₹)</label>
            <input
              type="number"
              required
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              placeholder="e.g. 1000"
              className="mt-1 block w-full rounded-full border border-primary/20 bg-white px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-secondary">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief details..."
              className="mt-1 block w-full rounded-2xl border border-primary/20 bg-white px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          {/* Service selectors */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-secondary">
              Applicable Services
            </label>
            <p className="text-[10px] text-foreground/50">
              Select specific services, or leave unchecked for all services.
            </p>
            <div className="max-h-40 overflow-y-auto space-y-2 rounded-2xl border border-primary/10 bg-white p-3.5">
              {services.map((service) => (
                <label key={service._id} className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedServiceIds.includes(service._id)}
                    onChange={() => handleServiceCheckbox(service._id)}
                    className="rounded text-primary focus:ring-primary border-primary/20"
                  />
                  {service.name}
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-full bg-primary py-2.5 text-xs font-semibold text-white shadow-md hover:bg-primary-dark transition"
            >
              {loading ? "Saving..." : editingId ? "Update" : "Create"}
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

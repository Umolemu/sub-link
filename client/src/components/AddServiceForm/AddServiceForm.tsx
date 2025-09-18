import { useState } from "react";
import { Input } from "../Input/Input";
import { Button } from "../Button/Button";
import * as Icons from "lucide-react";
import { createService } from "../../api/Services/Services";
import type { ServiceDTO } from "../../types/Services/services";

export function AddServiceForm({
  iconOptions,
  onServiceCreated,
}: {
  iconOptions: readonly string[];
  onServiceCreated: (service: ServiceDTO | null) => void;
}) {
  const [serviceName, setServiceName] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [serviceDesc, setServiceDesc] = useState("");
  const [iconName, setIconName] = useState<string>("Phone");
  const [creating, setCreating] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [priceError, setPriceError] = useState<string | null>(null);
  const [descError, setDescError] = useState<string | null>(null);

  const parsePrice = (input: string): number => {
    const match = (input || "").replace(/,/g, "").match(/(\d+(?:\.\d{1,2})?)/);
    return match ? parseFloat(match[1]) : NaN;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameError(null);
    setPriceError(null);
    setDescError(null);

    const name = serviceName.trim();
    const description = serviceDesc.trim();
    const priceNumber = parsePrice(servicePrice);

    let hasError = false;
    if (!name) {
      setNameError("Service name is required");
      hasError = true;
    }
    if (!description) {
      setDescError("Description is required");
      hasError = true;
    }
    if (Number.isNaN(priceNumber)) {
      setPriceError("Valid price is required");
      hasError = true;
    } else if (priceNumber < 0) {
      setPriceError("Price must be greater than or equal to 0");
      hasError = true;
    }
    if (hasError) return;

    setCreating(true);
    try {
      const response = await createService({
        name,
        description,
        price: priceNumber,
        category: iconName,
        icon: iconName,
      });
      onServiceCreated(response ?? null);
      if (response) {
        setServiceName("");
        setServicePrice("");
        setServiceDesc("");
        setIconName("Phone");
      }
    } finally {
      setCreating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Service Name <span className="text-red-600">*</span>
          </label>
          <Input
            required
            value={serviceName}
            onChange={(e) => {
              setServiceName(e.target.value);
              if (nameError) setNameError(null);
            }}
            placeholder="e.g. Premium Video"
          />
          {nameError && (
            <p className="mt-1 text-xs text-red-600">{nameError}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Price (display) <span className="text-red-600">*</span>
          </label>
          <Input
            required
            value={servicePrice}
            onChange={(e) => {
              setServicePrice(e.target.value);
              if (priceError) setPriceError(null);
            }}
            placeholder="R9.99 / month"
          />
          {priceError && (
            <p className="mt-1 text-xs text-red-600">{priceError}</p>
          )}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-black mb-1">
            Description <span className="text-red-600">*</span>
          </label>
          <Input
            required
            value={serviceDesc}
            onChange={(e) => {
              setServiceDesc(e.target.value);
              if (descError) setDescError(null);
            }}
            placeholder="Short description"
          />
          {descError && (
            <p className="mt-1 text-xs text-red-600">{descError}</p>
          )}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-black mb-2">
            Icon
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {iconOptions.map((name) => {
              const IconPick: any = (Icons as any)[name];
              const selected = iconName === name;
              return (
                <button
                  type="button"
                  key={name}
                  onClick={() => setIconName(name)}
                  className={`flex items-center justify-center h-12 rounded border transition-colors ${
                    selected
                      ? "bg-black text-white border-black"
                      : "bg-white text-black border-gray-300 hover:bg-gray-100"
                  }`}
                  aria-pressed={selected}
                  title={name}
                >
                  <IconPick className="h-5 w-5" />
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Selecting an icon only logs a reference for now.
          </p>
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={creating}>
          {creating ? "Creating…" : "Create Service"}
        </Button>
      </div>
    </form>
  );
}

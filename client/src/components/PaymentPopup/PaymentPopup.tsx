import { useEffect, useState, type ReactNode } from "react";
import { Button } from "../Button/Button";
import type { ServiceDTO } from "../../types/Services/services";
import { SiApplepay } from "react-icons/si";
import { FaCcMastercard, FaPaypal } from "react-icons/fa";

export type PaymentMethod = "applePay" | "mastercard" | "paypal";

type PaymentPopupProps = {
	open: boolean;
	service: ServiceDTO | null;
	onClose: () => void;
	onConfirm: (method: PaymentMethod) => Promise<void> | void;
	confirming?: boolean;
	error?: string | null;
};

export function PaymentPopup({
	open,
	service,
	onClose,
	onConfirm,
	confirming = false,
	error,
}: PaymentPopupProps) {
	const [method, setMethod] = useState<PaymentMethod | null>(null);

	useEffect(() => {
		if (open) {
			setMethod(null);
		}
	}, [open, service?._id]);

	if (!open || !service) return null;

		const methods: {
			key: PaymentMethod;
			label: string;
			icon: ReactNode;
		}[] = [
		{ key: "applePay", label: "Apple Pay", icon: <SiApplepay className="w-6 h-6" /> },
		{
			key: "mastercard",
			label: "MasterCard",
			icon: <FaCcMastercard className="w-6 h-6" />,
		},
		{ key: "paypal", label: "PayPal", icon: <FaPaypal className="w-6 h-6" /> },
	];

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div
				className="absolute inset-0 bg-black/40"
				aria-hidden="true"
				onClick={() => !confirming && onClose()}
			/>
			<div className="relative bg-white border border-gray-200 rounded-lg shadow-xl w-full max-w-md mx-4">
				<div className="flex items-start justify-between p-4 border-b border-gray-200">
					<div>
						<h3 className="text-xl font-semibold text-black">Confirm Payment</h3>
						<p className="mt-1 text-sm text-gray-600">
							You are subscribing to <span className="font-medium text-black">{service.name}</span>
							{typeof service.price === "number" && (
								<>
									{" "}for <span className="font-medium text-black">${service.price.toFixed(2)}</span>
								</>
							)}
						</p>
					</div>
					<button
						className="text-gray-500 hover:text-black"
						onClick={() => !confirming && onClose()}
						aria-label="Close"
					>
						×
					</button>
				</div>

				<div className="p-4">
					<div className="space-y-3">
						{methods.map((m) => (
							<label
								key={m.key}
								className={`flex items-center gap-3 p-3 border rounded-md cursor-pointer transition-colors ${
									method === m.key
										? "border-black bg-gray-50"
										: "border-gray-300 hover:bg-gray-50"
								}`}
							>
								<input
									type="radio"
									name="payment-method"
									value={m.key}
									className="accent-black"
									checked={method === m.key}
									onChange={() => setMethod(m.key)}
								/>
								<span className="text-black">{m.icon}</span>
								<span className="text-sm text-black font-medium">{m.label}</span>
							</label>
						))}
					</div>

					{error && (
						<div className="mt-3 text-sm text-red-600" role="alert">
							{error}
						</div>
					)}
				</div>

				<div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
					<Button variant="outline" onClick={() => !confirming && onClose()} disabled={confirming}>
						Cancel
					</Button>
					<Button
						variant="primary"
						disabled={!method || confirming}
						onClick={() => method && onConfirm(method)}
					>
						{confirming ? "Processing…" : "Pay"}
					</Button>
				</div>
			</div>
		</div>
	);
}


import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import QRCode from "qrcode";

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface QRCodeData {
  bankName: string;
  accountName: string;
  accountNumber: string;
  type: "one-time" | "dynamic";
  amount?: number;
}

// Demo bank list
const DEMO_BANKS = [
  "Access Bank",
  "First Bank",
  "GT Bank",
  "UBA",
  "Zenith Bank",
  "Wema Bank",
  "Sterling Bank",
  "Fidelity Bank",
];

export default function QRCodeModal({ isOpen, onClose }: QRCodeModalProps) {
  const [formData, setFormData] = useState({
    bankName: "",
    accountName: "",
    accountNumber: "",
    amount: "",
    type: "dynamic" as "one-time" | "dynamic",
  });
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isAccountVerified, setIsAccountVerified] = useState(false);

  const handleAccountNumberChange = async (value: string) => {
    const numbersOnly = value.replace(/\D/g, "").slice(0, 10);
    setFormData((prev) => ({
      ...prev,
      accountNumber: numbersOnly,
      accountName: "", // Reset account name when number changes
    }));
    setIsAccountVerified(false);

    // If account number is complete (10 digits), simulate verification
    if (numbersOnly.length === 10) {
      setIsVerifying(true);
      // Simulate API call to fetch account name
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setFormData((prev) => ({
        ...prev,
        accountName: "Kelly Owoju",
      }));
      setIsVerifying(false);
      setIsAccountVerified(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // Validate required fields
      if (
        !formData.bankName ||
        !formData.accountNumber ||
        !formData.accountName
      ) {
        throw new Error(
          "Bank name, account number, and account name are required"
        );
      }

      if (!isAccountVerified) {
        throw new Error("Please wait for account verification to complete");
      }

      // Validate amount for one-time payment
      if (formData.type === "one-time") {
        if (!formData.amount || parseFloat(formData.amount) <= 0) {
          throw new Error("Please enter a valid amount for one-time payment");
        }
      }

      // Prepare QR code data
      const qrData: QRCodeData = {
        bankName: formData.bankName,
        accountName: formData.accountName,
        accountNumber: formData.accountNumber,
        type: formData.type,
      };

      // Only include amount for one-time payments
      if (formData.type === "one-time") {
        qrData.amount = parseFloat(formData.amount);
      }

      // Generate QR code
      const qrCodeImage = await QRCode.toDataURL(JSON.stringify(qrData));
      setQrCodeUrl(qrCodeImage);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate QR code"
      );
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = qrCodeUrl;
    link.download = `scanmiter-qr-${formData.accountNumber}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // const handleShare = async () => {
  //   try {
  //     if (navigator.share) {
  //       await navigator.share({
  //         title: "Scanmiter Payment QR Code",
  //         text: "Scan this QR code to make a payment",
  //         url: qrCodeUrl,
  //       });
  //     } else {
  //       await navigator.clipboard.writeText(qrCodeUrl);
  //       alert("QR code URL copied to clipboard!");
  //     }
  //   } catch (err) {
  //     console.error("Error sharing:", err);
  //   }
  // };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 transition-colors"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <div className="flex justify-between items-center mb-8">
                      <Dialog.Title className="text-2xl font-semibold text-primary">
                        Generate QR Code
                      </Dialog.Title>
                    </div>

                    <div className="mb-8 bg-blue-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-blue-800 mb-3">
                        Accept Payments with Ease
                      </h3>
                      <p className="text-blue-700 text-sm mb-6">
                        Generate a QR code to start accepting payments
                        instantly. Your customers can simply scan and pay
                        directly to your account.
                      </p>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <CheckCircleIcon className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                          <div>
                            <p className="font-medium text-blue-800">
                              One-time Payment
                            </p>
                            <p className="text-sm text-blue-600">
                              Set a fixed amount that customers must pay.
                              Perfect for specific products or services.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircleIcon className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                          <div>
                            <p className="font-medium text-blue-800">
                              Dynamic Payment
                            </p>
                            <p className="text-sm text-blue-600">
                              Let customers enter their own amount. Ideal for
                              donations, variable services, or multiple items.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {!qrCodeUrl ? (
                      <form onSubmit={handleSubmit} className="space-y-8">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Payment Type
                          </label>
                          <div className="grid grid-cols-2 gap-4">
                            <button
                              type="button"
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  type: "one-time",
                                }))
                              }
                              className={`p-4 rounded-lg border-2 text-center transition-all ${
                                formData.type === "one-time"
                                  ? "border-primary bg-primary/5 text-primary shadow-sm"
                                  : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              <div className="flex flex-col items-center gap-1">
                                <span className="font-medium">One-time</span>
                                <span className="text-xs opacity-75">
                                  Fixed Amount
                                </span>
                              </div>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  type: "dynamic",
                                }))
                              }
                              className={`p-4 rounded-lg border-2 text-center transition-all ${
                                formData.type === "dynamic"
                                  ? "border-primary bg-primary/5 text-primary shadow-sm"
                                  : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              <div className="flex flex-col items-center gap-1">
                                <span className="font-medium">Dynamic</span>
                                <span className="text-xs opacity-75">
                                  Variable Amount
                                </span>
                              </div>
                            </button>
                          </div>
                        </div>

                        <div className="space-y-6 bg-gray-50 p-6 rounded-lg">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Select Bank
                            </label>
                            <select
                              value={formData.bankName}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  bankName: e.target.value,
                                }))
                              }
                              className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary shadow-sm py-3 text-gray-900"
                              required
                            >
                              <option value="">Select your bank</option>
                              {DEMO_BANKS.map((bank) => (
                                <option key={bank} value={bank}>
                                  {bank}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Account Number
                              <span className="text-xs text-gray-500 ml-1">
                                (10 digits)
                              </span>
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                value={formData.accountNumber}
                                onChange={(e) =>
                                  handleAccountNumberChange(e.target.value)
                                }
                                className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary shadow-sm pl-4 py-3 text-gray-900"
                                placeholder="Enter your account number"
                                maxLength={10}
                                pattern="[0-9]{10}"
                                required
                              />
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                                {formData.accountNumber.length}/10
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Account Name
                            </label>
                            <div className="relative">
                              <div className="w-full rounded-lg border border-gray-300 bg-white pl-4 py-3 text-gray-900">
                                {isVerifying ? (
                                  <div className="flex items-center gap-2 text-gray-600">
                                    <svg
                                      className="animate-spin h-5 w-5 text-primary"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                    >
                                      <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                      ></circle>
                                      <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                      ></path>
                                    </svg>
                                    Verifying account...
                                  </div>
                                ) : formData.accountName ? (
                                  <div className="flex items-center justify-between">
                                    <span>{formData.accountName}</span>
                                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                                  </div>
                                ) : (
                                  <span className="text-gray-500">
                                    Account name will appear here
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {formData.type === "one-time" && (
                          <div className="bg-primary/5 p-6 rounded-lg">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Amount (₦)
                              <span className="text-xs text-gray-500 ml-1">
                                (fixed amount customers will pay)
                              </span>
                            </label>
                            <div className="relative">
                              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                <span className="text-gray-500">₦</span>
                              </div>
                              <input
                                type="number"
                                value={formData.amount}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    amount: e.target.value,
                                  }))
                                }
                                className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary shadow-sm pl-8 py-3 text-gray-900"
                                placeholder="Enter amount"
                                required={formData.type === "one-time"}
                                min="0"
                                step="0.01"
                              />
                            </div>
                          </div>
                        )}

                        {error && (
                          <div className="bg-red-50 p-4 rounded-lg">
                            <p className="text-sm text-red-600">{error}</p>
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={!isAccountVerified}
                          className={`w-full py-3 rounded-lg font-medium shadow-sm transition-colors ${
                            isAccountVerified
                              ? "bg-primary text-white hover:bg-primary/90"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          Generate QR Code
                        </button>
                      </form>
                    ) : (
                      <div className="space-y-6">
                        <div className="bg-white p-6 rounded-lg border-2 border-gray-100">
                          <img
                            src={qrCodeUrl}
                            alt="Payment QR Code"
                            className="w-full max-w-[300px] mx-auto"
                          />
                          <div className="mt-6 bg-blue-50 p-4 rounded-lg text-sm text-blue-700">
                            <p className="font-medium mb-3">
                              How to use your QR code:
                            </p>
                            <ol className="list-decimal list-inside space-y-2">
                              <li>Download and print this QR code</li>
                              <li>
                                Display it where customers can easily scan
                              </li>
                              <li>Customers scan using the Scanmiter app</li>
                              <li>Payment goes directly to your account</li>
                            </ol>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <button
                            onClick={handleDownload}
                            className="flex-1 bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-sm"
                          >
                            Download QR Code
                          </button>
                          <button
                            onClick={() => setQrCodeUrl("")}
                            className="flex-1 border-2 border-primary text-primary py-3 rounded-lg hover:bg-primary/5 transition-colors font-medium"
                          >
                            Generate New
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

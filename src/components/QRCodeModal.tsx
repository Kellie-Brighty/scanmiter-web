import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import QRCode from "qrcode";

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  accountNumber: string;
  accountName: string;
  qrType: "one-time" | "dynamic";
}

export default function QRCodeModal({ isOpen, onClose }: QRCodeModalProps) {
  const [formData, setFormData] = useState<FormData>({
    accountNumber: "",
    accountName: "",
    qrType: "one-time",
  });
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const qrData = {
        ...formData,
        timestamp: new Date().toISOString(),
        merchantId: "MERCHANT_" + Math.random().toString(36).substr(2, 9),
      };

      const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(qrData));
      setQrCodeUrl(qrCodeDataUrl);
    } catch (err) {
      console.error("Error generating QR code:", err);
    } finally {
      setIsGenerating(false);
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

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Scanmiter Payment QR Code",
          text: "Scan this QR code to make a payment",
          url: qrCodeUrl,
        });
      } else {
        await navigator.clipboard.writeText(qrCodeUrl);
        alert("QR code URL copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

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
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
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
                    <Dialog.Title
                      as="h3"
                      className="text-xl font-semibold leading-6 text-gray-900 mb-8"
                    >
                      Generate Payment QR Code
                    </Dialog.Title>

                    {!qrCodeUrl ? (
                      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                        <div className="relative">
                          <input
                            type="text"
                            id="accountNumber"
                            className="peer w-full border-b-2 border-gray-200 py-2 px-1 text-gray-900 placeholder-transparent focus:border-primary focus:outline-none"
                            placeholder="Account Number"
                            value={formData.accountNumber}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                accountNumber: e.target.value,
                              })
                            }
                            required
                          />
                          <label
                            htmlFor="accountNumber"
                            className="absolute left-1 -top-3.5 text-sm text-gray-600 transition-all 
                            peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2
                            peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-primary"
                          >
                            Account Number
                          </label>
                        </div>
                        <div className="relative">
                          <input
                            type="text"
                            id="accountName"
                            className="peer w-full border-b-2 border-gray-200 py-2 px-1 text-gray-900 placeholder-transparent focus:border-primary focus:outline-none"
                            placeholder="Account Name"
                            value={formData.accountName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                accountName: e.target.value,
                              })
                            }
                            required
                          />
                          <label
                            htmlFor="accountName"
                            className="absolute left-1 -top-3.5 text-sm text-gray-600 transition-all 
                            peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2
                            peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-primary"
                          >
                            Account Name
                          </label>
                        </div>
                        <div className="space-y-3">
                          <label className="block text-sm font-medium text-gray-600">
                            QR Code Type
                          </label>
                          <div className="flex gap-6">
                            <label className="relative flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                className="peer sr-only"
                                name="qrType"
                                value="one-time"
                                checked={formData.qrType === "one-time"}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    qrType: e.target.value as
                                      | "one-time"
                                      | "dynamic",
                                  })
                                }
                              />
                              <div className="h-5 w-5 rounded-full border-2 border-gray-300 peer-checked:border-primary flex items-center justify-center">
                                <div className="h-2.5 w-2.5 rounded-full bg-primary hidden peer-checked:block"></div>
                              </div>
                              <span className="text-sm text-gray-700">
                                One-time Payment
                              </span>
                            </label>
                            <label className="relative flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                className="peer sr-only"
                                name="qrType"
                                value="dynamic"
                                checked={formData.qrType === "dynamic"}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    qrType: e.target.value as
                                      | "one-time"
                                      | "dynamic",
                                  })
                                }
                              />
                              <div className="h-5 w-5 rounded-full border-2 border-gray-300 peer-checked:border-primary flex items-center justify-center">
                                <div className="h-2.5 w-2.5 rounded-full bg-primary hidden peer-checked:block"></div>
                              </div>
                              <span className="text-sm text-gray-700">
                                Dynamic Payment
                              </span>
                            </label>
                          </div>
                        </div>
                        <div className="mt-8 flex flex-col sm:flex-row-reverse gap-3">
                          <button
                            type="submit"
                            className="inline-flex justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isGenerating}
                          >
                            {isGenerating
                              ? "Generating..."
                              : "Generate QR Code"}
                          </button>
                          <button
                            type="button"
                            className="inline-flex justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors"
                            onClick={onClose}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="mt-6 flex flex-col items-center space-y-6">
                        <div className="bg-white p-4 rounded-xl shadow-inner">
                          <img
                            src={qrCodeUrl}
                            alt="Payment QR Code"
                            className="w-64 h-64"
                          />
                        </div>
                        <div className="flex gap-4">
                          <button
                            onClick={handleDownload}
                            className="inline-flex items-center px-6 py-3 rounded-lg shadow-sm text-white bg-primary hover:bg-primary/90 transition-colors font-medium"
                          >
                            Download QR
                          </button>
                          <button
                            onClick={handleShare}
                            className="inline-flex items-center px-6 py-3 rounded-lg shadow-sm text-primary border-2 border-primary hover:bg-primary/5 transition-colors font-medium"
                          >
                            Share QR
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

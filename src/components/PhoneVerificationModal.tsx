import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  XMarkIcon,
  ArrowRightIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

interface PhoneVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: (phoneNumber: string) => void;
}

export default function PhoneVerificationModal({
  isOpen,
  onClose,
  onVerified,
}: PhoneVerificationModalProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");

  const handleSubmitPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);

    try {
      // Mock API call to send OTP
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStep("otp");
    } catch (error) {
      console.error("Error sending OTP:", error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);

    try {
      // Mock API call to verify OTP
      await new Promise((resolve) => setTimeout(resolve, 1500));
      onVerified(phoneNumber);
      onClose();
    } catch (error) {
      console.error("Error verifying OTP:", error);
    } finally {
      setIsVerifying(false);
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
                    <Dialog.Title className="text-2xl font-semibold text-primary mb-6">
                      {step === "phone" ? "Verify Your Phone" : "Enter Code"}
                    </Dialog.Title>

                    {/* New Information Section */}
                    <div className="mb-8 bg-blue-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-blue-800 mb-2">
                        Quick & Secure Payments
                      </h3>
                      <p className="text-blue-700 text-sm">
                        Verify your phone number to start making payments
                        instantly. You'll be able to scan any merchant's QR code
                        and pay directly from your bank account.
                      </p>
                      <ul className="mt-3 space-y-2 text-sm text-blue-700">
                        <li className="flex items-center gap-2">
                          <CheckCircleIcon className="w-5 h-5 text-blue-500" />
                          One-time verification
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircleIcon className="w-5 h-5 text-blue-500" />
                          Secure bank integration
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircleIcon className="w-5 h-5 text-blue-500" />
                          Instant payment confirmation
                        </li>
                      </ul>
                    </div>

                    {step === "phone" ? (
                      <form
                        onSubmit={handleSubmitPhone}
                        className="mt-6 space-y-6"
                      >
                        <div className="relative">
                          <input
                            type="tel"
                            id="phoneNumber"
                            className="peer w-full border-b-2 border-gray-200 py-2 px-1 text-gray-900 placeholder-transparent focus:border-primary focus:outline-none"
                            placeholder="Phone Number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                            pattern="[0-9]+"
                          />
                          <label
                            htmlFor="phoneNumber"
                            className="absolute left-1 -top-3.5 text-sm text-gray-600 transition-all 
                            peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2
                            peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-primary"
                          >
                            Phone Number
                          </label>
                        </div>

                        <div className="mt-8">
                          <button
                            type="submit"
                            className="w-full inline-flex justify-center items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isVerifying}
                          >
                            {isVerifying
                              ? "Sending Code..."
                              : "Send Verification Code"}
                            <ArrowRightIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </form>
                    ) : (
                      <form
                        onSubmit={handleVerifyOTP}
                        className="mt-6 space-y-6"
                      >
                        <div className="relative">
                          <input
                            type="text"
                            id="verificationCode"
                            className="peer w-full border-b-2 border-gray-200 py-2 px-1 text-gray-900 placeholder-transparent focus:border-primary focus:outline-none"
                            placeholder="Verification Code"
                            value={verificationCode}
                            onChange={(e) =>
                              setVerificationCode(e.target.value)
                            }
                            required
                            pattern="[0-9]+"
                            maxLength={6}
                          />
                          <label
                            htmlFor="verificationCode"
                            className="absolute left-1 -top-3.5 text-sm text-gray-600 transition-all 
                            peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2
                            peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-primary"
                          >
                            Verification Code
                          </label>
                        </div>

                        <div className="mt-8 space-y-3">
                          <button
                            type="submit"
                            className="w-full inline-flex justify-center items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isVerifying}
                          >
                            {isVerifying ? "Verifying..." : "Verify Code"}
                            <ArrowRightIcon className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            className="w-full text-sm text-primary hover:text-primary/80"
                            onClick={() => setStep("phone")}
                          >
                            Change Phone Number
                          </button>
                        </div>
                      </form>
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

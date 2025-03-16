import { useState } from "react";
import {
  QrCodeIcon,
  ClockIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import Scanner from "./Scanner";

interface UserDashboardProps {
  user: {
    phoneNumber: string;
    isVerified: boolean;
  };
  onBack: () => void;
}

interface PaymentStep {
  merchantData: any;
  selectedBank?: string;
}

export default function UserDashboard({ user, onBack }: UserDashboardProps) {
  const [currentStep, setCurrentStep] = useState<
    "initial" | "scanning" | "bank-selection" | "confirmation"
  >("initial");
  const [paymentDetails, setPaymentDetails] = useState<PaymentStep | null>(
    null
  );
  const [availableBanks, setAvailableBanks] = useState<
    Array<{ name: string; balance: number }>
  >([]);
  const [error, setError] = useState<string | null>(null);

  const handleScanStart = () => {
    setCurrentStep("scanning");
    setError(null);
  };

  const handleScanSuccess = async (merchantData: any) => {
    try {
      // Mock API call to fetch user's bank accounts
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate fetching available banks and balances
      setAvailableBanks([
        { name: "First Bank", balance: 150000 },
        { name: "GTBank", balance: 75000 },
        { name: "Access Bank", balance: 250000 },
      ]);

      setPaymentDetails({ merchantData });
      setCurrentStep("bank-selection");
    } catch (error) {
      setError("Failed to fetch bank details. Please try again.");
      setCurrentStep("initial");
    }
  };

  const handleBankSelection = (bankName: string) => {
    setPaymentDetails((prev) =>
      prev ? { ...prev, selectedBank: bankName } : null
    );
    setCurrentStep("confirmation");
  };

  const handlePaymentConfirmation = async () => {
    try {
      // Mock payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Reset to initial state after successful payment
      setCurrentStep("initial");
      setPaymentDetails(null);
      // You would typically show a success message and update transaction history
    } catch (error) {
      setError("Payment failed. Please try again.");
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case "initial":
        return (
          <div className="text-center space-y-6">
            <div className="bg-secondary/20 p-8 rounded-2xl max-w-md mx-auto">
              <h2 className="text-2xl font-semibold mb-4">
                Welcome to Scanmiter
              </h2>
              <p className="text-gray-600 mb-6">
                Your phone number: {user.phoneNumber}
              </p>
              <div className="space-y-4">
                <button
                  onClick={handleScanStart}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <QrCodeIcon className="w-6 h-6" />
                  Scan QR Code to Pay
                </button>
                <button className="w-full flex items-center justify-center gap-2 px-6 py-4 border-2 border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors">
                  <ClockIcon className="w-6 h-6" />
                  View Transaction History
                </button>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-700">
              <p className="font-medium">How it works:</p>
              <ol className="list-decimal list-inside mt-2 space-y-1 text-left">
                <li>
                  Click "Scan QR Code to Pay" to start the payment process
                </li>
                <li>Point your camera at the merchant's QR code</li>
                <li>Select your preferred bank account</li>
                <li>
                  Confirm the payment details and complete the transaction
                </li>
              </ol>
            </div>
          </div>
        );

      case "scanning":
        return (
          <div>
            <div className="mb-6">
              <button
                onClick={onBack}
                className="flex items-center text-primary hover:text-primary/80"
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Back to Home
              </button>
            </div>
            <Scanner
              onScanSuccess={handleScanSuccess}
              onScanError={(error) => setError(error)}
            />
            <div className="mt-6 bg-blue-50 p-4 rounded-lg text-sm text-blue-700">
              <p className="font-medium">Scanning Instructions:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Ensure good lighting conditions</li>
                <li>Hold your device steady</li>
                <li>Position the QR code within the frame</li>
                <li>Keep the code in focus</li>
              </ul>
            </div>
          </div>
        );

      case "bank-selection":
        return (
          <div className="max-w-md mx-auto">
            <div className="mb-6">
              <button
                onClick={() => setCurrentStep("scanning")}
                className="flex items-center text-primary hover:text-primary/80"
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Back to Scanner
              </button>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-6">
                Select Payment Method
              </h3>
              <div className="space-y-4">
                {availableBanks.map((bank) => (
                  <button
                    key={bank.name}
                    onClick={() => handleBankSelection(bank.name)}
                    className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{bank.name}</span>
                      <span className="text-gray-600">
                        Balance: ₦{bank.balance.toLocaleString()}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
              <div className="mt-6 bg-blue-50 p-4 rounded-lg text-sm text-blue-700">
                <p>
                  Select the bank account you want to use for this payment. Make
                  sure you have sufficient balance.
                </p>
              </div>
            </div>
          </div>
        );

      case "confirmation":
        if (!paymentDetails) return null;
        return (
          <div className="max-w-md mx-auto">
            <div className="mb-6">
              <button
                onClick={() => setCurrentStep("bank-selection")}
                className="flex items-center text-primary hover:text-primary/80"
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Back to Bank Selection
              </button>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-6">Confirm Payment</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Merchant</p>
                      <p className="font-medium">
                        {paymentDetails.merchantData.accountName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Amount</p>
                      <p className="font-medium">
                        ₦
                        {paymentDetails.merchantData.amount?.toLocaleString() ||
                          "0"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Bank</p>
                      <p className="font-medium">
                        {paymentDetails.selectedBank}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Payment Type</p>
                      <p className="font-medium">
                        {paymentDetails.merchantData.qrType === "one-time"
                          ? "One-time Payment"
                          : "Dynamic Payment"}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handlePaymentConfirmation}
                  className="w-full py-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Confirm Payment
                </button>
              </div>
              <div className="mt-6 bg-yellow-50 p-4 rounded-lg text-sm text-yellow-700">
                <p className="font-medium">Important:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Verify all payment details carefully</li>
                  <li>Make sure you have sufficient balance</li>
                  <li>Payment cannot be reversed once confirmed</li>
                </ul>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}
        {renderStep()}
      </div>
    </div>
  );
}

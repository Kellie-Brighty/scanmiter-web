import { useState, useEffect } from "react";
import {
  QrCodeIcon,
  ClockIcon,
  ArrowLeftIcon,
  BanknotesIcon,
  CreditCardIcon,
  UserCircleIcon,
  ChartBarIcon,
  CogIcon,
  ArrowTrendingUpIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import Scanner from "./Scanner";
import { sessionManager } from "../utils/sessionManager";
import scanmiterLogo from "../assets/scanmiter-logo.svg";

interface UserDashboardProps {
  user: {
    phoneNumber: string;
    isVerified: boolean;
  };
  onBack: () => void;
}

interface PaymentStep {
  merchantData: {
    accountName: string;
    accountNumber: string;
    amount?: number;
    type: "one-time" | "dynamic";
  };
  selectedBank?: string;
  amount?: number;
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
  const [activeTab, setActiveTab] = useState<
    "home" | "transactions" | "profile"
  >("home");
  const [quickStats, setQuickStats] = useState({
    totalTransactions: 0,
    totalAmount: 0,
    successRate: 0,
  });
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    // Load user session and stats
    const session = sessionManager.getSession();
    if (session?.transactions) {
      const stats = calculateStats(session.transactions);
      setQuickStats(stats);
    }
  }, []);

  const calculateStats = (transactions: any[]) => {
    const total = transactions.length;
    const amount = transactions.reduce((sum, t) => sum + t.amount, 0);
    const successful = transactions.filter(
      (t) => t.status === "completed"
    ).length;

    return {
      totalTransactions: total,
      totalAmount: amount,
      successRate: total ? (successful / total) * 100 : 0,
    };
  };

  // const handleScanStart = () => {
  //   setCurrentStep("scanning");
  //   setError(null);
  // };

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

  const renderPaymentFlow = () => {
    switch (currentStep) {
      case "scanning":
        return (
          <Scanner
            onScanSuccess={handleScanSuccess}
            onScanError={(error) => setError(error)}
          />
        );

      case "bank-selection":
        if (!paymentDetails?.merchantData) return null;
        return (
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Account Name</p>
                  <p className="font-medium">
                    {paymentDetails.merchantData.accountName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Account Number</p>
                  <p className="font-medium">
                    {paymentDetails.merchantData.accountNumber}
                  </p>
                </div>
                {paymentDetails.merchantData.type === "one-time" ? (
                  <div>
                    <p className="text-sm text-gray-500">Amount to Pay</p>
                    <p className="font-medium text-lg text-primary">
                      ₦{paymentDetails.merchantData.amount?.toLocaleString()}
                    </p>
                  </div>
                ) : (
                  <div>
                    <label
                      htmlFor="amount"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Enter Amount
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-gray-500 sm:text-sm">₦</span>
                      </div>
                      <input
                        type="number"
                        name="amount"
                        id="amount"
                        className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-primary focus:ring-primary sm:text-sm"
                        placeholder="0.00"
                        onChange={(e) => {
                          const amount = parseFloat(e.target.value);
                          setPaymentDetails((prev) =>
                            prev ? { ...prev, amount } : null
                          );
                        }}
                        required
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold mb-4">
                Select Payment Method
              </h3>
              <div className="space-y-3">
                {availableBanks.map((bank) => (
                  <button
                    key={bank.name}
                    onClick={() => {
                      // For one-time payments, use the merchant's amount
                      if (paymentDetails.merchantData.type === "one-time") {
                        setPaymentDetails((prev) =>
                          prev
                            ? {
                                ...prev,
                                amount: prev.merchantData.amount,
                                selectedBank: bank.name,
                              }
                            : null
                        );
                      }
                      handleBankSelection(bank.name);
                    }}
                    className="w-full p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
                    disabled={
                      paymentDetails.merchantData.type === "dynamic" &&
                      !paymentDetails.amount
                    }
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
              {paymentDetails.merchantData.type === "dynamic" &&
                !paymentDetails.amount && (
                  <p className="mt-4 text-sm text-yellow-600">
                    Please enter an amount before selecting a payment method
                  </p>
                )}
            </div>
          </div>
        );

      case "confirmation":
        if (
          !paymentDetails?.merchantData ||
          !paymentDetails.amount ||
          !paymentDetails.selectedBank
        )
          return null;
        return (
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold mb-6">Confirm Payment</h3>
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">To Account</p>
                      <p className="font-medium">
                        {paymentDetails.merchantData.accountName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Amount</p>
                      <p className="font-medium text-lg">
                        ₦{paymentDetails.amount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">From</p>
                      <p className="font-medium">
                        {paymentDetails.selectedBank}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Account Number</p>
                      <p className="font-medium">
                        {paymentDetails.merchantData.accountNumber}
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

                <div className="bg-yellow-50 p-4 rounded-lg text-sm text-yellow-700">
                  <p className="font-medium">Important:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Verify all payment details carefully</li>
                    <li>Make sure you have sufficient balance</li>
                    <li>Payment cannot be reversed once confirmed</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderDashboardContent = () => {
    switch (activeTab) {
      case "transactions":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Recent Transactions</h3>
            <div className="space-y-4">
              {/* Mock transactions */}
              {[1, 2, 3].map((_, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Merchant {index + 1}</p>
                      <p className="text-sm text-gray-500">Today, 2:30 PM</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">
                        ₦{(Math.random() * 10000).toFixed(2)}
                      </p>
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                        Completed
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "profile":
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="bg-primary/10 p-4 rounded-full">
                  <UserCircleIcon className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Account Details</h3>
                  <p className="text-gray-600">{user.phoneNumber}</p>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="flex items-center gap-2">
                    <CogIcon className="w-5 h-5 text-gray-500" />
                    Settings
                  </span>
                  <ArrowTrendingUpIcon className="w-5 h-5 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="flex items-center gap-2">
                    <BanknotesIcon className="w-5 h-5 text-gray-500" />
                    Linked Banks
                  </span>
                  <ArrowTrendingUpIcon className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <ChartBarIcon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Transactions</p>
                    <p className="text-2xl font-semibold">
                      {quickStats.totalTransactions}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <BanknotesIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="text-2xl font-semibold">
                      ₦{quickStats.totalAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <CreditCardIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Success Rate</p>
                    <p className="text-2xl font-semibold">
                      {quickStats.successRate.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setCurrentStep("scanning")}
                    className="flex flex-col items-center gap-3 p-6 bg-primary/5 rounded-xl hover:bg-primary/10 transition-colors"
                  >
                    <QrCodeIcon className="w-8 h-8 text-primary" />
                    <span className="font-medium text-primary">
                      Scan to Pay
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab("transactions")}
                    className="flex flex-col items-center gap-3 p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <ClockIcon className="w-8 h-8 text-gray-600" />
                    <span className="font-medium text-gray-600">
                      View History
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  if (currentStep !== "initial") {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-6">
            <button
              onClick={() => setCurrentStep("initial")}
              className="flex items-center text-primary hover:text-primary/80"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back to Dashboard
            </button>
          </div>
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
          {renderPaymentFlow()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <img src={scanmiterLogo} alt="Scanmiter" className="h-8 w-auto" />
              <span className="font-semibold text-lg">Scanmiter</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Dialog */}
      <Transition appear show={showLogoutConfirm} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setShowLogoutConfirm(false)}
        >
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

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 mb-4"
                  >
                    Confirm Logout
                  </Dialog.Title>
                  <p className="text-sm text-gray-500 mb-6">
                    Are you sure you want to log out? You'll need to verify your
                    phone number again to access your dashboard.
                  </p>
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                      onClick={() => setShowLogoutConfirm(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={() => {
                        setShowLogoutConfirm(false);
                        onBack();
                      }}
                    >
                      Logout
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Tabs */}
          <div className="flex space-x-6 mb-8">
            <button
              onClick={() => setActiveTab("home")}
              className={`pb-2 font-medium ${
                activeTab === "home"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab("transactions")}
              className={`pb-2 font-medium ${
                activeTab === "transactions"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Transactions
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`pb-2 font-medium ${
                activeTab === "profile"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Profile
            </button>
          </div>

          {/* Content */}
          {renderDashboardContent()}
        </div>
      </main>
    </div>
  );
}

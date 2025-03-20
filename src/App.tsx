import {
  QrCodeIcon,
  CreditCardIcon,
  Bars3Icon,
  XMarkIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  DevicePhoneMobileIcon,
  QueueListIcon,
  BanknotesIcon,
  WalletIcon,
  BuildingLibraryIcon,
  ClockIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import scanmiterLogo from "./assets/scanmiter-logo.svg";
import scanmiterHero from "./assets/scanmiter-hero.png";
import QRCodeModal from "./components/QRCodeModal";
import PhoneVerificationModal from "./components/PhoneVerificationModal";
import UserDashboard from "./components/UserDashboard";
import { sessionManager } from "./utils/sessionManager";
import courierImg from "./assets/courier.png";
import marketplaceImg from "./assets/marketplace.png";
import mechanicImg from "./assets/mechanic.png";
import supermarketImg from "./assets/supermarket.png";

interface UserState {
  phoneNumber: string;
  isVerified: boolean;
  lastLogin: string;
  transactions?: Array<{
    id: string;
    date: string;
    merchantName: string;
    amount: number;
    status: "completed" | "pending" | "failed";
  }>;
}

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [user, setUser] = useState<UserState | null>(() => {
    // Initialize user state from session
    return sessionManager.getSession();
  });
  const [showDashboard, setShowDashboard] = useState(() => {
    // Show dashboard if user exists in session
    return !!sessionManager.getSession();
  });

  useEffect(() => {
    // Check for existing session on mount
    const session = sessionManager.getSession();
    if (session) {
      setUser(session);
      setShowDashboard(true);
    }
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const handlePhoneVerified = (phoneNumber: string) => {
    const userData = {
      phoneNumber,
      isVerified: true,
      lastLogin: new Date().toISOString(),
      transactions: [], // Initialize empty transactions array
    };
    setUser(userData);
    sessionManager.saveSession(userData);
    setShowDashboard(true);
    setIsPhoneModalOpen(false);
  };

  const handleLogout = () => {
    sessionManager.clearSession();
    setUser(null);
    setShowDashboard(false);
  };

  const handleScanToPayClick = () => {
    if (!user?.isVerified) {
      setIsPhoneModalOpen(true);
    } else {
      setShowDashboard(true);
    }
  };

  if (showDashboard && user) {
    return <UserDashboard user={user} onBack={handleLogout} />;
  }

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img
                src={scanmiterLogo}
                alt="Scanmiter Logo"
                className="w-8 h-8"
              />
              <span className="text-xl font-bold text-primary">Scanmiter</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-primary hover:text-primary/80"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-primary hover:text-primary/80"
              >
                How it works
              </a>
              <a href="#contact" className="text-primary hover:text-primary/80">
                Contact
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-primary"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden pt-4 pb-3">
              <div className="flex flex-col space-y-4">
                <a
                  href="#features"
                  className="text-primary hover:text-primary/80"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="text-primary hover:text-primary/80"
                  onClick={() => setIsMenuOpen(false)}
                >
                  How it works
                </a>
                <a
                  href="#contact"
                  className="text-primary hover:text-primary/80"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-secondary to-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                Seamless Payments with QR Technology
              </h1>
              <p className="text-base md:text-lg text-primary/70 mb-8">
                Say goodbye to tedious manual payments. With Scanmiter, sending
                and receiving money is as easy as scanning a QR code.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
                  onClick={handleScanToPayClick}
                >
                  Scan to Pay
                  <CreditCardIcon className="w-5 h-5" />
                </button>
                <button
                  className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors"
                  onClick={() => setIsQRModalOpen(true)}
                >
                  Generate QR Code
                  <QrCodeIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="relative order-first md:order-last">
              <img
                src={scanmiterHero}
                alt="Scanmiter QR Payment Demo"
                className="w-full h-auto rounded-2xl shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/20 to-transparent rounded-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Perks Section */}
      <section
        className="py-24 bg-gradient-to-b from-white to-gray-50"
        id="features"
      >
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold text-primary mb-4"
            >
              Benefits for Everyone
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-gray-600"
            >
              Whether you're a merchant or a customer, Scanmiter makes payments
              easier
            </motion.p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 mb-12">
            {/* Merchant Benefits */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="absolute -top-6 left-0 bg-blue-500 text-white px-4 py-2 rounded-full font-semibold">
                For Merchants
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg">
                <div className="grid gap-8">
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="flex gap-6"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-ping" />
                      <div className="relative bg-blue-500/20 p-4 rounded-full">
                        <BanknotesIcon className="w-8 h-8 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-blue-800 mb-2">
                        Instant Account Access
                      </h3>
                      <p className="text-blue-600/80">
                        No registration required! Generate QR codes instantly
                        with just your bank details and start accepting payments
                        right away.
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="flex gap-6"
                  >
                    <div className="relative">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{
                          duration: 20,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="absolute inset-0 bg-blue-500/10 rounded-full"
                      />
                      <div className="relative bg-blue-500/20 p-4 rounded-full">
                        <WalletIcon className="w-8 h-8 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-blue-800 mb-2">
                        Flexible Payment Options
                      </h3>
                      <p className="text-blue-600/80">
                        Create fixed-amount QR codes for products or dynamic
                        codes for variable payments. Perfect for any business
                        model.
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="flex gap-6"
                  >
                    <div className="relative">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="relative bg-blue-500/20 p-4 rounded-full"
                      >
                        <ArrowPathIcon className="w-8 h-8 text-blue-600" />
                      </motion.div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-blue-800 mb-2">
                        Direct Bank Deposits
                      </h3>
                      <p className="text-blue-600/80">
                        Receive payments directly to your bank account. No
                        intermediary wallets or complex settlement processes.
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Customer Benefits */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="absolute -top-6 left-0 bg-green-500 text-white px-4 py-2 rounded-full font-semibold">
                For Customers
              </div>
              <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg">
                <div className="grid gap-8">
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="flex gap-6"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-green-500/10 rounded-full animate-ping" />
                      <div className="relative bg-green-500/20 p-4 rounded-full">
                        <BuildingLibraryIcon className="w-8 h-8 text-green-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-green-800 mb-2">
                        All Banks in One App
                      </h3>
                      <p className="text-green-600/80">
                        Access all your bank accounts through a single
                        interface. Link once with your phone number and you're
                        ready to go.
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="flex gap-6"
                  >
                    <div className="relative">
                      <motion.div
                        animate={{ x: [-10, 10, -10] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="relative bg-green-500/20 p-4 rounded-full"
                      >
                        <ClockIcon className="w-8 h-8 text-green-600" />
                      </motion.div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-green-800 mb-2">
                        Lightning-Fast Payments
                      </h3>
                      <p className="text-green-600/80">
                        Complete transactions in seconds with just a scan. No
                        need to manually enter account details or switch between
                        apps.
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="flex gap-6"
                  >
                    <div className="relative">
                      <motion.div
                        animate={{ y: [-10, 10, -10] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="relative bg-green-500/20 p-4 rounded-full"
                      >
                        <QueueListIcon className="w-8 h-8 text-green-600" />
                      </motion.div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-green-800 mb-2">
                        Transaction History
                      </h3>
                      <p className="text-green-600/80">
                        Keep track of all your payments in one place. View
                        detailed history across all your linked bank accounts.
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Informal Sector Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-primary/5 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                Empowering Nigeria's
              </span>
              <br />
              Informal Economy
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From bustling markets to local shops, we're transforming how
              millions of Nigerians do business every day.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative lg:sticky lg:top-24 lg:h-[600px]"
            >
              <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Powering Nigeria's Daily Transactions
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">
                        47M+
                      </span>
                    </div>
                    <p className="text-gray-600">
                      Daily informal transactions in Nigeria
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">
                        41%
                      </span>
                    </div>
                    <p className="text-gray-600">
                      Of Nigeria's GDP from informal sector
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">
                        65M
                      </span>
                    </div>
                    <p className="text-gray-600">
                      Nigerians in informal employment
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="space-y-8">
              {/* Market Place */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="group relative overflow-hidden rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative p-8">
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-lg">
                        <img
                          src={marketplaceImg}
                          alt="Market Place"
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -bottom-2 -right-2 bg-yellow-400 text-white p-2 rounded-full"
                      >
                        <QrCodeIcon className="w-5 h-5" />
                      </motion.div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                        Market Vendors
                      </h3>
                      <p className="text-gray-600 mb-4">
                        From Balogun Market to Ariaria, empower your business
                        with instant digital payments. No more cash handling
                        hassles or change problems.
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                          Fresh Produce
                        </span>
                        <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                          Street Food
                        </span>
                        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                          Local Goods
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Supermarket */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="group relative overflow-hidden rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative p-8">
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-lg">
                        <img
                          src={supermarketImg}
                          alt="Supermarket"
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="absolute -bottom-2 -right-2 bg-blue-400 text-white p-2 rounded-full"
                      >
                        <QrCodeIcon className="w-5 h-5" />
                      </motion.div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                        Local Supermarkets
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Replace expensive POS machines with simple QR codes.
                        Faster checkouts, happier customers, and zero hardware
                        costs.
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          Quick Checkout
                        </span>
                        <span className="px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-sm">
                          Zero Hardware
                        </span>
                        <span className="px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-sm">
                          Instant Settlement
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Mechanic */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="group relative overflow-hidden rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative p-8">
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-lg">
                        <img
                          src={mechanicImg}
                          alt="Mechanic"
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <motion.div
                        animate={{ y: [-2, 2, -2] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute -bottom-2 -right-2 bg-red-400 text-white p-2 rounded-full"
                      >
                        <QrCodeIcon className="w-5 h-5" />
                      </motion.div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                        Auto Mechanics
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Focus on fixing cars, not chasing payments. Generate QR
                        codes for quotes and get paid instantly when the job is
                        done.
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                          Auto Repairs
                        </span>
                        <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                          Spare Parts
                        </span>
                        <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
                          Services
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Courier */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="group relative overflow-hidden rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative p-8">
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-lg">
                        <img
                          src={courierImg}
                          alt="Courier"
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <motion.div
                        animate={{ x: [-2, 2, -2] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute -bottom-2 -right-2 bg-green-400 text-white p-2 rounded-full"
                      >
                        <QrCodeIcon className="w-5 h-5" />
                      </motion.div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                        Local Couriers
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Collect payments on delivery with a simple scan. No more
                        cash handling risks or payment delays.
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          Deliveries
                        </span>
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm">
                          Logistics
                        </span>
                        <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm">
                          COD
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-3 bg-primary/10 text-primary px-6 py-3 rounded-full cursor-pointer hover:bg-primary/20 transition-colors"
            >
              <span className="text-lg font-medium">
                Discover More Use Cases
              </span>
              <ArrowRightIcon className="w-5 h-5" />
            </motion.div>
          </motion.div> */}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-20 bg-secondary/30" id="how-it-works">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-2xl md:text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            How It Works
          </motion.h2>
          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {steps.map((step, index) => (
              <motion.div key={index} variants={fadeInUp} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-6 text-white text-2xl font-bold">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                  <p className="text-primary/70">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-[2px] bg-primary/20" />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-20" id="contact">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-2xl md:text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Get in Touch
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="flex items-start space-x-4">
                <MapPinIcon className="w-6 h-6 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Visit Us</h3>
                  <p className="text-primary/70">
                    24a Damilola Morounfolu Street,
                    <br />
                    Idimu, Lagos, Nigeria
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <PhoneIcon className="w-6 h-6 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Call Us</h3>
                  <p className="text-primary/70">+234 123 456 7890</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <EnvelopeIcon className="w-6 h-6 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Email Us</h3>
                  <p className="text-primary/70">contact@scanmiter.com</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="h-[400px] rounded-xl overflow-hidden shadow-lg"
            >
              <iframe
                src="https://www.openstreetmap.org/export/embed.html?bbox=3.2867,6.5735,3.2967,6.5835&layer=mapnik"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Be First in Line
            </h2>
            <p className="text-white/80 mb-8">
              Our mobile apps are coming soon! Join the waitlist to get early
              access and exclusive updates.
            </p>
            <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm">
              <form className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  Join Waitlist
                  <DevicePhoneMobileIcon className="w-5 h-5" />
                </button>
              </form>
              <p className="text-sm text-white/60 mt-4">
                Be among the first to experience our revolutionary mobile
                payment solution. We'll notify you as soon as the app is ready!
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
      />

      <PhoneVerificationModal
        isOpen={isPhoneModalOpen}
        onClose={() => setIsPhoneModalOpen(false)}
        onVerified={handlePhoneVerified}
      />
    </div>
  );
};

const steps = [
  {
    title: "Register Online",
    description:
      "Get started by registering on our web platform. Mobile apps coming soon!",
    icon: <DevicePhoneMobileIcon className="w-6 h-6 text-primary" />,
  },
  {
    title: "Scan QR Code",
    description:
      "Simply scan the merchant's QR code to initiate the payment process.",
    icon: <QrCodeIcon className="w-6 h-6 text-primary" />,
  },
  {
    title: "Complete Payment",
    description:
      "Choose your preferred bank and authorize the payment securely.",
    icon: <QueueListIcon className="w-6 h-6 text-primary" />,
  },
];

export default App;

import {
  QrCodeIcon,
  CreditCardIcon,
  ArrowRightIcon,
  Bars3Icon,
  XMarkIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  DevicePhoneMobileIcon,
  QueueListIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { motion } from "framer-motion";
import scanmiterLogo from "./assets/scanmiter-logo.svg";
import scanmiterHero from "./assets/scanmiter-hero.png";
import QRCodeModal from "./components/QRCodeModal";
import PhoneVerificationModal from "./components/PhoneVerificationModal";
import UserDashboard from "./components/UserDashboard";

interface UserState {
  phoneNumber: string;
  isVerified: boolean;
}

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [user, setUser] = useState<UserState | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);

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
    };
    setUser(userData);
    setShowDashboard(true);
  };

  const handleScanToPayClick = () => {
    if (!user?.isVerified) {
      setIsPhoneModalOpen(true);
    } else {
      setShowDashboard(true);
    }
  };

  if (showDashboard && user) {
    return <UserDashboard user={user} onBack={() => setShowDashboard(false)} />;
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

      {/* Features Section */}
      <section className="py-16 md:py-20" id="features">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-2xl md:text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Why Choose Scanmiter?
          </motion.h2>
          <motion.div
            className="grid md:grid-cols-3 gap-6 md:gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-primary/70">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
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
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses and customers who are already using
            Scanmiter for seamless payments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-primary rounded-lg hover:bg-white/90 transition-colors">
              Register as Merchant
              <ArrowRightIcon className="w-5 h-5" />
            </button>
            <button className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors opacity-75 cursor-not-allowed">
              Mobile Apps Coming Soon
              <DevicePhoneMobileIcon className="w-5 h-5" />
            </button>
          </div>
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

const features = [
  {
    title: "Quick Scanning",
    description: "Scan QR codes instantly and process payments in seconds.",
    icon: <QrCodeIcon className="w-6 h-6 text-primary" />,
  },
  {
    title: "Secure Payments",
    description: "Bank-grade security with real-time transaction monitoring.",
    icon: <CreditCardIcon className="w-6 h-6 text-primary" />,
  },
  {
    title: "Multiple Banks",
    description: "Connect and use multiple bank accounts seamlessly.",
    icon: <BanknotesIcon className="w-6 h-6 text-primary" />,
  },
];

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

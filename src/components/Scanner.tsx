import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

interface ScannerProps {
  onScanSuccess: (merchantData: {
    accountName: string;
    accountNumber: string;
    amount?: number;
    type: "one-time" | "dynamic";
  }) => void;
  onScanError: (error: string) => void;
}

export default function Scanner({ onScanSuccess, onScanError }: ScannerProps) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [lastScannedText, setLastScannedText] = useState<string>("");

  useEffect(() => {
    // Initialize scanner
    scannerRef.current = new Html5QrcodeScanner(
      "scanner",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        showTorchButtonIfSupported: true,
      },
      false
    );

    // Start scanning
    scannerRef.current.render(
      (decodedText) => {
        try {
          // Prevent duplicate scans
          if (decodedText === lastScannedText) {
            return;
          }
          setLastScannedText(decodedText);

          console.log("Scanned QR Code:", decodedText); // Debug log

          // Parse QR code data
          const merchantData = JSON.parse(decodedText);

          // Validate required fields
          if (!merchantData.accountName || !merchantData.accountNumber) {
            throw new Error(
              "Invalid QR code. Required fields: Account Name and Account Number."
            );
          }

          // Validate amount for one-time payments
          if (merchantData.type === "one-time" && !merchantData.amount) {
            throw new Error(
              "Invalid one-time payment QR code. Amount is required."
            );
          }

          // Stop scanning after successful scan
          if (scannerRef.current) {
            scannerRef.current.clear();
          }

          // Pass merchant data to parent
          onScanSuccess(merchantData);
        } catch (error) {
          console.error("QR Code parsing error:", error); // Debug log
          onScanError(
            error instanceof Error
              ? error.message
              : "Invalid QR code format. Please scan a valid Scanmiter payment QR code."
          );
        }
      },
      (error) => {
        // Only log scanning errors, don't show to user as they're usually just failed attempts
        console.log("Scanning in progress:", error);
      }
    );

    // Cleanup
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, [onScanSuccess, onScanError, lastScannedText]);

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Scan QR Code</h3>
          <p className="text-sm text-gray-500">
            Point your camera at the merchant's QR code
          </p>
        </div>

        {/* Scanner container */}
        <div
          id="scanner"
          className="relative aspect-square w-full max-w-[300px] mx-auto rounded-lg overflow-hidden"
        />

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">Make sure the QR code is:</p>
          <ul className="mt-2 space-y-1 text-sm text-blue-600">
            <li>• Well-lit and clearly visible</li>
            <li>• Centered in the frame</li>
            <li>• Not damaged or obscured</li>
          </ul>
        </div>

        <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-700 font-medium">
            QR Code Requirements:
          </p>
          <ul className="mt-2 space-y-1 text-sm text-yellow-600">
            <li>• Must contain merchant's account name</li>
            <li>• Must include account number</li>
            <li>• For one-time payments, must include amount</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

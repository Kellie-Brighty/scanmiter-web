import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

interface ScannerProps {
  onScanSuccess: (merchantData: any) => void;
  onScanError: (error: string) => void;
}

export default function Scanner({ onScanSuccess, onScanError }: ScannerProps) {
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "scanner",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      },
      false
    );

    scanner.render(
      (decodedText) => {
        try {
          const merchantData = JSON.parse(decodedText);
          scanner.clear();
          onScanSuccess(merchantData);
        } catch (error) {
          onScanError("Invalid QR code format");
        }
      },
      (error) => {
        console.warn("QR Code scanning failed:", error);
        // Don't show errors for normal scanning process
        if (error?.includes("NotFoundException")) return;
        onScanError(error);
      }
    );

    setIsScanning(true);

    return () => {
      if (isScanning) {
        scanner.clear();
      }
    };
  }, [onScanSuccess, onScanError]);

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Scan QR Code</h3>
          <p className="text-sm text-gray-500 mt-1">
            Position the QR code within the frame to scan
          </p>
        </div>

        <div
          id="scanner"
          className="rounded-lg overflow-hidden"
          style={{ maxWidth: "100%", height: "auto" }}
        />
      </div>
    </div>
  );
}

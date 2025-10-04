'use client';

import { useState } from 'react';
import { QrCode, X, Share2 } from 'lucide-react';
import { DietPlan } from '@/src/types';

interface QRCodeShareProps {
  dietPlan: DietPlan;
}

export default function QRCodeShare({ dietPlan }: QRCodeShareProps) {
  const [showModal, setShowModal] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  const generateQRCode = async () => {
    try {
      // Create a shareable summary of the diet plan
      const planSummary = {
        breakfast: dietPlan.breakfast.map(f => f.name),
        lunch: dietPlan.lunch.map(f => f.name),
        dinner: dietPlan.dinner.map(f => f.name),
        calories: dietPlan.nutritionalSummary?.totalCalories || 0,
        timestamp: dietPlan.generatedAt || new Date()
      };

      // Create a data URL (in production, you'd save this to a database and create a short link)
      const dataUrl = `${window.location.origin}/shared-plan?data=${encodeURIComponent(JSON.stringify(planSummary))}`;
      
      // Generate QR code using a public API
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(dataUrl)}`;
      setQrCodeUrl(qrUrl);
      setShowModal(true);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    }
  };

  return (
    <>
      <button
        onClick={generateQRCode}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all min-h-[48px]"
      >
        <QrCode className="w-5 h-5" />
        <span>Share via QR Code</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Share2 className="w-6 h-6 text-purple-600" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Share Your Diet Plan
                </h3>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Scan this QR code to share your personalized diet plan
              </p>

              <div className="bg-white p-4 rounded-xl inline-block mb-4">
                {qrCodeUrl && (
                  <img 
                    src={qrCodeUrl} 
                    alt="QR Code for diet plan" 
                    className="w-64 h-64"
                  />
                )}
              </div>

              <div className="space-y-3">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  This QR code contains a link to view your diet plan
                </p>
                
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(qrCodeUrl);
                    alert('QR code link copied to clipboard!');
                  }}
                  className="w-full px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg font-semibold hover:bg-emerald-200 transition-colors"
                >
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

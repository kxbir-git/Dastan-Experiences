'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  QrCode,
  Scan,
  CheckCircle2,
  XCircle,
  AlertCircle,
  User,
  Calendar,
  Ticket,
  UtensilsCrossed,
  RefreshCw,
  Camera,
  Volume2,
  VolumeX,
  History,
  Check,
} from 'lucide-react';
import { store } from '@/lib/store';
import type { Booking } from '@/types';

interface CheckInHistoryItem {
  booking: Booking;
  checkedInTime: string;
}

export default function VendorScannerPage() {
  const [scanInput, setScanInput] = useState('');
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    booking?: Booking;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [checkInHistory, setCheckInHistory] = useState<CheckInHistoryItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Play audio chime using Web Audio API
  const playSound = (type: 'success' | 'error') => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'success') {
        // High pleasant double-tone
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.12); // A5
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
      } else {
        // Low buzzy alert
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, audioCtx.currentTime);
        osc.frequency.setValueAtTime(160, audioCtx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
      }
    } catch {
      // AudioContext not allowed or not supported
    }
  };

  const handleVerify = async (hashToVerify: string) => {
    if (!hashToVerify.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/bookings/verify-qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrHash: hashToVerify.trim() }),
      });
      const data = await res.json();

      if (data.success && data.booking) {
        playSound('success');
        setResult({
          success: true,
          message: data.message || `Check-in approved for ${data.booking.customerName}!`,
          booking: data.booking,
        });
        setCheckInHistory((prev) => [
          { booking: data.booking, checkedInTime: new Date().toLocaleTimeString('en-IN') },
          ...prev,
        ]);
        setScanInput('');
      } else {
        playSound('error');
        setResult({
          success: false,
          message: data.error || data.message || 'Ticket not valid for entry.',
          booking: data.booking,
        });
      }
    } catch {
      playSound('error');
      setResult({ success: false, message: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleVerify(scanInput);
  };

  const handleReset = () => {
    setResult(null);
    setScanInput('');
    inputRef.current?.focus();
  };

  // Camera scanner toggle
  const toggleCamera = async () => {
    if (cameraActive) {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      setCameraActive(false);
    } else {
      setCameraActive(true);
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' },
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        }
      } catch (err) {
        // Fallback simulation mode
      }
    }
  };

  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Demo QR hashes
  const DEMO_HASHES = [
    { hash: 'AZD-QR-BNDR-94821-VERIFIED', label: 'Jazz Rooftop · Rohan Sharma (1x Pass)' },
    { hash: 'AZD-QR-REST-71239-VERIFIED', label: 'Spice Vault · Rohan Sharma (2x Covers)' },
    { hash: 'AZD-QR-DEMO-INVALID-99999', label: 'Expired / Fake Ticket Hash' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl saffron-gradient flex items-center justify-center shrink-0">
            <QrCode className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">QR Check-In Scanner</h1>
            <p className="text-xs text-slate-400 mt-0.5">Real-time gatekeeper verification & guest list validation</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border transition-colors ${
              soundEnabled
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
            title={soundEnabled ? 'Sound alerts enabled' : 'Sound muted'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={toggleCamera}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
              cameraActive
                ? 'bg-amber-500 text-slate-950 border-amber-400'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>{cameraActive ? 'Close Camera' : 'Camera Mode'}</span>
          </button>
        </div>
      </div>

      {/* Camera Viewfinder (if active) */}
      {cameraActive && (
        <div className="glass-panel rounded-3xl p-5 border border-slate-800 space-y-4">
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-black flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {/* Viewfinder crosshairs */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-56 h-56 border-2 border-dashed border-amber-400 rounded-3xl relative animate-pulse flex items-center justify-center">
                <div className="w-full h-0.5 bg-amber-400/80 absolute top-1/2 -translate-y-1/2 shadow-[0_0_12px_#f59e0b]" />
              </div>
            </div>
            <div className="absolute bottom-3 inset-x-0 text-center">
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-black/70 text-slate-200 border border-slate-700">
                Point camera at ticket QR code
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => handleVerify(DEMO_HASHES[0].hash)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-amber-300 transition-colors"
            >
              Simulate Camera Scan (Jazz Event)
            </button>
          </div>
        </div>
      )}

      {/* Main Scanner Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
        {/* State Icon */}
        <div className="flex justify-center">
          <div
            className={`w-28 h-28 rounded-3xl border-2 flex items-center justify-center transition-all ${
              loading
                ? 'border-amber-400 bg-amber-500/10 scale-105'
                : result?.success
                ? 'border-emerald-400 bg-emerald-500/10 scale-105 shadow-[0_0_30px_rgba(16,185,129,0.2)]'
                : result && !result.success
                ? 'border-rose-400 bg-rose-500/10 scale-105 shadow-[0_0_30px_rgba(244,63,94,0.2)]'
                : 'border-slate-800 bg-slate-900/80'
            }`}
          >
            {loading ? (
              <RefreshCw className="w-10 h-10 text-amber-400 animate-spin" />
            ) : result?.success ? (
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            ) : result && !result.success ? (
              <XCircle className="w-10 h-10 text-rose-400" />
            ) : (
              <Scan className="w-10 h-10 text-slate-500" />
            )}
          </div>
        </div>

        {/* Input Form */}
        {!result && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">
                QR Hash Code / Booking Reference
              </label>
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={scanInput}
                  onChange={(e) => setScanInput(e.target.value)}
                  placeholder="Paste QR hash or barcode string..."
                  autoFocus
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !scanInput.trim()}
              className="w-full saffron-gradient text-slate-950 font-bold py-3 rounded-xl text-sm hover:brightness-110 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Verifying Admission...
                </>
              ) : (
                <>
                  <Scan className="w-4 h-4" />
                  Verify & Admit Guest
                </>
              )}
            </button>
          </form>
        )}

        {/* Result Message & Details */}
        {result && (
          <div
            className={`rounded-2xl p-6 border space-y-4 ${
              result.success
                ? 'bg-emerald-500/10 border-emerald-500/30'
                : 'bg-rose-500/10 border-rose-500/30'
            }`}
          >
            <div className="flex items-center gap-3">
              {result.success ? (
                <CheckCircle2 className="w-7 h-7 text-emerald-400 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-7 h-7 text-rose-400 flex-shrink-0" />
              )}
              <div>
                <p className={`text-base font-black ${result.success ? 'text-emerald-300' : 'text-rose-300'}`}>
                  {result.message}
                </p>
                {result.booking && (
                  <span className="text-[11px] text-slate-400 font-mono">
                    Ref: {result.booking.bookingNumber}
                  </span>
                )}
              </div>
            </div>

            {/* Booking Details */}
            {result.booking && (
              <div className="space-y-2.5 pt-3 border-t border-slate-700/80">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Guest Name</span>
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-amber-400" />
                      {result.booking.customerName}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Quantity / Covers</span>
                    <span className="font-bold text-white">
                      {result.booking.quantity} Guest{result.booking.quantity > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Experience:</span>
                    <span className="font-semibold text-white">
                      {result.booking.eventTitle || result.booking.restaurantName}
                    </span>
                  </div>
                  {result.booking.tierName && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Ticket Tier:</span>
                      <span className="font-bold text-amber-400">{result.booking.tierName}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Booking Date:</span>
                    <span className="text-slate-300">{result.booking.bookingDate} · {result.booking.timeSlot || 'General Entry'}</span>
                  </div>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleReset}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-colors"
            >
              Scan Next Guest
            </button>
          </div>
        )}
      </div>

      {/* Quick Test Demo QR Hashes */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <QrCode className="w-3.5 h-3.5 text-amber-400" />
          <span>Quick 1-Click Test Pass Codes</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {DEMO_HASHES.map((demo) => (
            <button
              key={demo.hash}
              onClick={() => {
                setScanInput(demo.hash);
                handleVerify(demo.hash);
              }}
              className="text-left p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all group"
            >
              <div className="text-[11px] font-bold text-white group-hover:text-amber-400 transition-colors truncate">
                {demo.label}
              </div>
              <div className="text-[10px] font-mono text-slate-500 mt-0.5 truncate">
                {demo.hash}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Real-time Session Check-in Log */}
      {checkInHistory.length > 0 && (
        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <History className="w-3.5 h-3.5" />
            <span>Shift Check-In Log ({checkInHistory.length} Admitted)</span>
          </div>
          <div className="divide-y divide-slate-800/80">
            {checkInHistory.map((item, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white">{item.booking.customerName}</div>
                  <div className="text-[11px] text-slate-400">
                    {item.booking.tierName || item.booking.eventTitle || item.booking.restaurantName} · {item.booking.quantity} guest(s)
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {item.checkedInTime}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

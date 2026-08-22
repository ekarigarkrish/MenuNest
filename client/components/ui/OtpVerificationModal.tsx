"use client";

import React, { useState, useEffect, useRef } from "react";
import { ShieldCheck, RefreshCw, ArrowRight } from "lucide-react";
import Modal from "./Modal";
import Button from "./Button";
import { toast } from "sonner";

interface OtpVerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    phone: string;
    onVerify: (otp: string) => void;
    onResendOtp?: () => Promise<void>;
    isLoading?: boolean;
}

export default React.memo(function OtpVerificationModal({
    isOpen,
    onClose,
    phone,
    onVerify,
    onResendOtp,
    isLoading = false,
}: OtpVerificationModalProps) {
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [timer, setTimer] = useState(30);
    const [isResending, setIsResending] = useState(false);
    
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setOtp(["", "", "", ""]);
            setTimer(30);
            setTimeout(() => inputRefs.current[0]?.focus(), 100);
        }
    }, [isOpen]);

    // Timer countdown
    useEffect(() => {
        if (isOpen && timer > 0) {
            const interval = setInterval(() => setTimer((t) => t - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [isOpen, timer]);

    const handleInputChange = (index: number, value: string) => {
        const val = value.replace(/\D/g, ""); // Keep only numbers

        // Handle Paste (multiple digits)
        if (val.length > 1) {
            const pastedDigits = val.slice(0, 4).split("");
            const newOtp = ["", "", "", ""];
            pastedDigits.forEach((digit, i) => (newOtp[i] = digit));
            
            setOtp(newOtp);
            inputRefs.current[Math.min(pastedDigits.length, 3)]?.focus();
            return;
        }

        // Handle Single Digit
        const newOtp = [...otp];
        newOtp[index] = val;
        setOtp(newOtp);

        // Move to next input automatically
        if (val && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        // Move to previous input on Backspace if current is empty
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = () => {
        const otpCode = otp.join("");
        if (otpCode.length === 4) {
            onVerify(otpCode);
        } else {
            toast.error("Please enter a valid 4-digit OTP");
        }
    };

    const handleResend = async () => {
        if (!onResendOtp) return;
        
        setIsResending(true);
        try {
            await onResendOtp();
            setTimer(30);
            toast.success("OTP resent successfully");
        } catch (error) {
            toast.error("Failed to resend OTP");
        } finally {
            setIsResending(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="sm" closeOnOverlayClick={false}>
            <div className="flex flex-col items-center justify-center py-4 px-2 space-y-6">
                
                {/* Header Icon */}
                <div className="w-16 h-16 bg-cayenne-red-50 rounded-full flex items-center justify-center">
                    <ShieldCheck className="w-8 h-8 text-cayenne-red-500" />
                </div>
                
                {/* Title & Phone */}
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold text-carbon-black-900">Verify Phone Number</h2>
                    <p className="text-carbon-black-500 text-sm">
                        Enter the 4-digit verification code sent to
                        <br />
                        <span className="font-semibold text-carbon-black-900">{phone}</span>
                    </p>
                </div>

                {/* OTP Inputs */}
                <div className="flex gap-3 justify-center w-full my-4">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => {
                                inputRefs.current[index] = el;
                            }}
                            type="text"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            value={digit}
                            onChange={(e) => handleInputChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className="w-14 h-14 text-center text-2xl font-bold rounded-xl border-2 border-carbon-black-100 bg-carbon-black-50 text-carbon-black-900 focus:outline-none focus:border-cayenne-red-400 focus:bg-white focus:ring-4 focus:ring-cayenne-red-50 transition-all"
                        />
                    ))}
                </div>

                {/* Verify Button */}
                <Button
                    variant="primary"
                    size="lg"
                    className="w-full h-12 text-base font-semibold"
                    onClick={handleVerify}
                    isLoading={isLoading}
                    disabled={otp.join("").length !== 4}
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                    Verify & Continue
                </Button>

                {/* Resend OTP Section */}
                <div className="flex items-center justify-center mt-2 text-sm">
                    <span className="text-carbon-black-500 mr-2">Didn't receive code?</span>
                    
                    {timer > 0 ? (
                        <span className="font-medium text-carbon-black-800">
                            Resend in {timer}s
                        </span>
                    ) : (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleResend}
                            disabled={isResending || !onResendOtp}
                            className="font-medium text-cayenne-red-600 hover:text-cayenne-red-700 disabled:opacity-50 flex items-center gap-1 transition-colors px-2 h-8"
                        >
                            {isResending && <RefreshCw className="w-3 h-3 animate-spin" />}
                            Resend OTP
                        </Button>
                    )}
                </div>
            </div>
        </Modal>
    );
})
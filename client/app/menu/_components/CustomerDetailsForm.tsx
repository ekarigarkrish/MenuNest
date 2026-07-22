import React, { useState } from "react";
import { ChevronRight, ArrowLeft, Phone, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

export type CustomerDetails = {
    phone: string;
    firstName: string;
    lastName: string;
};

export default function CustomerDetailsForm({
    isOpen,
    onClose,
    onSubmit,
}: {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (details: CustomerDetails) => void;
}) {
    const [step, setStep] = useState<1 | 2>(1);
    const [phone, setPhone] = useState("+91");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    // Reset form when opened
    React.useEffect(() => {
        if (isOpen) {
            setStep(1);
        }
    }, [isOpen]);

    const handleNext = () => {
        if (step === 1 && phone.length >= 13) {
           setStep(2);
        }
    };

    const handleSubmit = () => {
        if (firstName.trim() && lastName.trim()) {
            onSubmit({ phone, firstName, lastName });
            onClose();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="sm"
            closeOnOverlayClick
            title={
                <div className="flex items-center gap-3">
                    <span>{step === 1 ? "Glad to see you here." : "What should we call you?"}</span>
                </div>
            }
        >

            <AnimatePresence mode="wait">
                {step === 1 ? (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                    >
                        <div className="relative flex items-center">
                            <Phone className="absolute left-3.5 w-5 h-5 text-carbon-black-400" />
                            <div className="absolute left-10 flex items-center gap-1.5 border-r border-carbon-black-200 pr-2">
                                <span className="text-base text-carbon-black-800 font-medium">+91</span>
                            </div>
                            <input
                                type="tel"
                                placeholder="Enter mobile number"
                                value={phone.replace("+91", "")}
                                onChange={(e) => {
                                    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                                    setPhone("+91" + digits);
                                }}
                                className="w-full pl-[5.5rem] pr-4 h-12 rounded-xl border border-carbon-black-200 bg-white text-base text-carbon-black-900 placeholder:text-carbon-black-400 focus:outline-none focus:ring-2 focus:ring-cayenne-red-400 focus:border-transparent transition"
                                autoFocus
                            />
                        </div>
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={handleNext}
                            disabled={phone.length < 13}
                            className="w-full mt-4"
                            rightIcon={<ChevronRight className="w-4 h-4" />}
                        >
                            Continue
                        </Button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="flex gap-2">
                            <div className="relative">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-carbon-black-400" />
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full pl-11 pr-4 h-12 rounded-xl border border-carbon-black-200 bg-white text-base text-carbon-black-900 placeholder:text-carbon-black-400 focus:outline-none focus:ring-2 focus:ring-cayenne-red-400 focus:border-transparent transition"
                                    autoFocus
                                />
                            </div>
                            <div className="relative">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-carbon-black-400 opacity-50" />
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full pl-11 pr-4 h-12 rounded-xl border border-carbon-black-200 bg-white text-base text-carbon-black-900 placeholder:text-carbon-black-400 focus:outline-none focus:ring-2 focus:ring-cayenne-red-400 focus:border-transparent transition"
                                />
                            </div>
                        </div>
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={handleSubmit}
                            disabled={!firstName.trim() || !lastName.trim()}
                            className="w-full mt-4 !px-4"
                        >
                            Save Details & Continue
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </Modal>
    );
}
import React, { useState, useEffect } from "react";
import { User, Phone, Loader2, Save } from "lucide-react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { Fetch } from "@/config/axios.config";
import { CustomerDetails } from "./CustomerDetailsForm";
import { toast } from "sonner";
import OtpVerificationModal from "@/components/ui/OtpVerificationModal";

export default React.memo(function UpdateCustomerDetailsForm({
    isOpen,
    onClose,
    customer,
    onSubmit,
}: {
    isOpen: boolean;
    onClose: () => void;
    customer: CustomerDetails | null;
    onSubmit: (details: CustomerDetails) => void;
}) {
    const [phone, setPhone] = useState("+91");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showOtpModal, setShowOtpModal] = useState(false);

    useEffect(() => {
        if (isOpen && customer) {
            setPhone(customer.phone || "+91");
            setFirstName(customer.firstName || "");
            setLastName(customer.lastName || "");
        }
    }, [isOpen, customer]);

    const hasChanges = !customer ||
        phone !== (customer.phone || "+91") ||
        firstName !== (customer.firstName || "") ||
        lastName !== (customer.lastName || "");

    const handleSubmitClick = async () => {
        if (!firstName.trim() || !lastName.trim() || phone.length < 13) {
            toast.error("Please fill all fields correctly.");
            return;
        }
        // Open OTP Modal instead of submitting directly
        try {
            const res = await Fetch.post('/api/customer/send/otp', { phone }, { withCredentials: true, withXSRFToken: true })
            toast.success(res.data?.message || "OTP sent successfully");
        }
        catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to send OTP");
            return;
        }
        setShowOtpModal(true);
    };

    const handleVerifyOtp = async (otp: string) => {
        setIsLoading(true);
        try {
            const res = await Fetch.post('/api/customer/verify/otp', { otp }, { withCredentials: true, withXSRFToken: true })
            
            if (!res.data?.success) {
                toast.error(res.data?.message || "Failed to verify OTP");
                return
            }
            await Fetch.put('/api/customer/update', { firstName, lastName, phone }, { withCredentials: true, withXSRFToken: true });
            
            setShowOtpModal(false);
            onSubmit({ phone, firstName, lastName });
            toast.success("Profile updated successfully!");
            onClose();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Something went wrong!')
            console.error("Failed to update on server, updating local storage only", error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                size="sm"
                closeOnOverlayClick
                title="Update Profile"
            >
                <div className="space-y-4">
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
                        />
                    </div>

                    <div className="flex gap-2">
                        <div className="relative w-full">
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-carbon-black-400" />
                            <input
                                type="text"
                                placeholder="First Name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full pl-11 pr-4 h-12 rounded-xl border border-carbon-black-200 bg-white text-base text-carbon-black-900 placeholder:text-carbon-black-400 focus:outline-none focus:ring-2 focus:ring-cayenne-red-400 focus:border-transparent transition"
                            />
                        </div>
                        <div className="relative w-full">
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
                        onClick={handleSubmitClick}
                        disabled={isLoading || !hasChanges}
                        className="w-full mt-4"
                        rightIcon={isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    >
                        {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </Modal>

            <OtpVerificationModal
                isOpen={showOtpModal}
                onClose={() => setShowOtpModal(false)}
                phone={phone}
                onVerify={handleVerifyOtp}
                isLoading={isLoading}
                onResendOtp={async () => {
                    await Fetch.post('/api/customer/send/otp', { phone }, { withCredentials: true, withXSRFToken: true });
                }}
            />
        </>
    );
})
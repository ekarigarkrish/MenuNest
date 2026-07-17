import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <main className="w-full flex flex-col">
                {children}
            </main>
            <Footer />
        </>
    )
}
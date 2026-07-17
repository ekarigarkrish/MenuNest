import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";

export default function AdminDashboardPage() {

    return (
        <Container>
    
            <Section className="py-8 md:py-12">
                <div className="flex flex-col gap-6">
                    <div>
                        <h1 className="text-3xl font-bold font-heading text-gray-900 tracking-tight">Dashboard Overview</h1>
                        <p className="text-gray-500 mt-2">Welcome to your restaurant admin dashboard.</p>
                    </div>

                    {/* Placeholder for Dashboard Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-4">
                        {[
                            { label: "Total Orders", value: "0" },
                            { label: "Total Revenue", value: "$0" },
                            { label: "Active Tables", value: "0" },
                            { label: "Menu Items", value: "0" },
                        ].map((stat, i) => (
                            <div
                                key={i}
                                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-2 hover:shadow-md transition-shadow"
                            >
                                <span className="text-sm font-medium text-gray-500">{stat.label}</span>
                                <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </Section>
        </Container>
    );
}
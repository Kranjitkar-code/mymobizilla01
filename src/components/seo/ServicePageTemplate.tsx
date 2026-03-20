import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { MOBIZILLA } from "@/config/mobizilla";

interface ServicePageProps {
    serviceName: string;
    priceStart: string;
    slug: string;
}

export default function ServicePageTemplate({ serviceName, priceStart, slug }: ServicePageProps) {
    return (
        <div className="container mx-auto px-4 py-8">
            <Helmet>
                <title>{`${serviceName} Kathmandu - ${priceStart} | Mobizilla New Road`}</title>
                <meta name="description" content={`Expert ${serviceName} in New Road, Kathmandu. 30-min doorstep service. ${serviceName} starting at ${priceStart}. Call ${MOBIZILLA.contact.phone1}`} />
                <link rel="canonical" href={`https://mymobizilla.com/${slug}`} />
            </Helmet>

            <section className="mb-12 text-center">
                <h1 className="text-3xl md:text-5xl font-bold mb-6 text-primary">{`${serviceName} Kathmandu - ${priceStart} | Mobizilla New Road`}</h1>
                <h2 className="text-xl md:text-2xl text-muted-foreground mb-8">
                    {`30-Min Doorstep ${serviceName} in New Road`}
                </h2>
                <div className="flex justify-center gap-4">
                    <a href={`tel:${MOBIZILLA.contact.phone1}`}>
                        <Button size="lg">📞 Call Now</Button>
                    </a>
                    <a href={`https://wa.me/${MOBIZILLA.contact.whatsapp}?text=Hi%2C+I+need+${serviceName.replace(/ /g, '+')}+quote`}>
                        <Button variant="outline" size="lg">💬 WhatsApp Quote</Button>
                    </a>
                </div>
            </section>

            <section className="mb-12 grid md:grid-cols-2 gap-8 items-center">
                <div>
                    <img
                        src="/images/placeholder-repair.jpg"
                        alt={`${serviceName} Before and After`}
                        className="rounded-xl shadow-lg w-full h-64 object-cover bg-muted"
                        onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/600x400?text=Repair+Service';
                        }}
                    />
                    <p className="text-center text-sm text-muted-foreground mt-2">Quality repairs with warranty.</p>
                </div>
                <div>
                    <p className="text-lg mb-4">
                        Mobizilla provides premium <strong>{serviceName}</strong> services in New Road and across Kathmandu.
                        We use high-quality parts and offer doorstep pickup and drop.
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>30 Minute Turnaround</li>
                        <li>6 Month to 1 Year Warranty</li>
                        <li>Expert Technicians</li>
                        <li>No Fix, No Fee</li>
                    </ul>
                </div>
            </section>

            <section className="mb-12">
                <h3 className="text-2xl font-bold mb-4 text-center">Estimated Pricing</h3>
                <div className="overflow-x-auto max-w-2xl mx-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Device Model</TableHead>
                                <TableHead>Service Cost (Approx)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">iPhone 13 / 14 Series</TableCell>
                                <TableCell>₨4,800 - ₨24,000</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">iPhone 15 Series</TableCell>
                                <TableCell>₨8,000 - ₨46,500</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Samsung S / Note Series</TableCell>
                                <TableCell>₨5,600 - ₨30,000</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">MacBook / Laptops</TableCell>
                                <TableCell>₨2,500 - ₨14,500</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <p className="text-center text-sm text-muted-foreground mt-4">*Prices vary based on model and damage severity.</p>
                </div>
            </section>

            <section className="text-center">
                <a href={`https://wa.me/${MOBIZILLA.contact.whatsapp}?text=Hi%2C+I+need+repair+quote`} target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="w-full sm:w-auto text-lg bg-green-600 hover:bg-green-700">WhatsApp {MOBIZILLA.contact.phone2}</Button>
                </a>
            </section>
        </div>
    );
}

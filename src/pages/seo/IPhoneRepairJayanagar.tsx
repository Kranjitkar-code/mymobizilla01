import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { MOBIZILLA } from "@/config/mobizilla";

export default function IPhoneRepairJayanagar() {
    return (
        <div className="container mx-auto px-4 py-8">
            <Helmet>
                <title>iPhone Repair New Road Kathmandu | Fastest Screen Replacement | Mobizilla</title>
                <meta name="description" content="Expert iPhone repair in New Road, Kathmandu. Screen replacement, battery fixes in 30 mins. Genuine parts for iPhone 13, 14, 15. Call now!" />
                <link rel="canonical" href="https://mymobizilla.com/iphone-repair-new-road-kathmandu" />
            </Helmet>

            <section className="mb-12 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary">iPhone Repair New Road Kathmandu - Fastest Screen Replacement</h1>
                <p className="text-xl text-muted-foreground mb-8">
                    Get your iPhone fixed in 30 minutes with genuine parts and warranty.
                </p>
                <div className="flex justify-center gap-4">
                    <a href={`tel:${MOBIZILLA.contact.phone1}`}>
                        <Button size="lg">📞 Call Now</Button>
                    </a>
                    <a href={`https://wa.me/${MOBIZILLA.contact.whatsapp}?text=Hi%2C+I+need+iPhone+repair+quote`}>
                        <Button variant="outline" size="lg">💬 WhatsApp Quote</Button>
                    </a>
                </div>
            </section>

            <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6 text-center">iPhone Screen Replacement Pricing (Kathmandu)</h2>
                <div className="overflow-x-auto max-w-3xl mx-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Model</TableHead>
                                <TableHead>Screen Replacement Cost</TableHead>
                                <TableHead>Time Required</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">iPhone 15 Pro Max</TableCell>
                                <TableCell>₨46,500</TableCell>
                                <TableCell>45 Mins</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">iPhone 15 / 15 Plus</TableCell>
                                <TableCell>₨24,000</TableCell>
                                <TableCell>30 Mins</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">iPhone 14 Pro Max</TableCell>
                                <TableCell>₨40,000</TableCell>
                                <TableCell>45 Mins</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">iPhone 14 / 14 Plus</TableCell>
                                <TableCell>₨21,000</TableCell>
                                <TableCell>30 Mins</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">iPhone 13 / 13 Pro</TableCell>
                                <TableCell>₨14,500</TableCell>
                                <TableCell>30 Mins</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">iPhone 12 / 12 Pro</TableCell>
                                <TableCell>₨10,500</TableCell>
                                <TableCell>30 Mins</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">iPhone 11</TableCell>
                                <TableCell>₨5,600</TableCell>
                                <TableCell>20 Mins</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </section>

            <section className="mb-12 grid md:grid-cols-2 gap-8 items-center">
                <div>
                    <h2 className="text-3xl font-bold mb-4">Why Mobizilla for iPhone?</h2>
                    <ul className="space-y-3 list-disc pl-5">
                        <li><strong>Genuine Apple Parts:</strong> We use original quality displays for True Tone retention.</li>
                        <li><strong>FaceID Protection:</strong> Specialized technicians ensure FaceID works perfectly after repair.</li>
                        <li><strong>Doorstep Service:</strong> We come to your home or office in New Road and across Kathmandu.</li>
                        <li><strong>Data Safe:</strong> No data loss during screen or battery replacement.</li>
                    </ul>
                </div>
                <Card className="overflow-hidden">
                    <div className="h-64 bg-muted flex items-center justify-center text-muted-foreground">
                        [Before/After Photo Placeholder]
                    </div>
                    <CardContent className="p-4 text-center text-sm italic">
                        iPhone 13 Pro max restored to factory condition.
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}

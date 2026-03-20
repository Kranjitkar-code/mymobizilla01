import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check } from "lucide-react";
import { MOBIZILLA } from "@/config/mobizilla";

export default function MacBookRepairBangalore() {
    return (
        <div className="container mx-auto px-4 py-8">
            <Helmet>
                <title>MacBook Repair Kathmandu - Keyboard, Screen, Logic Board Experts</title>
                <meta name="description" content="Expert MacBook repair in Kathmandu. Logic board repair, keyboard replacement, screen fix. Certified technicians at New Road." />
                <link rel="canonical" href="https://mymobizilla.com/macbook-repair-kathmandu" />
            </Helmet>

            <section className="mb-12 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary">MacBook Repair Kathmandu - Keyboard, Screen, Logic Board Experts</h1>
                <p className="text-xl text-muted-foreground mb-8">
                    Chip-level repair specialists for MacBook Air, Pro, and M1/M2/M3 chips.
                </p>
                <div className="flex justify-center gap-4">
                    <a href={`tel:${MOBIZILLA.contact.phone1}`}>
                        <Button size="lg">📞 Call Now</Button>
                    </a>
                    <a href={`https://wa.me/${MOBIZILLA.contact.whatsapp}?text=Hi%2C+I+need+MacBook+repair+quote`}>
                        <Button variant="outline" size="lg">💬 WhatsApp Quote</Button>
                    </a>
                </div>
            </section>

            <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6 text-center">MacBook Services & Pricing</h2>
                <div className="overflow-x-auto max-w-4xl mx-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Service</TableHead>
                                <TableHead>Models</TableHead>
                                <TableHead>Starting Price</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">Screen Replacement</TableCell>
                                <TableCell>Air A1466 / Pro A1278</TableCell>
                                <TableCell>₨13,500</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Retina Display</TableCell>
                                <TableCell>M1 / M2 / Pro Retina</TableCell>
                                <TableCell>₨29,500</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Keyboard Replacement</TableCell>
                                <TableCell>Butterfly / Scissor Keys</TableCell>
                                <TableCell>₨5,600</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Logic Board Repair</TableCell>
                                <TableCell>Dead / Water Damage</TableCell>
                                <TableCell>₨7,200</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Battery Replacement</TableCell>
                                <TableCell>All Models</TableCell>
                                <TableCell>₨7,200</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </section>

            <section className="grid md:grid-cols-2 gap-8 mb-16">
                <div className="bg-muted/30 p-8 rounded-xl">
                    <h3 className="text-2xl font-bold mb-4">Why Choose Us for MacBook?</h3>
                    <ul className="space-y-4">
                        <li className="flex gap-2"><Check className="text-green-500" /> <span><strong>Chip-Level Precision:</strong> We fix logic boards instead of just replacing them, saving you 60% cost.</span></li>
                        <li className="flex gap-2"><Check className="text-green-500" /> <span><strong>Genuine Components:</strong> Original batteries and screens.</span></li>
                        <li className="flex gap-2"><Check className="text-green-500" /> <span><strong>6 Month Warranty:</strong> On all chip-level repairs.</span></li>
                    </ul>
                </div>
                <div className="bg-muted/30 p-8 rounded-xl">
                    <h3 className="text-2xl font-bold mb-4">Common Issues We Fix</h3>
                    <ul className="space-y-4">
                        <li className="flex gap-2"><Check className="text-blue-500" /> <span>Not Turning On / Dead MacBook</span></li>
                        <li className="flex gap-2"><Check className="text-blue-500" /> <span>Liquid/Water Spills</span></li>
                        <li className="flex gap-2"><Check className="text-blue-500" /> <span>Keyboard Stuck / Double Typing</span></li>
                        <li className="flex gap-2"><Check className="text-blue-500" /> <span>Overheating & Fan Noise</span></li>
                    </ul>
                </div>
            </section>
        </div>
    );
}

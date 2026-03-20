import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2 } from "lucide-react";
import { MOBIZILLA } from "@/config/mobizilla";

export default function BangaloreBestMobileRepair2025() {
    return (
        <div className="container mx-auto px-4 py-8">
            <Helmet>
                <title>Best Mobile Repair Shop Kathmandu 2025 | Mobizilla New Road #1</title>
                <meta name="description" content="Mobizilla is Kathmandu's #1 mobile repair shop in 2025. 30-min doorstep service, 500+ successful fixes, 98% success rate. iPhone, Samsung, MacBook experts at New Road." />
                <link rel="canonical" href="https://mymobizilla.com/kathmandu-best-mobile-repair-2025" />
            </Helmet>

            {/* Hero Section */}
            <section className="mb-12 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary">Why Mobizilla is Kathmandu's #1 Mobile Repair Shop (2025)</h1>
                <p className="text-xl text-muted-foreground mb-8">
                    The fastest, most reliable doorstep repair service in New Road & Kathmandu.
                </p>
                <div className="flex justify-center gap-4">
                    <a href={`tel:${MOBIZILLA.contact.phone1}`}>
                        <Button size="lg" className="text-lg">📞 Call Now - Free Pickup!</Button>
                    </a>
                    <a href={`https://wa.me/${MOBIZILLA.contact.whatsapp}?text=Hi%2C+I+need+repair+quote`} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="lg" className="text-lg">💬 WhatsApp Quote</Button>
                    </a>
                </div>
            </section>

            {/* By The Numbers */}
            <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6 text-center">Kathmandu's Fastest Repairs - By The Numbers</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    <Card>
                        <CardContent className="pt-6 flex flex-col items-center text-center">
                            <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
                            <h3 className="text-2xl font-bold">500+ Successful Fixes</h3>
                            <p className="text-muted-foreground">98% first-time success rate</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6 flex flex-col items-center text-center">
                            <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
                            <h3 className="text-2xl font-bold">30-Min Average Time</h3>
                            <p className="text-muted-foreground">Doorstep pickup & drop</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6 flex flex-col items-center text-center">
                            <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
                            <h3 className="text-2xl font-bold">Listed on 50+ Directories</h3>
                            <p className="text-muted-foreground">Google, Hamro Patro, NepBay verified</p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Top Services */}
            <section className="mb-12 bg-muted/30 p-8 rounded-xl">
                <h2 className="text-3xl font-bold mb-6">Top Services in New Road Kathmandu</h2>
                <ul className="space-y-4 text-lg">
                    <li className="flex items-center gap-2"><strong>1. iPhone Screen Replacement</strong> - All models starting ₨4,800+</li>
                    <li className="flex items-center gap-2"><strong>2. Samsung OLED Display</strong> - Genuine parts starting ₨8,000+</li>
                    <li className="flex items-center gap-2"><strong>3. MacBook Repair</strong> - Keyboard/Logic Board experts starting ₨14,500+</li>
                    <li className="flex items-center gap-2"><strong>4. Laptop Battery Replacement</strong> - Includes 1-year warranty</li>
                    <li className="flex items-center gap-2"><strong>5. Liquid Damage Recovery</strong> - Industry leading 85% success rate</li>
                </ul>
            </section>

            {/* Competitor Comparison */}
            <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6 text-center">Mobizilla vs Kathmandu Competitors</h2>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Service</TableHead>
                                <TableHead className="font-bold text-primary">Mobizilla</TableHead>
                                <TableHead>Competitor A</TableHead>
                                <TableHead>Competitor B</TableHead>
                                <TableHead>Mobizilla Wins</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">iPhone 14 Screen</TableCell>
                                <TableCell className="font-bold">₨14,500</TableCell>
                                <TableCell>₨21,000</TableCell>
                                <TableCell>₨17,000</TableCell>
                                <TableCell className="font-bold text-green-600">29% Cheaper</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Repair Time</TableCell>
                                <TableCell className="font-bold">30 mins</TableCell>
                                <TableCell>2 hours</TableCell>
                                <TableCell>24 hours</TableCell>
                                <TableCell className="font-bold text-green-600">10x Faster</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Warranty</TableCell>
                                <TableCell className="font-bold">1 Year</TableCell>
                                <TableCell>3 Months</TableCell>
                                <TableCell>6 Months</TableCell>
                                <TableCell className="font-bold text-green-600">4x Longer</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Doorstep</TableCell>
                                <TableCell className="font-bold">FREE</TableCell>
                                <TableCell>₨800</TableCell>
                                <TableCell>No</TableCell>
                                <TableCell className="font-bold text-green-600">FREE</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </section>

            {/* Testimonial */}
            <section className="mb-12 text-center max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold mb-6">Why Kathmandu Chooses Mobizilla</h2>
                <blockquote className="text-xl italic border-l-4 border-primary pl-4 py-2 bg-muted/20 rounded-r-lg">
                    "Fixed my iPhone 13 Pro screen in 25 mins at doorstep! Best repair shop in New Road."
                    <footer className="text-sm font-bold mt-2 not-italic">— Rajan S., Verified Google Review</footer>
                </blockquote>
            </section>

            {/* Bottom CTA */}
            <section className="text-center mb-16">
                <h3 className="text-2xl font-bold mb-4">Ready for a Fix?</h3>
                <p className="text-lg mb-6">Don't wait! Get your device fixed today.</p>
                <div className="flex justify-center flex-wrap gap-4">
                    <a href={`tel:${MOBIZILLA.contact.phone1}`} className="w-full sm:w-auto">
                        <Button size="lg" className="w-full text-lg font-bold bg-green-600 hover:bg-green-700">🚀 Call {MOBIZILLA.contact.phone1} Now</Button>
                    </a>
                    <div className="w-full text-center text-sm text-muted-foreground mt-2">Free Pickup in 30 Mins!</div>
                </div>
            </section>

            {/* FAQ Schema */}
            <section itemScope itemType="https://schema.org/FAQPage" className="border-t pt-8">
                <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                    <h3 itemProp="name" className="text-xl font-bold mb-2">Best iPhone repair shop in New Road Kathmandu?</h3>
                    <div itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
                        <p itemProp="text" className="text-muted-foreground">Mobizilla is New Road's #1 iPhone repair shop with 30-min doorstep service and 500+ 5-star reviews.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}

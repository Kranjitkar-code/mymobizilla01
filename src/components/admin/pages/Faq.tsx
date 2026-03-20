import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Plus, Trash2, Save, Loader2, RefreshCw } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import SupabaseFaqService, { FaqItem } from '@/services/supabaseFaqService';
import { SchemaHelpDialog } from "../SchemaHelpDialog";

const DEFAULT_FAQS = [
    {
        question: "What products do you sell?",
        answer: "We offer a wide range of mobile phones, phone accessories, and replacement parts (screens, batteries, charging ports, etc.). You can browse our products by category or search for specific items."
    },
    {
        question: "Do you provide repair services?",
        answer: "Yes, we offer repair services for various mobile phone issues such as screen replacements, battery issues, charging problems, and more. Visit our \"Repair Services\" page for more details and to book a repair or directly visit our physical outlet."
    },
    {
        question: "How do I schedule a repair?",
        answer: "You can schedule a repair directly through our website by selecting your phone model and describing the issue. You will then be provided with repair options, pricing, and the next available appointment."
    },
    {
        question: "How long will it take to repair my phone?",
        answer: "Repair times vary based on the type of service. Most repairs are completed within 1-2 hours, but more complex issues may take longer. You’ll be notified once your repair is complete."
    },
    {
        question: "What types of phone parts do you sell?",
        answer: "We sell a wide variety of phone parts, including screens, batteries, charging ports, cameras, buttons, back covers, and more. You can find all parts listed on our website under the \"Phone Parts\" section."
    },
    {
        question: "Are the parts genuine?",
        answer: "Yes, we only sell high-quality, genuine parts sourced directly from manufacturers or trusted suppliers. We guarantee the authenticity of all the parts we sell."
    },
    {
        question: "Do you offer warranties on repairs and parts?",
        answer: "Yes, we offer a warranty on both repairs and parts. Warranty periods vary depending on the type of service or part purchased. Please refer to our Warranty Policy for specific details."
    },
    {
        question: "How can I check the status of my repair?",
        answer: "After you schedule your repair, you will receive regular updates on the status of your repair through email or SMS. You can also log into your account to view the status."
    },
    {
        question: "Can I repair my phone myself using parts purchased from your site?",
        answer: "While we do offer high-quality replacement parts, we recommend that you let our professionals handle repairs. Self-repair can void your warranty or potentially cause further damage if not done correctly."
    },
    {
        question: "What payment methods do you accept?",
        answer: "We accept cash and online payment methods."
    },
    {
        question: "Can I return phone parts or accessories?",
        answer: "Yes, we offer a return policy for phone parts and accessories within 30 days of purchase, provided they are unused and in their original packaging. Please refer to our Return Policy for more details."
    },
    {
        question: "Do you offer trade-ins or phone buyback programs?",
        answer: "Yes, we offer trade-in programs where you can exchange your old phone for store credit or a cash refund. Visit our exchange section for more information and to get an estimated value for your device."
    },
    {
        question: "Do you offer international shipping?",
        answer: "Yes, we ship internationally as well. Shipping fees and delivery times vary based on your location. Check our Shipping Policy for more information."
    },
    {
        question: "What happens if my phone is beyond repair?",
        answer: "If your phone is deemed irreparable, we will notify you and discuss possible options, such as a discounted replacement or repair parts for your device."
    },
    {
        question: "How can I contact customer support?",
        answer: "You can reach our customer support team through live chat on our website, by email, or by phone. Visit our \"Contact Us\" page for more details."
    }
];

const FaqPage = () => {
    const [faqs, setFaqs] = useState<FaqItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newQuestion, setNewQuestion] = useState('');
    const [newAnswer, setNewAnswer] = useState('');
    const [showSchemaHelp, setShowSchemaHelp] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        loadFaqs();
    }, []);

    const loadFaqs = async () => {
        setLoading(true);
        const data = await SupabaseFaqService.getAllFaqs();
        setFaqs(data);
        setLoading(false);
    };

    const handleAddFaq = async () => {
        if (!newQuestion.trim() || !newAnswer.trim()) return;

        const result = await SupabaseFaqService.addFaq({
            question: newQuestion,
            answer: newAnswer,
            display_order: faqs.length
        });

        if (result.success) {
            toast({ title: "Success", description: "FAQ added successfully" });
            setNewQuestion('');
            setNewAnswer('');
            setIsAdding(false);
            loadFaqs();
        } else {
            console.error("Add FAQ failed:", result.error);
            if (result.error?.code === '42P01' || result.error?.message?.includes('relation') || result.error?.message?.includes('does not exist')) {
                setShowSchemaHelp(true);
            }
            toast({ title: "Error", description: "Failed to add FAQ", variant: "destructive" });
        }
    };

    const handleDeleteFaq = async (id: string) => {
        if (!confirm('Delete this FAQ?')) return;

        const result = await SupabaseFaqService.deleteFaq(id);
        if (result.success) {
            toast({ title: "Success", description: "FAQ deleted" });
            loadFaqs();
        } else {
            toast({ title: "Error", description: "Failed to delete FAQ", variant: "destructive" });
        }
    };

    const handleLoadDefaults = async () => {
        if (!confirm('This will add all default FAQs to the database. Continue?')) return;

        setLoading(true);
        let successCount = 0;
        let failed = false;

        for (const [index, item] of DEFAULT_FAQS.entries()) {
            const result = await SupabaseFaqService.addFaq({
                question: item.question,
                answer: item.answer,
                display_order: index
            });
            if (result.success) {
                successCount++;
            } else {
                failed = true;
                if (result.error?.code === '42P01') setShowSchemaHelp(true);
            }
        }

        if (failed && successCount === 0) {
            toast({ title: "Error", description: "Failed to add FAQs. Database setup required.", variant: "destructive" });
        } else {
            toast({ title: "Completed", description: `Added ${successCount} default FAQs.` });
            loadFaqs();
        }
        setLoading(false);
    };

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">FAQ Management</h1>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowSchemaHelp(true)}>
                        Database Setup
                    </Button>
                    <Button variant="outline" onClick={handleLoadDefaults}>
                        <RefreshCw className="mr-2 h-4 w-4" /> Load Defaults
                    </Button>
                    <Button onClick={() => setIsAdding(!isAdding)}>
                        <Plus className="mr-2 h-4 w-4" /> Add FAQ
                    </Button>
                </div>
            </div>

            <SchemaHelpDialog open={showSchemaHelp} onOpenChange={setShowSchemaHelp} />

            {isAdding && (
                <Card className="bg-muted/50">
                    <CardHeader>
                        <CardTitle className="text-lg">New FAQ</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Question</label>
                            <Input
                                value={newQuestion}
                                onChange={(e) => setNewQuestion(e.target.value)}
                                placeholder="e.g. What are your hours?"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Answer</label>
                            <Textarea
                                value={newAnswer}
                                onChange={(e) => setNewAnswer(e.target.value)}
                                placeholder="e.g. We are open 9-5..."
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
                            <Button onClick={handleAddFaq}>Save FAQ</Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="space-y-4">
                {loading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : faqs.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground bg-card rounded-lg border border-dashed">
                        <p>No FAQs found.</p>
                        <p className="text-sm mt-2">Click "Load Defaults" to populate with standard questions.</p>
                    </div>
                ) : (
                    <Accordion type="single" collapsible className="w-full space-y-2">
                        {faqs.map((faq) => (
                            <AccordionItem key={faq.id} value={faq.id} className="bg-card border rounded-lg px-4">
                                <AccordionTrigger className="hover:no-underline">
                                    <span className="text-left font-medium">{faq.question}</span>
                                </AccordionTrigger>
                                <AccordionContent className="pt-2 pb-4 text-muted-foreground">
                                    <div className="flex justify-between items-start gap-4">
                                        <p className="whitespace-pre-wrap">{faq.answer}</p>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 hover:text-red-600 hover:bg-red-50 shrink-0"
                                            onClick={() => handleDeleteFaq(faq.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                )}
            </div>
        </div>
    );
};

export default FaqPage;

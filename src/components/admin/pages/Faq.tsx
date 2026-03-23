import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Plus, Trash2, Loader2, RefreshCw } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import SupabaseFaqService, { FaqItem } from '@/services/supabaseFaqService';
import { SchemaHelpDialog } from "../SchemaHelpDialog";
import { AdminCrudPage, AdminCrudToolbar, AdminCrudEmptyPanel } from '@/components/admin/crud/AdminCrudShell';

const DEFAULT_FAQS = [
    { question: 'How long does a screen repair take?', answer: 'Most screen repairs are completed within 1-2 hours.' },
    { question: 'Do you use original parts?', answer: 'We offer both original and high-quality aftermarket parts. We will discuss options with you before starting any repair.' },
    { question: 'Is there a warranty on repairs?', answer: 'Yes, all repairs come with a 30-day warranty covering parts and labor.' },
    { question: 'How do I get a repair quote?', answer: 'Use our online repair quote tool or bring your device to our shop at Ratna Plaza, New Road, Kathmandu.' },
    { question: 'What phone brands do you repair?', answer: 'We repair all major brands: iPhone, Samsung, OnePlus, Xiaomi, Oppo, Vivo, Realme, and more.' },
    { question: 'Can you fix water-damaged phones?', answer: 'Yes, we offer water damage repair services. Success depends on the extent of damage. Bring it in as soon as possible.' },
    { question: 'How does the buyback program work?', answer: 'Submit your device details online, our team will contact you with a fair price offer, and payment is made on the spot.' },
    { question: 'Where are you located?', answer: 'We are located at Ratna Plaza, New Road, Kathmandu 44600, Nepal. Open until 7 PM.' },
    { question: 'What payment methods do you accept?', answer: 'We accept cash, eSewa, Khalti, and bank transfers.' },
    { question: 'Do you offer training courses?', answer: 'Yes! Mobizilla Academy offers Basic to Advanced mobile repair training. Contact us for enrollment.' }
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
            if (result.error?.code === '42P01' || result.error?.message?.includes('relation') || result.error?.message?.includes('does not exist')) {
                setShowSchemaHelp(true);
            }
            toast({
                title: "Error",
                description: result.error?.message || "Failed to add FAQ",
                variant: "destructive",
            });
        }
    };

    const handleDeleteFaq = async (id: string) => {
        if (!confirm('Delete this FAQ?')) return;

        const result = await SupabaseFaqService.deleteFaq(id);
        if (result.success) {
            toast({ title: "Success", description: "FAQ deleted" });
            loadFaqs();
        } else {
            toast({
                title: "Error",
                description: result.error?.message || "Failed to delete FAQ",
                variant: "destructive",
            });
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
        <AdminCrudPage>
            <AdminCrudToolbar
                title="FAQ Management"
                actions={
                    <>
                        <Button variant="outline" onClick={() => setShowSchemaHelp(true)}>
                            Database Setup
                        </Button>
                        <Button onClick={() => setIsAdding(!isAdding)}>
                            <Plus className="mr-2 h-4 w-4" /> Add FAQ
                        </Button>
                        <Button variant="outline" onClick={handleLoadDefaults}>
                            <RefreshCw className="mr-2 h-4 w-4" /> Load Defaults
                        </Button>
                    </>
                }
            />

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
                            <Button variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
                            <Button onClick={handleAddFaq}>Save</Button>
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
                    <AdminCrudEmptyPanel
                        message="No FAQs yet."
                        hint='Use “Load defaults” to add standard questions, or “Add FAQ” to create your own.'
                    />
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
        </AdminCrudPage>
    );
};

export default FaqPage;

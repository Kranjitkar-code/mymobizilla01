import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { MOBIZILLA } from "@/config/mobizilla";

interface BlogPostProps {
    title: string;
    slug: string;
    content: React.ReactNode;
}

export default function BlogPostTemplate({ title, slug, content }: BlogPostProps) {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Helmet>
                <title>{title} | Mobizilla Blog</title>
                <meta name="description" content={`${title} - Read more on Mobizilla Blog. Expert repair advice and industry insights.`} />
                <link rel="canonical" href={`https://mymobizilla.com/blog/${slug}`} />
            </Helmet>

            <article className="prose lg:prose-xl mx-auto">
                <h1 className="text-3xl md:text-5xl font-bold mb-6">{title}</h1>
                <div className="text-sm text-muted-foreground mb-8">Published in 2025 by Mobizilla Experts</div>

                <div className="mb-8">
                    {content}
                </div>

                <section className="bg-muted p-6 rounded-xl my-8 not-prose">
                    <h3 className="text-xl font-bold mb-2">Need Expert Repair?</h3>
                    <p className="mb-4">Mobizilla offers 30-min doorstep service in New Road & Kathmandu.</p>
                    <div className="flex gap-4">
                        <a href={`tel:${MOBIZILLA.contact.phone1}`}>
                            <Button>Call {MOBIZILLA.contact.phone1}</Button>
                        </a>
                        <a href={`https://wa.me/${MOBIZILLA.contact.whatsapp}?text=Saw+your+blog+post%2C+need+help`}>
                            <Button variant="outline">WhatsApp Us</Button>
                        </a>
                    </div>
                </section>

                <div className="text-sm text-muted-foreground border-t pt-4 mt-8">
                    <strong>{MOBIZILLA.brand.name}</strong><br />
                    {MOBIZILLA.contact.address}<br />
                    {MOBIZILLA.contact.phone1}
                </div>
            </article>
        </div>
    );
}

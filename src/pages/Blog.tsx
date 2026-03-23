import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

type BlogListRow = {
  id: string;
  title: string;
  excerpt: string | null;
  cover_url: string | null;
  created_at: string;
};

export default function Blog() {
  const [posts, setPosts] = useState<BlogListRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      const { data, error: qErr } = await supabase
        .from('blogs')
        .select('id, title, excerpt, cover_url, created_at')
        .eq('published', true)
        .order('created_at', { ascending: false });
      if (cancelled) return;
      if (qErr) {
        setError(qErr.message);
        setPosts([]);
      } else {
        setPosts((data as BlogListRow[]) || []);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen py-20">
      <Helmet>
        <title>Mobile Tech Blog Nepal — Mobizilla</title>
        <meta
          name="description"
          content="Mobile phone tips, repair guides, and tech news from Nepal's leading repair experts at Mobizilla."
        />
        <link rel="canonical" href="https://mymobizilla.com/blog" />
      </Helmet>

      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-xl text-gray-600">Latest news and repair tips</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <p className="text-center text-muted-foreground">{error}</p>
        ) : posts.length === 0 ? (
          <div className="max-w-2xl mx-auto text-center text-muted-foreground py-12">
            No published posts yet. Check back soon.
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {posts.map((post) => {
              const img =
                post.cover_url ||
                'https://placehold.co/600x400/e2e8f0/64748b?text=Mobizilla';
              return (
                <article
                  key={post.id}
                  className="border rounded-lg overflow-hidden bg-card flex flex-col shadow-sm"
                >
                  <div className="aspect-[16/10] bg-muted overflow-hidden">
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          'https://placehold.co/600x400/e2e8f0/64748b?text=Mobizilla';
                      }}
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h2 className="text-xl font-semibold mb-2 line-clamp-2">{post.title}</h2>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                      {post.excerpt || ''}
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      {new Date(post.created_at).toLocaleDateString()}
                    </p>
                    <Button variant="outline" className="mt-auto w-fit" asChild>
                      <Link to={`/blog/${post.id}`}>Read more</Link>
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

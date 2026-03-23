import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

type BlogRow = {
  id: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  cover_url: string | null;
  image_url?: string | null;
  published: boolean;
  created_at: string;
};

export default function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!id) {
        navigate('/blog', { replace: true });
        return;
      }
      setLoading(true);
      const { data, error } = await supabase.from('blogs').select('*').eq('id', id).maybeSingle();
      if (cancelled) return;
      if (error || !data) {
        navigate('/blog', { replace: true });
        return;
      }
      const row = data as BlogRow;
      if (!row.published) {
        navigate('/blog', { replace: true });
        return;
      }
      setPost(row);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!post) {
    return null;
  }

  const cover = post.cover_url || post.image_url || '';
  const dateStr = new Date(post.created_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="min-h-screen py-12">
      <Helmet>
        <title>{post.title} — Mobizilla Blog</title>
        <meta
          name="description"
          content={post.excerpt || 'Mobizilla blog — mobile repair and tech in Nepal.'}
        />
        <link rel="canonical" href={`https://mymobizilla.com/blog/${post.id}`} />
      </Helmet>

      <div className="container mx-auto px-4 max-w-3xl">
        {cover ? (
          <div className="mb-8 rounded-lg overflow-hidden border bg-muted aspect-[2/1]">
            <img src={cover} alt="" className="w-full h-full object-cover" />
          </div>
        ) : null}

        <h1 className="text-3xl md:text-4xl font-bold mb-2">{post.title}</h1>
        <p className="text-sm text-muted-foreground mb-8">{dateStr}</p>

        <div className="prose prose-neutral dark:prose-invert max-w-none whitespace-pre-wrap">
          {post.content || post.excerpt || ''}
        </div>

        <div className="mt-10">
          <Button variant="outline" onClick={() => navigate('/blog')}>
            ← Back to blog
          </Button>
        </div>
      </div>
    </article>
  );
}

import { motion } from 'framer-motion';
import { Wrench, Image, BookOpen } from 'lucide-react';

type ComingSoonProps = {
  section: 'training' | 'gallery' | 'blog';
};

const sectionConfig = {
  training: {
    title: 'Training Programs Coming Soon',
    description: 'We\'re currently developing comprehensive training programs to help you master mobile device repair and maintenance. Stay tuned for expert-led courses and hands-on training sessions!',
    icon: <Wrench className="w-12 h-12 mb-4 text-primary" />,
  },
  gallery: {
    title: 'Gallery Coming Soon',
    description: 'Our gallery section is under construction. Soon you\'ll be able to browse through our work, success stories, and before/after repairs. Check back later to see our portfolio!',
    icon: <Image className="w-12 h-12 mb-4 text-primary" />,
  },
  blog: {
    title: 'Blog Coming Soon',
    description: 'We\'re working on creating valuable content about mobile technology, repair tips, and industry insights. Subscribe to our newsletter to be notified when we launch our blog!',
    icon: <BookOpen className="w-12 h-12 mb-4 text-primary" />,
  },
};

export default function ComingSoon({ section }: ComingSoonProps) {
  const { title, description, icon } = sectionConfig[section];

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto text-center"
      >
        <div className="flex justify-center">
          {icon}
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-6">
          {title}
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          {description}
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <a
            href="/"
            className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Go back home
          </a>
          <a href="#" className="text-sm font-semibold text-gray-900">
            Contact support <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </motion.div>
    </div>
  );
}

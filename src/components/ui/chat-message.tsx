import React from 'react';

interface ChatMessageProps {
  content: string;
  className?: string;
}

export function ChatMessage({ content, className = '' }: ChatMessageProps) {
  // Convert [text](/link) format to clickable links
  const formatMessage = (text: string) => {
    const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
    return parts.map((part, index) => {
      const linkMatch = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        const [, text, url] = linkMatch;
        return (
          <a 
            key={index}
            href={url}
            className="text-blue-500 hover:underline"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = url;
            }}
          >
            {text}
          </a>
        );
      }
      // Handle line breaks for bullet points
      return part.split('\n').map((line, i) => (
        <React.Fragment key={`${index}-${i}`}>
          {i > 0 && <br />}
          {line}
        </React.Fragment>
      ));
    });
  };

  return (
    <div className={className}>
      {formatMessage(content)}
    </div>
  );
}

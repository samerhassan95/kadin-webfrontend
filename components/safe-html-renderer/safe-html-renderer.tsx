"use client";

import dynamic from "next/dynamic";
import { ComponentProps } from "react";

interface HtmlContentProps {
  html: string;
  className?: string;
}

const HtmlContent = ({ html, className }: HtmlContentProps) => {
  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

// Use dynamic import with ssr: false to completely avoid SSR for HTML content
const SafeHtmlRenderer = dynamic(() => Promise.resolve(HtmlContent), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-200 h-20 rounded" />
});

export default SafeHtmlRenderer;
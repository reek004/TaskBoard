import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownComponentsProps {
  children: string;
  variant?: 'compact' | 'detail' | 'modal';
}

export const getMarkdownComponents = (variant: 'compact' | 'detail' | 'modal' = 'detail') => {
  switch (variant) {
    case 'compact':
      return {
        // Customize markdown components for compact display (TaskCard)
        p: ({ children }: any) => <p className="mb-1 last:mb-0">{children}</p>,
        h1: ({ children }: any) => <h1 className="text-xs font-semibold mb-1">{children}</h1>,
        h2: ({ children }: any) => <h2 className="text-xs font-semibold mb-1">{children}</h2>,
        h3: ({ children }: any) => <h3 className="text-xs font-semibold mb-1">{children}</h3>,
        h4: ({ children }: any) => <h4 className="text-xs font-semibold mb-1">{children}</h4>,
        h5: ({ children }: any) => <h5 className="text-xs font-semibold mb-1">{children}</h5>,
        h6: ({ children }: any) => <h6 className="text-xs font-semibold mb-1">{children}</h6>,
        ul: ({ children }: any) => <ul className="list-disc list-inside mb-1">{children}</ul>,
        ol: ({ children }: any) => <ol className="list-decimal list-inside mb-1">{children}</ol>,
        li: ({ children }: any) => <li className="mb-0">{children}</li>,
        code: ({ children }: any) => <code className="bg-gray-100 px-1 rounded text-xs">{children}</code>,
        strong: ({ children }: any) => <strong className="font-semibold">{children}</strong>,
        em: ({ children }: any) => <em className="italic">{children}</em>,
      };
    
    case 'detail':
      return {
        // For TaskDetailModal description
        p: ({ children }: any) => <p className="mb-3 last:mb-0 text-gray-700 leading-relaxed">{children}</p>,
        h1: ({ children }: any) => <h1 className="text-2xl font-bold mb-4 text-gray-900">{children}</h1>,
        h2: ({ children }: any) => <h2 className="text-xl font-bold mb-3 text-gray-900">{children}</h2>,
        h3: ({ children }: any) => <h3 className="text-lg font-semibold mb-2 text-gray-900">{children}</h3>,
        h4: ({ children }: any) => <h4 className="text-base font-semibold mb-2 text-gray-900">{children}</h4>,
        h5: ({ children }: any) => <h5 className="text-sm font-semibold mb-2 text-gray-900">{children}</h5>,
        h6: ({ children }: any) => <h6 className="text-sm font-semibold mb-2 text-gray-900">{children}</h6>,
        ul: ({ children }: any) => <ul className="list-disc pl-6 mb-3 space-y-1">{children}</ul>,
        ol: ({ children }: any) => <ol className="list-decimal pl-6 mb-3 space-y-1">{children}</ol>,
        li: ({ children }: any) => <li className="text-gray-700">{children}</li>,
        code: ({ children }: any) => <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{children}</code>,
        pre: ({ children }: any) => <pre className="bg-gray-100 p-3 rounded-lg overflow-x-auto mb-3">{children}</pre>,
        blockquote: ({ children }: any) => <blockquote className="border-l-4 border-blue-500 pl-4 mb-3 italic text-gray-600">{children}</blockquote>,
        a: ({ children, href }: any) => <a href={href} className="text-blue-600 hover:text-blue-800 underline">{children}</a>,
        strong: ({ children }: any) => <strong className="font-semibold text-gray-900">{children}</strong>,
        em: ({ children }: any) => <em className="italic">{children}</em>,
      };
    
    case 'modal':
      return {
        // For AddTaskModal preview
        p: ({ children }: any) => <p className="mb-2 last:mb-0 text-gray-700">{children}</p>,
        h1: ({ children }: any) => <h1 className="text-xl font-bold mb-3 text-gray-900">{children}</h1>,
        h2: ({ children }: any) => <h2 className="text-lg font-bold mb-2 text-gray-900">{children}</h2>,
        h3: ({ children }: any) => <h3 className="text-base font-semibold mb-2 text-gray-900">{children}</h3>,
        h4: ({ children }: any) => <h4 className="text-sm font-semibold mb-2 text-gray-900">{children}</h4>,
        h5: ({ children }: any) => <h5 className="text-sm font-semibold mb-2 text-gray-900">{children}</h5>,
        h6: ({ children }: any) => <h6 className="text-sm font-semibold mb-2 text-gray-900">{children}</h6>,
        ul: ({ children }: any) => <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>,
        ol: ({ children }: any) => <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>,
        li: ({ children }: any) => <li className="text-gray-700">{children}</li>,
        code: ({ children }: any) => <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">{children}</code>,
        pre: ({ children }: any) => <pre className="bg-gray-100 p-2 rounded overflow-x-auto mb-2">{children}</pre>,
        blockquote: ({ children }: any) => <blockquote className="border-l-4 border-blue-500 pl-3 mb-2 italic text-gray-600">{children}</blockquote>,
        a: ({ children, href }: any) => <a href={href} className="text-blue-600 hover:text-blue-800 underline">{children}</a>,
        strong: ({ children }: any) => <strong className="font-semibold text-gray-900">{children}</strong>,
        em: ({ children }: any) => <em className="italic">{children}</em>,
      };
    
    default:
      return {};
  }
};

const MarkdownRenderer: React.FC<MarkdownComponentsProps> = ({ children, variant = 'detail' }) => {
  return (
    <ReactMarkdown components={getMarkdownComponents(variant)}>
      {children}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer; 
import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import { defaultSchema } from 'hast-util-sanitize';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { UIStore } from '@/store';
import { adjustHSL } from '@/lib/utils';
import { CopyText } from '../copy-text/copy-text';
interface MarkdownPreviewProps {
  code: string;
}

const style: { [key: string]: React.CSSProperties } = {
  'code[class*="language-"]': {
    color: '#ffffff',
    fontFamily: "'Fira Code Variable', SFMono-Regular, Consolas, 'Liberation Mono', Menlo, Courier, monospace",
    fontSize: '1em',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    lineHeight: '1.5',
    tabSize: '4',
    hyphens: 'none',
  },
  'pre[class*="language-"]': {
    color: '#ffffff',
    fontFamily: "'Fira Code Variable', SFMono-Regular, Consolas, 'Liberation Mono', Menlo, Courier, monospace",
    fontSize: '1em',
    fontWeight: '400',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    lineHeight: '1.5',
    tabSize: '4',
    hyphens: 'none',
    overflow: 'auto',
    borderRadius: '.5em',
  },
  comment: {
    color: '#6f6f6f',
  },
  prolog: {
    color: '#6f6f6f',
  },
  doctype: {
    color: '#6f6f6f',
  },
  cdata: {
    color: '#6f6f6f',
  },
  punctuation: {
    color: '#86897a',
  },
  namespace: {
    color: '#93beff',
  },
  tag: {
    color: '#dbfffa',
  },
  boolean: {
    color: '#7ad9fb',
  },
  number: {
    color: '#7ad9fb',
  },
  deleted: {
    color: 'red',
  },
  keyword: {
    color: '#dbfffa',
  },
  property: {
    color: '#93beff',
  },
  selector: {
    color: 'red',
  },
  constant: {
    color: '#dbfffa',
  },
  symbol: {
    color: 'hsl(53, 89%, 79%)',
  },
  builtin: {
    color: 'hsl(53, 89%, 79%)',
  },
  'attr-name': {
    color: '#dbfffa',
  },
  'attr-value': {
    color: '#cabeff',
  },
  string: {
    color: '#4be4f7',
  },
  char: {
    color: '#4be4f7',
  },
  operator: {
    color: '#7ad9fb',
  },
  entity: {
    color: '#00d4af',
    cursor: 'help',
  },
  url: {
    color: '#00d4af',
  },
  '.language-css .token.string': {
    color: '#00d4af',
  },
  '.style .token.string': {
    color: '#00d4af',
  },
  variable: {
    color: '#00d4af',
  },
  inserted: {
    color: '#00d4af',
  },
  atrule: {
    color: 'hsl(218, 22%, 55%)',
  },
  regex: {
    color: '#bbfe81',
  },
  important: {
    color: '#bbfe81',
    fontWeight: 'medium',
  },
  medium: {
    fontWeight: 'medium',
  },
  italic: {
    fontStyle: 'italic',
  },
  '.language-markup .token.tag': {
    color: 'hsl(33, 33%, 52%)',
  },
  '.language-markup .token.attr-name': {
    color: 'hsl(33, 33%, 52%)',
  },
  '.language-markup .token.punctuation': {
    color: 'hsl(33, 33%, 52%)',
  },
  '': {
    position: 'relative',
    zIndex: '1',
  },
  '.line-highlight.line-highlight': {
    background: 'linear-gradient(to right, hsla(0, 0%, 33%, .1) 70%, hsla(0, 0%, 33%, 0))',
    borderBottom: '1px dashed hsl(0, 0%, 33%)',
    borderTop: '1px dashed hsl(0, 0%, 33%)',
    marginTop: '0.75em',
    zIndex: '0',
  },
  '.line-highlight.line-highlight:before': {
    backgroundColor: 'hsl(215, 15%, 59%)',
    color: 'hsl(24, 20%, 95%)',
  },
  '.line-highlight.line-highlight[data-end]:after': {
    backgroundColor: 'hsl(215, 15%, 59%)',
    color: 'hsl(24, 20%, 95%)',
  },
};

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = React.memo(({ code }) => {
  return (
    <ReactMarkdown
      className="markdown-body"
      components={{
        a({ children, ...otherProps }) {
          return (
            <a rel="noopener noreferrer" target="_blank" {...otherProps}>
              {children}
            </a>
          );
        },
        pre({ children }) {
          return <pre style={{ position: 'relative' }}>{children}</pre>;
        },

        code({
          children,
          className = '',
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          node,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          ref,
          ...codeTagProps
        }: React.ComponentPropsWithoutRef<'code'> & { node?: unknown; ref?: unknown }) {
          const code = Array.isArray(children) ? String(children[0] || '').replace(/\n$/, '') : String(children || '').replace(/\n$/, '');
          const match = /language-(\w+)/.exec(className || '');

          const { color } = UIStore();

          const customStyle: { [key: string]: React.CSSProperties } = {
            ...style,
            string: { color: `hsl(${adjustHSL(color, 0.2)})` },
            char: { color: `hsl(${adjustHSL(color, 0.2)})` },
            entity: {
              color: `hsl(${adjustHSL(color, 0.1, 60)})`,
              cursor: 'help',
            },
            'attr-value': {
              color: `hsl(${adjustHSL(color, 0.3)})`,
            },
            url: {
              color: `hsl(${adjustHSL(color, 0.1, 60)})`,
            },
            '.language-css .token.string': {
              color: `hsl(${adjustHSL(color, 0.1, 60)})`,
            },
            '.style .token.string': {
              color: `hsl(${adjustHSL(color, 0.1, 60)})`,
            },
            variable: {
              color: `hsl(${adjustHSL(color, 0.1)})`,
            },
            inserted: {
              color: `hsl(${adjustHSL(color, 0.2)})`,
            },
            tag: {
              color: `hsl(${adjustHSL(color, 0.6)})`,
            },
            keyword: {
              color: `hsl(${adjustHSL(color, 0.6)})`,
            },
            constant: {
              color: `hsl(${adjustHSL(color, 0.6)})`,
            },
            'attr-name': {
              color: `hsl(${adjustHSL(color, 0.6)})`,
            },
          };

          if (match) {
            return (
              <>
                <CopyText text={code} className="absolute top-3 right-3 bg-primary/60" />
                <div className="w-full overflow-auto pr-10">
                  <SyntaxHighlighter {...codeTagProps} style={customStyle} language={match[1]} PreTag="span">
                    {code}
                  </SyntaxHighlighter>
                </div>
              </>
            );
          }

          return <code {...codeTagProps}>{code}</code>;
        },
      }}
      rehypePlugins={[
        rehypeRaw,
        [
          rehypeSanitize,
          {
            ...defaultSchema,
            attributes: {
              ...defaultSchema.attributes,
              code: [
                // List of all allowed languages:
                ['className', 'language-norun', 'language-js', 'language-jsx', 'language-ts', 'language-tsx', 'language-bash', 'language-css', 'language-md'],
              ],
            },
          },
        ],
      ]}
      remarkPlugins={[remarkGfm]}
    >
      {code}
    </ReactMarkdown>
  );
});

MarkdownPreview.displayName = 'MarkdownPreview';

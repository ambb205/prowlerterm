import { marked } from 'marked';

marked.setOptions({
  breaks: false,
  gfm: true,
});

export function renderMarkdown(input: string): string {
  return marked.parse(input) as string;
}

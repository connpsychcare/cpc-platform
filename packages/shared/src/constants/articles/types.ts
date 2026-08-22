import type { ContentBlock } from "../content-blocks";

export interface ResourceArticle {
  slug: string;
  /** Short topic label shown on cards. */
  category: string;
  title: string;
  /** Card copy and meta description. */
  description: string;
  readTime: string;
  /** Opening paragraphs on the detail page, before the first block. */
  lead: string[];
  /** ISO date the piece was last reviewed by the clinical team. */
  reviewed: string;
  /** Long-form body. Each article composes its own block sequence. */
  blocks: ContentBlock[];
}

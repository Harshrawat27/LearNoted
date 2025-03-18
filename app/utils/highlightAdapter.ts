/**
 * Adapter functions to help with data structure conversion between
 * the new URL-based highlight model and the client components
 */

// Interface for the character offsets structure
export interface CharOffsets {
  start: number;
  end: number;
  [key: string]: unknown; // For any additional properties
}

// Interface for a highlight item in the new structure
export interface URLHighlightItem {
  text: string;
  color: string;
  serialized: string;
  context: string;
  charOffsets: CharOffsets | null;
  createdAt: Date;
  _id: string;
}

// Interface for a URL document in the new structure
export interface URLHighlightDoc {
  userEmail: string;
  url: string;
  highlights: URLHighlightItem[];
  updatedAt: Date;
  _id: string;
}

// Interface for a highlight in the client-expected format
export interface ClientHighlightItem {
  _id: string;
  text: string;
  color: string;
  context: string;
  url: string;
  createdAt: string;
  serialized?: string;
  charOffsets?: CharOffsets | null;
  title?: string;
}

/**
 * Converts a URL highlight document and its items to client format
 */
export function convertToClientFormat(
  urlDoc: URLHighlightDoc
): ClientHighlightItem[] {
  return urlDoc.highlights.map((highlight) => ({
    _id: highlight._id.toString(),
    text: highlight.text,
    color: highlight.color,
    context: highlight.context || '',
    url: urlDoc.url,
    createdAt: highlight.createdAt.toISOString(),
    serialized: highlight.serialized,
    charOffsets: highlight.charOffsets,
  }));
}

// Type for aggregation results
export interface AggregationResult {
  _id: string | { toString(): string };
  text?: string;
  color?: string;
  context?: string;
  url?: string;
  createdAt?: Date | string;
  serialized?: string;
  charOffsets?: CharOffsets | null;
  [key: string]: unknown; // For any additional fields
}

/**
 * Formats aggregation results to client format, ensuring all expected fields
 */
export function formatAggregationResults(
  results: AggregationResult[]
): ClientHighlightItem[] {
  return results.map((item) => ({
    _id: item._id.toString(),
    text: item.text || '',
    color: item.color || 'yellow',
    context: item.context || '',
    url: item.url || '',
    createdAt: item.createdAt
      ? new Date(item.createdAt).toISOString()
      : new Date().toISOString(),
    serialized: item.serialized || '',
    charOffsets: item.charOffsets || null,
  }));
}

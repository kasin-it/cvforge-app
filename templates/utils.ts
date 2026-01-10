/**
 * HTML escaping utilities for CV templates.
 * Prevents XSS attacks by escaping user content before rendering in HTML.
 */

import he from "he";

/**
 * Escapes HTML special characters in a string.
 * Use for all user-provided text content.
 * Handles null/undefined by returning empty string.
 */
export function escapeHtml(str: string | null | undefined): string {
  if (!str) return "";
  return he.escape(str);
}

/**
 * Sanitizes a URL to prevent javascript: and other dangerous protocols.
 * Returns empty string if URL is invalid or uses a dangerous protocol.
 * Use for all user-provided URLs in href/src attributes.
 */
export function sanitizeUrl(url: string | undefined | null): string {
  if (!url) return "";

  const trimmed = url.trim();
  if (!trimmed) return "";

  // Allow only http, https, and mailto protocols
  // Also allow relative URLs starting with /
  try {
    // Check if it's a relative URL
    if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
      return he.escape(trimmed);
    }

    const parsed = new URL(trimmed);
    const allowedProtocols = ["http:", "https:", "mailto:"];

    if (!allowedProtocols.includes(parsed.protocol)) {
      return "";
    }

    return he.escape(trimmed);
  } catch {
    // If URL parsing fails, it might be a relative path or invalid
    // Reject anything that looks like a protocol
    if (trimmed.includes(":") && !trimmed.startsWith("http")) {
      return "";
    }
    return he.escape(trimmed);
  }
}

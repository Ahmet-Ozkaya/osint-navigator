export type InputType = 'ip' | 'domain' | 'url' | 'hash' | 'email' | 'unknown';

export function detectInputType(input: string): InputType {
  const trimmed = input.trim();
  
  // Email detection
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return 'email';
  }
  
  // IPv4 detection
  if (/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(trimmed)) {
    return 'ip';
  }
  
  // Hash detection (MD5, SHA1, SHA256)
  if (/^[a-fA-F0-9]{32}$/.test(trimmed) || 
      /^[a-fA-F0-9]{40}$/.test(trimmed) || 
      /^[a-fA-F0-9]{64}$/.test(trimmed)) {
    return 'hash';
  }
  
  // URL detection
  if (/^https?:\/\/.+/.test(trimmed)) {
    return 'url';
  }
  
  // Domain detection (basic)
  if (/^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/.test(trimmed)) {
    return 'domain';
  }
  
  return 'unknown';
}

export function sanitizeInput(input: string): string {
  return input.replace(/^https?:\/\//, '').replace(/\/$/, '').trim();
}

export function encodeForUrl(input: string): string {
  return encodeURIComponent(sanitizeInput(input));
}
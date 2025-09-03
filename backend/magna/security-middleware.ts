import { APIError } from "encore.dev/api";

interface SecurityConfig {
  maxRequestSize: number;
  rateLimitPerMinute: number;
  allowedContentTypes: string[];
  blockedPatterns: RegExp[];
}

const securityConfig: SecurityConfig = {
  maxRequestSize: 1024 * 1024, // 1MB
  rateLimitPerMinute: 100,
  allowedContentTypes: ['application/json', 'text/plain'],
  blockedPatterns: [
    /\b(eval|exec|system|shell|cmd)\b/gi,
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /data:text\/html/gi,
    /(union|select|insert|update|delete|drop|create|alter)\s+/gi // Basic SQL injection
  ]
};

const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function validateInput(input: any, clientIP: string): void {
  // Rate limiting
  enforceRateLimit(clientIP);
  
  // Input validation
  validateInputContent(input);
  
  // Size validation
  validateInputSize(input);
}

function enforceRateLimit(clientIP: string): void {
  const now = Date.now();
  const key = clientIP;
  const current = requestCounts.get(key);
  
  if (!current || now > current.resetTime) {
    requestCounts.set(key, { count: 1, resetTime: now + 60000 }); // Reset after 1 minute
    return;
  }
  
  if (current.count >= securityConfig.rateLimitPerMinute) {
    throw APIError.resourceExhausted(`Rate limit exceeded. Maximum ${securityConfig.rateLimitPerMinute} requests per minute.`);
  }
  
  current.count++;
}

function validateInputContent(input: any): void {
  const inputString = JSON.stringify(input);
  
  // Check for blocked patterns
  for (const pattern of securityConfig.blockedPatterns) {
    if (pattern.test(inputString)) {
      throw APIError.invalidArgument("Input contains potentially malicious content");
    }
  }
  
  // Validate specific AI prompt inputs
  if (input.prompt) {
    validatePrompt(input.prompt);
  }
  
  // Validate email inputs
  if (input.email) {
    validateEmail(input.email);
  }
  
  // Validate URL inputs
  if (input.website || input.url) {
    validateURL(input.website || input.url);
  }
}

function validateInputSize(input: any): void {
  const inputSize = Buffer.byteLength(JSON.stringify(input), 'utf8');
  
  if (inputSize > securityConfig.maxRequestSize) {
    throw APIError.invalidArgument(`Request size too large. Maximum size is ${securityConfig.maxRequestSize} bytes.`);
  }
}

function validatePrompt(prompt: string): void {
  // Length validation
  if (prompt.length > 10000) {
    throw APIError.invalidArgument("Prompt too long. Maximum 10,000 characters.");
  }
  
  // Content validation
  const suspiciousPatterns = [
    /ignore\s+(previous|all)\s+(instructions|prompts)/gi,
    /you\s+are\s+now/gi,
    /pretend\s+to\s+be/gi,
    /act\s+as\s+if/gi,
    /forget\s+(everything|all)/gi,
    /system\s*:/gi,
    /assistant\s*:/gi
  ];
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(prompt)) {
      throw APIError.invalidArgument("Prompt contains potentially harmful instructions");
    }
  }
}

function validateEmail(email: string): void {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw APIError.invalidArgument("Invalid email format");
  }
}

function validateURL(url: string): void {
  try {
    const parsedUrl = new URL(url);
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw APIError.invalidArgument("Only HTTP and HTTPS URLs are allowed");
    }
  } catch {
    throw APIError.invalidArgument("Invalid URL format");
  }
}

export function sanitizeOutput(output: string): string {
  // Remove any potentially harmful content from AI responses
  let sanitized = output;
  
  // Remove script tags
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove javascript: URLs
  sanitized = sanitized.replace(/javascript:/gi, '');
  
  // Remove data URLs
  sanitized = sanitized.replace(/data:text\/html/gi, '');
  
  // Remove SQL injection attempts
  sanitized = sanitized.replace(/(union|select|insert|update|delete|drop|create|alter)\s+/gi, '');
  
  return sanitized;
}

export function logSecurityEvent(event: string, details: any, severity: 'low' | 'medium' | 'high'): void {
  console.warn(`[SECURITY ${severity.toUpperCase()}] ${event}:`, details);
  
  // In a production system, this would send to a security monitoring service
  if (severity === 'high') {
    console.error(`HIGH SEVERITY SECURITY EVENT: ${event}`);
  }
}

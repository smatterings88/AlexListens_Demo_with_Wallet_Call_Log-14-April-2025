import { NextResponse, NextRequest } from 'next/server';
import { CallConfig } from '@/lib/types';

async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 3): Promise<Response> {
  let lastError: Error | null = null;
  let retryDelay = 500; // Start with shorter delay

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt + 1}/${maxRetries} to fetch ${url}`);
      
      // Add timeout to the request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // Reduced timeout to 15s
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        cache: 'no-cache'
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      return response;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Check if we should retry based on the error type
      const shouldRetry = attempt < maxRetries - 1 && (
        error instanceof TypeError || // Network errors
        lastError.message.includes('socket') || // Socket errors
        lastError.message.includes('network') || // Network errors
        lastError.message.includes('timeout') || // Timeout errors
        (lastError.message.includes('HTTP error') && 
         lastError.message.includes('504')) // Gateway timeout errors
      );

      if (!shouldRetry) {
        throw lastError;
      }

      console.warn(`Attempt ${attempt + 1} failed:`, {
        error: lastError.message,
        cause: lastError.cause
      });

      // Shorter exponential backoff with minimal jitter
      const jitter = Math.random() * 200;
      const delay = retryDelay + jitter;
      console.log(`Retrying in ${Math.round(delay)}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      retryDelay *= 1.5; // Gentler backoff multiplier
    }
  }

  throw lastError;
}

export async function POST(request: NextRequest) {
  try {
    const body: CallConfig = await request.json();
    console.log('Attempting to call Ultravox API...');

    if (!process.env.ULTRAVOX_API_KEY) {
      console.error('Missing ULTRAVOX_API_KEY environment variable');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Add request ID for tracking
    const requestId = Math.random().toString(36).substring(7);
    console.log(`Request ID: ${requestId}`);

    const response = await fetchWithRetry('https://api.ultravox.ai/api/calls', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.ULTRAVOX_API_KEY,
        'X-Request-ID': requestId
      },
      body: JSON.stringify({ 
        ...body,
        // Add timeout configuration to the API request
        timeout: 10000, // 10 second timeout for the API call
      }),
    });

    console.log(`Ultravox API response status: ${response.status} for request ${requestId}`);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in API route:', error);
    
    // Enhanced error response
    const errorResponse = {
      error: 'Error calling Ultravox API',
      details: error instanceof Error ? error.message : 'Unknown error occurred',
      cause: error instanceof Error && error.cause ? String(error.cause) : undefined,
      timestamp: new Date().toISOString()
    };

    // Determine appropriate status code
    let statusCode = 500;
    if (error instanceof Error) {
      if (error.message.includes('504')) {
        statusCode = 504;
      } else if (error.message.includes('timeout')) {
        statusCode = 408;
      }
    }

    return NextResponse.json(errorResponse, { status: statusCode });
  }
}

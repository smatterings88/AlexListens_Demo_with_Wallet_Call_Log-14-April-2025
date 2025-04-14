import { NextResponse, NextRequest } from 'next/server';
import { CallConfig } from '@/lib/types';

async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 5): Promise<Response> {
  let lastError: Error | null = null;
  let retryDelay = 1000; // Start with 1 second delay

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt + 1}/${maxRetries} to fetch ${url}`);
      
      // Add timeout to the request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          ...options.headers,
          'Connection': 'keep-alive',
          'Keep-Alive': 'timeout=30, max=100'
        },
        // Add cache control
        cache: 'no-cache',
        credentials: 'same-origin'
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        return response;
      }

      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Check if we should retry based on the error type
      const shouldRetry = attempt < maxRetries - 1 && (
        error instanceof TypeError || // Network errors
        lastError.message.includes('socket') || // Socket errors
        lastError.message.includes('network') || // Network errors
        lastError.message.includes('timeout') // Timeout errors
      );

      if (!shouldRetry) {
        throw lastError;
      }

      console.warn(`Attempt ${attempt + 1} failed:`, {
        error: lastError.message,
        cause: lastError.cause
      });

      // Exponential backoff with jitter
      const jitter = Math.random() * 1000;
      const delay = retryDelay + jitter;
      console.log(`Retrying in ${Math.round(delay)}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      retryDelay *= 2; // Double the delay for next attempt
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

    const response = await fetchWithRetry('https://api.ultravox.ai/api/calls', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.ULTRAVOX_API_KEY,
      },
      body: JSON.stringify({ ...body }),
    });

    console.log('Ultravox API response status:', response.status);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in API route:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          error: 'Error calling Ultravox API', 
          details: error.message,
          cause: error.cause ? String(error.cause) : undefined
        },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { error: 'An unknown error occurred.' },
        { status: 500 }
      );
    }
  }
}

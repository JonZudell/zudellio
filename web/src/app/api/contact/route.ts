import { NextResponse } from 'next/server';

/**
 * The replacement for lambdas/contact/post/handler.py, and it does what that
 * did and no more: validate {name, email, message}, log it, answer 200 with the
 * same object. Nothing is sent, nothing is stored. Delivery is a decision for
 * the owner — see web/README.md — and it would need a credential this app does
 * not have.
 *
 * The status for a malformed body is 422, which is what FastAPI answered.
 */

export const dynamic = 'force-dynamic';

const MAX_NAME = 200;
const MAX_EMAIL = 320;
const MAX_MESSAGE = 5000;

// Deliberately the same shape of check pydantic's EmailStr makes: one @, a dot
// in the domain, no spaces. Not an attempt at RFC 5322.
const EMAIL = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

interface Contact {
  name: string;
  email: string;
  message: string;
}

function validate(body: unknown): { contact: Contact } | { errors: string[] } {
  const errors: string[] = [];
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return { errors: ['body must be a JSON object'] };
  }
  const raw = body as Record<string, unknown>;

  const field = (key: 'name' | 'email' | 'message', max: number): string => {
    const value = raw[key];
    if (typeof value !== 'string') {
      errors.push(`${key}: field required and must be a string`);
      return '';
    }
    if (value.trim() === '') errors.push(`${key}: must not be empty`);
    if (value.length > max) errors.push(`${key}: must be at most ${max} characters`);
    return value;
  };

  const name = field('name', MAX_NAME);
  const email = field('email', MAX_EMAIL);
  const message = field('message', MAX_MESSAGE);

  if (typeof raw.email === 'string' && raw.email.trim() !== '' && !EMAIL.test(raw.email)) {
    errors.push('email: value is not a valid email address');
  }

  if (errors.length > 0) return { errors };
  return { contact: { name, email, message } };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ errors: ['body must be valid JSON'] }, { status: 422 });
  }

  const result = validate(body);
  if ('errors' in result) {
    console.warn('contact rejected', { errors: result.errors });
    return NextResponse.json({ errors: result.errors }, { status: 422 });
  }

  console.log('contact posted to');
  console.log(JSON.stringify(result.contact));

  return NextResponse.json(result.contact, { status: 200 });
}

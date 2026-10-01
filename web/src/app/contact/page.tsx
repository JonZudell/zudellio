import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'contact — zudell.io',
  description: 'Get in touch with jon@zudell.io',
};

export default function ContactPage() {
  return (
    <>
      <h2 className="section-heading">contact</h2>
      <div className="border-post">
        <p>
          Email me at{' '}
          <a href="mailto:jon@zudell.io" className="href-blue">
            jon@zudell.io
          </a>
          .
        </p>
        <p className="comment-green"># the form below is accepted and written to the server log.</p>
        <p className="comment-green"># it is not forwarded anywhere, so email is the reliable route.</p>
        <ContactForm />
      </div>
    </>
  );
}

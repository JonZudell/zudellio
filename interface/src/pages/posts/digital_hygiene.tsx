import React from 'react';
import Post from '../../components/containers/Post';
interface PostProps {
  displaySummary?: boolean;
}

const Hygiene: React.FC<PostProps> = ({ displaySummary = false }) => {
  return (
    <Post
      author="jon@zudell.io"
      date={new Date('2024-11-19T00:00:00Z')}
      title="digital_hygiene"
      version="v1.1.1-alpha"
      postId="digital_hygiene"
      displaySummary={displaySummary}
      summaryContent={
        <p>
          <span className="text-color-emphasis">Digital Hygiene</span> is a
          euphemism for a persons information security posture. It is the degree
          of paranoia you have that some one is out to get you. Paranoia is the
          appropriate response;{' '}
          <span className="text-color-emphasis">
            they <i>are</i> out to get you
          </span>
          .
        </p>
      }
    >
      <p>
        <span className="text-color-emphasis">Digital Hygiene</span> is a
        euphemism for a persons information security posture. It is the degree
        of paranoia you have that some one is out to get you. Paranoia is the
        appropriate response because{' '}
        <span className="text-color-emphasis">
          they <i>are</i> out to get you
        </span>
        .
      </p>
      <br />
      <h3 className="comment-green"># Whomst are they?</h3>
      <p>
        <span className="text-color-emphasis">
          <i>They</i> are identity thieves, credit card scammers, and fraudsters
        </span>{' '}
        And they out to steal yo&apos; identity, yo&apos; credit card, and
        yo&apos; online banking information if you let them. The common factor
        between them all is they look for easy targets.
      </p>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        width="64"
        height="64"
        className="mx-auto my-4"
      >
        <path
          d="M32 2C15.4 2 2 15.4 2 32s13.4 30 30 30 30-13.4 30-30S48.6 2 32 2zm0 56C17.7 58 6 46.3 6 32S17.7 6 32 6s26 11.7 26 26-11.7 26-26 26z"
          fill="#000"
        />
        <path
          d="M32 8c-13.3 0-24 10.7-24 24s10.7 24 24 24 24-10.7 24-24S45.3 8 32 8zm0 46c-12.1 0-22-9.9-22-22S19.9 10 32 10s22 9.9 22 22-9.9 22-22 22z"
          fill="#fff"
        />
        <path
          d="M32 12c-11 0-20 9-20 20s9 20 20 20 20-9 20-20-9-20-20-20zm0 38c-9.9 0-18-8.1-18-18S22.1 14 32 14s18 8.1 18 18-8.1 18-18 18z"
          fill="#000"
        />
        <path
          d="M32 16c-8.8 0-16 7.2-16 16s7.2 16 16 16 16-7.2 16-16-7.2-16-16-16zm0 30c-7.7 0-14-6.3-14-14s6.3-14 14-14 14 6.3 14 14-6.3 14-14 14z"
          fill="#fff"
        />
        <path
          d="M32 20c-6.6 0-12 5.4-12 12s5.4 12 12 12 12-5.4 12-12-5.4-12-12-12zm0 22c-5.5 0-10-4.5-10-10s4.5-10 10-10 10 4.5 10 10-4.5 10-10 10z"
          fill="#000"
        />
        <path
          d="M32 24c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z"
          fill="#fff"
        />
        <path
          d="M32 28c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"
          fill="#000"
        />
      </svg>
      <br />
      <h4 className="comment-green">## Identity Thieves</h4>
      <p>
        Identity thieves collect information about you largely from bulk data
        releases. You have had your personal information leaked by companies or
        surreptitiously exfiltrated by hackers. Take the{' '}
        <a
          className="href-blue"
          href="https://www.ftc.gov/enforcement/refunds/equifax-data-breach-settlement"
        >
          equifax security breach
        </a>{' '}
        for example it{' '}
        <span className="text-color-emphasis">
          affected 147 million Americans that we know of
        </span>
        ; adding insult to injury the security lapse that allowed this leak was
        due to a publicy accessible web portal having a default admin password.
        The{' '}
        <span className="text-color-emphasis">
          Office of Personnel Management
        </span>{' '}
        had with equally clown shoes levels of security. OPM is responsible for
        managing background investigations on government{' '}
        <span className="text-color-emphasis">
          employees with security clearances
        </span>
        .{' '}
        <span className="text-color-emphasis">
          OPM leaked millions of records
        </span>{' '}
        <b>
          by allowing unencrypted hard drives to fall off the back of a moving
          truck
        </b>
        .
      </p>
      <br />
      <h4 className="comment-green">## Card Scammers</h4>
      <p>
        Card Scammers broadly break into two categories: thems that buy credit
        card data to abuse, and thems that collect credit card data to sell. Of
        the thems that collect data there are two categories Card Skimmers and
        hackers that compromise point of sale systems.
      </p>
      <br />
      <h4 className="comment-green">### Card Skimmers</h4>
      <p>
        Card skimming can happen{' '}
        <span className="text-color-emphasis">
          with or without physical contact
        </span>
        . Contactless credit cards function based on a device called a retro
        reflector. Essentially it is an antenna and an integrated circuit. When
        exposed to radio waves the retro reflector becomes passively powered and
        transmits a radio signal containing your card information. Card skimming
        can also happen when a{' '}
        <span className="text-color-emphasis">
          disguised physical card reader
        </span>{' '}
        is slid over a read card reader. You swipe your card; the merchant
        processes your transaction and the bad guys have your credit card info.
      </p>
      <br />
      <h4 className="comment-green">### Hackers POS</h4>
      <p>
        Point of Sale systems can be e-commerce stores or merchants with card
        readers. There are rules and{' '}
        <a href="https://www.pcisecuritystandards.org/" className="href-blue">
          regulations surrounding how to process payment card information
        </a>
        . You can reasonably expect businesses to care about this about as much
        as they care about keeping your data private, which is to say not at all{' '}
        <sup>in some cases™</sup>. When these systems are compromised tens of
        thousands of cards. They{' '}
        <a
          className="href-blue"
          href="https://abcnews.go.com/Technology/carders-sites-peek-world-credit-card-theft/story?id=24076802"
        >
          sell the cards for about $10 a pop
        </a>
      </p>
    </Post>
  );
};

export default Hygiene;

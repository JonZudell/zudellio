import React from 'react';
import Post from '../../components/containers/Post';
interface PostProps {
  displaySummary: boolean;
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
          euphemism for a persons information security posture. It is{' '}
          <span className="text-color-emphasis">the degree of paranoia</span>{' '}
          you have that some one is out to get you. Paranoia is the appropriate
          response;{' '}
          <span className="text-color-emphasis">
            they <i>are</i> out to get you
          </span>
          .
        </p>
      }
    >
      <p>
        <span className="text-color-emphasis">Digital Hygiene</span> is a
        euphemism for a persons information security posture. It is{' '}
        <span className="text-color-emphasis">the degree of paranoia</span> you
        have that some one is out to get you. Paranoia is the appropriate
        response because{' '}
        <span className="text-color-emphasis">
          they <i>are</i> out to get you
        </span>
        .
      </p>
      <br />
      <h3 className="comment-green"># Whomst are they?</h3>
      <p>
        <span className="text-color-emphasis">
          They are identity thieves, credit card scammers, and hackers
        </span>{' '}
        And they out to steal yo&apos; identity, yo&apos; credit card, and
        yo&apos; online banking information if you let them. The common factor
        between them all is they look for easy targets.
      </p>
      <br />
      <h4 className="comment-green">## Identity Thieves</h4>
      <p>
        Identity thieves collect information about you largely from bulk data
        releases. You have had your personal information leaked by companies or
        surreptitiously exfiltrated by hackers. Take the{' '}
        <a
          className="href-blue underline"
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
        has an equally clown shoes levels of security. OPM is responsible for
        managing background investigations on government{' '}
        <span className="text-color-emphasis">
          employees with security clearances
        </span>
        .{' '}
        <span className="text-color-emphasis">
          OPM leaked millions of records
        </span>{' '}
        <b className="bold">
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
        is slid over a real card reader. You swipe your card; the merchant
        processes your transaction and the bad guys have your credit card info.
      </p>
      <br />
      <h3 className="comment-green">## Hackers</h3>
      <svg
        width="25%"
        height="auto"
        viewBox="0 0 188.79773 266.88754"
        version="1.1"
        id="svg1098"
        className="mx-auto"
      >
        <defs id="defs1092" />
        <g id="layer1" transform="translate(-71.154705,42.062809)">
          <g
            transform="matrix(4.2296014,0,0,4.2296014,-17.102997,-279.2292)"
            id="g1045"
          >
            <path
              id="path826"
              d="m 41.282671,56.593389 c -4.780981,0.156934 -9.50067,0.457331 -14.389347,2.460699 -2.04289,0.837169 -2.628847,2.20575 -3.187304,3.452785 -3.771156,12.555413 -2.862138,26.278479 1.868625,36.048343 3.737809,7.719214 7.351113,15.306104 14.464848,19.325644 1.234073,0.61099 2.227895,0.81006 3.096406,0.79438 0.0327,-5.3e-4 0.06677,9.9e-4 0.0991,0 0.868524,0.0157 1.862333,-0.18339 3.096419,-0.79438 7.113722,-4.01954 10.727038,-11.60643 14.464823,-19.325644 4.730775,-9.769864 5.639285,-23.49293 1.86813,-36.048343 -0.558482,-1.247035 -1.143906,-2.615616 -3.186797,-3.452785 -4.888676,-2.003368 -9.606235,-2.395539 -14.389347,-2.460699 -1.251465,-0.01706 -2.493986,-0.04306 -3.805567,0 z"
              style={{
                fill: '#ffffff',
                fillRule: 'evenodd',
                stroke: '#000000',
                strokeWidth: 0.99368656,
                strokeLinecap: 'butt',
                strokeLinejoin: 'miter',
                strokeMiterlimit: 4,
                strokeDasharray: 'none',
                strokeOpacity: 1,
              }}
            />
            <path
              id="path844"
              d="m 30.522905,68.554997 c -2.431133,-0.08127 -4.963954,0.834374 -7.008988,3.401672 a 0.92969334,0.92969334 0 1 0 1.45406,1.158891 c 2.313429,-2.904232 4.834556,-3.142802 7.408193,-2.387945 2.573625,0.754858 5.077968,2.68594 6.554139,4.195234 a 0.92914115,0.92914115 0 1 0 1.328254,-1.299216 C 38.61416,71.942337 35.961752,69.842912 32.898754,68.94452 32.133008,68.719922 31.333283,68.582088 30.522905,68.554997 Z"
              style={{
                fill: '#000000',
                fillRule: 'evenodd',
                stroke: 'none',
                strokeWidth: 1.85809648,
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
                strokeMiterlimit: 4,
                strokeDasharray: 'none',
                strokeOpacity: 1,
              }}
            />
            <path
              id="path846"
              d="m 27.525733,78.662544 c -0.263787,-0.04898 -0.984605,-0.41529 -0.09996,-0.915733 2.658292,-1.503714 7.492167,-0.168603 9.130116,0.554531 0.445188,0.196547 1.111997,0.782327 0.158434,0.829411 -3.834963,0.18936 -6.624027,0.0079 -9.188634,-0.468209 z"
              style={{
                fill: '#000000',
                fillRule: 'evenodd',
                stroke: 'none',
                strokeWidth: 0.1238731,
                strokeLinecap: 'butt',
                strokeLinejoin: 'miter',
                strokeMiterlimit: 4,
                strokeDasharray: 'none',
                strokeOpacity: 1,
              }}
            />
            <path
              id="path848"
              d="m 39.408298,74.211813 c 1.267333,2.009921 2.286945,3.640867 2.131298,5.069587 -0.304306,2.793225 -0.04695,5.443902 0.08275,8.152725 0.02626,0.549077 -1.494517,1.536461 -0.08275,3.641822"
              style={{
                fill: 'none',
                fillRule: 'evenodd',
                stroke: '#000000',
                strokeWidth: 0.32774755,
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
                strokeOpacity: 1,
              }}
            />
            <path
              id="path854"
              d="m 27.882649,91.903712 c 1.250363,4.140274 4.487489,5.915847 8.276916,6.91087 2.360117,0.619749 4.758139,0.80375 7.138744,0.747673 2.380618,0.05611 4.778628,-0.127924 7.138758,-0.747673 3.789426,-0.995023 7.02654,-2.770596 8.276903,-6.91087 H 56.8928 c -0.658497,1.664807 -2.152394,3.48968 -3.72941,3.790865 -0.971723,0.185587 -4.393011,0.858391 -5.291971,0.720149 -0.940915,-1.21107 -1.848991,-2.70441 -2.717367,-3.98802 l -1.430697,0.485223 -0.818727,0.01982 -1.491506,-0.432082 c -0.868375,1.28361 -1.746995,2.703977 -2.68791,3.915047 -0.89896,0.138242 -4.320248,-0.534562 -5.29197,-0.720149 C 31.856226,95.39338 30.362328,93.568506 29.703831,91.9037 Z m 15.216064,1.735699 0.367556,0.0025 2.686126,4.262981 c 0.219986,0.308048 0.04806,0.451616 -0.496743,0.537708 -0.999198,0.157889 -1.211938,0.222873 -2.357343,0.227245 -1.145405,-0.005 -1.39154,-0.06875 -2.390738,-0.226601 -0.544806,-0.08609 -0.710809,-0.226167 -0.496744,-0.538352 z"
              style={{
                fill: '#000000',
                fillRule: 'evenodd',
                stroke: 'none',
                strokeWidth: 0.1238731,
                strokeLinecap: 'butt',
                strokeLinejoin: 'miter',
                strokeMiterlimit: 4,
                strokeDasharray: 'none',
                strokeOpacity: 1,
              }}
            />
            <path
              id="path856"
              d="m 40.256407,102.99464 c 1.677738,1.79739 1.138667,3.41599 0.393681,4.67616 -0.230998,0.39074 -0.07073,1.83204 -0.05574,2.21166 0.07135,1.81356 0.569173,3.87184 0.697109,4.28568 0.268668,0.86915 1.060737,1.01804 1.856374,1.0351 0.713274,0.0152 1.780428,-0.35309 1.857032,-1.0351 0.04831,-0.43047 0.625745,-2.47212 0.697095,-4.28568 0.01499,-0.37962 0.175306,-1.82092 -0.05574,-2.21166 -0.744986,-1.26017 -1.284688,-2.87877 0.393049,-4.67616 H 43.93963 42.356582 Z"
              style={{
                fill: '#000000',
                fillRule: 'evenodd',
                stroke: 'none',
                strokeWidth: 0.08051752,
                strokeLinecap: 'butt',
                strokeLinejoin: 'miter',
                strokeMiterlimit: 4,
                strokeDasharray: 'none',
                strokeOpacity: 1,
              }}
            />
            <path
              style={{
                fill: '#000000',
                fillRule: 'evenodd',
                stroke: 'none',
                strokeWidth: 1.85809648,
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
                strokeMiterlimit: 4,
                strokeDasharray: 'none',
                strokeOpacity: 1,
              }}
              d="m 56.073813,68.554997 c 2.431146,-0.08127 4.963967,0.834374 7.009,3.401672 a 0.92969334,0.92969334 0 1 1 -1.45406,1.158891 c -2.313429,-2.904232 -4.834568,-3.142802 -7.408193,-2.387945 -2.573625,0.754858 -5.077967,2.68594 -6.554138,4.195234 a 0.92914115,0.92914115 0 1 1 -1.328254,-1.299216 c 1.644403,-1.681296 4.296811,-3.780721 7.359808,-4.679113 0.765747,-0.224598 1.565459,-0.362432 2.375837,-0.389523 z"
              id="path858"
            />
            <path
              style={{
                fill: '#000000',
                fillRule: 'evenodd',
                stroke: 'none',
                strokeWidth: 0.1238731,
                strokeLinecap: 'butt',
                strokeLinejoin: 'miter',
                strokeMiterlimit: 4,
                strokeDasharray: 'none',
                strokeOpacity: 1,
              }}
              d="m 59.070997,78.662544 c 0.263775,-0.04898 0.984605,-0.41529 0.09997,-0.915733 -2.658292,-1.503714 -7.492168,-0.168603 -9.130117,0.554531 -0.445187,0.196547 -1.111996,0.782327 -0.158446,0.829411 3.834963,0.18936 6.62404,0.0079 9.188647,-0.468209 z"
              id="path860"
            />
            <path
              style={{
                fill: 'none',
                fillRule: 'evenodd',
                stroke: '#FFFFFF',
                strokeWidth: 0.31118649,
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
                strokeOpacity: 0,
              }}
              d="m 60.056866,79.816931 c 9.377491,6.518833 0.177114,16.015988 -7.387135,10.451998"
              id="path862"
            />
            <path
              id="path868"
              d="m 48.727271,91.860185 c -1.381643,-0.646788 -2.462399,-0.317237 -3.263387,0.249012 -0.818492,0.578621 -1.409466,0.821561 -2.231041,0.821561 -0.821589,0 -1.471724,-0.24294 -2.290216,-0.821561 -0.500621,-0.353908 -1.109791,-0.615316 -1.833978,-0.603645 -0.43451,0.0071 -0.910653,0.112093 -1.428777,0.354633"
              style={{
                fill: 'none',
                fillRule: 'evenodd',
                stroke: '#000000',
                strokeWidth: 0.32774755,
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
                strokeOpacity: 1,
              }}
            />
            <path
              id="path880"
              d="m 22.873853,76.789699 c 1.67267,-0.245375 2.500378,0.584672 3.336001,1.404631 -1.240564,0.10876 -2.48181,0.21241 -3.570109,1.46316"
              style={{
                fill: 'none',
                fillRule: 'evenodd',
                stroke: '#000000',
                strokeWidth: 0.32774755,
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
                strokeOpacity: 1,
              }}
            />
            <path
              style={{
                fill: 'none',
                fillRule: 'evenodd',
                stroke: '#000000',
                strokeWidth: 0.32774755,
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
                strokeOpacity: 1,
              }}
              d="m 63.633974,76.789699 c -1.672671,-0.245375 -2.500378,0.584672 -3.336002,1.404631 1.240565,0.10876 2.48181,0.21241 3.57011,1.46316"
              id="path882"
            />
            <path
              id="path884"
              d="m 28.627659,92.731322 c 2.441241,13.759138 28.182964,13.963028 29.38291,0"
              style={{
                fill: 'none',
                fillRule: 'evenodd',
                stroke: '#000000',
                strokeWidth: 0.32774755,
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
                strokeOpacity: 1,
              }}
            />
          </g>
        </g>
      </svg>
      <p>
        Point of Sale systems can be e-commerce stores or merchants with card
        readers. There are rules and{' '}
        <a
          href="https://www.pcisecuritystandards.org/"
          className="href-blue underline"
        >
          regulations surrounding how to process payment card information
        </a>
        . You can reasonably expect businesses to care about this about as much
        as they care about keeping your data private, which is to say not at all{' '}
        <sup>in some cases™</sup>. When these systems are hacked tens of
        thousands of cards can be compromised. They{' '}
        <a
          className="href-blue underline"
          href="https://abcnews.go.com/Technology/carders-sites-peek-world-credit-card-theft/story?id=24076802"
        >
          sell the cards for about $10 a pop
        </a>
      </p>
      <br />
      <h3 className="comment-green"># What you can do about it</h3>
      <p>
        Open your wallet and pay for these services; or don&apos;t and use the
        free plans idc:
      </p>
      <ul>
        <li>
          <a href="https://privacy.com/" className="href-blue underline">
            privacy.com
          </a>
        </li>
        <li>
          <a
            href="https://nordpass.com/password-manager/"
            className="href-blue underline"
          >
            Nord Pass
          </a>
        </li>
        <li>
          <a
            href="https://letmegooglethat.com/?q=Google+Authenticator+App"
            className="href-blue underline"
          >
            Google Authenticator
          </a>
        </li>
      </ul>
      <br />
      <h4 className="comment-green">## privacy.com is badass</h4>
      <p>
        You can create{' '}
        <span className="text-color-emphasis">
          &quot;virtual credit cards&quot;
        </span>{' '}
        with spending limits, transactions restricted to one merchant, or limit
        the number of transactions per month. This will{' '}
        <span className="text-color-emphasis">
          insulate you from hackers, carders, and shady online businesses
        </span>
        . Your cell phone carrier{' '}
        <span className="text-color-emphasis">
          {' '}
          won&apos;t &quot;accidentally&quot; charge you twice in one month
        </span>
        .
      </p>
      <br />
      <h4 className="comment-green">## Nord Pass</h4>
      <p>
        Manage login credentials, create strong passwords on the fly, and create
        email masks so you donn&apos;t have to give out your email! Nord Pass
        has an{' '}
        <span className="text-color-emphasis">
          app for your phone and add ons for your browser
        </span>
        ; it will fill in login and passwords almost automatically. Use it, you
        won&apos;t regret it.{' '}
        <span className="text-color-emphasis">
          Unless NordPass gets hacked then god help you
        </span>
        . You will need to set up two passwords. An account password and a vault
        password.
      </p>
      <br />
      <h4 className="comment-green">## Google Authenticator</h4>
      <p>
        Passwords are not enough,{' '}
        <span className="text-color-emphasis">
          two factor authentication is the bare minimum
        </span>
        . You don&apos;t have to use Google Authenticator but you should at
        least enable another form of auth.{' '}
        <span className="text-color-emphasis">
          Don&apos;t store additional auth factors in a password manager
        </span>
        .
      </p>
      <br />
      <h3 className="comment-green"># Enjoy</h3>
      <p>
        Stress less about hacked accounts, forgotten passwords, email spam,
        double billing, over spending, and{' '}
        <span className="text-color-emphasis">those bastards</span> that{' '}
        <span className="text-color-emphasis">want your credit card</span>.
        Check{' '}
        <a href="https://haveibeenpwned.com/" className="href-blue underline">
          have i been pwned dot com
        </a>{' '}
        to see if your email has been compromised.
      </p>
    </Post>
  );
};

export default Hygiene;

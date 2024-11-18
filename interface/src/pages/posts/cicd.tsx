import React from 'react';
import Post from '../../components/containers/Post';
interface PostProps {
  displaySummary?: boolean;
}

const CICD: React.FC<PostProps> = ({ displaySummary = false }) => {
  return (
    <Post
      author="jon@zudell.io"
      date={new Date('2024-10-30T00:00:00Z')}
      title="cicd"
      version="v1.0.-10"
      postId="cicd"
      displaySummary={displaySummary}
      summaryContent={
        <p>
          <span className="text-color-emphasis">CI/CD</span> is like a big{' '}
          <span className="text-color-emphasis">rube goldberg machine</span>{' '}
          where the first domino to fall is a push to your code repo and the
          last domino to fall is the{' '}
          <span className="text-color-emphasis">production server</span>.
        </p>
      }
    >
      <p>
        <span className="text-color-emphasis">CI/CD</span> is like a big{' '}
        <span className="text-color-emphasis">rube goldberg machine</span> where
        the first domino to fall is a push to your code repo and the last domino
        to fall is the{' '}
        <span className="text-color-emphasis">production server</span>.
      </p>
      <br />
      <h3 className="comment-green"># CI the brittlest process</h3>
      <p>
        Continuos Integration in{' '}
        <span className="text-color-emphasis">
          the process of building code and testing it on every change set
        </span>
        . When changes take place in code they can have unforseen and far
        reaching consequences as such it needs to be repeatedly verified at
        every step. The goal is immediate knowledge of which change set broke
        the software. This aids in incident response and recovery. CI processes
        are built to fail. It is expected not every commit will pass. The subset
        that do pass should be ready to deploy to the next environment.
      </p>
      <br />
      <h3 className="comment-green"># CD automated reflexive deployment</h3>
      <p>
        If you work on software you know that plans never survive contact with
        reality. In environments that haven&apos;t embraced CI/CD deployments
        can happen so rarely that the process is not well understood and prone
        to error.{' '}
        <span className="text-color-emphasis">
          Most production grade software undergoes several deployments
        </span>{' '}
        or builds throughout its lifetime. Many times several deployments will
        be required before developers understand the full impact their changes
        have. In order to not push broken poorly understood, code to production
        things must be tested. Part of testing is testing the deployment.
      </p>
      <br />
      <h3 className="comment-green"># Staged Releases</h3>
      <p>
        Note that not every deployment will make it to production.{' '}
        <span className="text-color-emphasis">
          The simplest way deployments are tested without touching production{' '}
        </span>{' '}
        is to make staging environments. Staging environments may perform
        different functions. There may be an arbitrary number of staging
        environments. Most processes will use three environments development,
        staging, and production. Each environment should strive to have parity
        with each other.
      </p>
      <br />
      <h4 className="comment-green">## Development</h4>
      <p>
        The function of development is to function as a{' '}
        <span className="text-color-emphasis">
          sandbox with all resource dependencies provided
        </span>
        , development environments may host many different change sets at once
        and are hella unreliable; they tend to function as the first place code
        is deployed. Development environments tend to not have perfect parity
        with production. Developer permissions are the most straighforward
        example.
      </p>
      <br />
      <h4 className="comment-green">## Staging</h4>
      <p>
        Whereas there tend to be one development or production environments;
        <span className="text-color-emphasis">
          multiple staging environments
        </span>{' '}
        are more common than multiple development environments. When this
        happens it tends to be because multiple product teams are working to get
        features released and the change sets are incompatible. This lets Q.A.
        <span className="text-color-emphasis">
          examine multiple change sets
        </span>{' '}
        independant of eachother. Staging environments may be{' '}
        <span className="text-color-emphasis">
          run in parallel or sequentially
        </span>
        .
      </p>
      <br />
      <h4 className="comment-green">## Production</h4>
      <p>
        Every bit of work done is all for naught if it doesn&apos;t make it into
        production. Production should have the most stringent security
        configuration. All other environments should strive to be as close to
        production as possible.
      </p>
      <br />
      <h3 className="comment-green"># Feature Flags</h3>
      <p>
        Another way to test the functionality of features before activating them
        is with feature flags.
        <span className="text-color-emphasis">
          Feature flags are conditional statements that keep two feature sets as
          part of the same deployment
        </span>
        . Features can be tested in the production environment by toggling the
        feature for different user cohorts. In this sense feature{' '}
        <span className="text-color-emphasis">
          flags can be used for A/B or Multi armed bandit testing
        </span>
        .
      </p>
      <br />
      <h3 className="comment-green"># Git Ops</h3>
      <p>
        There are many ways to enable automated deployments. A widely adopted
        approach is to{' '}
        <span className="text-color-emphasis">
          use triggers in version control to manage the CI/CD process
        </span>
        . This is an excellent practice because it leverages a tool developers
        use ubiquitously. It also enables pinning releases to specific versions
        of softare as opposed to when something was built.
      </p>
    </Post>
  );
};

export default CICD;

import React from 'react';
import Post from '../../components/containers/Post';

interface PostProps {
  displaySummary: boolean;
  summaryOnly?: boolean;
  classNames?: string;
}

const HireMe: React.FC<PostProps> = ({
  displaySummary = false,
  summaryOnly = false,
  classNames,
}) => {
  return (
    <Post
      author="jon@zudell.io"
      date={new Date('2024-11-01T00:00:00Z')}
      title="hire_me"
      version="v1.0.0"
      postId="hire_me"
      displaySummary={displaySummary}
      summaryOnly={summaryOnly}
      summaryContent={
        <>
          <p>
            <span className="text-color-emphasis">I am available for hire</span>
            . DevOps and Full Stack Engineer with 13 years of experience leading
            cloud infrastructure optimization and secure CI/CD pipeline
            development. Proven record of reducing deployment errors by 50% and
            mentoring teams to deliver scalable, efficient solutions.
          </p>
        </>
      }
      classNames={classNames}
    >
      <p>
        DevOps and Full Stack Engineer with 13 years of experience leading cloud
        infrastructure optimization and secure CI/CD pipeline development.
        Proven record of reducing deployment errors by 50% and mentoring teams
        to deliver scalable, efficient solutions.
      </p>
      <br />
      <h3 className="comment-green"># Skills</h3>
      <p>
        Full Stack Development, Continuous Integration / Continuous Deployment,
        Infrastructure as Code, Containerization
      </p>{' '}
      <br />
      <h3 className="comment-green"># Languages</h3>
      <p>Python, TypeScript, JavaScript, Terraform, Java, Bash, sql</p>
      <br />
      <h3 className="comment-green"># Technologies</h3>
      <p>
        Flask, React, Docker, Amazon Web Services, Kubernetes, ArgoCD,
        PostgreSQL, DynamoDB, Lambdas, API Gateway
      </p>
      <br />
      <h3 className="comment-green"># Specializations</h3>
      <p>
        Full Stack Development, Continuous Integration/Continuous Deployment,
        Public Key Infrastructure, Authentication
      </p>
      <br />
      <h3 className="comment-green"># Work Experience</h3>
      <br />
      <h4 className="comment-green">
        ## Platform Engineer - Lark Technologies - 2021-12 – 2024-03
      </h4>
      <ul>
        <li>
          Migrated CI/CD process from GitHub Actions to ArgoCD/Argo Workflows
          for improved efficiency for 30 scalable microservices
        </li>
        <li>
          Enhanced pipeline security by implementing Static Code Analysis,
          resolving build vulnerabilities, while ensuring pipeline availability
        </li>
        <li>
          Automated Scanning and remediation critical resources using AWS Config
          Rules; remediated hundreds of resources on noncompliance
        </li>
        <li>
          Optimized JWT token management, deployment errors reduced by 50% and
          uninterrupted development operations ensured
        </li>
        <li>
          Mentored junior engineers on CI pipelines, fostering a culture of
          knowledge sharing and enabling scalable cloud automation via GitOps
        </li>
      </ul>{' '}
      <br />
      <h4 className="comment-green">
        ## DevOps Engineer - Leidos - 2018-06 – 2020-03
      </h4>
      <ul>
        <li>
          Automated AWS provisioning for 200 servers, improving orchestration
          efficiency using Chef scripts across 10 accounts
        </li>
        <li>
          Remediated 244 OS Hardening line items for RHEL7 across hundreds of
          servers; leveraged InSpec and oscap; configured observability
        </li>
      </ul>{' '}
      <br />
      <h4 className="comment-green">
        ## Software Engineer - Lockheed Martin - 2017-03 – 2018-03
      </h4>
      <ul>
        <li>
          Replaced a 10,000 line Java program with 250 lines of python by
          leveraging native Linux libraries enabling user session management
        </li>
        <li>
          Architected client server communication process for Air Space Defense
          System for the largest ever RHEL7 deployment for the U.A.E.
        </li>
      </ul>
      <br />
      <h4 className="comment-green">
        ## Software Engineer - United States Air Force - 2011-01 – 2017-01
      </h4>
      <ul>
        <li>
          Wrote procedures to ingest/quality check about 4 million lightning
          strike and weather observations per day in Java and Python
        </li>
        <li>
          Implemented software processes saving 2,479 man-hours per year through
          error correction automating reducing error rate by 98%
        </li>
      </ul>
      <br />
      <h3 className="comment-green"># Education</h3>
      <ul>
        <li>AA General Studies - NWFSC - Expected in March 2025</li>
      </ul>
      <br />
      <h3 className="comment-green"># Contact Info</h3>
      <ul>
        <li>email: jon@zudell.io</li>
      </ul>
    </Post>
  );
};

export default HireMe;

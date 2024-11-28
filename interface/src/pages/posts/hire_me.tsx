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
            I am available for hire. Full Stack Developer, DevOps Engineer, and
            Cloud Infrastructure Expert
          </p>
        </>
      }
      classNames={classNames}
    >
      <p>
        I am available for hire. Full Stack Developer, DevOps Engineer, and
        Cloud Infrastructure Expert
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
      <h3 className="comment-green"># Tooling</h3>
      <p>
        Flask, React, Docker, Amazon Web Services, Kubernetes, ArgoCD,
        PostgreSQL, DynamoDB, Lambdas, API Gateway
      </p>
      <br />
      <h3 className="comment-green"># Specializations</h3>
      <p>
        Authentication, Accessibility, Security, Identity Providers, Public Key
        Infrastructure
      </p>
      <br />
      <h3 className="comment-green"># Work Experience</h3>
      <p>
        Thirteen years of experience. Works across the stack. Delivers high
        quality code.
      </p>
      <br />
      <h4 className="comment-green">
        ## Release Engineer - Lark Technologies - 2021-2024
      </h4>
      <ul>
        <li>
          Served as the primary security contact for the Platform Engineering
          team, addressing information security issues and ensuring compliance.
        </li>
        <li>
          Ensured platform was both stable and reliable with usage by over 50
          engineers
        </li>
        <li>
          Created CI/CD pipelines for Apache Airflow DAGs and Lambdas supporting
          Data Engineering and Full Stack Development
        </li>
        <li>
          Kept AWS resources properly configured with audit log by developing
          AWS config rules and automatic remediations
        </li>
        <li>
          Patched gaps within JWT rotation system fully automating the process
          resolving largest source of misconfiguration and downtime
        </li>
      </ul>{' '}
      <br />
      <h4 className="comment-green">## DevOps Engineer - Leidos - 2018-2020</h4>
      <ul>
        <li>
          Automated Linux machine provisioning in AWS by writing Chef scripts
          managing 200 servers in 3 separate enclaves
        </li>
        <li>
          Met specifications provided by United States Airforce and Defense
          Information systems Agency by automating configuration
        </li>
        <li>
          Organized user testing to demonstrate functionality and evaluated
          Oracle IDAM as proposed Identity Provider
        </li>
      </ul>{' '}
      <br />
      <h4 className="comment-green">
        ## Software Engineer - Lockheed Martin - 2017-2018
      </h4>
      <ul>
        <li>
          Developed workstation command and control system for a significant Air
          Space Defense System with associated training plan
        </li>
        <li>
          Implemented client server communication architecture on socket-level
          in Python and Java/Spring
        </li>
      </ul>
      <br />
      <h4 className="comment-green">
        ## Software Engineer - United States Air Force - 2011-2017
      </h4>
      <ul>
        <li>
          Developed data ingestion software, quality control algorithms, and web
          applications to accomplish a variety of tasks
        </li>
        <li>
          Successfully designed database schemas, tables, partitions, and PL/SQL
          procedures as needed per requirements
        </li>
        <li>
          Wrote procedures to ingest/quality check about 4 million lightning
          strike and weather observations per day
        </li>
        <li>
          Implemented software processes saving 2,479 man-hours per year through
          error correction automating reducing error rate by 98%
        </li>
      </ul>
      <br />
      <h3 className="comment-green"># Education</h3>
      <ul>
        <li>BS Computer Science - UWF - Starting in March 2025</li>
        <li>AA General Studies - NWFSC - Awarded in March 2025</li>
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

import React from 'react';
import Post from '../../components/containers/Post';

interface PostProps {
  displaySummary: boolean;
}

const MultiArmedBandit: React.FC<PostProps> = ({ displaySummary = false }) => {
  return (
    <Post
      author="jon@zudell.io"
      date={new Date('2024-12-07T00:00:00Z')}
      title="multi_armed_bandit"
      version="v0.0.0"
      postId="multi_armed_bandit"
      displaySummary={displaySummary}
      summaryContent={
        <p>
          The multi armed bandit is a problem in machine learning that is
          analagous to the question &quot;When running multiple A/B tests in
          parallel parallel how do you distribute users across experiences based
          on outcomes?&quot; This is the explore/exploit dilemma.
        </p>
      }
    >
      <p>
        The multi armed bandit is a problem in machine learning that is
        analagous to the question &quot;When running multiple A/B tests in
        parallel how do you distribute users across experiences based on
        outcomes?&quot; This is the explore/exploit dilemma.
      </p>
      <br />
      <h3 className="comment-green"># Explore/Exploit Dilemma</h3>
      <p>
        The purpose of A/B testing is to differentiate experiences based on
        outcome. For every user that visits the site the question &quot;In order
        to maximize an outcome; which experience should I assign the user.&quot;
        must be asked. If you always take the safe bet how can you cannot be
        sure that other options do not have higher yields. One solution is to
        select the option with the best option so far but give more weight to
        less thoroughly tested options. This is the Upper Confidence Bound
        algorithm.
        <br /> <br />
        <h4 className="comment-green">
          ## Upper Confidence Bound (UCB) Algorithm
        </h4>
        <p>
          The Upper Confidence Bound (UCB) algorithm is used to balance
          exploration and exploitation. The formula for UCB is:
        </p>
        <pre>
          <code>UCB = x̄ + sqrt((2 * ln(n)) / ni)</code>
        </pre>
        <p>
          Where:
          <ul>
            <li>
              <code>x̄</code> is the average reward of the option
            </li>
            <li>
              <code>n</code> is the total number of trials
            </li>
            <li>
              <code>ni</code> is the number of times the option has been
              selected
            </li>
          </ul>
        </p>
      </p>
      <br />
      <h3 className="comment-green"># AWS Implementation</h3>
      <p>
        AWS Cloudfront in conjuction with a Lambda@Edge function can A/B test or
        M.A.B. test quite easily.
      </p>
      <br />
      <h3 className="comment-green">## Terraform Infrastructure as Code</h3>
      <p>
        Terraform can be used to create a cloudfront distribution with multiple
        backends and link to the Lambda@Edge function to assign user
        experiences.
      </p>
      <br />
      <h3 className="comment-green">## Lambda </h3>
      <p>
        Terraform can be used to create a cloudfront distribution with multiple
        backends and link to the Lambda@Edge function to assign user
        experiences.
      </p>
    </Post>
  );
};

export default MultiArmedBandit;

import React from 'react';
import Post from '../../components/containers/Post';
import CodeBlock from '../../components/containers/CodeBlock';
interface PostProps {
  displaySummary?: boolean;
}

const AWSTF: React.FC<PostProps> = ({ displaySummary = false }) => {
  return (
    <Post
      author="jon@zudell.io"
      date={new Date('2024-10-30T00:00:00Z')}
      title="aws_tf_bootstrap"
      version="v1.0.0"
      postId="aws_tf_bootstrap"
      displaySummary={displaySummary}
      summaryContent={
        <p>
          <span className="text-color-emphasis">Bootstrapping Terraform</span>{' '}
          to manage your{' '}
          <span className="text-color-emphasis">AWS environment</span> can be a
          huge pain. The issue is terraform will not be able to create the the
          bucket or dynamodb table to store the state. This is a{' '}
          <span className="text-color-emphasis">chicken and egg</span> problem.
          Here&apos;s a brief guide on to set it up.
        </p>
      }
    >
      <p>
        <span className="text-color-emphasis">Bootstrapping Terraform</span> to
        manage your <span className="text-color-emphasis">AWS environment</span>{' '}
        can be a huge pain. The issue is terraform will not be able to create
        the the bucket or dynamodb table to store the state. This is a{' '}
        <span className="text-color-emphasis">chicken and egg</span> problem.
        Here&apos;s a brief guide on to set it up.
      </p>
      <br />
      <h3 className="comment-green"># Software Dependancies</h3>
      <p>You will need to have the following software installed:</p>
      <ul>
        <li>
          <p>
            <a
              className="href-blue underline"
              href="https://www.terraform.io/downloads.html"
            >
              Terraform
            </a>
          </p>
        </li>
        <li>
          <p>
            <a
              className="href-blue underline"
              href="https://aws.amazon.com/cli/"
            >
              AWS CLI
            </a>
          </p>
        </li>
      </ul>
      <br />
      <h3 className="comment-green"># Overview</h3>
      <p>
        In order for terraform to store its state in AWS it needs to configure
        the required provider like so.
      </p>
      <br />
      <CodeBlock
        language="terraform"
        code={`terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  backend "s3" {
    encrypt = true
    bucket = "terraform-state-infrastructure"
    key    = "terraform.tfstate"
    region = "us-east-1"
    dynamodb_table = "terraform-dynamodb-locks"
  }
}`}
        title={'main.tf'}
      />
      <br />
      <p>
        The issue is terraform will not be able to create the the bucket or
        dynamodb table to store the state. This is a chicken and egg problem.
      </p>
      <br />
      <h3 className="comment-green"># Resource Creation</h3>
      <p>
        We don&apos;t like getting our hands dirty with the AWS cli and we will
        not sully ourselves by touching the web console. We will use terraform
        like god intended. The solution is to create the bucket, associated
        policies, and dynamodb table using terraform with no backend. To do so
        run <span className="inline-code">terraform apply</span>. This will
        create the resources in AWS.
      </p>
      <br />
      <CodeBlock
        language="terraform"
        code={`terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    # backend "s3" {
    #   encrypt = true
    #   bucket = "terraform-state-infrastructure"
    #   key    = "terraform.tfstate"
    #   region = "us-east-1"
    #   dynamodb_table = "terraform-dynamodb-locks"
    # }
  }
}

variable "terraform_iam_role" {
  description = "The IAM role to assume when running terraform"
  type        = string
}

resource "aws_s3_bucket" "terraform_state_bucket" {
  bucket = "terraform-state-infrastructure"
}

resource "aws_s3_bucket_policy" "terraform_state_policy" {
  bucket = aws_s3_bucket.terraform_state_bucket.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          AWS = "\${var.terraform_iam_role}"
        }
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          "\${aws_s3_bucket.terraform_state_bucket.arn}",
          "\${aws_s3_bucket.terraform_state_bucket.arn}/*"
        ]
      }
    ]
  })
}

resource "aws_dynamodb_table" "terraform_dynamodb_locks" {
  name         = "terraform-locks"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }
}`}
        title={'main.tf'}
      />
      <br />
      <h3 className="comment-green"># Bootstrapping</h3>
      <p>
        Afterward executing the terraform apply delete the .terraform directory
        and the terraform .tfstate files then uncomment the backend. Doing this
        will create the bucket, associated IAM role and dynamodb table. Finally
        uncomment the backend and run{' '}
        <span className="inline-code">terraform init -migrate-state</span>.
        Congratulations, you have fulfilled the capitalist dream of pulling
        yourself up by your own bootstraps.
      </p>
    </Post>
  );
};

export default AWSTF;

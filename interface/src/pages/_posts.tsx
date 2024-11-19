import React from 'react';
import { useParams } from 'react-router-dom';
import AccessibleLink from '../components/input/AccessibleLink';
import A11y from './posts/a11y';
import Authn from './posts/authn';
import HireMe from './posts/_hire_me';
import Init from './posts/init';
import StaticSiteGeneration from './posts/ssg';
import Functional from './posts/functional';
import ObjectOriented from './posts/oop';
import AWSTF from './posts/aws_tf_bootstrap';
import Solid from './posts/solid';
import CICD from './posts/cicd';
import Hygiene from './posts/digital_hygiene';
export interface PostProps {
  displaySummary?: boolean;
  classNames?: string;
}

export interface Post {
  date: Date;
  component: React.FC<PostProps>;
}

export const Posts: {
  [key: string]: { component: React.FC<PostProps>; date: Date };
} = {
  init: { component: Init, date: new Date('2024-08-30') },
  ssg: { component: StaticSiteGeneration, date: new Date('2024-08-31') },
  a11y: { component: A11y, date: new Date('2024-09-01') },
  functional: { component: Functional, date: new Date('2024-09-20') },
  oop: { component: ObjectOriented, date: new Date('2024-10-10') },
  aws_tf_bootstrap: { component: AWSTF, date: new Date('2024-10-12') },
  solid: { component: Solid, date: new Date('2024-10-15') },
  cicd: { component: CICD, date: new Date('2024-11-17') },
  digital_hygiene: { component: Hygiene, date: new Date('2024-11-19') },
  // authn: { component: Authn, date: new Date('2024-09-15') },
};
export const sortedPosts = Object.values(Posts).sort(
  (a, b) => b.date.getTime() - a.date.getTime(),
);

export const sticked_post: React.FC<PostProps> = HireMe;

const _Post: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();

  return (
    <div className={''}>
      <div className="w-full">
        <AccessibleLink
          text={'Back'}
          href={'/'}
          decorationLeft="< "
          ariaLabel={'Go to Home Page'}
        />
        {postId &&
          Posts[postId]?.component &&
          React.createElement(Posts[postId].component, {
            displaySummary: false,
          })}
        <AccessibleLink
          text={'Back'}
          href={'/'}
          decorationLeft="< "
          ariaLabel={'Go to Home Page'}
        />
      </div>
    </div>
  );
};

export default _Post;

import React from 'react';
import { useParams } from 'react-router-dom';
import AccessibleLink from '../components/input/AccessibleLink';
import A11y from './posts/a11y';
import Authn from './posts/authn';
import HireMe from './posts/hire_me';
import Init from './posts/init';
import StaticSiteGeneration from './posts/ssg';
import Functional from './posts/functional';
import ObjectOriented from './posts/oop';
import AWSTF from './posts/aws_tf_bootstrap';
import Solid from './posts/solid';
import CICD from './posts/cicd';
import Hygiene from './posts/digital_hygiene';
import ConwayRule30 from './posts/conway_rule_30';
import OnPasswords from './posts/on_passwords';
export interface PostProps {
  displaySummary: boolean;
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
  aws_tf_bootstrap: { component: AWSTF, date: new Date('2024-10-18') },
  solid: { component: Solid, date: new Date('2024-11-04') },
  cicd: { component: CICD, date: new Date('2024-11-17') },
  digital_hygiene: { component: Hygiene, date: new Date('2024-11-19') },
  conway_rule_30: { component: ConwayRule30, date: new Date('2024-11-27') },
  on_passwords: { component: OnPasswords, date: new Date('2024-12-04') },
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
          decorationLeftClassname="ml-1em"
          ariaLabel={'Go to Home Page'}
        />
        {postId &&
          (postId === 'hire_me'
            ? React.createElement(HireMe, { displaySummary: false })
            : Posts[postId]?.component &&
              React.createElement(Posts[postId].component, {
                displaySummary: false,
              }))}
        <AccessibleLink
          text={'Back'}
          href={'/'}
          decorationLeft="< "
          decorationLeftClassname="ml-1em"
          ariaLabel={'Go to Home Page'}
        />
      </div>
    </div>
  );
};

export default _Post;

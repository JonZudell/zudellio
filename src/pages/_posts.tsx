import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AccessibleLink from '../components/input/AccessibleLink';
import A11y from './posts/a11y';
import Authn from './posts/authn';
import HireMe from './posts/hire_me';
import Init from './posts/init';
import StaticSiteGeneration from './posts/ssg';
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
  authn: { component: Authn, date: new Date('2024-09-01') },
  a11y: { component: A11y, date: new Date('2024-09-02') },
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
          tabIndex={0}
        />
        {postId &&
          Posts[postId]?.component &&
          React.createElement(Posts[postId].component, {
            displaySummary: false,
          })}
      </div>
    </div>
  );
};

export default _Post;

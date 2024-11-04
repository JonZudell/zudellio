import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AccessibleLink from '../components/input/AccessibleLink';
import A11y from './posts/a11y';
import Authn from './posts/authn';
import HireMe from './posts/hire_me';
import Init from './posts/init';
import StaticSiteGeneration from './posts/ssg';
interface PostProps {
  displaySummary?: boolean;
  classNames?: string;
}

const posts: { [key: string]: { component: React.FC<PostProps>; date: Date } } =
  {
    init: { component: Init, date: new Date('2024-08-30') },
    ssg: { component: StaticSiteGeneration, date: new Date('2024-08-31') },
    authn: { component: Authn, date: new Date('2024-09-01') },
    a11y: { component: A11y, date: new Date('2024-09-02') },
  };
const sorted = Object.values(posts).sort(
  (a, b) => b.date.getTime() - a.date.getTime(),
);

const sticked_post: React.FC<PostProps> = HireMe;

const Index: React.FC = () => {
  const { postId } = useParams<{ postId?: string }>();

  return (
    <div className={''}>
      {postId ? (
        <div className="w-full">
          <AccessibleLink
            text={'Back'}
            href={'/'}
            decorationLeft="< "
            tabIndex={-1}
          />
          {posts[postId]?.component &&
            React.createElement(posts[postId].component, {
              displaySummary: false,
            })}
        </div>
      ) : (
        <div className="w-full">
          <div className="flex justify-center items-center">
            <h2 className="text-xl">sticked posts</h2>
          </div>
          {React.createElement(sticked_post, {
            displaySummary: true,
            classNames: 'stickied-post',
          })}
          <div className="flex justify-center items-center">
            <h2 className="text-xl">misadventures in software</h2>
          </div>
          <div>
            {sorted.map((post, index) => (
              <div key={index}>
                {React.createElement(post.component, { displaySummary: true })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;

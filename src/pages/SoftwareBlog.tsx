import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import './index.css';
import A11y from "./posts/a11y";
import Authn from "./posts/authn";
import HireMe from "./posts/hire_me";
import IIFEModule from "./posts/iife_modules";
import Init from "./posts/init";
import SSRWONode from "./posts/ssr_wo_node";
import STPYV8Require from "./posts/stpyv8_require";
interface PostProps {
  displaySummary?: boolean;
  classNames?: string;
}

const posts: { [key: string]: { component: React.FC<PostProps>; date: Date } } = {
  init: { component: Init, date: new Date('2024-08-30') },
  ssr_wo_node: { component: SSRWONode, date: new Date('2024-08-31') },
  iife_module: { component: IIFEModule, date: new Date('2024-08-31') },
  stypyv8_require: { component: STPYV8Require, date: new Date('2024-08-31') },
  authn: { component: Authn, date: new Date('2024-09-01') },
  a11y: { component: A11y, date: new Date('2024-09-01') },
};

const sticked_post: React.FC<PostProps> = HireMe

const SoftwareBlog: React.FC = () => {
  const navigate = useNavigate();
  const { postId } = useParams<{ postId?: string }>();
  // Convert posts object to an array and sort by date
  const sortedPosts = Object.entries(posts)
    .sort(([, a], [, b]) => b.date.getTime() - a.date.getTime())
    .map(([id, { component: Component, date }]) => (
      <li key={id}>
        <Component displaySummary={true} />
      </li>
    ));
  return (
    <>
      {postId ? (
        <div className="w-full">
          <Button text={"Back"} onClick={() => {navigate('/')}} decorationLeft="< " />
          {posts[postId]?.component && React.createElement(posts[postId].component, { displaySummary: false })}
        </div>
      ) : (
        <div className="w-full">
          <div className="flex justify-center items-center">
            <h2 className="text-xl">sticked posts</h2>
          </div>
          {React.createElement(sticked_post, { displaySummary: true, classNames: "border-blue-400" })}
          <div className="flex justify-center items-center">
            <h2 className="text-xl">software misadventures</h2>
          </div>
          <ul>{sortedPosts}</ul>
        </div>
      )}
    </>
  );
};

export default SoftwareBlog;
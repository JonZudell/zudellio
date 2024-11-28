import React from 'react';
import { StoryObj, Meta } from '@storybook/react';
import { hydrateApp } from './csr'; // Adjust the import path as necessary
import Root from './components/core/Root';
import A11y from './pages/posts/a11y';
import Authn from './pages/posts/authn';
import HireMe from './pages/posts/hire_me';
import Init from './pages/posts/init';
import StaticSiteGeneration from './pages/posts/ssg';
import Functional from './pages/posts/functional';
import ObjectOriented from './pages/posts/oop';
import AWSTF from './pages/posts/aws_tf_bootstrap';
import Solid from './pages/posts/solid';
import CICD from './pages/posts/cicd';
import Hygiene from './pages/posts/digital_hygiene';
import { StaticRouter } from 'react-router-dom/server';
import Content from './components/core/Content';
import { ThemeProvider } from './contexts/ThemeProvider';
import ConwayRule30 from './pages/posts/conway_rule_30'; // Add this import
const meta = {
  title: 'Hydration',
  component: Root,
} satisfies Meta<typeof Root>;

export default meta;
const posts: {
  [key: string]: React.FC<{ displaySummary: boolean }> | undefined;
} = {
  a11y: A11y,
  authn: Authn,
  hire_me: HireMe,
  init: Init,
  ssg: StaticSiteGeneration,
  functional: Functional,
  oop: ObjectOriented,
  aws_tf_bootstrap: AWSTF,
  solid: Solid,
  cicd: CICD,
  digital_hygiene: Hygiene,
  conway_rule_30: ConwayRule30,
};

const stories: { [key: string]: StoryObj } = {};

Object.keys(posts).forEach((key) => {
  stories[key] = {
    render: () => (
      <StaticRouter location={''}>
        <ThemeProvider>
          <Content>
            {posts[key] &&
              React.createElement(posts[key], { displaySummary: false })}
          </Content>
        </ThemeProvider>
      </StaticRouter>
    ),
  };
});
export const A11yStory = stories.a11y;
export const AuthnStory = stories.authn;
export const HireMeStory = stories.hire_me;
export const InitStory = stories.init;
export const SsgStory = stories.ssg;
export const FunctionalStory = stories.functional;
export const OopStory = stories.oop;
export const AwsTfBootstrapStory = stories.aws_tf_bootstrap;
export const SolidStory = stories.solid;
export const CicdStory = stories.cicd;
export const ConwayRule30Story = stories.conway_rule_30;

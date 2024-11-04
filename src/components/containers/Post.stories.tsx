import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Post from './Post';
import { StaticRouter } from 'react-router-dom/server';
const meta = {
  component: Post,
  tags: ['autodocs'],
} satisfies Meta<typeof Post>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Full: Story = {
  args: {
    postId: 'example-post',
    author: 'author@example.com',
    date: new Date(),
    title: 'Example Post',
    version: 'v1.0.0',
    displaySummary: false,
    summaryContent: <p>This is a summary of the post.</p>,
    children: <p>This is the full content of the post.</p>,
  },
  render: (args) => (
    <StaticRouter location="/">
      <Post {...args} />
    </StaticRouter>
  ),
};

export const Summary: Story = {
  args: {
    postId: 'example-post',
    author: 'author@example.com',
    date: new Date(),
    title: 'Example Post',
    version: 'v1.0.0',
    displaySummary: true,
    summaryContent: <p>This is a summary of the post.</p>,
    children: <p>This is the full content of the post.</p>,
  },
  render: (args) => (
    <StaticRouter location="/">
      <Post {...args} />
    </StaticRouter>
  ),
};

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import GitHubBanner from './GithubBanner';

const meta = {
  component: GitHubBanner,
} satisfies Meta<typeof GitHubBanner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Example: Story = {
  render: () => <GitHubBanner></GitHubBanner>,
};

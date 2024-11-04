import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import CodeBlock from './CodeBlock';

const meta = {
  component: CodeBlock,
} satisfies Meta<typeof CodeBlock>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Example: Story = {
  args: {
    code: "console.log('Hello, world!');",
    title: "Example Code",
  },
  render: (args) => <CodeBlock {...args} />,
};

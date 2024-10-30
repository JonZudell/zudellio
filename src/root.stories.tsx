import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import Root from './root';

type PagePropsAndCustomArgs = React.ComponentProps<typeof Root> & {};

const meta: Meta<PagePropsAndCustomArgs> = {
  title: 'Pages/Index',
  component: Root,
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};
export default meta;

type Story = StoryObj<PagePropsAndCustomArgs>;

export const RootStory: Story = {
  render: (args) => <Root {...args} />,
};
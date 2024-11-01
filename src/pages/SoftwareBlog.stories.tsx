import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import NoContext from '../components/NoContext';

const meta: Meta = {
  title: 'Pages/SoftwareBlog',
  component: NoContext,
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

export const SoftwareBlogStory: StoryObj = {
  render: () => (
    <MemoryRouter initialEntries={['/']}>
      <NoContext />
    </MemoryRouter>
    ),
};
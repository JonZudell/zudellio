import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import A11y from './posts/a11y';
import Authn from './posts/authn';
import HireMe from './posts/_hire_me';
import Init from './posts/init';
import StaticSiteGeneration from './posts/ssg';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../contexts/ThemeProvider'; // or the correct module for ThemeProvider
import Functional from './posts/functional';

const meta = {} satisfies Meta<typeof A11y>;

export default meta;

type Story = StoryObj<typeof meta>;

export const A11yStory: Story = {
  render: () => {
    return (
      <MemoryRouter>
        <A11y />
      </MemoryRouter>
    );
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
};

export const AuthnStory: Story = {
  render: () => {
    return (
      <MemoryRouter>
        <Authn />
      </MemoryRouter>
    );
  },
};

export const HireMeStory: Story = {
  // set args to pass props to the component
  args: { summaryOnly: true, displaySummary: true },
  render: (args) => {
    return (
      <MemoryRouter>
        <HireMe {...args} />
      </MemoryRouter>
    );
  },
};

export const InitStory: Story = {
  render: () => {
    return (
      <MemoryRouter>
        <Init />
      </MemoryRouter>
    );
  },
};

export const StaticSiteGenerationStory: Story = {
  render: () => {
    return (
      <MemoryRouter>
        <StaticSiteGeneration />
      </MemoryRouter>
    );
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
};

export const FunctionalStory: Story = {
  render: () => {
    return (
      <MemoryRouter>
        <Functional />
      </MemoryRouter>
    );
  },
};

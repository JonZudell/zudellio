import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { ThemeProvider } from './contexts/ThemeContext';

const meta: Meta<typeof App> = {
  title: 'App/Pages',
  component: App,
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
      
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof App>;

export const DarkApp: Story = {
  args: {
    theme: 'dark',
  },
  render: ({theme}) => (
    <MemoryRouter initialEntries={['/']}>
      <ThemeProvider>
        <App theme={theme}/>
      </ThemeProvider>
    </MemoryRouter>
  ),
};

export const LightApp: Story = {
  args: {
    theme: 'light',
  },
  render: ({theme}) => (
    <MemoryRouter initialEntries={['/']}>
      <ThemeProvider>
        <App theme={theme}/>
      </ThemeProvider>
    </MemoryRouter>
    ),
};

export const About: Story = {
  args: {
    theme: 'dark',
  },
  render: ({theme}) => (
    <MemoryRouter initialEntries={['/about']}>
      <ThemeProvider>
        <App theme={theme}/>
      </ThemeProvider>
    </MemoryRouter>
    ),
};

export const Contact: Story = {
  args: {
    theme: 'light',
  },
  render: ({theme}) => (
    <MemoryRouter initialEntries={['/contact']}>
      <ThemeProvider>
        <App theme={theme}/>
      </ThemeProvider>
    </MemoryRouter>
    ),
};

export const Pagination: Story = {
  args: {
    theme: 'dark',
  },
  render: ({theme}) => (
    <MemoryRouter initialEntries={['/1']}>
      <ThemeProvider>
        <App theme={theme}/>
      </ThemeProvider>
    </MemoryRouter>
    ),
};

export const Article: Story = {
  args: {
    theme: 'dark',
  },
  render: ({theme}) => (
    <MemoryRouter initialEntries={['/blog/a11y']}>
      <ThemeProvider>
        <App theme={theme}/>
      </ThemeProvider>
    </MemoryRouter>
    ),
};
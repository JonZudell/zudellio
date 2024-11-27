import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ConwayContainer from './ConwayContainer';

const meta = {
  component: ConwayContainer,
} satisfies Meta<typeof ConwayContainer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Example: Story = {
  render: () => <ConwayContainer />,
};

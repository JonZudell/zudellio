import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import Button from './Button';

const meta: Meta = {
  title: 'Components/Button',
  component: Button,
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

type Story = StoryObj<typeof Button>;

export const DefaultButton: Story = {
  render: () => <Button text="default"></Button>,
};

// export const PrimaryButton: Story = {
//   render: () => <Button className="bg-blue-500 text-white">Primary Button</Button>,
// };

// export const SecondaryButton: Story = {
//   render: () => <Button className="bg-gray-500 text-white">Secondary Button</Button>,
// };

// export const DangerButton: Story = {
//   render: () => <Button className="bg-red-500 text-white">Danger Button</Button>,
// };

// export const PlainButton: Story = {
//   render: () => <Button className="bg-transparent border-none">Plain Button</Button>,
// };
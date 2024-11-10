import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import AccessibleCheckbox from './AccessibleCheckbox';

const meta = {
  component: AccessibleCheckbox,
} satisfies Meta<typeof AccessibleCheckbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Example: Story = {
  args: {
    children: <p>Example!</p>,
    ariaLabel: 'Accessible Button!',
    inputId: 'example-checkbox',
    name: 'exampleCheckbox',
    onChange: () => undefined,
  },
  render: (args) => (
    <AccessibleCheckbox
      ariaLabel={args.ariaLabel}
      inputId={args.inputId}
      name={args.name}
      onChange={function (): void {
        throw new Error('Function not implemented.');
      }}
    >
      {args.children}
    </AccessibleCheckbox>
  ),
};

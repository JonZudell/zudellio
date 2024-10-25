import type { Meta, StoryObj } from '@storybook/react';
import ActivityBar from './ActivityBar';
const meta = {
    component: ActivityBar,
} satisfies Meta<typeof ActivityBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
};
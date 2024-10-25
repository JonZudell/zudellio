import type { Meta, StoryObj } from '@storybook/react';
import AppShell from './AppShell';
const meta = {
    component: AppShell,
} satisfies Meta<typeof AppShell>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
};
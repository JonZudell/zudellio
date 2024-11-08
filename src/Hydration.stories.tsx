import React from 'react';
import { StoryObj, Meta } from '@storybook/react';
import { hydrateApp } from './csr'; // Adjust the import path as necessary
import Root from './components/core/Root';
import { StaticRouter } from 'react-router-dom/server';

const meta = {
  title: 'Hydration',
  component: Root,
} satisfies Meta<typeof Root>;

export default meta;

type Story = StoryObj<typeof meta>;
interface HydratedRootProps {
  path: string;
}

const HydratedRoot: React.FC<HydratedRootProps> = ({ path }) => {
  React.useEffect(() => {
    const container = document.getElementById('root');
    console.log('hydrating');
    hydrateApp(container);
    console.log('hydrated');
  }, []);

  return (
    <main id="root">
      <StaticRouter location={path}>
        <Root />
      </StaticRouter>
    </main>
  );
};

export const RootStory: Story = {
  render: () => <HydratedRoot path="/" />,
};

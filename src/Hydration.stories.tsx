import React, { useEffect } from 'react';
import { StoryObj, Meta } from '@storybook/react';
import { hydrateApp } from './csr'; // Adjust the import path as necessary
import Root from './components/core/Root';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';

// export default {
//   title: 'Hydration',
//   component: Root,
// } as Meta;
// const meta = {} satisfies Meta<typeof Root>;

// export default meta;

// type Story = StoryObj<typeof meta>;
// const Template: Story = () => {
//   useEffect(() => {
//     const container = document.getElementById('root');
//     hydrateApp(container);
//   }, []);

//   return (
//     <div id="root">
//       <BrowserRouter>
//         <Root />
//       </BrowserRouter>
//     </div>
//   );
// };

// export default Template;
const meta = {} satisfies Meta<typeof Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const RootStory: Story = {
  render: () => {
    return (
      <MemoryRouter>
        <Root />
      </MemoryRouter>
    );
  },
};

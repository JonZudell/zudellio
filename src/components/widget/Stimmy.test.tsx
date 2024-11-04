import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Stimmy from './Stimmy'; // Import the actual component

test('should render Stimmy component and handle interactions', async () => {
  render(<Stimmy />);

  const canvas = screen.getByRole('img'); // Assuming the canvas has role 'img'
  fireEvent.click(canvas);
  fireEvent.mouseUp(canvas);
  fireEvent.blur(canvas);

  // Add assertions to verify the interactions
  expect(console.log).toHaveBeenCalledWith('Canvas clicked');
  expect(console.log).toHaveBeenCalledWith('Mouse up on canvas');
  expect(console.log).toHaveBeenCalledWith('Canvas lost focus');
});

import forms from '@tailwindcss/forms';

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [
    forms({
      strategy: 'class', // only generate classes
    }),
  ],
};

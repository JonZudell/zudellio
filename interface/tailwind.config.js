// eslint-disable-next-line @typescript-eslint/no-var-requires
const forms = require('@tailwindcss/forms');

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

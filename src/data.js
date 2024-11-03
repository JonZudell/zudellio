const globSync = require('glob').sync;
const relative = require('path').relative;

const pages = globSync('./src/pages/**/*.tsx').map((file)  => {
  const relativePath = relative('./src/pages', file);
  const route = '/' + relativePath.replace(/\.tsx$/, '').replace(/\/index$/, '');

  return route;
});

module.exports = {
  title: 'zudell.io',
  routes: pages
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const globSync = require('glob').sync;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const relative = require('path').relative;

const pages = globSync('./src/pages/**/*.tsx')
  .filter((file) => !file.includes('/_'))
  .map((file) => {
    const relativePath = relative('./src/pages', file);
    let route = '/' + relativePath.replace(/\.tsx$/, '');
    if (route === '/index') {
      route = '/';
    } else {
      route += '/';
    }
    return route;
  });

module.exports = {
  title: 'zudell.io',
  routes: pages,
};

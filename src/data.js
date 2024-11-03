const globSync = require('glob').sync;
const relative = require('path').relative;

const pages = globSync('./src/pages/**/*.tsx').map((file)  => {
  const relativePath = relative('./src/pages', file);
  let route = '/' + relativePath.replace(/\.tsx$/, '');
  if (route === '/index') {
    route = '/'
  } else {
    route += "/"
  }
  return route;
});

console.log(pages); // Print the pages

module.exports = {
  title: 'zudell.io',
  routes: pages
}

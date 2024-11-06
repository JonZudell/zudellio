import { sync as globSync } from 'glob';
import { relative } from 'path';

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

console.log(pages); // Print the pages

export const title = 'zudell.io';
export const routes = pages;

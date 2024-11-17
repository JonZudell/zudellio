import React from 'react';
import Post from '../../components/containers/Post';
import CodeBlock from '../../components/containers/CodeBlock';

interface PostProps {
  displaySummary?: boolean;
}

const SSG: React.FC<PostProps> = ({ displaySummary = false }) => {
  return (
    <Post
      author="jon@zudell.io"
      date={new Date('2024-10-31T00:00:00Z')}
      title="static_site_generation"
      version="v0.4.2"
      postId="ssg"
      displaySummary={displaySummary}
      summaryContent={
        <p>
          Using a slightly modified version of this repositories webpack plugin
          <span className="inline-span">
            <a
              className="href-blue underline"
              href="https://github.com/markdalgleish/static-site-generator-webpack-plugin"
            >
              markdalgleish/static-site-generator-webpack-plugin
            </a>
          </span>
          and my own custom webpack plugin / configuration I was able to write a{' '}
          <span className="text-color-emphasis">
            Static Site Generator with webpack, react(-router), and TypeScript.
          </span>{' '}
          Routes are generated from the src/pages directory.
        </p>
      }
    >
      <p>
        Using a slightly modified version of this repositories webpack plugin
        <span className="inline-span">
          <a
            className="href-blue underline"
            href="https://github.com/markdalgleish/static-site-generator-webpack-plugin"
          >
            markdalgleish/static-site-generator-webpack-plugin
          </a>
        </span>
        and my own custom webpack plugin / configuration I was able to write a{' '}
        <span className="text-color-emphasis">
          Static Site Generator with webpack, react(-router), and TypeScript.
        </span>{' '}
        Routes are generated from the src/pages directory.
      </p>
      <p>
        My Template Wrapper Plugin, it reads the output assets from the webpack
        build and rewrites the index.html files with the content from the
        statically generated routes.
      </p>
      <br />
      <CodeBlock
        className=""
        code={`class TemplateWrapperPlugin {
  apply(compiler) {
    compiler.hooks.thisCompilation.tap(
      'TemplateWrapperPlugin',
      (compilation) => {
        compilation.hooks.processAssets.tapAsync(
          {
            name: 'TemplateWrapperPlugin',
            stage: webpack.Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE,
          },
          (assets, callback) => {
            data.routes.forEach((route) => {
              const assetKey = \`\${route.replace(/^\\//, '')}index.html\`;

              const asset = assets[assetKey];
              if (asset) {
                const content = asset.source();
                const template = fs.readFileSync(
                  path.join(__dirname, '/src/index.html'),
                  'utf8',
                );

                const htmlOutput = template.replace(
                  '<!-- inject:body -->',
                  content,
                ); // Example modification
                assets[assetKey] = {
                  source: () => htmlOutput,
                  size: () => htmlOutput.length,
                };
              } else {
                console.warn(
                  \`TemplateWrapperPlugin: Asset not found for route \${route}\`,
                );
              }
            });
            callback();
          },
        );
      },
    );
  }
}`}
        title={'TemplateWrapperPlugin.js'}
      />
      <p>
        The template wrapper plugin references the index.html file. It is
        provided below
      </p>
      <CodeBlock
        className=""
        language="html"
        code={`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta
      name="description"
      content="Web site created using create-react-app"
    />
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <!-- inject:body -->
    <script defer src="/main.js"></script>
    <link rel="stylesheet" href="/main.css">
  </body>
</html>`}
        title={'index.html'}
      />
      <p>
        The two plugins work together to generate the static site. Inside the
        webpack configuration static-site-generator plugin is fed routes
        generated by a data.js file.
      </p>
      <br />
      <CodeBlock
        className=""
        code={`// eslint-disable-next-line @typescript-eslint/no-var-requires
const globSync = require('glob').sync;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const relative = require('path').relative;

const pages = globSync('./src/pages/**/*.tsx')
  .filter((file) => !file.includes('/_'))
  .map((file) => {
    const relativePath = relative('./src/pages', file);
    let route = '/' + relativePath.replace(/\\.tsx$/, '');
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
`}
        title={'data.js'}
      />
      <CodeBlock
        className=""
        code={`/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const fs = require('fs');
const StaticSiteGeneratorPlugin = require('./ssgwp');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const data = require('./src/data');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TemplateWrapperPlugin = require('./TemplateWrapperPlugin');

module.exports = {
  mode: 'production',
  entry: {
    main: './src/csr.tsx',
    ssg: './src/ssg.tsx',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd',
    globalObject: 'this',
    clean: true,
  },
  devtool: 'source-map',
  resolve: {
    fallback: {
      fs: false,
      path: require.resolve('path-browserify'),
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer/'),
    },
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\\.tsx?$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
      {
        test: /\\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
      {
        test: /\\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'scss-loader'],
      },
    ],
  },
  plugins: [
    new StaticSiteGeneratorPlugin({
      entry: 'ssg',
      paths: data.routes,
      locals: {
        data: data,
      },
      globals: {
        window: {},
      },
    }),
    new TemplateWrapperPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
};
`}
        title={'webpack.config.js'}
      />
      <p>
        All of these files working together with the following directory
        structure:
      </p>
      <br />
      <CodeBlock
        showLineNumbers={false}
        className=""
        title="Directory Structure (src/pages)"
        language="bash"
        code={`src/pages
├── _posts.stories.tsx
├── _posts.tsx
├── contact.tsx
├── index.tsx
└── posts
    ├── a11y.tsx
    ├── authn.tsx
    ├── functional.tsx
    ├── hire_me.tsx
    ├── init.tsx
    ├── js_modules.tsx
    └── ssg.tsx

2 directories, 11 files`}
      />
      <p>Will produce this dist folder</p>
      <CodeBlock
        showLineNumbers={false}
        className=""
        title="Directory Structure (dist)"
        language="bash"
        code={`dist
├── contact
│   └── index.html
├── index.html
├── main.css
├── main.css.map
├── main.js
├── main.js.map
├── posts
│   ├── a11y
│   │   └── index.html
│   ├── authn
│   │   └── index.html
│   ├── functional
│   │   └── index.html
│   ├── hire_me
│   │   └── index.html
│   ├── init
│   │   └── index.html
│   ├── js_modules
│   │   └── index.html
│   └── ssg
│       └── index.html
├── ssg.css
├── ssg.css.map
├── ssg.js
└── ssg.js.map

10 directories, 17 files`}
      />
      <h3 className="comment-green"># Client Side Hydration</h3>
      <p>
        The static site generator uses the entry point ssg.tsx to generate the
        markup. The client side hydration is handled by the entry point csr.tsx.
        In order for the hydration to go off without a hitch ssg.tsx and csr.tsx
        need to generate the exact same string of valid html.
      </p>
      <br />
      <CodeBlock
        title="ssg.tsx"
        code={`import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import Root from './components/core/Root';
import './main.css';

interface Locals {
  path: string;
  [key: string]: any;
}

export default function (locals: Locals) {
  const html = renderToStaticMarkup(
    <StaticRouter location={locals.path}>
      <Root />
    </StaticRouter>,
  );

  return \`\${html}\`; // Ensure it returns a valid HTML string
}
`}
      />
      <CodeBlock
        title="csr.tsx"
        code={`import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Root from './components/core/Root';
import './main.css';

const container = document.getElementById('root');

export function hydrateApp(container: HTMLElement | null) {
  if (container) {
    hydrateRoot(
      container,
      <BrowserRouter>
        <Root />
      </BrowserRouter>,
    );
  }
}

hydrateApp(container);
`}
      />
    </Post>
  );
};

export default SSG;

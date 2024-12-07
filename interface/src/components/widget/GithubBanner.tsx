import React from 'react';
import '../../main.css';
interface GitHubBannerProps {
  link?: string;
}

const GitHubBanner: React.FC<GitHubBannerProps> = ({ link }) => {
  return (
    <div
      style={{
        width: '20em',
        backgroundColor: 'black',
        position: 'absolute',
        top: 0,
        right: 0,
        transform: 'translate(35%, 115%) rotate(45deg)',
        transformOrigin: 'center center',
        margin: '-2em 0 0 0',
        border: '8px solid black',
        float: 'right',
      }}
    >
      <div
        style={{
          border: '2px solid white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '1em',
          height: '2em',
        }}
      >
        <a href="https://www.github.com/JonZudell/zudellio">GitHub!</a>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="white"
          style={{ marginLeft: '0.5em' }}
        >
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.744.083-.729.083-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.835 2.807 1.305 3.492.998.108-.775.418-1.305.76-1.605-2.665-.305-5.466-1.332-5.466-5.93 0-1.31.467-2.38 1.235-3.22-.123-.303-.535-1.527.117-3.176 0 0 1.008-.322 3.3 1.23.957-.266 1.983-.399 3.005-.404 1.02.005 2.048.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.649.241 2.873.118 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.803 5.62-5.475 5.92.43.37.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.218.694.825.576 4.765-1.588 8.2-6.084 8.2-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      </div>
    </div>
  );
};

export default GitHubBanner;

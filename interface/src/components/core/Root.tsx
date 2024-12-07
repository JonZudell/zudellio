import React from 'react';
import Paths from './Paths';
import Content from './Content';
import Header from './Header';
import Footer from './Footer';
import { ThemeProvider } from '../../contexts/ThemeProvider';
import GitHubBanner from '../widget/GithubBanner';

const Root: React.FC = () => (
  <ThemeProvider>
    <GitHubBanner />
    <Header />
    <Content>
      <Paths />
    </Content>
    <Footer />
  </ThemeProvider>
);

export default Root;

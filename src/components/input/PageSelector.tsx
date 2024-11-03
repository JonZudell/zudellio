import React from 'react';
import Button from './Button';
import './PageSelector.css';

interface PageSelectorProps {
  pages: number;
  setPage: (page: number) => void;
}

const PageSelector: React.FC<PageSelectorProps> = ({ pages, setPage }) => {

  return (
    <div className="flex justify-center mt-4">
      {Array.from({ length: pages }, (_, i) => (
        <Button
          key={i}
          className={``}
          onClick={() => setPage(i)}
          text={i.toString()}
          decorationLeft='['
          decorationRight=']'

        >
        </Button>
      ))}
    </div>
  );
};

export default PageSelector;
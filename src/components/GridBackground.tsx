import React, { ReactNode } from 'react';

interface GridBackgroundProps {
    children?: ReactNode;
}

const GridBackground: React.FC<GridBackgroundProps> = ({ children }) => {
    return (
        <div className="grid-background">
            {children}
            <style jsx>{`
        .grid-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: #f0f0f0;
          background-image:
            linear-gradient(to right, #e0e0e0 1px, transparent 1px),
            linear-gradient(to bottom, #e0e0e0 1px, transparent 1px);
          background-size: 20px 20px;
          z-index: 0;
        }
        .grid-background::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image:
            linear-gradient(to right, #d0d0d0 1px, transparent 1px),
            linear-gradient(to bottom, #d0d0d0 1px, transparent 1px);
          background-size: 100px 100px;
          z-index: 1;
        }
      `}</style>
        </div>
    );
};

export default GridBackground;
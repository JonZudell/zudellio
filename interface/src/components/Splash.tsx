import React, { CSSProperties, ReactNode } from 'react';

// Define the props interface
interface SplashProps {
    children: ReactNode;
}

// Create the Splash component
const Splash: React.FC<SplashProps> = ({ children }) => {
    return (
        <div style={styles.container}>
            <div style={styles.content}>
                {children}
            </div>
        </div>
    );
};

// Define basic styles
const styles: { [key: string]: CSSProperties } = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f0f0',
    },
    content: {
        textAlign: 'center',
    },
};

export default Splash;
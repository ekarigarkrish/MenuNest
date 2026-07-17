import React from "react";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

const Container = React.memo(React.forwardRef<HTMLDivElement, ContainerProps>(
    ({ children, className = "", ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}
                {...props}
            >
                {children}
            </div>
        );
    }
));

export default Container;
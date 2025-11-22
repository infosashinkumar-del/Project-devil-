import React, { useEffect, useState } from 'react';

interface CountUpProps {
    end: number;
    duration?: number;
    prefix?: string;
    decimals?: number;
    className?: string;
}

export const CountUp: React.FC<CountUpProps> = ({ end, duration = 1500, prefix = '', decimals = 2, className = '' }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime: number | null = null;
        let animationFrame: number;

        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            
            // EaseOutCubic
            const ease = 1 - Math.pow(1 - progress, 3);
            
            setCount(ease * end);

            if (progress < 1) {
                animationFrame = requestAnimationFrame(step);
            }
        };

        animationFrame = requestAnimationFrame(step);
        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration]);

    return (
        <span className={className}>
            {prefix}{count.toFixed(decimals)}
        </span>
    );
};
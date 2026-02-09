
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const Particles = () => {
    const particles = useMemo(() => {
        return Array.from({ length: 25 }).map((_, i) => ({
            id: i,
            size: Math.random() * 15 + 5,
            x: Math.random() * 100,
            y: Math.random() * 100,
            duration: Math.random() * 20 + 10,
            delay: Math.random() * 10,
            color: i % 2 === 0 ? '#f472b6' : '#8b5cf6' // pink or purple
        }));
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full blur-[1px]"
                    style={{
                        width: p.size,
                        height: p.size,
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        backgroundColor: p.color,
                        opacity: 0.15,
                    }}
                    animate={{
                        y: [0, -100, 0],
                        x: [0, Math.random() * 50 - 25, 0],
                        opacity: [0.1, 0.3, 0.1],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        delay: p.delay,
                        ease: "linear"
                    }}
                />
            ))}
        </div>
    );
};

export default Particles;

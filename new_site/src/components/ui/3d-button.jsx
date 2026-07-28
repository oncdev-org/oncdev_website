import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

export const Button3D = ({
  children,
  onClick,
  href,
  className = "",
  as = "button",
  ...props
}) => {
  const buttonRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Calculate tilt angles max 15 degrees
    const rY = ((mouseX - width / 2) / (width / 2)) * 15;
    const rX = -((mouseY - height / 2) / (height / 2)) * 15;

    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const Component = motion[as] || motion.button;

  return (
    <div style={{ perspective: "800px" }} className="inline-block">
      <Component
        ref={buttonRef}
        href={href}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateX: rotateX,
          rotateY: rotateY,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
        }}
        style={{
          transformStyle: "preserve-3d",
        }}
        className={`relative inline-flex items-center justify-center transition-shadow duration-300 ${className}`}
        {...props}
      >
        <span style={{ transform: "translateZ(12px)" }} className="inline-flex items-center gap-2">
          {children}
        </span>
      </Component>
    </div>
  );
};

import React, { useEffect, useRef, useState } from "react";
import "./GeometricBackground.scss";

export const GeometricBackground = ({ isAnimating }) => {
  const [lengths, setLengths] = useState([0, 0, 0]);
  const pathsRef = [useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    const newLengths = pathsRef.map((ref) => {
      if (ref.current) {
        return ref.current.getTotalLength();
      }
      return 0;
    });
    setLengths(newLengths);
  }, []);

  return (
    <div className="geometric-background">
      <svg viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Top Line */}
        <path
          ref={pathsRef[0]}
          d="M0 150C300 80 600 200 900 120C1200 180 1400 100 1600 160C1920 80 1920 80 1920 80"
          stroke="#a07850"
          strokeWidth="1"
          style={{
            strokeDasharray: lengths[0],
            strokeDashoffset: isAnimating ? lengths[0] : 0,
            transition: isAnimating ? "none" : "stroke-dashoffset 1.2s ease-out",
            "--line-length": lengths[0],
            animation: isAnimating ? "bronzeLineDraw 1.2s ease-out forwards" : "none",
          }}
        />
        {/* Middle Line */}
        <path
          ref={pathsRef[1]}
          d="M0 400C400 500 800 380 1200 480C1600 420 1920 500 1920 500"
          stroke="#a07850"
          strokeWidth="1"
          style={{
            strokeDasharray: lengths[1],
            strokeDashoffset: isAnimating ? lengths[1] : 0,
            transition: isAnimating ? "none" : "stroke-dashoffset 1.2s ease-out",
            "--line-length": lengths[1],
            animation: isAnimating ? "bronzeLineDraw 1.2s ease-out 0.2s forwards" : "none",
          }}
        />
        {/* Bottom Line */}
        <path
          ref={pathsRef[2]}
          d="M200 800C600 700 1000 780 1400 720C1920 800 1920 800 1920 800"
          stroke="#a07850"
          strokeWidth="1"
          style={{
            strokeDasharray: lengths[2],
            strokeDashoffset: isAnimating ? lengths[2] : 0,
            transition: isAnimating ? "none" : "stroke-dashoffset 1.2s ease-out",
            "--line-length": lengths[2],
            animation: isAnimating ? "bronzeLineDraw 1.2s ease-out 0.4s forwards" : "none",
          }}
        />
      </svg>
    </div>
  );
};

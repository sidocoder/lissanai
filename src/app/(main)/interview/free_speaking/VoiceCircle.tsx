import React, { useEffect, useRef } from "react";
import styles from "./VoiceCircle.module.css";

type ConversationState = "idle" | "recording" | "processing" | "responding";

interface VoiceCircleProps {
  state: ConversationState;
  onClick: () => void;
  userVolume: number; // New prop: Real-time volume of the user's voice (0-1)
  aiAudioElement: HTMLAudioElement | null; // New prop: The AI's audio element to visualize
}

// Helper function to create a smooth blob SVG path
const generateBlobPath = (radii: number[]): string => {
  const center = 50;
  const numPoints = radii.length;
  const angleStep = (2 * Math.PI) / numPoints;
  let path = `M ${center + radii[0]} ${center}`;
  for (let i = 1; i < numPoints; i++) {
    const r = radii[i];
    const angle = i * angleStep;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    path += ` L ${x} ${y}`;
  }
  path += " Z";
  return path;
};

const VoiceCircle: React.FC<VoiceCircleProps> = ({
  state,
  onClick,
  userVolume,
  aiAudioElement,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const blobPathRef = useRef<SVGPathElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const audioContextRef = useRef<AudioContext | undefined>(undefined);
  const analyserRef = useRef<AnalyserNode | undefined>(undefined);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | undefined>(
    undefined
  );

  // Effect for scaling the circle based on user's voice volume
  useEffect(() => {
    if (state === "recording" && containerRef.current) {
      // Scale goes from 100% to 115% based on volume
      const scale = 1 + userVolume * 0.15;
      containerRef.current.style.transform = `scale(${scale})`;
    } else if (containerRef.current) {
      // Return to normal size when not recording
      containerRef.current.style.transform = `scale(1)`;
    }
  }, [userVolume, state]);

  // Effect for visualizing the AI's audio with the blob animation
  useEffect(() => {
    if (state === "responding" && aiAudioElement && blobPathRef.current) {
      // --- Setup Audio Analysis ---
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 64;
      }
      if (
        !sourceNodeRef.current ||
        sourceNodeRef.current.mediaElement !== aiAudioElement
      ) {
        sourceNodeRef.current =
          audioContextRef.current.createMediaElementSource(aiAudioElement);
        sourceNodeRef.current.connect(analyserRef.current!);
        analyserRef.current!.connect(audioContextRef.current.destination);
      }

      const analyser = analyserRef.current!;
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const numPoints = 16;
      const radii = new Array(numPoints).fill(48);
      const targetRadii = new Array(numPoints).fill(48);

      // --- Animation Loop ---
      const animate = () => {
        analyser.getByteFrequencyData(dataArray);
        for (let i = 0; i < numPoints; i++) {
          const dataIndex = Math.floor((dataArray.length / numPoints) * i);
          const freqValue = dataArray[dataIndex];
          const radiusOffset = (freqValue / 255) * 10; // Max 10px offset
          targetRadii[i] = 48 + radiusOffset;
        }
        for (let i = 0; i < numPoints; i++) {
          // Smoothly ease the current radius towards the target
          radii[i] += (targetRadii[i] - radii[i]) * 0.2;
        }
        if (blobPathRef.current) {
          blobPathRef.current.setAttribute("d", generateBlobPath(radii));
        }
        animationFrameRef.current = requestAnimationFrame(animate);
      };
      animate();
    } else if (blobPathRef.current) {
      // --- Cleanup and Reset ---
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      // Animate back to a perfect circle
      blobPathRef.current.setAttribute(
        "d",
        "M 50, 50 m -48, 0 a 48,48 0 1,0 96,0 a 48,48 0 1,0 -96,0"
      );
    }

    // Cleanup function when component unmounts or state changes
    return () => {
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
      if (sourceNodeRef.current) sourceNodeRef.current.disconnect();
      sourceNodeRef.current = undefined;
    };
  }, [state, aiAudioElement]);

  const stateClass =
    styles[`state${state.charAt(0).toUpperCase() + state.slice(1)}`];

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${stateClass}`}
      onClick={onClick}
    >
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <linearGradient
            id="speaking-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" style={{ stopColor: "#4285F4" }} />
            <stop offset="100%" style={{ stopColor: "#34A853" }} />
          </linearGradient>
        </defs>
      </svg>

      <svg className={styles.blobSvg} viewBox="0 0 100 100">
        {/* Default shape is a perfect circle */}
        <path
          ref={blobPathRef}
          className={styles.blobPath}
          d="M 50, 50 m -48, 0 a 48,48 0 1,0 96,0 a 48,48 0 1,0 -96,0"
        />

        {/* The processing spinner, only visible in the processing state */}
        {state === "processing" && (
          <circle
            className={styles.processingSpinner}
            cx="50"
            cy="50"
            r="45"
            strokeDasharray="200"
            strokeDashoffset="150"
          />
        )}
      </svg>

      <svg
        className={styles.micIcon}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 384 512"
      >
        <path d="M192 0C139 0 96 43 96 96V256c0 53 43 96 96 96s96-43 96-96V96c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 89.1 66.2 162.7 152 174.4V464H120c-13.3 0-24 10.7-24 24s10.7 24 24 24h144c13.3 0 24-10.7 24-24s-10.7-24-24-24H200V430.4c85.8-11.7 152-85.3 152-174.4V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 70.7-57.3 128-128 128s-128-57.3-128-128V216z" />
      </svg>
    </div>
  );
};

export default VoiceCircle;

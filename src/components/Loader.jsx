import { useEffect, useId } from "react";
import { motion, useAnimation, useReducedMotion } from "framer-motion";
import clsx from "clsx";

export default function Loader({ className, onFinished }) {
  const controls = useAnimation();
  const shouldReduceMotion = useReducedMotion();
  const clipId = useId();

  useEffect(() => {
    if (shouldReduceMotion) {
      (async () => {
        await Promise.all([
          controls.start("cupVisible", { transition: { duration: 0 } }),
          controls.start("strawVisible", { transition: { duration: 0 } }),
          controls.start("liquidFull", { transition: { duration: 0 } }),
          controls.start("bubblesVisible", { transition: { duration: 0 } }),
          controls.start("checkVisible", { transition: { duration: 0 } }),
        ]);
        onFinished?.();
      })();
      return;
    }

    const sequence = async () => {
      await controls.start("cupVisible");
      await controls.start("strawVisible");

      controls.start("liquidFull");

      setTimeout(() => controls.start("bubblesVisible"), 600);

      await new Promise((resolve) => setTimeout(resolve, 1500));
      await controls.start("strawSip");

      await controls.start("checkVisible");

      setTimeout(() => onFinished?.(), 500);
    };

    sequence();

    return () => controls.stop();
  }, [controls, shouldReduceMotion, onFinished]);

  const variants = {
    cup: {
      hidden: { opacity: 0, scale: 0.95 },
      cupVisible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5, ease: "easeOut" }
      }
    },
    straw: {
      hidden: { y: -20, opacity: 0 },
      strawVisible: {
        y: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 200, damping: 20 }
      },
      strawSip: {
        y: [0, 3, 0],
        transition: { duration: 0.4, ease: "easeInOut" }
      }
    },
    liquid: {
      hidden: { y: 60 },
      liquidFull: {
        y: 15,
        transition: { duration: 1.8, ease: "easeInOut" }
      }
    },
    bubbles: {
      hidden: { opacity: 0, y: 5 },
      bubblesVisible: {
        opacity: [0, 1, 0],
        y: -15,
        transition: { duration: 1.5, repeat: 1, times: [0, 0.5, 1] }
      }
    },
    check: {
      hidden: { opacity: 0, scale: 0.5, rotate: -20 },
      checkVisible: {
        opacity: 1,
        scale: 1,
        rotate: 0,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }
    }
  };

  return (
    <div className={clsx("fixed inset-0 z-50 bg-white flex items-center justify-center", className)}>
      <div className="w-64 h-64">
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          fill="none"
          stroke="#1a1a1a"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full overflow-visible"
          role="img"
          aria-label="Loading animation: pouring drink"
          initial="hidden"
          animate={controls}
        >
          <defs>
            <clipPath id={clipId}>
              <path d="M31 30 L33.5 78 Q34 83 39 83 H61 Q66 83 66.5 78 L69 30" />
            </clipPath>
          </defs>

          <motion.g variants={variants.cup}>
            <path
              d="M30 30 L32.5 78 Q33 84 39 84 H61 Q67 84 67.5 78 L70 30"
              fill="#ffffff"
            />
          </motion.g>

          <g clipPath={`url(#${clipId})`}>
            <motion.g variants={variants.liquid}>
              <path d="M20 50 V100 H80 V50" fill="#00BFA6" stroke="none" />
              <path d="M20 50 Q35 45 50 50 T80 50" fill="#00BFA6" stroke="none" />
              <path d="M31 50 Q40 46 50 50 T69 50" stroke="#00BFA6" strokeWidth="1.5" fill="none" />
            </motion.g>
          </g>

          <motion.g variants={variants.straw}>
            <path d="M58 20 L48 80" stroke="#1a1a1a" strokeWidth="3" />
            <path d="M58 20 L48 80" stroke="white" strokeWidth="1" opacity="0.8" />
          </motion.g>

          <motion.g variants={variants.bubbles}>
            <circle cx="45" cy="70" r="1.5" fill="#1a1a1a" stroke="none" />
            <circle cx="52" cy="65" r="1.2" fill="#1a1a1a" stroke="none" style={{ transform: "translate(4px, -2px)" }} />
          </motion.g>

          <motion.g variants={variants.check}>
            <circle cx="80" cy="20" r="8" fill="#00BFA6" stroke="none" />

            <path d="M76 20 L79 23 L84 17" stroke="white" strokeWidth="1.5" fill="none" />
          </motion.g>
        </motion.svg>
      </div>
    </div>
  );
}
import React, { useState, useEffect, useRef } from 'react';

/**
 * CountUp Component
 * Animates a numeric counter smoothly from 0 to the target value
 * when the element scrolls into view or on page load/reload.
 *
 * @param {string|number} value - Target value (e.g. "30", "6,800", 3500)
 * @param {string} suffix - Suffix string (e.g. "+", "%", "K")
 * @param {string} prefix - Prefix string (e.g. "$")
 * @param {number} duration - Animation duration in ms (default: 2000ms)
 * @param {string} className - Additional CSS classes
 */
export default function CountUp({
  value,
  suffix = '',
  prefix = '',
  duration = 2000,
  className = '',
}) {
  const [displayValue, setDisplayValue] = useState('0');
  const [inView, setInView] = useState(false);
  const elementRef = useRef(null);
  const animationRef = useRef(null);

  // Trigger intersection observer when element enters viewport
  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    if (!('IntersectionObserver' in window)) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -20px 0px',
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Run the count-up animation
  useEffect(() => {
    if (!inView) return;

    const rawStr = String(value ?? '').trim();
    if (!rawStr) {
      setDisplayValue('0');
      return;
    }

    // Extract suffix from value if embedded (e.g. "30+" or "100%")
    let valClean = rawStr;
    let extraSuffix = '';
    const suffixMatch = valClean.match(/[+%kKmMbB]$/);
    if (suffixMatch && !suffix) {
      extraSuffix = suffixMatch[0];
      valClean = valClean.slice(0, -1).trim();
    }

    const hasCommas = valClean.includes(',');
    const numericStr = valClean.replace(/,/g, '');
    const targetNumber = parseFloat(numericStr);

    // If non-numeric (e.g. text string), display directly
    if (isNaN(targetNumber)) {
      setDisplayValue(rawStr);
      return;
    }

    // Detect decimal precision
    const decimalMatch = numericStr.match(/\.(\d+)/);
    const decimalPlaces = decimalMatch ? decimalMatch[1].length : 0;

    const startNumber = 0;
    const startTime = performance.now();

    const formatNumber = (num, isComplete = false) => {
      if (decimalPlaces > 0) {
        return isComplete ? targetNumber.toFixed(decimalPlaces) : num.toFixed(decimalPlaces);
      }
      const rounded = isComplete ? Math.round(targetNumber) : Math.floor(num);
      if (hasCommas) {
        return rounded.toLocaleString('en-US');
      }
      return String(rounded);
    };

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth ease-out curve (fast initial climb, elegant deceleration)
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentVal = startNumber + (targetNumber - startNumber) * easeOut;

      if (progress < 1) {
        setDisplayValue(formatNumber(currentVal, false));
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(formatNumber(targetNumber, true));
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [inView, value, duration, suffix]);

  return (
    <span ref={elementRef} className={className}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
}

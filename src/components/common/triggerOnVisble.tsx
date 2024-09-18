import React, { useRef, useEffect, useState, ComponentProps } from "react";
export interface Props extends ComponentProps<"div"> {
  onVisible: () => any;
}
const TriggerOnVisible = ({ onVisible, ...props }: Props) => {
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // If the component is visible
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (onVisible) {
            onVisible();
          }
        } else {
          setIsVisible(false);
        }
      },
      { threshold: 0.1 } // Adjust this for the percentage of visibility needed
    );

    // Observe the element
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    // Cleanup the observer on unmount
    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [onVisible]);

  return <div {...props} ref={elementRef}></div>;
};

export default TriggerOnVisible;

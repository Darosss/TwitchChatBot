import React, { Children, useEffect, useRef, useState } from "react";

const SLIDE_DELAY = 9999;

export default function Slideshow(props: {
  children?: React.ReactNode;
  className?: string;
  styleWrapper?: React.CSSProperties;
}) {
  const { children, className = "", styleWrapper = { width: "50vw" } } = props;
  const arrayChildren = Children.toArray(children);

  const [index, setIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [slideShowOn, setSlideShowOn] = useState(true);

  const toggleSlideShow = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setSlideShowOn(!slideShowOn);
    e.currentTarget.innerHTML = `${slideShowOn ? "&#9632;" : "&#9654;"}`;
  };

  useEffect(() => {
    function resetTimeout() {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }

    const startTimeout = () => {
      timeoutRef.current = setTimeout(
        () =>
          setIndex((prevIndex) =>
            prevIndex === arrayChildren.length - 1 ? 0 : prevIndex + 1
          ),
        SLIDE_DELAY
      );
    };
    if (slideShowOn) {
      startTimeout();
    }

    return () => {
      resetTimeout();
    };
  }, [arrayChildren, index, slideShowOn]);

  if (!children) return <></>;

  return (
    <div style={styleWrapper} className={`slideshow-wrapper ${className}`}>
      <div className="slideshow">
        <div
          className="slideshow-slider"
          style={{
            transform: `translate3d(${-index * 100}%, 0, 0)`,
            width: `100%`,
          }}
        >
          <div className="slide">
            {arrayChildren.map((children, indx) => {
              return <React.Fragment key={indx}>{children}</React.Fragment>;
            })}
          </div>
        </div>

        <div className="slideshow-dots">
          {arrayChildren.map((_, idx) => (
            <div
              key={idx}
              className={`slideshow-dot${index === idx ? " active" : ""}`}
              onClick={() => {
                setIndex(idx);
              }}
            ></div>
          ))}
          <div className="slideshow-button-wrapper">
            <button
              className="common-button primary-button"
              onClick={(e) => {
                toggleSlideShow(e);
              }}
            >
              &#9654;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

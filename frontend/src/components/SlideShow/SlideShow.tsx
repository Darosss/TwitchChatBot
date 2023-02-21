import "./style.css";

import React, { Children, useRef, useState } from "react";

const SLIDE_DELAY = 1234;

export default function Slideshow(props: { children?: React.ReactNode }) {
  const { children } = props;
  const arrayChildren = Children.toArray(children);

  const [index, setIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [slideShowOn, setSlideShowOn] = useState(true);

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

  const toggleSlideShow = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setSlideShowOn(!slideShowOn);
    e.currentTarget.innerHTML = `${slideShowOn ? "&#9632;" : "&#9654;"}`;
  };

  React.useEffect(() => {
    if (slideShowOn) {
      startTimeout();
    }

    return () => {
      resetTimeout();
    };
  }, [index, slideShowOn]);

  return (
    <div className="slideshow">
      <div
        className="slideshow-slider"
        style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}
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
        <div className="slideshow-button">
          <button
            onClick={(e) => {
              toggleSlideShow(e);
            }}
          >
            &#9654;
          </button>
        </div>
      </div>
    </div>
  );
}

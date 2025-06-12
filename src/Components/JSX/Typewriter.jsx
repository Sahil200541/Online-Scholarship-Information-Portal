import React, { useEffect, useRef } from 'react';
import '../CSS/Typewriter.css';

const Typewriter = ({ texts, period = 2000 }) => {
  const elementRef = useRef(null);
  const loopNumRef = useRef(0);
  const isDeletingRef = useRef(false);
  const txtRef = useRef('');
  const deltaRef = useRef(200);

  useEffect(() => {
    const tick = () => {
      const i = loopNumRef.current % texts.length;
      const fullTxt = texts[i];

      if (isDeletingRef.current) {
        txtRef.current = fullTxt.substring(0, txtRef.current.length - 1);
      } else {
        txtRef.current = fullTxt.substring(0, txtRef.current.length + 1);
      }

      if (elementRef.current) {
        elementRef.current.innerHTML = `<span class="wrap">${txtRef.current}</span>`;
      }

      let delta = 200 - Math.random() * 100;

      if (isDeletingRef.current) {
        delta /= 2;
      }

      if (!isDeletingRef.current && txtRef.current === fullTxt) {
        delta = 3000;
        isDeletingRef.current = true;
      } else if (isDeletingRef.current && txtRef.current === '') {
        isDeletingRef.current = false;
        loopNumRef.current++;
        delta = 500;
      }

      setTimeout(tick, delta);
    };

    tick();
  }, [texts, period]);

  return (
    <h1>
      <a href="" className="typewrite" ref={elementRef}>
        <span className="wrap"></span>
      </a>
    </h1>
  );
};

export default Typewriter; 
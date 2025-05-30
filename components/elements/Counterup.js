'use client'
import { useState } from 'react';
import CountUp from "react-countup";
import ScrollTrigger from 'react-scroll-trigger';

export default function CounterUp({ count, time }) {
    const [counterOn, setCounterOn] = useState(false);
    return (
        <>
            <ScrollTrigger onEnter={() => setCounterOn(true)} onExit={() => setCounterOn(false)} >
                <CountUp end={count} duration={time} redraw={true}>
                    {({ countUpRef }) => (
                        <h3 ref={countUpRef}/>
                    )}
                </CountUp>
            </ScrollTrigger>
        </>
    );
}
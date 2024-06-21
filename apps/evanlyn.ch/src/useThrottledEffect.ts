import { useEffect, useRef } from "react"


export const useThrottledEffect = (effect: () => void, delay: number, runOnPageClose=false) => {
    const effectCalls = useRef<{
        lastEffect: () => void;
        timerId?: NodeJS.Timeout;
        lastCallTime: number | null;
    }>({ lastEffect: effect, lastCallTime: null});

    useEffect(() => {
        effectCalls.current.lastEffect = effect;
    }, [effect]);

    useEffect(() => {
        const handle = () => {
            const now = Date.now();
            const timeSinceLastCall = now - (effectCalls.current.lastCallTime ?? 0);
            const timeToNextCall = delay - timeSinceLastCall;

            // clear the previous timeout because we are potentially handling it now
            if (effectCalls.current.timerId !== undefined) {
                clearTimeout(effectCalls.current.timerId);
            }

            // if we have waited long enough, call the effect now
            if (timeToNextCall >= delay) {
                effectCalls.current.lastEffect();
                effectCalls.current.lastCallTime = now;
            }
            // otherwise schedule it for the remaining time since the last call
            effectCalls.current.timerId = setTimeout(() => {
                effectCalls.current.lastEffect();
                effectCalls.current.lastCallTime = Date.now();
                effectCalls.current.timerId = undefined;
            }, timeToNextCall);
        };

        // if this is the first call, call the effect immediately
        if (effectCalls.current.lastCallTime === null) {
            effect();
            effectCalls.current.lastCallTime = Date.now();
        } else {
            handle();
        }

        // Function to run effect immediately
        const runEffectBeforePageClose = (event: BeforeUnloadEvent) => {
            if (effectCalls.current.timerId !== undefined) {
                effectCalls.current.lastEffect();
                // Prevent the default action to ensure the effect has time to run
                // Note: Modern browsers might not display this message
                event.returnValue = "Changes you made may not be saved.";
            }
        };

        // Attach the event listener if runOnPageClose is true
        if (runOnPageClose) {
            window.addEventListener("beforeunload", runEffectBeforePageClose);
        }

        return () => {
            // We don't worry about whether timerId has changed since the effect was called
            // because we only need to worry about cleaning up the last timerId
            // eslint-disable-next-line react-hooks/exhaustive-deps
            const currentTimerId = effectCalls.current.timerId;
            if (currentTimerId !== undefined) {
                clearTimeout(currentTimerId);
            }

            if (runOnPageClose) {
                window.removeEventListener("beforeunload", runEffectBeforePageClose);
            }
        }
    }, [delay, effect, runOnPageClose])
}

import { useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';

const MENU_OPEN_EVENT = 'littlelemon:menu-open';

export default function useAnimatedPanel({ id, isOpen, panelRef, buttonRef, containerRef }) {
    const timelineRef = useRef(null);
    const isInitialised = useRef(false);
    const closeFnRef = useRef(null);

    // Collapse panel on first paint
    useEffect(() => {
        const timer = setTimeout(() => {
            if (panelRef.current) {
                gsap.set(panelRef.current, { height: 0, opacity: 0, overflow: 'hidden' });
            }
            isInitialised.current = true;
        }, 0);
        return () => clearTimeout(timer);
    }, [panelRef]);

    const animatePanel = useCallback((isOpening, focusButton = true) => {
        const panel = panelRef.current;
        if (!panel || !isInitialised.current) return;

        if (timelineRef.current) timelineRef.current.kill();

        const tl = gsap.timeline();
        timelineRef.current = tl;

        if (isOpening) {
            gsap.set(panel, { height: 'auto', overflow: 'hidden' });
            const naturalHeight = panel.offsetHeight;
            gsap.set(panel, { height: 0 });

            tl.to(panel, { height: naturalHeight, duration: 0.3, ease: 'power2.out' })
              .to(panel, { opacity: 1, duration: 0.2, ease: 'power2.out' }, '-=0.1')
              .set(panel, { height: 'auto' });
        } else {
            tl.to(panel, { opacity: 0, duration: 0.15, ease: 'power2.in' })
              .to(panel, {
                  height: 0,
                  duration: 0.25,
                  ease: 'power2.in',
                  onComplete: () => { if (focusButton) buttonRef.current?.focus(); }
              }, '-=0.05');
        }
    }, [panelRef, buttonRef]);

    // Close when another menu broadcasts open
    useEffect(() => {
        const handler = (e) => {
            if (e.detail?.sourceId === id) return;
            closeFnRef.current?.(false);
        };
        window.addEventListener(MENU_OPEN_EVENT, handler);
        return () => window.removeEventListener(MENU_OPEN_EVENT, handler);
    }, [id]);

    // Close on click outside
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                closeFnRef.current?.(false);
            }
        };
        document.addEventListener('click', handler);
        return () => document.removeEventListener('click', handler);
    }, [isOpen, containerRef]);

    // Kill running animation on unmount
    useEffect(() => () => { timelineRef.current?.kill(); }, []);

    const broadcastOpen = useCallback(() => {
        window.dispatchEvent(new CustomEvent(MENU_OPEN_EVENT, { detail: { sourceId: id } }));
    }, [id]);

    return { animatePanel, broadcastOpen, closeFnRef };
}

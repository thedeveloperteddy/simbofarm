import { useEffect, useRef, useState } from 'react';

// Easing function for smooth animations (similar to Three.js easing)
const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);
const easeInOutQuad = (t: number): number => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

export function ScrollVideoBackground() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isVideoReady, setIsVideoReady] = useState(false);
    const animationFrameRef = useRef<number | null>(null);
    const lastScrollY = useRef(0);
    const scrollVelocity = useRef(0);
    const isMobileScrolling = useRef(false);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Set video properties for smooth playback
        video.muted = true;
        video.loop = true;
        video.preload = 'auto';
        video.playsInline = true;
        // Additional properties for smooth playback
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', '');

        const handleVideoLoad = () => {
            setIsVideoReady(true);
            // Use a slightly higher playback rate for smoother frames
            video.playbackRate = 0.3;
            // Start playing at smooth slow speed
            video.play().catch(console.error);
        };

        const handleScroll = () => {
            // On mobile, only update when not actively scrolling (after touch end)
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            if (isMobile && isMobileScrolling.current) {
                return; // Skip scroll updates during active touch scrolling on mobile
            }

            const scrollTop = window.pageYOffset;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            // Calculate scroll progress with easing
            const rawProgress = Math.min(scrollTop / (documentHeight - windowHeight), 1);
            const easedProgress = easeOutCubic(rawProgress);

            // Calculate scroll velocity for dynamic effects
            const deltaY = scrollTop - lastScrollY.current;
            scrollVelocity.current = scrollVelocity.current * 0.8 + deltaY * 0.2; // Smooth velocity
            lastScrollY.current = scrollTop;

            setScrollProgress(easedProgress);

            // Gentle time control that works with slow playback
            if (video.duration && isVideoReady) {
                const videoDuration = video.duration;
                const baseTime = easedProgress * videoDuration;

                // Add subtle velocity-based offset
                const velocityOffset = (scrollVelocity.current * 0.0005) * videoDuration * 0.05;
                const targetTime = Math.max(0, Math.min(videoDuration, baseTime + velocityOffset));

                // Very gentle interpolation for smooth slow-motion
                const currentTime = video.currentTime;
                const timeDifference = targetTime - currentTime;
                const interpolatedTime = currentTime + (timeDifference * 0.01); // Extremely gentle

                // Only seek if the difference is significant to avoid micro-adjustments
                if (Math.abs(timeDifference) > 0.1) {
                    video.currentTime = Math.max(0, Math.min(videoDuration, interpolatedTime));
                }
            }
        };

        const throttledScroll = () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }

            animationFrameRef.current = requestAnimationFrame(() => {
                handleScroll();
            });
        };

        const handleTouchStart = () => {
            isMobileScrolling.current = true;
        };

        const handleTouchEnd = () => {
            isMobileScrolling.current = false;
            // Update video position after touch ends
            handleScroll();
        };

        // Event listeners
        video.addEventListener('loadeddata', handleVideoLoad);
        window.addEventListener('scroll', throttledScroll, { passive: true });
        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchend', handleTouchEnd, { passive: true });

        // Initial call
        handleScroll();

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            video.removeEventListener('loadeddata', handleVideoLoad);
            window.removeEventListener('scroll', throttledScroll);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isVideoReady]);

    // Calculate dynamic transform based on scroll progress
    const scale = 1 + scrollProgress * 0.1; // Subtle zoom effect
    const opacity = Math.max(0.3, 1 - scrollProgress * 0.2); // Fade effect

    return (
        <div className="fixed inset-0 z-0 overflow-hidden">
            <video
                ref={videoRef}
                className="w-full h-full object-cover transition-transform duration-300 ease-out"
                style={{
                    transform: `scale(${scale})`,
                    opacity: opacity,
                }}
                muted
                playsInline
                preload="auto"
            >
                <source src="/bg-vid/bg.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Dynamic overlay that responds to scroll */}
            <div
                className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30 transition-opacity duration-500"
                style={{
                    opacity: 0.2 + scrollProgress * 0.3,
                }}
            />

            {/* Subtle parallax-like effect overlay */}
            <div
                className="absolute inset-0 bg-gradient-to-r from-orange-900/5 to-blue-900/5 transition-transform duration-700 ease-out"
                style={{
                    transform: `translateY(${scrollProgress * -20}px)`,
                }}
            />
        </div>
    );
}
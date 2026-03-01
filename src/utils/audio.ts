/**
 * Generates a simple beep sound using the Web Audio API.
 * This avoids dependency on external .mp3 files.
 */
export function playTimerBeep() {
    if (typeof window === 'undefined') return;

    try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note

        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);

        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.5);

        // Close context after play
        setTimeout(() => {
            audioCtx.close();
        }, 1000);
    } catch (e) {
        console.error("Web Audio API not supported or blocked:", e);
    }
}

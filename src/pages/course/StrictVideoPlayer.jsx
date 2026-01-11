import React, { useRef, useState, useEffect } from 'react';
import { AlertTriangle, Lock } from 'lucide-react';

export default function StrictVideoPlayer({ videoUrl, settings, onComplete }) {
    const videoRef = useRef(null);
    const [maxTime, setMaxTime] = useState(0);
    const [warning, setWarning] = useState("");

    const handleTimeUpdate = () => {
        if (!videoRef.current) return;
        const current = videoRef.current.currentTime;
        if (current > maxTime) {
            setMaxTime(current);
        }

        // Check verification threshold (e.g. 90%)
        const duration = videoRef.current.duration;
        if (duration > 0 && (current / duration) >= (settings?.minWatchThreshold || 0.9)) {
            onComplete();
        }
    };

    const handleSeeking = () => {
        if (!videoRef.current) return;
        if (settings?.allowSeekForward === false) {
            if (videoRef.current.currentTime > maxTime + 1) { // Tolerance of 1s
                videoRef.current.currentTime = maxTime;
                setWarning("Прескчането на съдържание е забранено за това обучение!");
                setTimeout(() => setWarning(""), 3000);
            }
        }
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', backgroundColor: 'black' }}>
            {warning && (
                <div style={{
                    position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)',
                    backgroundColor: 'rgba(220, 38, 38, 0.9)', color: 'white', padding: '10px 20px',
                    borderRadius: '8px', zIndex: 10, display: 'flex', alignItems: 'center', gap: '10px',
                    fontWeight: 'bold'
                }}>
                    <AlertTriangle size={20} />
                    {warning}
                </div>
            )}

            <video
                ref={videoRef}
                src={videoUrl}
                style={{ width: '100%', height: '100%' }}
                controls
                onTimeUpdate={handleTimeUpdate}
                onSeeking={handleSeeking}
                controlsList="nodownload" // Basic attempt to hide download
            >
                Вашият браузър не поддържа видео.
            </video>
        </div>
    );
}

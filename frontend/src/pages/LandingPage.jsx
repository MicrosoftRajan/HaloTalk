import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';

// --- Part 1: Self-Contained Video Player Components ---
const VideoPlayerContext = React.createContext(null);

const useVideoPlayer = () => {
  const context = useContext(VideoPlayerContext);
  if (!context) {
    throw new Error('useVideoPlayer must be used within a VideoPlayer provider');
  }
  return context;
};

const VideoPlayer = ({ children, style }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true); // Play by default
  const [isMuted, setIsMuted] = useState(true); // Muted by default for autoplay
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (videoRef.current) {
      isPlaying ? videoRef.current.play() : videoRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const togglePlay = () => setIsPlaying(prev => !prev);
  const toggleMute = () => setIsMuted(prev => !prev);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setProgress(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleTimeSeek = (e) => {
    if (videoRef.current) {
      const newTime = Number(e.target.value);
      videoRef.current.currentTime = newTime;
      setProgress(newTime);
    }
  }

  const value = {
    videoRef,
    isPlaying,
    isMuted,
    progress,
    duration,
    togglePlay,
    toggleMute,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleTimeSeek,
  };

  return (
    <VideoPlayerContext.Provider value={value}>
      <div className="relative w-full h-full" style={style}>
        {children}
      </div>
    </VideoPlayerContext.Provider>
  );
};

const VideoPlayerContent = ({ src, autoPlay, className }) => {
  const { videoRef, handleTimeUpdate, handleLoadedMetadata } = useVideoPlayer();
  return (
    <video
      ref={videoRef}
      src={src}
      autoPlay={autoPlay}
      muted // Autoplay works best when muted initially
      loop
      playsInline
      onTimeUpdate={handleTimeUpdate}
      onLoadedMetadata={handleLoadedMetadata}
      className={className}
    />
  );
};

const VideoPlayerControlBar = ({ children, className }) => (
  <div className={className}>{children}</div>
);

const VideoPlayerPlayButton = ({ className }) => {
  const { isPlaying, togglePlay } = useVideoPlayer();
  return (
    <button onClick={togglePlay} className={`text-white focus:outline-none ${className}`}>
      {isPlaying ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
      )}
    </button>
  );
};

const VideoPlayerMuteButton = ({ className }) => {
  const { isMuted, toggleMute } = useVideoPlayer();
  return (
    <button onClick={toggleMute} className={`text-white focus:outline-none ${className}`}>
      {isMuted ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
      )}
    </button>
  );
};

const VideoPlayerTimeRange = ({ className }) => {
  const { progress, duration, handleTimeSeek } = useVideoPlayer();
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return (
    <div className={`w-full flex items-center gap-2 ${className}`}>
      <span className="text-white text-xs font-mono">{formatTime(progress)}</span>
      <input
        type="range"
        min="0"
        max={duration || 0}
        value={progress}
        onChange={handleTimeSeek}
        className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer range-sm"
      />
      <span className="text-white text-xs font-mono">{formatTime(duration)}</span>
    </div>
  );
}

// --- Part 2: Clock Component ---
const Clock = () => {
  // Static date based on user request: Monday, September 22, 2025 at 2:20 PM IST
  const time = new Date('2025-09-22T14:20:00+05:30');
  const dateOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric", timeZone: "Asia/Kolkata" };
  const timeOptions = { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata" };
  const formattedDate = time.toLocaleDateString("en-IN", dateOptions);
  const formattedTime = time.toLocaleTimeString("en-IN", timeOptions);

  return (
    <div className="absolute top-4 left-4 md:top-6 md:left-6 bg-black/50 text-white p-3 rounded-lg shadow-lg text-center backdrop-blur-sm">
      <p className="text-lg md:text-xl font-semibold tracking-wider">{formattedTime}</p>
      <p className="text-xs md:text-sm">{formattedDate}</p>
    </div>
  );
};


// --- Part 3: Video Player Instance ---
const HeroVideoPlayer = () => {
  return (
    <VideoPlayer style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}>
      <VideoPlayerContent
        src="https://videos.pexels.com/video-files/3209828/3209828-hd_1280_720_25fps.mp4"
        autoPlay
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/30"></div>
      <Clock />
      <VideoPlayerControlBar className="absolute bottom-5 left-1/2 flex w-full max-w-2xl -translate-x-1/2 items-center gap-4 px-4 py-2 bg-black/40 rounded-full backdrop-blur-md">
        <VideoPlayerPlayButton className="p-1" />
        <VideoPlayerTimeRange />
        <VideoPlayerMuteButton className="p-1" />
      </VideoPlayerControlBar>
    </VideoPlayer>
  );
};


// --- Part 4: Image Gallery Component ---
const HoverExpandGallery = ({ images, className }) => {
  return (
    <div className={`w-full flex flex-col lg:flex-row gap-4 ${className || ""}`}>
      {images.map((image, index) => (
        <div
          key={index}
          className="relative overflow-hidden rounded-xl shadow-lg group h-64 lg:h-[500px] flex-1 cursor-pointer transition-all duration-700 ease-in-out hover:flex-[5]"
          style={{
            backgroundImage: `url(${image.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 group-hover:from-black/60 transition-all duration-500"></div>
          <div className="relative z-10 w-full h-full flex flex-col justify-end p-6 text-white">
            <h3 className="text-2xl font-bold transition-transform duration-500 transform group-hover:-translate-y-10">
              {image.code}
            </h3>
            <div className="opacity-0 max-w-xs transition-all duration-500 group-hover:opacity-100 group-hover:delay-200 space-y-2">
              <p className="text-lg font-semibold">{image.alt.split(".")[0]}.</p>
              <p className="text-sm text-gray-300">{image.alt}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- Part 5: Image Data ---
const galleryImages = [
  { src: "/anime1.jpg", alt: "A bustling street in Tokyo at night, vibrant with neon signs.", code: "#01" },
  { src: "/anime2.jpeg", alt: "A tranquil scene of a Japanese temple with autumn leaves.", code: "#02" },
  { src: "/anime3.jpg", alt: "A stunning view of Mount Fuji towering over a cityscape.", code: "#03" },
  { src: "/anime4.jpg", alt: "A detailed shot of a delicious bowl of ramen noodles.", code: "#04" },
  { src: "/anime5.jpg", alt: "An urban exploration shot of a quiet alleyway at dusk.", code: "#05" },
];

// --- Part 6: Crowd/Peeps Components ---
const CrowdCanvas = ({ src, rows, cols }) => {
  const peeps = useMemo(() => {
    const peepList = [];
    for (let i = 0; i < rows * cols; i++) {
      peepList.push({
        x: (i % cols),
        y: Math.floor(i / cols),
        delay: `${Math.random() * 2}s`,
        duration: `${3 + Math.random() * 3}s`,
      });
    }
    return peepList;
  }, [rows, cols]);

  return (
    <div className="absolute inset-0 grid overflow-hidden" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .peep { animation: float infinite ease-in-out; }
      `}</style>
      {peeps.map((peep, index) => (
        <div
          key={index}
          className="peep"
          style={{
            backgroundImage: `url(${src})`,
            backgroundSize: `${cols * 100}% ${rows * 100}%`,
            backgroundPosition: `${peep.x * 100 / (cols - 1)}% ${peep.y * 100 / (rows - 1)}%`,
            animationDelay: peep.delay,
            animationDuration: peep.duration,
          }}
        />
      ))}
    </div>
  );
};

const PeepsSection = () => {
  return (
    <div className="relative h-full w-full flex flex-col items-center justify-center overflow-hidden bg-gray-900">
      <CrowdCanvas
        src="https://assets.codepen.io/3371966/peeps-sprite.png"
        rows={15}
        cols={7}
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 text-center text-white p-4">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
          Meet the Peeps
        </h2>
        <p className="text-lg md:text-xl max-w-2xl mx-auto text-gray-300">
          An animated crowd, built from a single sprite sheet.
        </p>
      </div>
    </div>
  );
};


// --- Part 7: Main Landing Page Component ---
const LandingPage = () => {
  return (
    <div className="bg-black">
      {/* --- Section 1: Hero Video Section --- */}
      <main className="relative min-h-screen w-full flex items-center justify-center bg-gray-900">
        <div className="text-center text-white z-10 p-4">
          <h1 className="text-5xl md:text-7xl font-extrabold drop-shadow-lg">Welcome to the Showreel</h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-gray-200 drop-shadow-md">
            Immerse yourself in a seamless video experience, followed by our interactive gallery.
          </p>
        </div>
        <HeroVideoPlayer />
      </main>

      {/* --- Section 2: Hover Expand Image Gallery --- */}
      <section className="w-full min-h-screen bg-black flex items-center justify-center p-4 sm:p-8">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
              Explore Our Gallery
            </h2>
            <div className="w-24 h-1 bg-sky-500 mx-auto rounded-full"></div>
          </div>
          <HoverExpandGallery images={galleryImages} />
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
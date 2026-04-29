import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, VolumeX, Volume2, Music, Disc3 } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: 'Neon Drive [AI.01]',
    artist: 'Syntax Generator',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: '6:12'
  },
  {
    id: 2,
    title: 'Cyberpunk Skyline [AI.02]',
    artist: 'Neural Network',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: '7:05'
  },
  {
    id: 3,
    title: 'Digital Horizon [AI.03]',
    artist: 'Algorithm',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: '5:44'
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const skipBackward = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const duration = audioRef.current.duration;
      const current = audioRef.current.currentTime;
      if (duration > 0) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnded = () => {
    skipForward();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setProgress(value);
    if (audioRef.current) {
      audioRef.current.currentTime = (value / 100) * audioRef.current.duration;
    }
  };

  return (
    <div className="flex flex-col bg-gray-950/80 backdrop-blur-md p-6 rounded-2xl border border-cyan-500/30 w-full max-w-md mx-auto shadow-[0_0_40px_theme('colors.cyan.500/10')] relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnded}
      />

      {/* Now Playing Area */}
      <div className="flex items-center gap-4 mb-6 z-10">
        <div className="relative">
          <div className={`w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-500 to-fuchsia-500 flex items-center justify-center shadow-[0_0_15px_theme('colors.cyan.500/40')] ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }}>
            <div className="w-4 h-4 bg-gray-950 rounded-full border border-cyan-300/50"></div>
            <Music className="absolute text-white/50 w-6 h-6 opacity-50" />
            <Disc3 className="absolute text-white w-full h-full p-2 opacity-30 mix-blend-overlay" />
          </div>
        </div>
        
        <div className="flex flex-col overflow-hidden">
          <div className="text-xs text-cyan-400 font-mono mb-1 tracking-widest uppercase flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-fuchsia-500 shadow-[0_0_5px_theme("colors.fuchsia.500")] animate-pulse' : 'bg-gray-600'}`}></span>
            {isPlaying ? 'Now Playing' : 'Paused'}
          </div>
          <div className="text-white text-lg font-bold truncate">
            {currentTrack.title}
          </div>
          <div className="text-gray-400 text-sm font-mono truncate">
            {currentTrack.artist}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6 z-10">
        <input
          type="range"
          value={progress || 0}
          min="0"
          max="100"
          onChange={handleSeek}
          className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 hover:accent-fuchsia-400 transition-colors slider-thumb"
        />
        <div className="flex justify-between mt-2 text-xs text-gray-500 font-mono">
          <span>{audioRef.current && audioRef.current.currentTime ? formatTime(audioRef.current.currentTime) : '0:00'}</span>
          <span>{currentTrack.duration}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-4 z-10">
        <div className="flex items-center gap-2">
          <button onClick={() => setIsMuted(!isMuted)} className="text-gray-400 hover:text-cyan-400 transition-colors p-2">
            {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-20 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-gray-400 hover:accent-cyan-400 transition-colors"
          />
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={skipBackward} 
            className="text-gray-300 hover:text-white hover:drop-shadow-[0_0_8px_white] transition-all p-2"
          >
            <SkipBack className="w-6 h-6 fill-current" />
          </button>
          
          <button 
            onClick={togglePlay} 
            className="w-14 h-14 flex items-center justify-center rounded-full bg-cyan-500 hover:bg-cyan-400 text-gray-900 transition-all shadow-[0_0_20px_theme('colors.cyan.500/50')] hover:shadow-[0_0_30px_theme('colors.cyan.400/80')] transform hover:scale-105"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current ml-1" /> // ml-1 for optical centering 
            )}
          </button>

          <button 
            onClick={skipForward} 
            className="text-gray-300 hover:text-white hover:drop-shadow-[0_0_8px_white] transition-all p-2"
          >
            <SkipForward className="w-6 h-6 fill-current" />
          </button>
        </div>
      </div>

      {/* Playlist Preview */}
      <div className="pt-4 border-t border-gray-800 flex flex-col gap-2 z-10 max-h-32 overflow-y-auto pr-2 scrollbar-hide">
        {TRACKS.map((track, idx) => (
          <div 
            key={track.id} 
            onClick={() => { setCurrentTrackIndex(idx); setIsPlaying(true); }}
            className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${idx === currentTrackIndex ? 'bg-cyan-500/20 border border-cyan-500/30' : 'hover:bg-gray-800/60 transparent'}`}
          >
            <div className="flex items-center gap-3 truncate">
              {idx === currentTrackIndex && isPlaying ? (
                <div className="w-4 h-4 flex items-end gap-[1px]">
                  <div className="w-[3px] bg-cyan-400 animate-[bounce_0.5s_infinite_alternate]" style={{height: '100%'}}></div>
                  <div className="w-[3px] bg-cyan-400 animate-[bounce_0.8s_infinite_alternate]" style={{height: '60%'}}></div>
                  <div className="w-[3px] bg-cyan-400 animate-[bounce_0.6s_infinite_alternate]" style={{height: '80%'}}></div>
                </div>
              ) : (
                <span className={`font-mono text-xs ${idx === currentTrackIndex ? 'text-cyan-400' : 'text-gray-500'}`}>0{idx+1}</span>
              )}
              <span className={`text-sm truncate ${idx === currentTrackIndex ? 'text-cyan-300 font-bold' : 'text-gray-400'}`}>{track.title}</span>
            </div>
            <span className="text-xs text-gray-600 font-mono">{track.duration}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper to format 0:00 time
function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

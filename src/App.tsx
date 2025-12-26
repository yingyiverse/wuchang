import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Heart, Dog } from 'lucide-react';
import { supabase } from './supabase';

const LYRICS_DATA = [
  { time: 0, text: "无常呀 无常" },
  { time: 4, text: "无常呀 无常" },
  { time: 8, text: "你见过长夜的黑暗" },
  { time: 12, text: "也见过人的良善" },
  { time: 16, text: "" }, // instrumental / break
  { time: 18, text: "你从出生开始流浪" },
  { time: 22, text: "你在寒风中受伤" },
  { time: 26, text: "可是 你依然坚强" },
  { time: 30, text: "" },
  { time: 32, text: "无常呀 无常" },
  { time: 36, text: "你遇见两位哥哥给你喂了一口饭" },
  { time: 42, text: "因为你毛色黑白腿长长" },
  { time: 46, text: "他们喊你作无常" },
  { time: 50, text: "" },
  { time: 52, text: "小狗无常" },
  { time: 54, text: "聪明又好看" },
  { time: 56, text: "可爱又善良" },
  { time: 58, text: "你会看家 带娃 还会讨饭" },
  { time: 64, text: "" },
  { time: 66, text: "小狗无常" },
  { time: 68, text: "愿你好好长大 无忧无患" },
  { time: 72, text: "愿你寻到一个温暖的家" },
  { time: 78, text: "" },
  { time: 94, text: "无常呀 无常" },
  { time: 98, text: "人生本就无常" },
  { time: 102, text: "你经历过风霜" },
  { time: 106, text: "依旧阳光灿烂" },
  { time: 110, text: "" },
  { time: 112, text: "无常呀 无常" },
  { time: 116, text: "感谢上天带你到我身旁" },
  { time: 120, text: "让我看见爱纯粹的模样" },
  { time: 126, text: "" },
  { time: 128, text: "无常呀 无常" },
  { time: 132, text: "愿你寻到一个温暖的家" },
  { time: 136, text: "陪伴守护直到永远" }
];

// --- Immersive Music Player (New Important Position) ---
const MainPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const activeLyricIndex = LYRICS_DATA.findIndex((line, i) => {
    const nextLine = LYRICS_DATA[i + 1];
    return currentTime >= line.time && (!nextLine || currentTime < nextLine.time);
  });

  // Show lyrics only when playing, otherwise show credits
  const currentLyric = isPlaying && activeLyricIndex !== -1 ? LYRICS_DATA[activeLyricIndex].text : "";

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="main-player-hero glass"
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <audio
          ref={audioRef}
          src="/wuchang_song.wav"
          loop
          onTimeUpdate={handleTimeUpdate}
        />
        <div className="player-left">
          <div className={`vinyl-record ${isPlaying ? 'spinning' : ''}`}>
            <img src="/images/wucang5.jpeg" alt="Song Cover" />
            <div className="vinyl-center" />
          </div>
          <div className="song-meta">
            <span className="live-badge">
              <span className="dot" /> NOW PLAYING
            </span>
            <h3>无常之歌 (Official Theme)</h3>
            <AnimatePresence mode="wait">
              <motion.p
                key={currentLyric || "credits"}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
                style={{
                  color: currentLyric ? '#ffffff' : 'rgba(255,255,255,0.6)',
                  fontWeight: currentLyric ? 500 : 400,
                  minHeight: '24px' // Prevent layout shift
                }}
              >
                {currentLyric || "作词：菲比 / 作曲：AI"}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
        <div className="player-controls">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={togglePlay}
            className="play-btn-large"
          >
            {isPlaying ? <Pause size={32} /> : <Play size={32} fill="currentColor" />}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const Hero = ({ onAdoptClick }: { onAdoptClick: () => void }) => {
  const [showVideo, setShowVideo] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);

  // Preload video to check if it's ready
  React.useEffect(() => {
    const video = document.createElement('video');
    video.src = "/wucang.mp4";
    video.oncanplaythrough = () => setIsVideoReady(true);
    // Explicitly start loading
    video.load();
  }, []);

  // Auto-switch between photo and video
  React.useEffect(() => {
    if (!isVideoReady) return;

    const timer = setInterval(() => {
      setShowVideo(prev => !prev);
    }, 8000); // Switch every 8 seconds

    return () => clearInterval(timer);
  }, [isVideoReady]);

  return (
    <section className="hero-v2">
      <div className="hero-background">
        <div className="hero-overlay" />
      </div>

      <div className="hero-content-v2">
        <div className="hero-text-side">
          <motion.div
            className="hero-text-content"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="location-tag">@ 上海DNC数字游民国际村</span>
            <h1>无常：<br />渴望有个家</h1>
            <p>已流浪 4 个月，3 个月前与兄弟来到 DNC 数字游民社区。他聪明懂事，会握手、会恭喜发财、会坐。尽管大家为他捐款、买粮、打疫苗，但他仍渴望一个真正稳定的家。</p>
          </motion.div>
          <MainPlayer />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="hero-image-frame"
        >
          <AnimatePresence mode="wait">
            {showVideo ? (
              <motion.video
                key="video"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                src="/wucang.mp4"
                className="full-bg-img"
                muted
                autoPlay
                playsInline
                onEnded={() => setShowVideo(false)} // Switch back to image when video ends
              />
            ) : (
              <motion.img
                key="image"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                src="/images/wucang1.jpeg"
                alt="Wuchang Lifestyle"
                className="full-bg-img"
              />
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className="floating-adopt-btn"
            onClick={onAdoptClick}
          >
            <Heart size={20} fill="currentColor" />
            带他回家
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

const PhotoGallery = () => {
  const images = [
    "/images/wucang1.jpeg",
    "/images/wucang2.jpeg",
    "/images/wucang3.jpeg",
    "/images/wucang4.jpeg",
    "/images/wucang5.jpeg",
    "/images/wucang2.jpeg",
  ];

  return (
    <section id="gallery" className="gallery-section section-container">
      <div className="section-header">
        <span className="sub-title">瞬间 / MOMENTS</span>
        <h2>无常的社区生活</h2>
      </div>
      <div className="gallery-grid">
        {images.map((src, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.02, y: -5 }}
            className="gallery-item"
          >
            <img src={src} alt={`Wuchang ${i}`} loading="lazy" />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const InteractionZone = ({ onAdoptClick }: { onAdoptClick: () => void }) => {
  const [pats, setPats] = useState(0);
  const [hearts, setHearts] = useState<{ id: number, x: number, y: number }[]>([]);

  // Fetch initial pat count
  React.useEffect(() => {
    const fetchPats = async () => {
      // Assuming a table 'wucang_pats' exists. 
      // If table doesn't exist, this will fail gracefully or return 0
      const { count, error } = await supabase
        .from('wucang_pats')
        .select('*', { count: 'exact', head: true });

      if (!error && count !== null) {
        setPats(count);
      } else {
        // Fallback or mock if DB not ready
        // setPats(520); 
      }
    };

    fetchPats();

    // Optional: Realtime subscription could go here
  }, []);

  const handlePat = async (e: React.MouseEvent) => {
    // Optimistic update
    setPats(prev => prev + 1);

    // Animation
    const rect = e.currentTarget.getBoundingClientRect();
    const newHeart = {
      id: Date.now(),
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    setHearts([...hearts, newHeart]);
    setTimeout(() => {
      setHearts(prev => prev.filter(h => h.id !== newHeart.id));
    }, 1000);

    // Record to Supabase
    await supabase.from('wucang_pats').insert([
      { created_at: new Date().toISOString() }
    ]);
  };

  return (
    <section id="interact" className="interaction-section section-container">
      <div className="interaction-card-v2 glass">
        <div className="avatar-side">
          <div className="avatar-glow" />
          <motion.img
            src="/images/wucang1.jpeg"
            alt="Intelligent Wuchang"
            className="big-avatar"
            onClick={handlePat}
            whileTap={{ scale: 0.95 }}
          />
          <AnimatePresence>
            {hearts.map(h => (
              <motion.div
                key={h.id}
                initial={{ opacity: 0, scale: 0.5, y: 0 }}
                animate={{ opacity: 1, scale: 1.5, y: -150, x: (Math.random() - 0.5) * 100 }}
                exit={{ opacity: 0 }}
                className="floating-heart"
                style={{ left: h.x, top: h.y }}
              >
                ❤️
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="text-side">
          <h2>帮助无常结束流浪</h2>
          <p>他很聪明，会握手、会恭喜发财。每一次点击都是一份认可，但他更需要一个温暖的家。</p>
          <div className="pat-stats">
            <Heart size={20} fill="var(--accent-color)" color="var(--accent-color)" />
            <span>{pats.toLocaleString()} 人次温暖感应</span>
          </div>
          <button onClick={handlePat} className="gradient-btn-pat">
            我想摸摸他
          </button>
          <div style={{ marginTop: 16 }}>
            <span
              onClick={onAdoptClick}
              style={{ cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.9rem', textDecoration: 'underline' }}
            >
              或者，真的带他回家
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default function App() {
  const scrollToFooter = () => {
    document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="app-main">
      <nav className="navbar section-container">
        <div className="logo-group">
          <Dog className="logo-icon" size={24} />
          <span className="logo-text">我是无常</span>
        </div>
        <div className="nav-links">
          <a href="#gallery">影集</a>
          <a href="#interact">互动</a>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="nav-cta glass"
            onClick={scrollToFooter}
          >
            领养咨询
          </motion.button>
        </div>
      </nav>

      <Hero onAdoptClick={scrollToFooter} />

      <PhotoGallery />

      <InteractionZone onAdoptClick={scrollToFooter} />

      <footer id="footer" className="footer-v2">
        <div className="footer-inner section-container">
          <div className="footer-main">
            <h2>给他一个稳定的家</h2>
            <p>我们已经照顾了他三个月，希望能有爱心人士给他一个永远的归宿。欢迎来 DNC 社区看望他。</p>
            <div className="footer-qr-container">
              <img src="/images/qrcode.png" alt="Contact QR" className="footer-qr" />
              <span>扫码联系领养</span>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 WUCHANG PROJECT. FOR ART & FREEDOM.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Heart, Dog } from 'lucide-react';
import { supabase } from './supabase';

// --- Immersive Music Player (New Important Position) ---
const MainPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
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

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="main-player-hero glass"
    >
      <audio ref={audioRef} src="/wuchang_song.wav" loop />
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
          <p>作曲：菲比</p>
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
    </motion.div>
  );
};

const Hero = ({ onAdoptClick }: { onAdoptClick: () => void }) => {
  const [showVideo, setShowVideo] = useState(false);

  // Auto-switch between photo and video
  React.useEffect(() => {
    const timer = setInterval(() => {
      setShowVideo(prev => !prev);
    }, 8000); // Switch every 8 seconds

    return () => clearInterval(timer);
  }, []);

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

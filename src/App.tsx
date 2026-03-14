/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  PlusCircle, 
  Cpu, 
  Target, 
  Zap, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Mail, 
  Phone, 
  Instagram, 
  Youtube, 
  Facebook, 
  Send,
  CheckCircle2,
  ArrowLeft,
  Layout,
  Figma,
  Smartphone,
  Video,
  Palette,
  BarChart3,
  ExternalLink,
  Briefcase,
  Rocket,
  Layers,
  Check,
  Lightbulb,
  PenTool,
  Megaphone,
  Brain,
  Star,
  Award,
  ShieldCheck,
  Edit,
  ShoppingCart,
  Globe,
  Heart,
  Gem,
  Gift,
  BarChart2,
  Eye,
  Link as LinkIcon,
  Share2,
  Twitter,
  Trophy,
  Sparkles,
  Lock
} from 'lucide-react';
import { motion } from 'motion/react';

const SectionTitle = ({ children, icon: Icon }: { children: React.ReactNode, icon?: any }) => (
  <div className="mb-8 flex items-center justify-center gap-3">
    {Icon && <Icon className="w-6 h-6 text-brand-purple" />}
    <h2 className="text-2xl md:text-3xl font-bold text-white">
      {children}
    </h2>
  </div>
);

const Card = ({ children, className = "", ...props }: { children: React.ReactNode, className?: string, [key: string]: any }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={`bg-brand-card/60 backdrop-blur-md p-8 rounded-[2rem] border border-white/5 shadow-2xl ${className}`}
    {...props}
  >
    {children}
  </motion.div>
);

// Audio ping utility
const playPing = () => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) {
    console.log("Audio not supported or blocked");
  }
};

const useTrackingCounters = () => {
  // Start at zero as requested
  const BASE_VISITORS = 0;
  const BASE_CLICKS = 0;
  const BASE_SHARES = 0;

  const [stats, setStats] = useState({
    visitors: BASE_VISITORS,
    clicks: BASE_CLICKS,
    shares: BASE_SHARES
  });

  useEffect(() => {
    // 1. Visitor Tracking
    let localVisitors = parseInt(localStorage.getItem('track_visitors') || '0');
    const hasVisitedSession = sessionStorage.getItem('session_visited');
    
    if (!hasVisitedSession) {
      localVisitors += 1;
      localStorage.setItem('track_visitors', localVisitors.toString());
      sessionStorage.setItem('session_visited', 'true');
    }

    // 2. Click Tracking
    let localClicks = parseInt(localStorage.getItem('track_clicks') || '0');
    
    // 3. Share Tracking
    let localShares = parseInt(localStorage.getItem('track_shares') || '0');

    setStats({
      visitors: BASE_VISITORS + localVisitors,
      clicks: BASE_CLICKS + localClicks,
      shares: BASE_SHARES + localShares
    });

    // Global Click Listener for tracking link/button clicks
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a') || target.closest('button')) {
        localClicks += 1;
        localStorage.setItem('track_clicks', localClicks.toString());
        setStats(prev => ({ ...prev, clicks: BASE_CLICKS + localClicks }));
      }
    };

    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  const trackShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: document.title,
          text: 'اكتشف هذا الموقع الرائع!',
          url: url,
        });
      } else {
        try {
          await navigator.clipboard.writeText(url);
          alert('تم نسخ الرابط بنجاح! يمكنك الآن مشاركته مع أصدقائك.');
        } catch (err) {
          console.error('Clipboard API failed in trackShare, trying fallback...', err);
          const textArea = document.createElement("textarea");
          textArea.value = url;
          textArea.style.position = "fixed";
          textArea.style.left = "-9999px";
          textArea.style.top = "0";
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          try {
            const successful = document.execCommand('copy');
            if (successful) {
              alert('تم نسخ الرابط بنجاح! يمكنك الآن مشاركته مع أصدقائك.');
            }
          } catch (fallbackErr) {
            console.error('Fallback copy failed in trackShare', fallbackErr);
          }
          document.body.removeChild(textArea);
        }
      }
      // Increment share on success
      const currentShares = parseInt(localStorage.getItem('track_shares') || '0');
      const newShares = currentShares + 1;
      localStorage.setItem('track_shares', newShares.toString());
      setStats(prev => ({ ...prev, shares: BASE_SHARES + newShares }));
      playPing();
    } catch (error) {
      console.log('Share cancelled or failed', error);
    }
  };

  return { stats, trackShare };
};

const AnimatedCounter = ({ value }: { value: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const frameRate = 1000 / 60;
    const totalFrames = Math.round(duration / frameRate);
    const increment = value / totalFrames;
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, frameRate);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{count.toLocaleString('en-US')}</span>;
};

const ParticipantsBoard = ({ shares, visitors }: { shares: number, visitors: number }) => {
  // If visitors < 800, show a locked state
  if (visitors < 800) {
    return (
      <div className="mt-12 p-8 border border-brand-purple/20 rounded-2xl bg-[#0B0B14]/50 text-center relative overflow-hidden w-full">
        <div className="absolute inset-0 backdrop-blur-sm bg-black/40 z-10 flex flex-col items-center justify-center">
          <Lock className="w-12 h-12 text-slate-500 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">لوحة المشاركين (مقفلة)</h3>
          <p className="text-slate-400">تُفتح اللوحة عند الوصول إلى 800 زائر. (الحالي: {visitors})</p>
        </div>
        {/* Blurred mock content behind */}
        <div className="opacity-30 blur-sm">
          <div className="flex gap-4 justify-center">
            <div className="w-12 h-12 rounded-full bg-slate-800"></div>
            <div className="w-12 h-12 rounded-full bg-slate-800"></div>
            <div className="w-12 h-12 rounded-full bg-slate-800"></div>
          </div>
        </div>
      </div>
    );
  }

  // Unlocked state
  const mockParticipants = [
    { id: 1, name: 'سارة م.', shares: 45, early: true },
    { id: 2, name: 'أحمد خ.', shares: 32, early: true },
    { id: 3, name: 'محمد ع.', shares: 28, early: true },
    { id: 4, name: 'نورة س.', shares: 15, early: false },
    { id: 5, name: 'أنت', shares: shares > 0 ? shares : 0, early: shares > 0, isUser: true },
  ].filter(p => p.shares > 0).sort((a, b) => b.shares - a.shares);

  return (
    <div className="mt-12 p-8 border border-brand-purple/30 rounded-2xl bg-gradient-to-b from-[#1A1A2E] to-[#0B0B14] w-full text-right">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
          <Users className="w-6 h-6 text-brand-purple" />
          لوحة الشرف للمشاركين
        </h3>
        <span className="px-3 py-1 bg-brand-purple/20 text-brand-purple rounded-full text-sm font-medium">
          مرئية للجميع
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockParticipants.map((p, i) => (
          <div key={p.id} className={`flex items-center gap-4 p-4 rounded-xl border ${p.isUser ? 'border-brand-purple bg-brand-purple/10' : 'border-slate-800 bg-[#0B0B14]'}`}>
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-purple to-purple-900 flex items-center justify-center text-white font-bold text-lg">
                {p.name.charAt(0)}
              </div>
              {p.early && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center border-2 border-[#0B0B14]" title="مشارك مبكر">
                  <Star className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h4 className="text-white font-bold flex items-center gap-2">
                {p.name}
                {p.isUser && <span className="text-xs text-brand-purple bg-brand-purple/20 px-2 py-0.5 rounded">أنت</span>}
              </h4>
              <p className="text-slate-400 text-sm">{p.shares} مشاركة</p>
            </div>
            <div className="text-2xl font-black text-slate-700">
              #{i + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const ShareAndGrowSection = ({ stats, trackShare }: { stats: any, trackShare: () => void }) => {
  const [copied, setCopied] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const shareCount = stats.shares;

  const handleShare = (platform: string) => {
    setIsAnimating(true);
    trackShare();
    setTimeout(() => setIsAnimating(false), 500);

    const userId = Math.random().toString(36).substring(7);
    const url = `${window.location.origin}${window.location.pathname}?ref=${userId}`;
    const text = "الفكرة تكبر كلما شاركتها… اكتشف هذه المنظومة الرائعة!";

    if (platform === 'whatsapp') window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`);
    if (platform === 'twitter') window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
    if (platform === 'facebook') window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
    if (platform === 'copy') {
      const copyToClipboard = async () => {
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error('Clipboard API failed, trying fallback...', err);
          // Fallback: Create a temporary textarea
          const textArea = document.createElement("textarea");
          textArea.value = url;
          textArea.style.position = "fixed";
          textArea.style.left = "-9999px";
          textArea.style.top = "0";
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          try {
            const successful = document.execCommand('copy');
            if (successful) {
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }
          } catch (fallbackErr) {
            console.error('Fallback copy failed', fallbackErr);
          }
          document.body.removeChild(textArea);
        }
      };
      copyToClipboard();
    }
    setShowOptions(false);
  };

  const getMilestone = () => {
    if (shareCount < 1000) return { current: 1000, reward: "سحب على جائزة مميزة", icon: Gift };
    return { current: 10000, reward: "إطلاق ميزة جديدة حصريًا للمشاركين", icon: Sparkles };
  };

  const milestone = getMilestone();
  const prevMilestone = shareCount < 1000 ? 0 : 1000;
  const progress = Math.min(((shareCount - prevMilestone) / (milestone.current - prevMilestone)) * 100, 100);
  const dropsRemaining = 200 - (shareCount % 200);

  return (
    <Card className="relative overflow-hidden border-brand-purple/30 bg-gradient-to-br from-[#0B0B14] to-[#1A1A2E]">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-purple/20 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col items-center text-center space-y-8">
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-brand-purple/20 rounded-2xl mb-2 text-brand-purple">
            <Share2 className="w-8 h-8" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white">
            شارك وكبّر الأثر
          </h2>
          <p className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-blue-400 font-bold">
            الفكرة تكبر كلما شاركتها… اضغط الآن لتكون جزءًا من النمو.
          </p>
        </div>

        {/* Live Counter */}
        <div className={`flex flex-col items-center justify-center p-8 bg-black/40 rounded-3xl border border-white/10 w-full max-w-md relative overflow-hidden ${isAnimating ? 'animate-shake' : ''}`}>
          <div className={`absolute inset-0 bg-brand-purple/20 blur-xl rounded-full transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}></div>
          <p className="text-slate-400 mb-2 font-medium relative z-10">إجمالي المشاركات والتأثير</p>
          <div className={`text-6xl md:text-7xl font-black text-white tracking-tight transition-transform duration-300 relative z-10 ${isAnimating ? 'scale-110 text-brand-purple drop-shadow-[0_0_15px_rgba(139,139,255,0.8)]' : ''}`}>
            <AnimatedCounter value={shareCount} />
          </div>
          <p className="text-brand-purple mt-4 font-bold animate-pulse relative z-10">
            كل مشاركة = تذكرة دخول للسحب!
          </p>
        </div>

        {/* Milestone Progress */}
        <div className="w-full max-w-md space-y-3">
          <div className="flex justify-between text-sm font-medium">
            <span className="text-slate-400">الهدف القادم: {milestone.current.toLocaleString('en-US')}</span>
            <span className="text-brand-purple flex items-center gap-1">
              <milestone.icon className="w-4 h-4" /> {milestone.reward}
            </span>
          </div>
          <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
            <motion.div 
              className="h-full bg-gradient-to-r from-brand-purple to-blue-500 rounded-full relative"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
            </motion.div>
          </div>
          <p className="text-slate-500 text-xs">
            باقي {milestone.current - shareCount} مشاركة للوصول للهدف. 🎁 مكافأة عشوائية قادمة بعد {dropsRemaining} مشاركة!
          </p>
        </div>

        {/* Share Button & Options */}
        <div className="relative w-full max-w-md">
          {!showOptions ? (
            <button 
              onClick={() => setShowOptions(true)}
              className="w-full group relative bg-brand-purple hover:bg-brand-purple/90 text-white font-bold text-xl py-5 px-8 rounded-2xl shadow-[0_0_30px_rgba(139,139,255,0.3)] hover:shadow-[0_0_40px_rgba(139,139,255,0.5)] transition-all duration-300 overflow-hidden flex items-center justify-center gap-3"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              <span>انشر الرابط الآن</span>
              <Share2 className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </button>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="grid grid-cols-2 gap-4"
            >
              <button onClick={() => handleShare('whatsapp')} className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold py-4 rounded-xl transition-colors">
                <MessageSquare className="w-5 h-5" /> واتساب
              </button>
              <button onClick={() => handleShare('twitter')} className="flex items-center justify-center gap-2 bg-[#1DA1F2] hover:bg-[#1A91DA] text-white font-bold py-4 rounded-xl transition-colors">
                <Twitter className="w-5 h-5" /> تويتر
              </button>
              <button onClick={() => handleShare('facebook')} className="flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#166FE5] text-white font-bold py-4 rounded-xl transition-colors">
                <Facebook className="w-5 h-5" /> فيسبوك
              </button>
              <button onClick={() => handleShare('copy')} className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-xl transition-colors border border-white/10">
                {copied ? <Check className="w-5 h-5 text-green-400" /> : <LinkIcon className="w-5 h-5" />} 
                {copied ? 'تم النسخ!' : 'نسخ الرابط'}
              </button>
            </motion.div>
          )}
        </div>

        {/* Participants Board */}
        <ParticipantsBoard shares={shareCount} visitors={stats.visitors} />
      </div>
    </Card>
  );
};

export default function App() {
  const { stats, trackShare } = useTrackingCounters();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('شكراً لتواصلك! سيتم الرد عليك قريباً.');
  };

  return (
    <div className="min-h-screen bg-brand-dark font-sans text-slate-200 selection:bg-brand-purple/30 selection:text-white">
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-purple/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Header / Logo */}
      <header className="pt-10 pb-6 flex justify-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/40 backdrop-blur-xl border border-white/10 px-8 py-3 rounded-full flex items-center gap-3 shadow-2xl"
        >
          <div className="w-8 h-8 bg-brand-purple rounded-full flex items-center justify-center text-white font-bold">S</div>
          <span className="text-lg font-bold text-white tracking-wide">شعار سوق الكتاب</span>
        </motion.div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pb-24 space-y-12">
        
        {/* Hero Section */}
        <Card className="text-center py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 relative inline-block"
          >
            <div className="w-64 h-64 rounded-full p-1.5 bg-gradient-to-tr from-brand-purple to-blue-400 shadow-[0_0_50px_rgba(168,85,247,0.4)] overflow-hidden">
              <div className="w-full h-full rounded-full bg-brand-dark flex items-center justify-center overflow-hidden border-4 border-brand-dark">
                <img 
                  src="https://r2.erweima.ai/i/1741884189390_755162.jpg" 
                  alt="Sooq Alketab Cover" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">من أنا</h1>
          <p className="text-brand-purple font-medium mb-8 leading-relaxed">
            طالب هندسة برمجيات وحواسيب | مطور مبدع | صانع محتوى | مفكر استراتيجي
          </p>
          
          <div className="text-slate-400 max-w-2xl mx-auto leading-relaxed text-lg space-y-6">
            <p>
              أؤمن أن كل مشروع يبدأ من فكرة، لكن الفكرة لا تنمو وحدها.<br/>
              هي تحتاج إلى وعي يفهمها، وصبر يرعاها، وخطوات تُؤخذ بثبات حتى تكتمل.
            </p>
            <p>
              النجاح ليس قفزة… بل تراكم لحظات صغيرة تُبنى بهدوء.<br/>
              لحظات يصنعها شخص قرر أن يستمر، حتى عندما لم يكن الطريق واضحًا بالكامل.
            </p>
            <p>
              الفكرة التي تُمنح وقتها تنضج، والخطوة التي تُؤخذ بتركيز تفتح الطريق لما بعدها.<br/>
              وأبسط البدايات قد تحمل في داخلها مشروعًا كاملًا ينتظر أن يظهر.
            </p>
            <div className="pt-4">
              <p className="text-brand-purple font-bold animate-pulse">
                إذا كنت تقرأ هذا الآن، فأنت جزء من المرحلة.
              </p>
            </div>
          </div>
        </Card>

        {/* Slogan Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-purple/20 via-brand-purple/5 to-transparent border border-brand-purple/20 p-8 md:p-12 text-center"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight">
              النجاح يبدأ من <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-blue-400">ترتيب العقل</span>
              <br /> قبل ترتيب الصفحات
            </h2>
            <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              غايتنا هي بلورة أفكارك وتنظيمها باحترافية عالية، لتتحول من مجرد فكرة إلى مشروع متكامل ومؤثر.
            </p>
          </div>
        </motion.div>

        {/* What I Do Section */}
        <Card>
          <SectionTitle icon={Briefcase}>ماذا أفعل؟</SectionTitle>
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-slate-400 leading-relaxed mb-4">
                  أعمل في نقطة التقاء البرمجيات مع التسويق الذكي.<br/>
                  مهمتي هي نقل المشاريع من مرحلة الفكرة إلى مرحلة التنفيذ، حيث يصبح المحتوى جزءًا من الهوية، والتقنية جزءًا من الحل.
                </p>
                <p className="text-brand-purple font-medium mt-4">
                  عملي لا يعتمد على الحظ… بل على منهجية واضحة ونتائج قابلة للقياس.
                </p>
              </div>
              <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                <ul className="grid grid-cols-1 gap-3 text-sm text-slate-400">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-purple" /> بناء وتطوير المواقع والأنظمة</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-purple" /> تصميم الهويات والشعارات</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-purple" /> تصوير المنتجات باحترافية</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-purple" /> إدارة الصفحات وصناعة المحتوى</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-purple" /> تحليل البيانات والتحسين المستمر</li>
                </ul>
              </div>
            </div>
            
            <div className="pt-6 border-t border-white/5">
              <h3 className="text-xl font-bold text-white mb-6">منهجية العمل</h3>
              <div className="grid gap-6">
                {[
                  { title: 'تحليل عميق', desc: 'فهم دقيق للمتطلبات والجمهور قبل البدء' },
                  { title: 'تنفيذ دقيق', desc: 'جودة عالية في التفاصيل التقنية والبصرية' },
                  { title: 'تطوير مستمر', desc: 'تحسينات مبنية على البيانات والنتائج' }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <CheckCircle2 className="w-5 h-5 text-brand-purple mt-1 shrink-0" />
                    <div>
                      <span className="font-bold text-white">{item.title}: </span>
                      <span className="text-slate-400">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Why Us Section */}
        <Card>
          <SectionTitle icon={ShieldCheck}>سر تميزنا</SectionTitle>
          <div className="bg-gradient-to-br from-brand-purple/10 to-transparent p-8 rounded-3xl border border-brand-purple/20">
            <h3 className="text-2xl font-bold text-white mb-4 text-center">
              نحن لا نقدّم خدمات منفصلة… بل حلولًا متكاملة.
            </h3>
            <p className="text-slate-300 text-lg leading-relaxed text-center mb-8 max-w-3xl mx-auto">
              نملك خبرة عملية في الأعمال والمبيعات، وخبرة تقنية في البرمجيات، وهذا ما يجعل نتائجنا تتفوق على <span className="text-brand-purple font-bold">99%</span> من السوق.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 bg-white/5 p-6 rounded-2xl border border-white/10 max-w-2xl mx-auto shadow-lg">
              <div className="w-14 h-14 bg-brand-purple/20 rounded-full flex items-center justify-center shrink-0">
                <Award className="w-8 h-8 text-brand-purple" />
              </div>
              <p className="text-white font-medium text-lg leading-relaxed text-center md:text-right">
                نحن لا نروّج فقط، بل نبني منظومات تجعل الترويج أسهل… وربما غير ضروري.
              </p>
            </div>
          </div>
        </Card>

        {/* Milestones Section */}
        <Card className="bg-[#0B0B14] border-[#1A1A2E]">
          <div className="flex items-center justify-end gap-3 mb-10 border-b border-white/5 pb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white">أبرز المحطات</h2>
            <Star className="w-8 h-8 text-[#8B8BFF] fill-current" />
          </div>
          
          <div className="relative max-w-3xl mx-auto">
            {/* The vertical line */}
            <div className="absolute top-8 bottom-8 right-[7px] w-[2px] bg-[#2A2A4A]"></div>
            
            <div className="space-y-6">
              {/* Milestone 1 */}
              <div className="relative pr-10">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-[#8B8BFF] bg-[#0B0B14] z-10 shadow-[0_0_10px_rgba(139,139,255,0.5)]"></div>
                <div className="bg-[#11111E] border border-[#1A1A2E] p-6 rounded-2xl hover:border-[#8B8BFF]/50 transition-colors duration-300">
                  <h3 className="text-xl font-bold text-white mb-2 text-right">إطلاق أول مشروع تقني ناجح</h3>
                  <p className="text-slate-400 text-sm text-right leading-relaxed">وبناء قاعدة مستخدمين واسعة.</p>
                </div>
              </div>

              {/* Milestone 2 */}
              <div className="relative pr-10">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-[#8B8BFF] bg-[#0B0B14] z-10 shadow-[0_0_10px_rgba(139,139,255,0.5)]"></div>
                <div className="bg-[#11111E] border border-[#1A1A2E] p-6 rounded-2xl hover:border-[#8B8BFF]/50 transition-colors duration-300">
                  <h3 className="text-xl font-bold text-white mb-2 text-right">شراكات استراتيجية</h3>
                  <p className="text-slate-400 text-sm text-right leading-relaxed">مع رواد الصناعة.</p>
                </div>
              </div>

              {/* Milestone 3 */}
              <div className="relative pr-10">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-[#8B8BFF] bg-[#0B0B14] z-10 shadow-[0_0_10px_rgba(139,139,255,0.5)]"></div>
                <div className="bg-[#11111E] border border-[#1A1A2E] p-6 rounded-2xl hover:border-[#8B8BFF]/50 transition-colors duration-300">
                  <h3 className="text-xl font-bold text-white mb-2 text-right">توسّع نحو مجالات متقدمة</h3>
                  <p className="text-slate-400 text-sm text-right leading-relaxed">في المجالات البرمجية والتسويقية.</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* My Vision Section */}
        <Card>
          <SectionTitle icon={TrendingUp}>رؤيتي للمستقبل</SectionTitle>
          <div className="bg-white/5 p-8 rounded-3xl border border-white/5 flex flex-col md:flex-row items-center gap-8">
            <div className="w-16 h-16 bg-brand-purple/20 rounded-2xl flex items-center justify-center text-brand-purple shrink-0">
              <Rocket className="w-8 h-8" />
            </div>
            <p className="text-slate-300 text-lg leading-relaxed text-center md:text-right">
              أسعى لبناء منظومة أعمال لا تكتفي بالنجاح المادي، بل تصنع أثرًا حقيقيًا في المجتمع.<br/>
              أرى المستقبل مساحة مفتوحة للابتكار، وأسعى لأن تكون مشاريعي جزءًا من هذا التغيير.
            </p>
          </div>
        </Card>

        {/* Ecosystem Section */}
        <div className="space-y-8">
          <SectionTitle icon={Layers}>منظومة سوق الكتاب</SectionTitle>
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Sooq Alketab Plus */}
            <Card className="flex flex-col h-full bg-[#0B0B14] border-[#1A1A2E] hover:border-brand-purple/50 transition-colors duration-300 p-8">
              <div className="flex items-center justify-center gap-3 text-[#C084FC] mb-6">
                <PlusCircle className="w-8 h-8" fill="currentColor" />
                <h3 className="text-2xl font-bold text-white">Sooq Alketab Plus</h3>
              </div>
              <p className="text-slate-400 text-center mb-10 text-sm leading-relaxed px-2">
                مساحة تجمع المحتوى العميق بالإعلان الذكي والفرص التجارية.
              </p>

              <div className="space-y-8 flex-grow">
                {/* Audience */}
                <div>
                  <h4 className="font-bold text-white mb-6 text-right text-lg">
                    الجمهور:
                  </h4>
                  <div className="space-y-5">
                    <div className="flex items-center justify-end gap-4">
                      <span className="text-slate-300 text-sm font-medium">المعلنون – صناع المحتوى – المهتمون بالتسويق الذكي</span>
                      <Users className="w-5 h-5 text-[#C084FC] shrink-0" fill="currentColor" />
                    </div>
                  </div>
                </div>

                {/* Services */}
                <div className="pt-4">
                  <h4 className="font-bold text-white mb-6 text-right text-lg">
                    الخدمات:
                  </h4>
                  <div className="space-y-6">
                    {[
                      { title: 'عرض منتجات باحترافية' },
                      { title: 'حملات إعلانية دقيقة' },
                      { title: 'تخطيط فرص إعلانية' },
                      { title: 'ترتيب صفحات التواصل' }
                    ].map((service, i) => (
                      <div key={i} className="flex items-start justify-end gap-4 text-right">
                        <div>
                          <p className="font-bold text-white text-base mb-1">{service.title}</p>
                        </div>
                        <CheckCircle2 className="w-6 h-6 text-[#C084FC] shrink-0 mt-1" fill="currentColor" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Button */}
              <a href="https://www.instagram.com/sooq_alketab_plus" target="_blank" rel="noopener noreferrer" className="w-full mt-10 bg-[#1A1A2E] hover:bg-[#2A2A4A] text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-colors duration-300">
                <span className="text-sm">ابدأ حملتك الإعلانية معنا</span>
                <Megaphone className="w-5 h-5" />
              </a>
            </Card>

            {/* Sooq Alketab */}
            <Card className="flex flex-col h-full bg-[#0B0B14] border-[#1A1A2E] hover:border-brand-purple/50 transition-colors duration-300 p-8">
              <div className="flex items-center justify-center gap-3 text-[#C084FC] mb-6">
                <BookOpen className="w-8 h-8" fill="currentColor" />
                <h3 className="text-2xl font-bold text-white">Sooq Alketab</h3>
              </div>
              <p className="text-slate-400 text-center mb-10 text-sm leading-relaxed px-2">
                منصة ثقافية تجمع الكتاب بالفكر، وتصل بالمعنى إلى من يبحث عنه.
              </p>
              
              <div className="space-y-8 flex-grow">
                {/* Audience */}
                <div>
                  <h4 className="font-bold text-white mb-6 text-right text-lg">
                    الجمهور:
                  </h4>
                  <div className="space-y-5">
                    <div className="flex items-center justify-end gap-4">
                      <span className="text-slate-300 text-sm font-medium">القراء والمثقفون – الكتاب والمؤلفون – الباحثون عن المعرفة</span>
                      <Users className="w-5 h-5 text-[#C084FC] shrink-0" fill="currentColor" />
                    </div>
                  </div>
                </div>

                {/* Services */}
                <div className="pt-4">
                  <h4 className="font-bold text-white mb-6 text-right text-lg">
                    الخدمات:
                  </h4>
                  <div className="space-y-6">
                    <div className="flex items-start justify-end gap-4 text-right">
                      <div>
                        <p className="font-bold text-white text-base mb-1">تطوير الفكرة المحورية</p>
                      </div>
                      <Lightbulb className="w-6 h-6 text-[#C084FC] shrink-0 mt-1" fill="currentColor" />
                    </div>

                    <div className="flex items-start justify-end gap-4 text-right">
                      <div>
                        <p className="font-bold text-white text-base mb-1">الصياغة والتدقيق</p>
                      </div>
                      <PenTool className="w-6 h-6 text-[#C084FC] shrink-0 mt-1" fill="currentColor" />
                    </div>

                    <div className="flex items-start justify-end gap-4 text-right">
                      <div>
                        <p className="font-bold text-white text-base mb-1">تصميم غلاف احترافي</p>
                      </div>
                      <Palette className="w-6 h-6 text-[#C084FC] shrink-0 mt-1" fill="currentColor" />
                    </div>

                    <div className="flex items-start justify-end gap-4 text-right">
                      <div>
                        <p className="font-bold text-white text-base mb-1">الطباعة والتسويق</p>
                      </div>
                      <Megaphone className="w-6 h-6 text-[#C084FC] shrink-0 mt-1" fill="currentColor" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Button */}
              <a href="https://www.instagram.com/sooq_alketab" target="_blank" rel="noopener noreferrer" className="w-full mt-10 bg-[#1A1A2E] hover:bg-[#2A2A4A] text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-colors duration-300">
                <span className="text-sm">ابدأ رحلتك في التأليف معنا</span>
                <Edit className="w-5 h-5" />
              </a>
            </Card>

            {/* Sooq Alketab Technology */}
            <Card className="flex flex-col h-full bg-[#0B0B14] border-[#1A1A2E] hover:border-brand-purple/50 transition-colors duration-300 p-8">
              <div className="flex items-center justify-center gap-3 text-[#C084FC] mb-6">
                <Cpu className="w-8 h-8" fill="currentColor" />
                <h3 className="text-2xl font-bold text-white">Sooq Alketab Tech</h3>
              </div>
              <p className="text-slate-400 text-center mb-10 text-sm leading-relaxed px-2">
                وجهتك لأفخم الإكسسوارات التقنية المستوردة.
              </p>

              <div className="space-y-8 flex-grow">
                {/* Audience */}
                <div>
                  <h4 className="font-bold text-white mb-6 text-right text-lg">
                    الجمهور:
                  </h4>
                  <div className="space-y-5">
                    <div className="flex items-center justify-end gap-4">
                      <span className="text-slate-300 text-sm font-medium">صناع المحتوى – المبرمجون والمصممون – عشاق التقنية</span>
                      <Users className="w-5 h-5 text-[#C084FC] shrink-0" fill="currentColor" />
                    </div>
                  </div>
                </div>

                {/* Services */}
                <div className="pt-4">
                  <h4 className="font-bold text-white mb-6 text-right text-lg">
                    الخدمات:
                  </h4>
                  <div className="space-y-6">
                    <div className="flex items-start justify-end gap-4 text-right">
                      <div>
                        <p className="font-bold text-white text-base mb-1">إكسسوارات تقنية مستوردة</p>
                      </div>
                      <Globe className="w-6 h-6 text-[#C084FC] shrink-0 mt-1" fill="currentColor" />
                    </div>

                    <div className="flex items-start justify-end gap-4 text-right">
                      <div>
                        <p className="font-bold text-white text-base mb-1">أدوات مكتبية ذكية</p>
                      </div>
                      <Heart className="w-6 h-6 text-[#C084FC] shrink-0 mt-1" fill="currentColor" />
                    </div>

                    <div className="flex items-start justify-end gap-4 text-right">
                      <div>
                        <p className="font-bold text-white text-base mb-1">معدات تحسين بيئة العمل</p>
                      </div>
                      <Gem className="w-6 h-6 text-[#C084FC] shrink-0 mt-1" fill="currentColor" />
                    </div>

                    <div className="flex items-start justify-end gap-4 text-right">
                      <div>
                        <p className="font-bold text-white text-base mb-1">هدايا تقنية مبتكرة</p>
                      </div>
                      <Gift className="w-6 h-6 text-[#C084FC] shrink-0 mt-1" fill="currentColor" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Button */}
              <a href="https://www.instagram.com/sooq_alketab_tech" target="_blank" rel="noopener noreferrer" className="w-full mt-10 bg-[#1A1A2E] hover:bg-[#2A2A4A] text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-colors duration-300">
                <span className="text-sm">تصفح أحدث المنتجات</span>
                <ShoppingCart className="w-5 h-5" />
              </a>
            </Card>
          </div>
        </div>

        {/* Stats Section */}
        <div className="space-y-12 py-12">
          {/* Hook Before */}
          <div className="text-center">
            <p className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#C084FC] to-[#9333EA] italic">
              “الأثر الحقيقي… يُقاس بما يتحرك، لا بما يُقال.”
            </p>
          </div>

          {/* Intro */}
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
              <BarChart2 className="w-8 h-8 text-brand-purple" />
              الأرقام التي تصنع الرحلة
            </h2>
            <div className="text-slate-300 leading-relaxed space-y-2 text-lg">
              <p>الأرقام هنا ليست للعرض…</p>
              <p>هي انعكاس لحركة الناس داخل المنظومة، ودليل على أن الفكرة لا تعيش وحدها، بل تتحرك مع كل من يمر بها.</p>
              <p>كل رقم يمثل تفاعلًا… وكل تفاعل خطوة جديدة في بناء مشروع يكبر يومًا بعد يوم.</p>
            </div>
          </div>

          {/* Counters */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="flex flex-col items-center text-center p-8 bg-[#0B0B14] border-[#1A1A2E] hover:border-brand-purple/50 transition-colors duration-300">
              <div className="w-16 h-16 bg-brand-purple/10 rounded-full flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-brand-purple" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">عدد الزائرين</h3>
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#C084FC] to-[#9333EA] mb-4">
                <AnimatedCounter value={stats.visitors} />
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                كل دخول إلى الموقع يضيف نقطة جديدة.<br/>
                هذا الرقم يعكس حجم الاهتمام… وبداية كل علاقة.
              </p>
            </Card>

            <Card className="flex flex-col items-center text-center p-8 bg-[#0B0B14] border-[#1A1A2E] hover:border-brand-purple/50 transition-colors duration-300">
              <div className="w-16 h-16 bg-brand-purple/10 rounded-full flex items-center justify-center mb-6">
                <LinkIcon className="w-8 h-8 text-brand-purple" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">عدد الضغطات على الروابط</h3>
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#C084FC] to-[#9333EA] mb-4">
                <AnimatedCounter value={stats.clicks} />
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                كل ضغطة على أي رابط داخل الموقع — أي صفحة، أي قسم — تزيد العداد واحدًا.<br/>
                هذا الرقم يعكس الفضول… والرغبة في معرفة المزيد.
              </p>
            </Card>
          </div>

          {/* Share and Grow Section */}
          <ShareAndGrowSection stats={stats} trackShare={trackShare} />

          {/* Outro */}
          <div className="text-center space-y-8 max-w-3xl mx-auto pt-8">
            <p className="text-slate-300 leading-relaxed text-lg">
              هذه الأرقام ليست نهاية الطريق…<br/>
              بل إشارات على أننا نسير في الاتجاه الصحيح،<br/>
              وأن المنظومة تتحرك… وتتوسع… وتكبر مع كل خطوة.
            </p>
            
            {/* Hook After */}
            <p className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#C084FC] to-[#9333EA] italic">
              “حين يتحرك الناس… تتحرك الفكرة.”
            </p>
          </div>
        </div>

        {/* Skills Section */}
        <Card>
          <SectionTitle icon={Layout}>الخبرات والمهارات</SectionTitle>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <Figma className="w-6 h-6 text-brand-purple" /> تصميم UI/UX (خبرة +3 سنوات)
              </h3>
              <ul className="space-y-4">
                {[
                  'تحليل تجربة المستخدم',
                  'Figma'
                ].map((skill, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-400">
                    <div className="w-1.5 h-1.5 bg-brand-purple rounded-full" />
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-6 rounded-3xl border border-white/5 text-center">
                <Video className="w-8 h-8 text-brand-purple mx-auto mb-3" />
                <p className="font-bold text-white text-sm">الموشن جرافيك</p>
              </div>
              <div className="bg-white/5 p-6 rounded-3xl border border-white/5 text-center">
                <Palette className="w-8 h-8 text-brand-purple mx-auto mb-3" />
                <p className="font-bold text-white text-sm">الهوية البصرية</p>
              </div>
              <div className="bg-white/5 p-6 rounded-3xl border border-white/5 text-center">
                <BarChart3 className="w-8 h-8 text-brand-purple mx-auto mb-3" />
                <p className="font-bold text-white text-sm">استراتيجيات النمو</p>
              </div>
              <div className="bg-white/5 p-6 rounded-3xl border border-white/5 text-center">
                <TrendingUp className="w-8 h-8 text-brand-purple mx-auto mb-3" />
                <p className="font-bold text-white text-sm">تحسين المبيعات</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Social Presence */}
        <div className="space-y-8">
          <SectionTitle icon={Users}>تواجدي الرقمي</SectionTitle>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Facebook, name: 'فيسبوك', vision: 'تابع أحدث إصداراتنا ومبادراتنا', link: 'https://www.facebook.com/share/15rynPPuqv/?mibextid=wwXIfr' },
              { icon: Instagram, name: 'إنستجرام', vision: 'صور حصرية وكواليس عملنا', link: 'https://www.instagram.com/sooq_alketab?igsh=MWFzNDN0aXB5d2U0Mw==' },
              { icon: MessageSquare, name: 'واتساب (تواصل مباشر)', vision: 'للاستفسارات والطلبات المباشرة', link: 'https://wa.me/message/F7R7RTGBN4BEP1' },
              { icon: Users, name: 'مجموعة واتساب', vision: 'انضم لمجتمعنا لمعرفة كل جديد', link: 'https://chat.whatsapp.com/Hoo7gZxFvcSAKJMJ6d5tAv' }
            ].map((social, i) => (
              <a key={i} href={social.link} target="_blank" rel="noopener noreferrer" className="block h-full">
                <Card className="p-6 h-full hover:border-brand-purple/50 transition-colors duration-300">
                  <div className="w-10 h-10 bg-brand-purple/10 rounded-xl flex items-center justify-center text-brand-purple mb-4">
                    <social.icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-white mb-2">{social.name}</h4>
                  <p className="text-slate-500 text-xs leading-relaxed">{social.vision}</p>
                </Card>
              </a>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <Card id="contact">
          <SectionTitle icon={Mail}>تواصل معي</SectionTitle>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <p className="text-slate-400 text-lg">
                هل لديك فكرة أو مشروع؟<br/>
                يسعدني دائمًا التعاون والعمل على شيء جديد.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-slate-300">
                  <Mail className="w-5 h-5 text-brand-purple" />
                  <span>sooqalketab@gmail.com</span>
                </div>
                <div className="flex items-center gap-4 text-slate-300">
                  <Phone className="w-5 h-5 text-brand-purple" />
                  <span>00966551628760</span>
                </div>
              </div>
              <div className="flex gap-4">
                <a href="https://www.facebook.com/share/15rynPPuqv/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-brand-purple/20 transition-colors"><Facebook className="w-5 h-5" /></a>
                <a href="https://www.instagram.com/sooq_alketab?igsh=MWFzNDN0aXB5d2U0Mw==" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-brand-purple/20 transition-colors"><Instagram className="w-5 h-5" /></a>
                <a href="https://wa.me/message/F7R7RTGBN4BEP1" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-brand-purple/20 transition-colors"><MessageSquare className="w-5 h-5" /></a>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                type="text" 
                placeholder="الاسم الكامل"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-purple/50 transition-colors"
                required
              />
              <input 
                type="email" 
                placeholder="البريد الإلكتروني"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-purple/50 transition-colors"
                required
              />
              <textarea 
                placeholder="رسالتك هنا..."
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-purple/50 transition-colors resize-none"
                required
              ></textarea>
              <button className="w-full bg-brand-purple text-white font-bold py-4 rounded-2xl shadow-lg shadow-brand-purple/20 hover:bg-brand-purple/90 transition-all flex items-center justify-center gap-2">
                إرسال الرسالة <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </Card>

      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center">
        <p className="text-slate-500 text-sm">
          © {new Date().getFullYear()} سوق الكتاب (Sooq Alketab). جميع الحقوق محفوظة.
        </p>
      </footer>
    </div>
  );
}

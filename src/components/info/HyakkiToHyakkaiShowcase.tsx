import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Play,
  RotateCcw,
  Layers,
  Type,
  Sun,
  ChevronRight,
  ChevronLeft,
  Zap,
  Flame,
  Pause,
  Award,
  Eye,
  Heart
} from 'lucide-react';

export type ConceptId = 'concept-1' | 'concept-2' | 'concept-3';

interface ConceptMeta {
  id: ConceptId;
  badge: string;
  title: string;
  subtitle: string;
  themeColor: string;
  phases: {
    number: number;
    title: string;
    sub: string;
  }[];
}

const CONCEPTS: ConceptMeta[] = [
  {
    id: 'concept-1',
    badge: 'IDEA 01：明転・昇華アプローチ',
    title: '混沌から光へのブレイクスルー',
    subtitle: '〜 瘴気の墨雲から、内側で弾ける真紅の御光と金箔の結晶 〜',
    themeColor: 'from-purple-900/40 via-wafuu-shu/30 to-amber-500/30',
    phases: [
      { number: 1, title: '百鬼夜行の瘴気とグリッチ', sub: 'CHAOS & SMOKE' },
      { number: 2, title: '内部覚醒・ガラス崩壊クラッシュ', sub: 'SHATTER BREAKTHROUGH' },
      { number: 3, title: '金箔昇華・光の結晶メッセージ', sub: 'CLIMAX RADIANCE' }
    ]
  },
  {
    id: 'concept-2',
    badge: 'IDEA 02：文字変形（モーフィング）アプローチ',
    title: 'おどろおどろしさから個性の光彩へ',
    subtitle: '〜 這いずる影文字の亀裂から噴き出す4色ネオンと空中再構築 〜',
    themeColor: 'from-blue-900/40 via-emerald-800/30 to-amber-500/30',
    phases: [
      { number: 1, title: '画面奥から迫る影の這いずり', sub: 'CREEPING SHADOWS' },
      { number: 2, title: 'へんとつくりの隙間から漏れる4色ネオン', sub: 'NEON COLOR LEAK' },
      { number: 3, title: '空中再構築・個性光彩メッセージ', sub: 'MORPHING SEARCHLIGHT' }
    ]
  },
  {
    id: 'concept-3',
    badge: 'IDEA 03：レイヤー・対比アプローチ',
    title: '夜を塗り替える光のパレード',
    subtitle: '〜 横スクロールする影の行進を追い越す浄化の白光と和風切子 〜',
    themeColor: 'from-indigo-950/60 via-amber-700/30 to-[#FFE895]/30',
    phases: [
      { number: 1, title: 'おどろおどろしい影のシルエット行進', sub: 'SHADOW MARCH' },
      { number: 2, title: '追走する強烈な白光と和風七彩波', sub: 'LIGHT WAVE PURIFICATION' },
      { number: 3, title: '切子発光・晴れ舞台の願いの結実', sub: 'STAINED GLASS FESTIVAL' }
    ]
  }
];

export const HyakkiToHyakkaiShowcase: React.FC = () => {
  const [activeConcept, setActiveConcept] = useState<ConceptId>('concept-1');
  const [currentPhase, setCurrentPhase] = useState<1 | 2 | 3>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const concept = CONCEPTS.find((c) => c.id === activeConcept) || CONCEPTS[0];

  // 1サイクル12秒のアニメーション進行（Phase 1: 0-30%, Phase 2: 30-55%, Phase 3: 55-100%）
  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    const duration = 12000; // 12秒で全フェーズ変化し願いの文章へ到達・ホールド

    const updateAnimation = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const delta = time - lastTimeRef.current;
      lastTimeRef.current = time;

      setProgress((prev) => {
        const next = (prev + (delta / duration) * 100) % 100;

        // 進行度に応じたフェーズ自動切り替え
        if (next < 28) {
          setCurrentPhase(1);
        } else if (next < 52) {
          setCurrentPhase(2);
        } else {
          setCurrentPhase(3);
        }
        return next;
      });

      animFrameRef.current = requestAnimationFrame(updateAnimation);
    };

    animFrameRef.current = requestAnimationFrame(updateAnimation);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, activeConcept]);

  const handleSelectConcept = (id: ConceptId) => {
    setActiveConcept(id);
    setCurrentPhase(1);
    setProgress(0);
    lastTimeRef.current = 0;
    setIsPlaying(true);
  };

  const handleManualPhase = (phase: 1 | 2 | 3) => {
    setCurrentPhase(phase);
    setIsPlaying(false);
    if (phase === 1) setProgress(10);
    if (phase === 2) setProgress(40);
    if (phase === 3) setProgress(75);
  };

  const handleReset = () => {
    setCurrentPhase(1);
    setProgress(0);
    lastTimeRef.current = 0;
    setIsPlaying(true);
  };

  return (
    <div className="space-y-10 w-full font-serif text-wafuu-kinari select-none">

      {/* 独自キーフレームアニメーション定義 */}
      <style>{`
        @keyframes glitch-shake {
          0%, 100% { transform: translate(0, 0) skew(0deg); filter: drop-shadow(0 0 15px rgba(147,51,234,0.7)); }
          20% { transform: translate(-3px, 2px) skew(-3deg); filter: drop-shadow(-4px 0 20px rgba(239,68,68,0.9)); }
          40% { transform: translate(3px, -2px) skew(2deg); filter: drop-shadow(4px 0 20px rgba(168,85,247,0.9)); }
          60% { transform: translate(-2px, -1px) skew(-1deg); filter: drop-shadow(0 0 25px rgba(255,0,128,0.8)); }
          80% { transform: translate(2px, 1px) skew(1deg); filter: drop-shadow(0 0 10px rgba(0,255,255,0.7)); }
        }
        @keyframes smoke-drift {
          0% { transform: translateX(-15%) translateY(0) scale(1.1); opacity: 0.5; }
          50% { transform: translateX(15%) translateY(-5%) scale(1.3); opacity: 0.8; }
          100% { transform: translateX(-15%) translateY(0) scale(1.1); opacity: 0.5; }
        }
        @keyframes glass-shatter-part {
          0% { transform: scale(1) rotate(0deg); opacity: 1; filter: brightness(1.5); }
          50% { transform: scale(1.4) rotate(15deg) translateY(-20px); opacity: 0.9; filter: brightness(2); }
          100% { transform: scale(1.8) rotate(35deg) translateY(-50px); opacity: 0; }
        }
        @keyframes crawl-forward {
          0% { transform: scale(0.6) translateY(40px) rotateX(25deg); filter: blur(4px) brightness(0.2); }
          100% { transform: scale(1.05) translateY(0) rotateX(0deg); filter: blur(0px) brightness(0.8); }
        }
        @keyframes neon-leak-pulse {
          0%, 100% { filter: drop-shadow(0 0 15px currentColor) brightness(1.2); }
          50% { filter: drop-shadow(0 0 35px currentColor) brightness(2.2); }
        }
        @keyframes shadow-march {
          0% { transform: translateX(-120%); opacity: 0; }
          20% { opacity: 0.9; }
          80% { opacity: 0.9; }
          100% { transform: translateX(120%); opacity: 0; }
        }
        @keyframes light-wave-sweep {
          0% { transform: translateX(-150%) skewX(-25deg); opacity: 0; }
          30% { opacity: 1; }
          100% { transform: translateX(150%) skewX(-25deg); opacity: 0; }
        }
        @keyframes text-shine-pulse {
          0%, 100% { text-shadow: 0 0 25px rgba(255,232,149,0.7), 0 0 50px rgba(212,175,55,0.4); }
          50% { text-shadow: 0 0 40px rgba(255,255,255,0.9), 0 0 70px rgba(255,232,149,0.8); }
        }
        @keyframes float-particle {
          0% { transform: translateY(0) scale(0.8) rotate(0deg); opacity: 0; }
          30% { opacity: 0.8; }
          70% { opacity: 0.8; }
          100% { transform: translateY(-120px) scale(1.2) rotate(180deg); opacity: 0; }
        }
      `}</style>

      {/* ==========================================================
          ヘッダー：演出ショーケースタイトル
      ========================================================== */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-wafuu-shu/25 via-wafuu-kincha/30 to-wafuu-ai/25 border border-wafuu-kincha/60 text-xs font-bold text-[#FFE895] tracking-[0.25em] font-mono shadow-xl backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-wafuu-kincha animate-spin" style={{ animationDuration: '8s' }} />
          <span>WAFUU TYPOGRAPHY TRANSFORMATION LAB</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-widest leading-tight">
          「百鬼夜行から、百花の輝きへ」<br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFE895] via-[#D4AF37] to-[#FFB2B2]">
            完全アニメーション演出 3案
          </span>
        </h2>

        <p className="text-xs sm:text-sm text-wafuu-kinari/85 max-w-3xl mx-auto leading-relaxed tracking-wide">
          説明文に頼らず、文字とエフェクトの動きそのもので「混沌から希望へのドラマチックな転換」を描き出します。<br />
          いずれの演出案も、最終的に物語の真髄である以下の願いの言葉へと美しく変形・到達します。
        </p>

        {/* コンセプト切り替えタブ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 max-w-5xl mx-auto font-sans">
          {CONCEPTS.map((c, idx) => {
            const isActive = c.id === activeConcept;
            return (
              <button
                key={c.id}
                onClick={() => handleSelectConcept(c.id)}
                className={`p-4 sm:p-5 rounded-2xl border text-left transition-all relative overflow-hidden group flex flex-col justify-between shadow-lg ${isActive
                    ? 'bg-gradient-to-br from-[#1C1810] via-[#2A2315] to-[#1F140D] border-wafuu-kincha ring-2 ring-wafuu-kincha/50 scale-[1.02]'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-wafuu-kinari/70'
                  }`}
              >
                {isActive && (
                  <div className="absolute -right-6 -top-6 w-28 h-28 bg-wafuu-kincha/25 rounded-full blur-2xl pointer-events-none" />
                )}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-full ${isActive
                          ? 'bg-wafuu-kincha text-black font-black shadow-md'
                          : 'bg-black/40 text-wafuu-kinari/60 group-hover:text-white'
                        }`}
                    >
                      IDEA 0{idx + 1}
                    </span>
                    {isActive && (
                      <span className="text-xs font-bold text-wafuu-kincha flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" /> 再生中
                      </span>
                    )}
                  </div>
                  <h3 className={`font-serif font-black text-base sm:text-lg tracking-wide ${isActive ? 'text-white' : 'text-wafuu-kinari/90'}`}>
                    {c.title}
                  </h3>
                </div>
                <p className="text-xs text-wafuu-kinari/70 mt-2 line-clamp-2 leading-relaxed">
                  {c.subtitle}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* ==========================================================
          メイン・シネマティック・アニメーション・ステージ
      ========================================================== */}
      <div className="bg-gradient-to-b from-[#060911] via-[#0D1322] to-[#05080F] rounded-3xl border-2 border-wafuu-kincha/60 shadow-[0_0_70px_rgba(0,0,0,0.9)] overflow-hidden relative">

        {/* 背景環境変化エフェクト（Phaseに応じて背景色と雰囲気が劇的に変わる） */}
        <div className={`absolute inset-0 pointer-events-none transition-all duration-1000 ${currentPhase === 1 ? 'opacity-80' : currentPhase === 2 ? 'opacity-90' : 'opacity-100'
          }`}>
          {currentPhase === 1 && (
            <>
              <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-purple-950/40 blur-[130px] animate-pulse" />
              <div className="absolute bottom-[-20%] right-[-10%] w-[70vw] h-[70vw] rounded-full bg-black blur-[100px]" />
            </>
          )}
          {currentPhase === 2 && (
            <>
              <div className="absolute top-[-10%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-wafuu-shu/25 blur-[120px] animate-pulse" />
              <div className="absolute bottom-[-10%] right-[20%] w-[60vw] h-[60vw] rounded-full bg-blue-600/25 blur-[120px]" />
            </>
          )}
          {currentPhase === 3 && (
            <>
              <div className="absolute top-[-10%] left-[10%] w-[70vw] h-[70vw] rounded-full bg-amber-500/25 blur-[140px]" />
              <div className="absolute bottom-[-10%] right-[10%] w-[70vw] h-[70vw] rounded-full bg-wafuu-kincha/30 blur-[140px]" />
            </>
          )}
        </div>

        {/* コントロールバー＆タイムライン進行ゲージ */}
        <div className="px-6 py-4 bg-black/70 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 relative z-20 font-sans">
          <div className="flex items-center gap-3">
            <span className={`w-3 h-3 rounded-full ${currentPhase === 3 ? 'bg-[#FFE895] shadow-[0_0_12px_#FFE895]' : 'bg-wafuu-kincha'} animate-pulse`} />
            <span className="text-xs sm:text-sm font-bold text-[#FFE895] tracking-wider font-serif">
              {concept.badge}：{concept.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-4 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${isPlaying
                  ? 'bg-wafuu-kincha/25 border-wafuu-kincha text-[#FFE895]'
                  : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-[#FFE895]" /> : <Play className="w-3.5 h-3.5 fill-white" />}
              <span>{isPlaying ? '演出再生中' : '一時停止'}</span>
            </button>

            <button
              onClick={handleReset}
              className="p-1.5 rounded-xl bg-white/5 border border-white/10 text-wafuu-kinari/80 hover:text-white hover:bg-white/15 transition-all"
              title="最初から再生"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 進行プログレス・フェーズインジケーター */}
        <div className="w-full bg-white/5 h-1.5 relative overflow-hidden z-20">
          <div
            className="h-full bg-gradient-to-r from-purple-500 via-wafuu-shu to-[#FFE895] transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* =========================================================================
            アニメーション・ビューポート本体（高さ確保・完全ダイナミック演出）
        ========================================================================= */}
        <div className="min-h-[440px] sm:min-h-[520px] flex items-center justify-center p-6 sm:p-12 relative overflow-hidden z-10">

          {/* -------------------------------------------------------------
              案1：【明転・昇華アプローチ】混沌から光へのブレイクスルー
          ------------------------------------------------------------- */}
          {activeConcept === 'concept-1' && (
            <div className="w-full flex flex-col items-center justify-center text-center relative">

              {/* Phase 1：百鬼夜行の墨雲・グリッチ（混沌の闇） */}
              {currentPhase === 1 && (
                <div className="space-y-8 py-10 relative w-full animate-fade-in">
                  {/* スモーク＆瘴気パーティクル */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-96 h-64 bg-purple-900/60 rounded-full blur-3xl animate-[smoke-drift_6s_infinite_ease-in-out]" />
                    <div className="w-80 h-80 bg-black/80 rounded-full blur-2xl animate-[smoke-drift_8s_infinite_reverse_ease-in-out]" />
                  </div>

                  <div className="relative inline-block py-6">
                    <h3
                      className="text-7xl sm:text-9xl font-black text-[#15131E] tracking-[0.3em] font-serif select-none relative z-10 animate-[glitch-shake_0.4s_infinite_ease-in-out]"
                      style={{
                        textShadow: '4px 4px 0px #4A154B, -3px -3px 0px #0F172A, 0 0 35px rgba(168,85,247,0.8)'
                      }}
                    >
                      百 鬼 夜 行
                    </h3>
                    {/* 不気味なグリッチ残像レイヤー */}
                    <h3
                      className="text-7xl sm:text-9xl font-black text-purple-600/30 tracking-[0.3em] font-serif absolute top-6 left-1/2 transform -translate-x-1/2 select-none blur-[1px] animate-[glitch-shake_0.6s_infinite_reverse]"
                    >
                      百 鬼 夜 行
                    </h3>
                  </div>

                  <div className="relative z-10 flex items-center justify-center gap-2 text-purple-300 font-mono text-xs tracking-[0.3em] uppercase bg-black/60 px-5 py-2 rounded-full border border-purple-500/40 max-w-md mx-auto">
                    <Flame className="w-4 h-4 text-purple-400 animate-pulse" />
                    <span>PHASE 01: 闇夜に蠢く混沌の墨雲と瘴気</span>
                  </div>
                </div>
              )}

              {/* Phase 2：内部覚醒とガラスクラッシュ・ブレイクスルー */}
              {currentPhase === 2 && (
                <div className="space-y-8 py-10 relative w-full animate-fade-in">
                  {/* 爆発クラッシュ衝撃波 */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-96 h-96 rounded-full bg-gradient-to-r from-wafuu-shu via-amber-500 to-purple-600 opacity-60 blur-3xl animate-ping" style={{ animationDuration: '1.5s' }} />
                  </div>

                  <div className="relative z-10 py-4">
                    <div className="flex items-center justify-center gap-2 sm:gap-6 flex-wrap">
                      {['百', '鬼', '夜', '行'].map((char, idx) => (
                        <div
                          key={idx}
                          className="relative group transform transition-all duration-500"
                          style={{
                            transform: idx % 2 === 0 ? 'scale(1.2) rotate(-8deg) translateY(-10px)' : 'scale(1.2) rotate(10deg) translateY(12px)'
                          }}
                        >
                          {/* 内側から溢れ出す真紅と黄金の閃光 */}
                          <div className="absolute inset-0 bg-gradient-to-t from-wafuu-shu via-amber-400 to-white blur-xl opacity-90 animate-pulse" />

                          <span className="text-7xl sm:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-[#FFE895] to-wafuu-shu tracking-tighter block relative z-10 drop-shadow-[0_0_40px_rgba(239,68,68,0.9)] animate-[glass-shatter-part_1.8s_infinite_ease-out]">
                            {char}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="relative z-10 flex items-center justify-center gap-2 text-[#FFE895] font-mono text-xs tracking-[0.25em] uppercase bg-wafuu-shu/80 px-6 py-2 rounded-full border border-wafuu-kincha shadow-lg max-w-md mx-auto">
                    <Zap className="w-4 h-4 text-[#FFE895] animate-bounce" />
                    <span>PHASE 02: 黄金の鼓動と漆ガラス・激震クラッシュ</span>
                  </div>
                </div>
              )}

              {/* Phase 3：金箔昇華と「願いの文章」への完全到達（クライマックス） */}
              {currentPhase === 3 && (
                <div className="py-6 px-4 sm:px-10 w-full animate-fade-in relative">
                  {/* 舞い上がり降り注ぐ金箔＆光の結晶パーティクル */}
                  <div className="absolute inset-0 pointer-events-none flex justify-around overflow-hidden">
                    {[...Array(16)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-2 h-2 sm:w-3.5 sm:h-3.5 rounded-full bg-gradient-to-r from-[#FFE895] to-white shadow-[0_0_12px_#FFE895] animate-[float-particle_3.5s_infinite_ease-out]"
                        style={{
                          left: `${5 + (i * 6)}%`,
                          bottom: '0%',
                          animationDelay: `${(i % 5) * 0.4}s`,
                          animationDuration: `${2.8 + (i % 4) * 0.5}s`
                        }}
                      />
                    ))}
                  </div>

                  {/* 最終到達文章パネル（圧倒的な輝き） */}
                  <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#1E170A] via-[#2A200D] to-[#151107] border-2 border-[#FFE895] shadow-[0_0_90px_rgba(255,232,149,0.5)] space-y-6 relative z-10 overflow-hidden backdrop-blur-md">
                    <div className="absolute -top-12 -right-12 w-60 h-60 bg-[#FFE895]/20 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-12 -left-12 w-60 h-60 bg-wafuu-shu/20 rounded-full blur-3xl pointer-events-none" />

                    <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-black/60 border border-[#FFE895]/80 text-xs font-bold text-[#FFE895] tracking-[0.25em] font-mono shadow-md">
                      <Sparkles className="w-4 h-4 text-[#FFE895]" />
                      <span>PHASE 03: 昇華完了 ―― 光の結晶が到達した願い</span>
                    </div>

                    {/* クライマックス願い文章 */}
                    <div className="space-y-4 pt-2">
                      <h3 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-wide font-serif drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
                        いろいろな鬼や妖怪が夜に群れ歩く<br className="hidden sm:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-red-400 font-black">
                          「百鬼夜行」
                        </span>
                        から転じて、
                      </h3>
                      <h3 className="text-2xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFE895] via-white to-[#FFD875] leading-tight tracking-widest font-serif animate-[text-shine-pulse_3s_infinite_ease-in-out]">
                        様々な個性を持つ市川生たちが<br className="hidden sm:block" />
                        明るく世界を照らす「輝き」であるように。
                      </h3>
                    </div>

                    <div className="pt-2 flex items-center justify-center gap-3 text-xs sm:text-sm font-serif text-wafuu-kinari/90">
                      <span className="w-8 h-[1px] bg-wafuu-kincha" />
                      <span>これが文字の破片から生まれた、なずな祭の真のメッセージ</span>
                      <span className="w-8 h-[1px] bg-wafuu-kincha" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* -------------------------------------------------------------
              案2：【文字変形（モーフィング）アプローチ】おどろおどろしさから個性の光彩へ
          ------------------------------------------------------------- */}
          {activeConcept === 'concept-2' && (
            <div className="w-full flex flex-col items-center justify-center text-center relative">

              {/* Phase 1：画面奥から迫る影の這いずり */}
              {currentPhase === 1 && (
                <div className="space-y-8 py-10 relative w-full animate-fade-in">
                  <div className="flex items-center justify-center gap-3 sm:gap-8 py-6">
                    {['百', '鬼', '夜', '行'].map((char, idx) => (
                      <div
                        key={idx}
                        className="w-20 h-28 sm:w-28 sm:h-36 rounded-2xl bg-[#090D14] border border-white/10 flex items-center justify-center shadow-2xl relative overflow-hidden animate-[crawl-forward_2.2s_infinite_ease-in-out]"
                        style={{ animationDelay: `${idx * 0.25}s` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-[#111827] to-transparent opacity-90" />
                        <span className="text-5xl sm:text-7xl font-black text-white/20 tracking-tighter font-serif relative z-10">
                          {char}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="relative z-10 flex items-center justify-center gap-2 text-[#86ACDE] font-mono text-xs tracking-[0.25em] uppercase bg-black/60 px-6 py-2 rounded-full border border-blue-500/40 max-w-md mx-auto">
                    <Eye className="w-4 h-4 text-blue-400 animate-pulse" />
                    <span>PHASE 01: 漆黒の影として這いずるあやかし文字</span>
                  </div>
                </div>
              )}

              {/* Phase 2：へんとつくりの亀裂から漏れる4色鮮烈ネオン */}
              {currentPhase === 2 && (
                <div className="space-y-8 py-8 relative w-full animate-fade-in">
                  <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 py-2">
                    {[
                      { char: '百', color: 'from-red-500 to-amber-400', textColor: 'text-red-400', label: '朱赤（熱情）', shadow: 'rgba(239,68,68,0.8)' },
                      { char: '鬼', color: 'from-blue-500 to-cyan-300', textColor: 'text-blue-400', label: '瑠璃紺（探究）', shadow: 'rgba(59,130,246,0.8)' },
                      { char: '夜', color: 'from-amber-400 to-yellow-200', textColor: 'text-yellow-300', label: '山吹（創造）', shadow: 'rgba(245,158,11,0.8)' },
                      { char: '行', color: 'from-emerald-400 to-teal-300', textColor: 'text-emerald-300', label: '翡翠（調和）', shadow: 'rgba(16,185,129,0.8)' }
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="w-24 h-32 sm:w-32 sm:h-40 rounded-3xl bg-black border-2 border-white/40 flex flex-col items-center justify-center relative overflow-hidden transform scale-105 transition-all animate-[neon-leak-pulse_1.5s_infinite_ease-in-out]"
                        style={{ color: item.shadow }}
                      >
                        {/* 隙間から噴き出すネオン光 */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-40 animate-pulse`} />
                        <span className={`text-5xl sm:text-7xl font-black ${item.textColor} tracking-tighter font-serif relative z-10 drop-shadow-lg`}>
                          {item.char}
                        </span>
                        <span className="text-[11px] font-bold text-white bg-black/80 px-2.5 py-0.5 rounded-full mt-3 relative z-10 border border-white/20">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="relative z-10 flex items-center justify-center gap-2 text-white font-mono text-xs tracking-[0.25em] uppercase bg-black/70 px-6 py-2 rounded-full border border-white/30 max-w-lg mx-auto">
                    <Layers className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
                    <span>PHASE 02: へんとつくりの隙間から噴き出す多彩な個性のネオン</span>
                  </div>
                </div>
              )}

              {/* Phase 3：パーツが再構築され「願いの文章」へ変形到達（クライマックス） */}
              {currentPhase === 3 && (
                <div className="py-6 px-4 sm:px-10 w-full animate-fade-in relative">
                  {/* サーチライト回転エフェクト */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-25">
                    <div className="w-[200%] h-[200%] bg-[conic-gradient(from_0deg_at_50%_50%,_transparent_0deg,_#EF4444_45deg,_transparent_90deg,_#3B82F6_135deg,_transparent_180deg,_#F59E0B_225deg,_transparent_270deg,_#10B981_315deg,_transparent_360deg)] animate-spin" style={{ animationDuration: '16s' }} />
                  </div>

                  <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#111A2E] via-[#1A263B] to-[#0F1624] border-2 border-blue-400/80 shadow-[0_0_90px_rgba(59,130,246,0.4)] space-y-6 relative z-10 overflow-hidden backdrop-blur-md">
                    <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-black/60 border border-blue-400 text-xs font-bold text-[#86ACDE] tracking-[0.25em] font-mono shadow-md">
                      <Award className="w-4 h-4 text-blue-400" />
                      <span>PHASE 03: モーフィング再構築 ―― 4色光彩が照らす未来</span>
                    </div>

                    {/* クライマックス願い文章（4色個性のグラデーション強調） */}
                    <div className="space-y-4 pt-2">
                      <h3 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-wide font-serif drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
                        いろいろな鬼や妖怪が夜に群れ歩く<br className="hidden sm:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-purple-400 to-blue-400 font-black">
                          「百鬼夜行」
                        </span>
                        から転じて、
                      </h3>
                      <h3 className="text-2xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-300 via-green-400 to-blue-400 leading-tight tracking-widest font-serif animate-[text-shine-pulse_3s_infinite_ease-in-out]">
                        様々な個性を持つ市川生たちが<br className="hidden sm:block" />
                        明るく世界を照らす「輝き」であるように。
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                      {[
                        { kanji: '朱赤の情熱', color: 'bg-red-500/20 border-red-400 text-red-300' },
                        { kanji: '瑠璃の探究', color: 'bg-blue-500/20 border-blue-400 text-blue-300' },
                        { kanji: '山吹の黄金', color: 'bg-amber-500/20 border-amber-400 text-amber-300' },
                        { kanji: '翡翠の創造', color: 'bg-emerald-500/20 border-emerald-400 text-emerald-300' }
                      ].map((tag, i) => (
                        <span key={i} className={`px-3.5 py-1 rounded-xl border text-xs font-bold ${tag.color}`}>
                          {tag.kanji}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* -------------------------------------------------------------
              案3：【レイヤー・対比アプローチ】夜を塗り替える光のパレード
          ------------------------------------------------------------- */}
          {activeConcept === 'concept-3' && (
            <div className="w-full flex flex-col items-center justify-center text-center relative">

              {/* Phase 1：横スクロールする影の行進 */}
              {currentPhase === 1 && (
                <div className="space-y-8 py-10 relative w-full animate-fade-in">
                  <div className="w-full bg-[#050811] border-y-2 border-indigo-950 py-12 px-6 relative overflow-hidden flex items-center justify-center shadow-inner">
                    <div className="flex items-center gap-8 sm:gap-14 tracking-widest text-6xl sm:text-8xl font-black font-serif text-black opacity-90 animate-[shadow-march_4s_infinite_linear]"
                      style={{ textShadow: '0 0 15px #1E2E4A' }}>
                      <span>百</span><span>鬼</span><span>夜</span><span>行</span>
                    </div>
                    <div className="absolute right-6 bottom-3 flex items-center gap-1.5 text-xs font-mono text-indigo-400">
                      <span>影のシルエット行進：左から右へ</span>
                      <ChevronRight className="w-4 h-4 animate-bounce" />
                    </div>
                  </div>

                  <div className="relative z-10 flex items-center justify-center gap-2 text-indigo-300 font-mono text-xs tracking-[0.25em] uppercase bg-black/60 px-6 py-2 rounded-full border border-indigo-500/40 max-w-md mx-auto">
                    <ChevronRight className="w-4 h-4 text-indigo-400" />
                    <span>PHASE 01: 暗夜の絵巻をゾロゾロと通り過ぎるあやかし影</span>
                  </div>
                </div>
              )}

              {/* Phase 2：後ろから追走する強烈な白光・七彩波 */}
              {currentPhase === 2 && (
                <div className="space-y-8 py-10 relative w-full animate-fade-in">
                  <div className="w-full bg-gradient-to-r from-white via-[#FFE895] via-pink-400 to-[#0A0F1D] border-y-2 border-[#FFE895] py-12 px-6 relative overflow-hidden flex items-center justify-between shadow-[0_0_60px_rgba(255,232,149,0.7)]">

                    {/* 高速スイープする光の波レイヤー */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-80 animate-[light-wave-sweep_1.8s_infinite_ease-in-out]" />

                    <div className="flex items-center gap-4 text-left z-10">
                      <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-xl">
                        <Sun className="w-8 h-8 text-wafuu-kincha animate-spin" style={{ animationDuration: '4s' }} />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-black font-mono block tracking-wider">PURIFICATION LIGHT WAVE</span>
                        <span className="text-xl sm:text-2xl font-black text-black font-serif">影を追い抜く強烈な白光と虹彩の波</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-4xl sm:text-6xl font-black font-serif text-white/40 z-10 pr-8">
                      <span>百</span><span>鬼</span><span>夜</span><span>行</span>
                    </div>
                  </div>

                  <div className="relative z-10 flex items-center justify-center gap-2 text-[#FFE895] font-mono text-xs tracking-[0.25em] uppercase bg-black/70 px-6 py-2 rounded-full border border-[#FFE895]/50 max-w-md mx-auto">
                    <Sun className="w-4 h-4 text-[#FFE895] animate-pulse" />
                    <span>PHASE 02: 光の波に触れた瞬間、和風切子ステンドグラスへ弾ける</span>
                  </div>
                </div>
              )}

              {/* Phase 3：切子発光と晴れ舞台で結実する「願いの文章」到達（クライマックス） */}
              {currentPhase === 3 && (
                <div className="py-6 px-4 sm:px-10 w-full animate-fade-in relative">
                  {/* ステンドグラス切子の煌めきパーティクル */}
                  <div className="absolute inset-0 pointer-events-none flex justify-around opacity-60">
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className="w-4 h-4 sm:w-6 sm:h-6 rotate-45 border border-[#FFE895] bg-gradient-to-br from-white/30 to-amber-400/30 animate-pulse"
                        style={{
                          animationDelay: `${i * 0.3}s`,
                          animationDuration: `${2 + (i % 3)}s`
                        }}
                      />
                    ))}
                  </div>

                  <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-tr from-[#2C1F0B] via-[#4A3513] to-[#241908] border-2 border-[#FFE895] shadow-[0_0_90px_rgba(255,232,149,0.6)] space-y-6 relative z-10 overflow-hidden backdrop-blur-md">
                    <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-black/60 border border-[#FFE895] text-xs font-bold text-[#FFE895] tracking-[0.25em] font-mono shadow-md">
                      <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                      <span>PHASE 03: 晴れ舞台開闢 ―― 切子の輝きが映す願い</span>
                    </div>

                    {/* クライマックス願い文章（ステンドグラス＆晴れ舞台ゴールド） */}
                    <div className="space-y-4 pt-2">
                      <h3 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-wide font-serif drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
                        いろいろな鬼や妖怪が夜に群れ歩く<br className="hidden sm:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-300 to-indigo-300 font-black">
                          「百鬼夜行」
                        </span>
                        から転じて、
                      </h3>
                      <h3 className="text-2xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFE895] via-white to-[#FFB2B2] leading-tight tracking-widest font-serif animate-[text-shine-pulse_3s_infinite_ease-in-out]">
                        様々な個性を持つ市川生たちが<br className="hidden sm:block" />
                        明るく世界を照らす「輝き」であるように。
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-2">
                      {[
                        { word: '和風切子発光', sub: 'Kiriko Glass', color: 'border-amber-400/60 bg-amber-500/10 text-[#FFE895]' },
                        { word: '百花繚乱の光', sub: 'Bloom', color: 'border-rose-400/60 bg-rose-500/10 text-[#FFB2B2]' },
                        { word: '夜を塗り替える', sub: 'Repaint', color: 'border-blue-400/60 bg-blue-500/10 text-[#B2D1FF]' },
                        { word: '未来照らす舞台', sub: 'Festival Stage', color: 'border-emerald-400/60 bg-emerald-500/10 text-[#B2FFD1]' }
                      ].map((card, idx) => (
                        <div key={idx} className={`p-2.5 rounded-xl border ${card.color} flex flex-col items-center justify-center text-center shadow-md`}>
                          <span className="text-xs sm:text-sm font-bold font-serif">{card.word}</span>
                          <span className="text-[10px] font-mono opacity-70">{card.sub}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* タイムライン・ステップ選択＆進行コントローラー */}
        <div className="px-6 py-5 bg-black/80 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans relative z-20">
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center overflow-x-auto pb-2 sm:pb-0">
            {concept.phases.map((ph) => {
              const isCurrent = currentPhase === ph.number;
              return (
                <button
                  key={ph.number}
                  onClick={() => handleManualPhase(ph.number as 1 | 2 | 3)}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2.5 shrink-0 shadow-md ${isCurrent
                      ? 'bg-gradient-to-r from-wafuu-kincha to-[#9A7B2C] text-black border-[#FFE895] font-black scale-105 ring-2 ring-[#FFE895]/50'
                      : 'bg-white/5 text-wafuu-kinari/70 border-white/10 hover:bg-white/10 hover:text-white'
                    }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${isCurrent ? 'bg-black text-wafuu-kincha' : 'bg-white/10 text-white'
                    }`}>
                    0{ph.number}
                  </span>
                  <div className="text-left">
                    <span className="block leading-none">{ph.title}</span>
                    <span className={`text-[9px] font-mono block mt-0.5 ${isCurrent ? 'text-black/70' : 'text-wafuu-kinari/50'}`}>
                      {ph.sub}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleManualPhase(currentPhase <= 1 ? 3 : (currentPhase - 1) as 1 | 2 | 3)}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-xs text-wafuu-kinari/80 flex items-center gap-1 transition-all"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>前のシーン</span>
            </button>
            <span className="text-xs font-mono text-wafuu-kincha font-bold px-3">
              SCENE 0{currentPhase} / 03
            </span>
            <button
              onClick={() => handleManualPhase(currentPhase >= 3 ? 1 : (currentPhase + 1) as 1 | 2 | 3)}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-xs text-wafuu-kinari/80 flex items-center gap-1 transition-all"
            >
              <span>次のシーン</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* ==========================================================
          演出美学のポイント（書体対比と色彩転生）
      ========================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 font-sans">
        <div className="p-8 rounded-3xl bg-gradient-to-br from-[#131926] to-[#0A0E17] border border-white/15 shadow-xl space-y-4 relative overflow-hidden group hover:border-wafuu-kincha/60 transition-all">
          <div className="absolute top-0 right-0 w-36 h-36 bg-purple-600/10 rounded-full blur-2xl pointer-events-none" />
          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-[#86ACDE] mb-2 shadow-md">
            <Type className="w-6 h-6" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white font-serif tracking-wider">
            書体の劇的対比（フォントのギャップ）
          </h3>
          <p className="text-xs sm:text-sm text-wafuu-kinari/80 leading-relaxed font-serif">
            前半フェーズの「百鬼夜行」では、少しトゲのある筆文字や不気味に蠢く歪んだ書体演出を採用。そこから後半のクライマックスでは、洗練されたシャープな明朝体・モダンフォントへ切り替えることで、文字そのものの動きがドラマを生み出します。
          </p>
          <div className="pt-2 flex items-center gap-3 text-xs font-mono text-wafuu-kincha font-bold">
            <span className="px-3 py-1 rounded bg-black border border-purple-500/40 text-purple-300">混沌の太字・筆文字</span>
            <ChevronRight className="w-4 h-4 text-wafuu-kinari/50" />
            <span className="px-3 py-1 rounded bg-black border border-wafuu-kincha text-[#FFE895]">光のシャープ洗練書体</span>
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-gradient-to-br from-[#1C1810] to-[#0D0A06] border border-wafuu-kincha/40 shadow-xl space-y-4 relative overflow-hidden group hover:border-wafuu-kincha transition-all">
          <div className="absolute top-0 right-0 w-36 h-36 bg-wafuu-kincha/15 rounded-full blur-2xl pointer-events-none" />
          <div className="w-12 h-12 rounded-2xl bg-wafuu-kincha/20 border border-wafuu-kincha/50 flex items-center justify-center text-[#FFE895] mb-2 shadow-md">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white font-serif tracking-wider">
            色彩の昇華（カラーパレットの変化）
          </h3>
          <p className="text-xs sm:text-sm text-wafuu-kinari/80 leading-relaxed font-serif">
            「黒・深い紫・藍鉄」といった夜と混沌のパレットから、「白・ゴールド・4色の和風ネオン」という多様で圧倒的な輝きへと移り変わる演出。一人ひとりの異なる個性と情熱が調和し、なずな祭の空を照らし出します。
          </p>
          <div className="pt-2 flex items-center gap-3 text-xs font-mono text-wafuu-kincha font-bold">
            <span className="px-3 py-1 rounded bg-black border border-indigo-500/40 text-indigo-300">黒・紫・深緑（混沌）</span>
            <ChevronRight className="w-4 h-4 text-wafuu-kinari/50" />
            <span className="px-3 py-1 rounded bg-black border border-wafuu-kincha text-[#FFE895]">白・金・多色パステル／ネオン</span>
          </div>
        </div>
      </div>

    </div>
  );
};

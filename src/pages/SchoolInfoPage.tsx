import React, { useState } from 'react';
import { Sparkles, Compass, Flame, ArrowDown, ShieldCheck, ArrowRight, Eye, Star } from 'lucide-react';
import { HyakkiToHyakkaiShowcase } from '../components/info/HyakkiToHyakkaiShowcase';

export const SchoolInfoPage: React.FC = () => {
  const [activeAct, setActiveAct] = useState<number>(1);

  return (
    <div className="min-h-screen bg-[#070B13] text-wafuu-kinari font-serif select-none overflow-hidden relative">
      
      {/* ==========================================================
          背景アクセント：金茶と藍鉄の微細な光輝と和紙・金箔効果
      ========================================================== */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-wafuu-shu/10 blur-[130px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-wafuu-kincha/10 blur-[130px] animate-pulse" style={{ animationDuration: '12s' }} />
        <div className="absolute top-[40%] left-[30%] w-[30vw] h-[30vw] rounded-full bg-wafuu-ai/15 blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-20 relative z-10 space-y-24">
        
        {/* ==========================================================
            【メイン】タイポグラフィ・トランスフォーム・ショーケース（3案インタラクティブ体験）
        ========================================================== */}
        <section className="pt-2">
          <HyakkiToHyakkaiShowcase />
        </section>

        {/* ==========================================================
            四幕ストーリー：クイックナビゲーション＆導入
        ========================================================== */}
        <div className="text-center space-y-6 pt-8 border-t border-white/10">
          <div className="space-y-2">
            <span className="text-xs sm:text-sm tracking-[0.3em] text-wafuu-kincha block font-bold">
              第76回 なずな祭 公式ストーリー詳細
            </span>
            <h3 className="text-2xl sm:text-4xl font-black text-white tracking-widest font-serif">
              「百輝夜行」四幕の物語
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-wafuu-kinari/80 max-w-2xl mx-auto font-serif leading-relaxed">
            ここで紐解かれるのは、宵闇からパレードの結実まで、なずな祭が辿る四つの幕（アクト）です。
          </p>

          {/* 4幕クイックナビゲーションバー */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 font-sans">
            {[
              { act: 1, title: '第一幕：宵闇と静寂', color: 'from-[#131D2E] to-[#1E2E4A]', border: 'border-wafuu-ai' },
              { act: 2, title: '第二幕：和傘と一筆の閃光', color: 'from-[#6E1418] to-[#9E1B22]', border: 'border-wafuu-shu' },
              { act: 3, title: '第三幕：百の輝きの共鳴', color: 'from-[#8C6B22] to-[#B89030]', border: 'border-wafuu-kincha' },
              { act: 4, title: '第四幕：パレードの結実', color: 'from-[#1A263B] to-[#2D3E5E]', border: 'border-white/40' },
            ].map((item) => (
              <button
                key={item.act}
                onClick={() => {
                  setActiveAct(item.act);
                  const el = document.getElementById(`act-${item.act}`);
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className={`px-5 py-3 rounded-2xl border transition-all text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md ${
                  activeAct === item.act
                    ? `bg-gradient-to-r ${item.color} text-white ${item.border} scale-105 shadow-xl`
                    : 'bg-white/5 text-wafuu-kinari/70 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="font-mono text-[10px] text-wafuu-kincha font-bold px-1.5 py-0.5 rounded bg-black/40">ACT.0{item.act}</span>
                <span>{item.title}</span>
              </button>
            ))}
          </div>

          <div className="pt-4 text-wafuu-kincha/60 animate-bounce flex justify-center">
            <ArrowDown className="w-6 h-6" />
          </div>
        </div>

        {/* ==========================================================
            第一幕：宵闇と静寂の幕開け (The Twilight Prelude)
        ========================================================== */}
        <div id="act-1" className="scroll-mt-28 space-y-8 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-wafuu-deep to-[#1F314E] border border-wafuu-ai/60 flex items-center justify-center text-white shadow-[0_0_30px_rgba(33,48,74,0.6)] shrink-0">
              <Compass className="w-8 h-8 text-[#86ACDE]" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold tracking-[0.25em] text-[#86ACDE] block uppercase">
                ACT 01: THE TWILIGHT PRELUDE
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-wider font-serif">
                第一幕：宵闇と静寂の幕開け
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-gradient-to-br from-[#101827] via-[#162236] to-[#0D131F] p-8 sm:p-12 rounded-3xl border border-wafuu-ai/40 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-wafuu-ai/15 rounded-full blur-3xl pointer-events-none" />

            <div className="md:col-span-7 space-y-6 relative z-10 leading-relaxed text-base sm:text-lg text-wafuu-kinari/90 font-serif">
              <p className="border-l-4 border-[#86ACDE] pl-4 text-white font-bold text-lg sm:text-xl">
                夜の帳がキャンパスへ降りる時、静かな気配が目を覚ます。
              </p>
              <p>
                文化祭の開幕を告げる前の静寂。それは単なる夜ではなく、かつてない熱狂が産声を上げるための「藍鉄紺のゆりかご」です。
                行灯の微光が石畳を照らし、それぞれの教室で重ねられた数え切れない準備の時間と想いが、静かにその輪郭を現します。
              </p>
              <div className="p-5 rounded-2xl bg-black/40 border border-white/10 text-xs sm:text-sm font-sans text-wafuu-kinari/80 space-y-2">
                <div className="flex items-center gap-2 font-bold text-[#86ACDE] font-serif">
                  <Star className="w-4 h-4" />
                  <span>第一幕の美学：静の中に秘められた爆発力</span>
                </div>
                <p>
                  静けさの中にこそ、最も濃いエネルギーが宿る――なずな祭「百輝夜行」は、この厳かな夜の静寂から最初の一歩を踏み出します。
                </p>
              </div>
            </div>

            <div className="md:col-span-5 flex justify-center relative z-10">
              <div className="w-full h-72 sm:h-80 rounded-3xl bg-gradient-to-tr from-[#080D16] to-[#1D2E4A] border border-[#86ACDE]/30 p-6 flex flex-col items-center justify-center text-center shadow-inner relative group overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#86ACDE]/10 via-transparent to-transparent opacity-80" />
                <div className="w-20 h-20 rounded-full bg-[#132034] border-2 border-[#86ACDE]/60 flex items-center justify-center mb-4 shadow-[0_0_40px_rgba(134,172,222,0.4)] transition-transform duration-500 group-hover:scale-110">
                  <Flame className="w-10 h-10 text-[#86ACDE]" />
                </div>
                <span className="font-serif font-black text-xl text-white tracking-wider">宵闇の灯火</span>
                <span className="text-xs font-mono text-[#86ACDE] pt-1">SILENT IGNITION</span>
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================================
            第二幕：赤い和傘と一筆の閃光 (The Crimson Umbrella & Brushstroke)
        ========================================================== */}
        <div id="act-2" className="scroll-mt-28 space-y-8 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-wafuu-shu via-wafuu-shu-dark to-[#731317] border border-wafuu-shu/60 flex items-center justify-center text-white shadow-[0_0_30px_rgba(209,75,65,0.6)] shrink-0">
              {/* 和傘モチーフ SVG */}
              <svg className="w-9 h-9 text-white animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 2v2M12 22v-6M4.93 4.93l1.41 1.41M19.07 4.93l-1.41 1.41" />
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12h20z" fill="currentColor" fillOpacity="0.2" />
                <path d="M12 12L7 7M12 12l5-5M12 12l-3-5M12 12l3-5" />
              </svg>
            </div>
            <div>
              <span className="text-xs font-mono font-bold tracking-[0.25em] text-[#FF9E9E] block uppercase">
                ACT 02: THE CRIMSON UMBRELLA & BRUSHSTROKE ARC
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-wider font-serif">
                第二幕：赤い和傘と一筆の閃光
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-gradient-to-br from-[#2B0E10] via-[#1E0B0D] to-[#120708] p-8 sm:p-12 rounded-3xl border border-wafuu-shu/50 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-80 h-80 bg-wafuu-shu/20 rounded-full blur-3xl pointer-events-none" />

            <div className="md:col-span-5 order-2 md:order-1 flex justify-center relative z-10">
              <div className="w-full h-72 sm:h-80 rounded-3xl bg-gradient-to-tr from-[#1E090B] to-[#401216] border border-wafuu-shu/40 p-6 flex flex-col items-center justify-center text-center shadow-inner relative group overflow-hidden">
                <div className="w-24 h-24 rounded-full bg-[#351013] border-2 border-[#FF9E9E]/60 flex items-center justify-center mb-4 shadow-[0_0_50px_rgba(209,75,65,0.6)] transition-transform duration-500 group-hover:rotate-12">
                  <svg className="w-12 h-12 text-[#FF9E9E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v2M12 22v-6M4.93 4.93l1.41 1.41M19.07 4.93l-1.41 1.41" />
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12h20z" fill="currentColor" fillOpacity="0.25" />
                  </svg>
                </div>
                <span className="font-serif font-black text-xl text-white tracking-wider">真紅の骨組み</span>
                <span className="text-xs font-mono text-[#FF9E9E] pt-1">CRIMSON RESOLVE</span>
              </div>
            </div>

            <div className="md:col-span-7 order-1 md:order-2 space-y-6 relative z-10 leading-relaxed text-base sm:text-lg text-wafuu-kinari/90 font-serif">
              <p className="border-l-4 border-wafuu-shu pl-4 text-white font-bold text-lg sm:text-xl">
                漆黒の紙面に走る一筆の稲妻、赤い和傘が熱情を解き放つ。
              </p>
              <p>
                百輝夜行の象徴たる「赤い和傘」。その骨組みは、困難や風雨にあっても決して折れない強靭な熱意と、全校生徒が一つに繋がる絆を意味します。
                和傘を開く一瞬の動作は、真っ黒なキャンバスに極太の毛筆が一筆で閃光を描くかのような、圧倒的な情熱の奔流です。
              </p>
              <div className="p-5 rounded-2xl bg-black/40 border border-white/10 text-xs sm:text-sm font-sans text-wafuu-kinari/80 space-y-2">
                <div className="flex items-center gap-2 font-bold text-[#FF9E9E] font-serif">
                  <ShieldCheck className="w-4 h-4" />
                  <span>第二幕の美学：個の情熱が結集する「傘の骨組み」</span>
                </div>
                <p>
                  一本一本の細い竹骨が中央で束ねられ、巨大な和傘を支えるように――生徒たちの多彩な情熱が中央で交わり、文化祭という一つの巨大な華を開かせます。
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================================
            第三幕：百の輝きと共鳴するあやかしの宴 (A Hundred Radiances)
        ========================================================== */}
        <div id="act-3" className="scroll-mt-28 space-y-8 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-wafuu-kincha via-[#A67C28] to-[#6E5016] border border-wafuu-kincha/60 flex items-center justify-center text-white shadow-[0_0_30px_rgba(212,175,55,0.6)] shrink-0">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold tracking-[0.25em] text-[#FFE895] block uppercase">
                ACT 03: A HUNDRED RESONATING RADIANCES
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-wider font-serif">
                第三幕：百の輝きと共鳴する宴
              </h2>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#1C170B] via-[#241E10] to-[#131008] p-8 sm:p-14 rounded-3xl border border-wafuu-kincha/50 shadow-2xl relative overflow-hidden space-y-8">
            <div className="absolute top-0 right-1/3 w-96 h-96 bg-wafuu-kincha/15 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-3xl space-y-4 relative z-10 font-serif leading-relaxed text-base sm:text-lg text-wafuu-kinari/90">
              <p className="border-l-4 border-wafuu-kincha pl-4 text-white font-bold text-lg sm:text-xl">
                単一の光ではない。百人百様、千差万別の色が夜を黄金に染める。
              </p>
              <p>
                『百鬼夜行』が異形たちの行進であるならば、『百輝夜行』はクラス企画、文化部公演、有志バンド、模擬店…
                ありとあらゆる表現者が自らの色で夜を照らす黄金の宴です。お互いの光を打ち消すことなく、共鳴し合って夜空へ舞い上がります。
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 relative z-10 font-sans">
              <div className="p-6 rounded-2xl bg-black/50 border border-wafuu-kincha/30 space-y-3 shadow-md hover:border-wafuu-kincha/70 transition-all">
                <div className="flex items-center gap-2.5 text-[#FFE895] font-bold text-base font-serif">
                  <span className="w-2.5 h-2.5 rounded-full bg-wafuu-kincha shadow-[0_0_10px_rgba(212,175,55,0.8)]" />
                  <span>クラス展示の創発熱</span>
                </div>
                <p className="text-xs sm:text-sm text-wafuu-kinari/80 leading-relaxed">
                  教室という限られた四角い空間を、圧倒的な世界観と工夫で別世界へと変貌させるクラス団結の結晶。
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-black/50 border border-wafuu-kincha/30 space-y-3 shadow-md hover:border-wafuu-kincha/70 transition-all">
                <div className="flex items-center gap-2.5 text-[#FFE895] font-bold text-base font-serif">
                  <span className="w-2.5 h-2.5 rounded-full bg-wafuu-shu shadow-[0_0_10px_rgba(209,75,65,0.8)]" />
                  <span>ステージ公演の爆発力</span>
                </div>
                <p className="text-xs sm:text-sm text-wafuu-kinari/80 leading-relaxed">
                  古賀記念アリーナ・Nステ会場・國枝記念国際ホールで巻き起こるダンスと音楽と演劇の熱狂。観覧者と演者が一体となる感動の波。
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-black/50 border border-wafuu-kincha/30 space-y-3 shadow-md hover:border-wafuu-kincha/70 transition-all">
                <div className="flex items-center gap-2.5 text-[#FFE895] font-bold text-base font-serif">
                  <span className="w-2.5 h-2.5 rounded-full bg-wafuu-ai shadow-[0_0_10px_rgba(33,48,74,0.8)]" />
                  <span>文化部・有志の深遠</span>
                </div>
                <p className="text-xs sm:text-sm text-wafuu-kinari/80 leading-relaxed">
                  日々の研鑽と学問的探究を惜しみなく披露する文化部展示。知と美の奥深さが光を添えます。
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================================
            第四幕：パレードの結実と未来への軌跡 (The Grand Parade)
        ========================================================== */}
        <div id="act-4" className="scroll-mt-28 space-y-8 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1F2937] via-[#374151] to-[#111827] border border-white/40 flex items-center justify-center text-white shadow-[0_0_30px_rgba(255,255,255,0.3)] shrink-0">
              <Eye className="w-8 h-8 text-[#E2E8F0]" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold tracking-[0.25em] text-[#E2E8F0] block uppercase">
                ACT 04: THE GRAND PARADE & ETERNAL LEGACY
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-wider font-serif">
                第四幕：パレードの結実と未来への軌跡
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-gradient-to-br from-[#111827] via-[#1F2937] to-[#0D131F] p-8 sm:p-14 rounded-3xl border border-white/20 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-wafuu-shu/10 via-wafuu-kincha/10 to-transparent rounded-full blur-3xl pointer-events-none" />

            {/* ポスタービジュアルアート展示 */}
            <div className="lg:col-span-5 flex justify-center relative z-10">
              <div className="p-4 rounded-3xl bg-gradient-to-b from-wafuu-kincha via-[#8C6B22] to-wafuu-shu shadow-2xl">
                <div className="p-2.5 rounded-2xl bg-[#0B121E] overflow-hidden">
                  <img
                    src="/assets/poster/poster_complete.png"
                    alt="百輝夜行 ポスター完成版"
                    className="w-full max-w-[340px] h-auto object-contain rounded-xl transform hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6 relative z-10 leading-relaxed text-base sm:text-lg text-wafuu-kinari/90 font-serif">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-white tracking-wider font-mono">
                <span>FINAL ACT: PARADE CLIMAX</span>
              </div>

              <h3 className="font-serif font-black text-2xl sm:text-4xl text-white tracking-wide leading-tight">
                輝きは一夜で消えない。<br />
                <span className="text-gradient-shu-kincha">心に刻まれる永遠のパレードへ。</span>
              </h3>

              <p>
                百の輝きが合流し、ひとつの巨大なパレードとなって夜明けへと進んでゆきます。
                なずな祭が幕を閉じた後も、ここで燃え上がった情熱や結ばれた絆の輝きが消えることはありません。
                このポスターに描かれた和傘と一筆の軌跡のように、皆様の記憶の中で永久に輝き続けます。
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 font-sans">
                <a
                  href="#act-1"
                  onClick={(e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-wafuu-shu to-wafuu-shu-dark hover:from-wafuu-shu-dark hover:to-[#8B1A1E] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
                >
                  <span>物語の冒頭へ戻る</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

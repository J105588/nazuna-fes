import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';

/*
  ========================================================================
  ShojiOpening - リアルな障子の引き分けオープニング演出（深みのある和風カラー）
  ========================================================================
  
  伝統的な京都・日本家屋の深みある焼杉・濃い漆調木目と、
  歴史を感じさせる深めの古民家未晒し和紙を忠実に再現した3x5格子障子。
*/

interface ShojiOpeningProps {
  onComplete: () => void;
  onOpenStart?: () => void;
}

/* 障子の格子パネル1枚（深め・濃い和紙テクスチャ + 重厚木枠） */
const ShojiPanel: React.FC<{ side: 'left' | 'right' }> = ({ side }) => {
  const cols = 3;
  const rows = 5;
  const cells = Array.from({ length: cols * rows });

  return (
    <div
      data-shoji-panel={side}
      style={{
        position: 'absolute',
        top: 0,
        [side]: 0,
        width: '50%',
        height: '100%',
        zIndex: 2,
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gap: '7px',
        padding: '14px',
        /* 外枠（深みと重厚感のある濃い木枠・漆調木目） */
        background: `linear-gradient(
          180deg,
          #3B250D 0%, #4D3314 15%, #5A3D18 30%,
          #3B250D 50%, #271808 70%, #4D3314 85%, #271808 100%
        )`,
        borderLeft: side === 'right' ? '4px solid #1A0F05' : 'none',
        borderRight: side === 'left' ? '4px solid #1A0F05' : 'none',
        boxShadow: `inset 0 2px 0 rgba(255,255,255,0.08), 
                    inset 0 -3px 0 rgba(0,0,0,0.45), 
                    ${side === 'left' ? '8px' : '-8px'} 0 30px rgba(0,0,0,0.65)`,
        willChange: 'transform',
      }}
    >
      {cells.map((_, i) => (
        <div
          key={i}
          style={{
            /* 深みのある古民家・未晒し和紙テクスチャ（重い1.5px斜めストライプを除去しグラデーションで完全再現） */
            background: `
              radial-gradient(ellipse at ${30 + Math.random() * 40}% ${30 + Math.random() * 40}%, 
                rgba(230, 215, 185, 0.3) 0%, transparent 75%),
              linear-gradient(170deg, #E2D2B5 0%, #D4C1A0 45%, #C9B491 100%)
            `,
            borderRadius: '1px',
            /* 木桟（格子）の深い立体シャドウ */
            boxShadow: `
              inset 0 0 0 1px rgba(59, 37, 13, 0.35),
              inset 0 2px 4px rgba(255, 255, 255, 0.22),
              inset 0 -2px 4px rgba(0, 0, 0, 0.3)
            `,
            /* 和紙の微細な濃淡・透け感 */
            opacity: 0.94 + Math.random() * 0.06,
          }}
        />
      ))}

      {/* 引き手（取っ手）- 黒漆・古代青銅調の重厚な佇まい */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          [side === 'left' ? 'right' : 'left']: '20px',
          transform: 'translateY(-50%)',
          width: '15px',
          height: '54px',
          background: `linear-gradient(
            180deg, #1F1306 0%, #3B250D 30%, #4D3314 50%, #3B250D 70%, #1F1306 100%
          )`,
          borderRadius: '3px',
          boxShadow: `
            inset 0 1px 0 rgba(255,255,255,0.15),
            0 3px 8px rgba(0,0,0,0.6),
            inset 0 0 0 1px rgba(26, 15, 5, 0.8)
          `,
          zIndex: 5,
        }}
      >
        {/* 引き手の凹み */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '7px',
          height: '24px',
          borderRadius: '2px',
          background: 'linear-gradient(180deg, #140A03 0%, #271808 50%, #140A03 100%)',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.7)',
        }} />
      </div>
    </div>
  );
};

export const ShojiOpening: React.FC<ShojiOpeningProps> = ({ onComplete, onOpenStart }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgOverlayRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const onCompleteRef = useRef(onComplete);
  const onOpenStartRef = useRef(onOpenStart);

  useEffect(() => {
    onCompleteRef.current = onComplete;
    onOpenStartRef.current = onOpenStart;
  }, [onComplete, onOpenStart]);

  const startAnimation = useCallback(() => {
    if (!containerRef.current) return;

    const leftPanel = containerRef.current.querySelector('[data-shoji-panel="left"]') as HTMLElement;
    const rightPanel = containerRef.current.querySelector('[data-shoji-panel="right"]') as HTMLElement;
    const lightBeam = containerRef.current.querySelector('[data-shoji-light]') as HTMLElement;

    if (!leftPanel || !rightPanel) return;

    // prefers-reduced-motion チェック
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(false);
      onCompleteRef.current();
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setIsVisible(false);
      },
    });

    // Phase 0: 初期待機（0.4s）- 完全に閉じた状態
    tl.set([leftPanel, rightPanel], { x: 0, force3D: true });

    // Phase 1: 中央の隙間から金茶の光が漏れ出す（0.4s〜1.0s）
    if (lightBeam) {
      tl.to(lightBeam, {
        opacity: 0.85,
        scaleX: 1.6,
        duration: 0.6,
        ease: 'power2.out',
        force3D: true,
      }, 0.4);
    }

    // Phase 2: 障子が左右に重厚に開き始める（1.0s〜2.5s）
    tl.to(leftPanel, {
      x: '-105%',
      duration: 1.5,
      ease: 'power3.inOut',
      force3D: true,
    }, 1.0);

    tl.to(rightPanel, {
      x: '105%',
      duration: 1.5,
      ease: 'power3.inOut',
      force3D: true,
    }, 1.0);

    // ★修正: 左右の障子が引き分かれ始める瞬間 (1.0s) に合わせ、隙間の光が扉の開きと同期して消滅
    if (lightBeam) {
      tl.to(lightBeam, {
        opacity: 0,
        scaleX: 6.0,
        duration: 0.28,
        ease: 'power2.out',
        force3D: true,
      }, 1.0);
    }

    // 障子引き分けと合わせ、裏面の黒背景(bgOverlayRef)を穏やかに透過させ、まずは深層の静寂（背景層）を見せる
    if (bgOverlayRef.current) {
      tl.to(bgOverlayRef.current, {
        opacity: 0,
        duration: 0.85,
        ease: 'power2.inOut',
      }, 1.1);
    }

    // ★重要：障子が開いた絶妙なタイミング（間：2.0s）でポスター結晶化を開始し、「近すぎる」違和感を完全解消
    tl.call(() => {
      onOpenStartRef.current?.();
    }, [], 2.0);

    // ★重要★: 障子が完全に左右に開ききり、余韻を持たせたタイミング (2.8s) で障子終了処理
    tl.call(() => {
      onCompleteRef.current?.();
    }, [], 2.8);

    // Phase 3: 障子コンテナ自体を透明化して消滅（2.8s〜3.2s）
    tl.to(containerRef.current, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in',
    }, 2.8);

    return () => { tl.kill(); };
  }, []);

  useEffect(() => {
    const timer = setTimeout(startAnimation, 80);
    return () => clearTimeout(timer);
  }, [startAnimation]);

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        zIndex: 1000,
        pointerEvents: 'auto', // 演出中は裏側の要素へのクリックやスクロールタッチを完全遮断
        overflow: 'hidden',
      }}
    >
      {/* 背景（障子が閉まっている間の奥の漆黒・濃黒、開く瞬間に滑らかに透過して裏側のポスターを露出） */}
      <div
        ref={bgOverlayRef}
        style={{
          position: 'absolute',
          inset: 0,
          background: '#050711',
          zIndex: 0,
        }}
      />

      {/* 中央の光ビーム（障子の隙間からの幻想的な金茶の光） */}
      <div
        data-shoji-light
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%) scaleX(0.5)',
          width: '14px',
          height: '100%',
          background: `linear-gradient(
            180deg,
            rgba(201, 168, 62, 0) 0%,
            rgba(201, 168, 62, 0.65) 20%,
            rgba(225, 185, 110, 0.9) 50%,
            rgba(201, 168, 62, 0.65) 80%,
            rgba(201, 168, 62, 0) 100%
          )`,
          opacity: 0,
          zIndex: 3,
          filter: 'blur(4px)',
        }}
      />

      {/* 左障子 */}
      <ShojiPanel side="left" />

      {/* 右障子 */}
      <ShojiPanel side="right" />
    </div>
  );
};

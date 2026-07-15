import React, { useEffect, useRef, useCallback, useState } from 'react';
import gsap from 'gsap';
import { PosterCanvas, LAYERS, TEXT_START_INDEX } from './PosterCanvas';
import type { PosterRefs } from './PosterCanvas';



interface OpeningIntroProps {
  skipAnimation?: boolean;
  startTrigger?: boolean;
  onComplete?: () => void;
}

export const OpeningIntro: React.FC<OpeningIntroProps> = ({
  skipAnimation = false,
  startTrigger = true,
  onComplete
}) => {
  const posterRef = useRef<PosterRefs | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isHeroInView, setIsHeroInView] = useState(true);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    const checkVisibility = () => {
      const hash = window.location.hash.replace(/^#\/?/, '').split('?')[0].toLowerCase();
      const isHome = !hash || hash === 'home';
      setIsHeroInView(isHome);
    };

    checkVisibility();
    window.addEventListener('hashchange', checkVisibility);
    return () => {
      window.removeEventListener('hashchange', checkVisibility);
    };
  }, []);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const showAllLayers = useCallback(() => {
    if (!posterRef.current) return;
    const { layerRefs, bgContainerRef, textContainerRef } = posterRef.current;
    const isMobile = window.matchMedia('(max-width: 768px) or (orientation: portrait)').matches;
    const bgTranslateY = isMobile ? '-50%' : '-45%';

    if (bgContainerRef.current) {
      bgContainerRef.current.style.filter = 'none';
      bgContainerRef.current.style.willChange = 'auto';
      bgContainerRef.current.style.transform = `translate(-50%, ${bgTranslateY}) scale(1) translateZ(0)`;
    }
    if (textContainerRef.current) {
      textContainerRef.current.style.filter = 'none';
      textContainerRef.current.style.willChange = 'auto';
      textContainerRef.current.style.transform = 'translate(-50%, -50%) scale(1) translateZ(0)';
    }

    layerRefs.current.forEach((el, idx) => {
      if (el) {
        const layer = LAYERS[idx];
        el.style.opacity = String(layer ? layer.opacity : 1);
        el.style.transform = 'translateZ(0) scale(1)';
        el.style.filter = 'none';
        el.style.willChange = 'auto';
      }
    });
  }, []);

  // 画像デコードを高速確認し、初回描画のカクつきを根絶
  useEffect(() => {
    if (skipAnimation) {
      setIsReady(true);
      return;
    }

    let isMounted = true;
    const checkImages = async () => {
      if (!posterRef.current) {
        if (isMounted) setIsReady(true);
        return;
      }
      const imgs = posterRef.current.layerRefs.current.filter(Boolean) as HTMLImageElement[];

      const decodePromises = imgs.map((img) => {
        if (img.complete) return img.decode().catch(() => { });
        return new Promise((resolve) => {
          img.onload = () => img.decode().then(resolve).catch(resolve);
          img.onerror = resolve;
        });
      });

      await Promise.race([
        Promise.all(decodePromises),
        new Promise((r) => setTimeout(r, 300)),
      ]);

      if (isMounted) setIsReady(true);
    };

    checkImages();
    return () => { isMounted = false; };
  }, [skipAnimation]);

  // ★スタンバイ＆トリガー発動管理
  useEffect(() => {
    if (!isReady || !posterRef.current) return;

    if (skipAnimation || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (!skipAnimation) showAllLayers();
      onCompleteRef.current?.();
      return;
    }

    const { layerRefs, bgContainerRef, textContainerRef } = posterRef.current;
    const isMobile = window.matchMedia('(max-width: 768px) or (orientation: portrait)').matches;
    const bgTranslateY = isMobile ? '-50%' : '-45%';
    const textTranslateY = '-50%';

    // 【初期スタンバイ状態の設定：重いFBOブラーを避けて不透明度とスケールで優雅にスタンバイ】
    if (bgContainerRef.current) {
      gsap.set(bgContainerRef.current, { filter: 'none', transform: `translate(-50%, ${bgTranslateY}) scale(1) translateZ(0)` });
    }
    if (textContainerRef.current) {
      gsap.set(textContainerRef.current, { filter: 'none', transform: `translate(-50%, ${textTranslateY}) scale(1) translateZ(0)` });
    }

    layerRefs.current.forEach((el, idx) => {
      if (!el) return;
      const layer = LAYERS[idx];
      if (!layer) return;

      if (layer.isText) {
        gsap.set(el, { opacity: 0, scale: 1.05, transformOrigin: 'center center', force3D: true });
      } else if (layer.isFog) {
        gsap.set(el, { opacity: 0, scale: 1.06, transformOrigin: 'center center', force3D: true });
      } else if (idx === 0) {
        gsap.set(el, { opacity: 1, scale: 1.0, transformOrigin: 'center center', force3D: true });
      } else if (idx < 8) {
        gsap.set(el, { opacity: 0, scale: 1.03, transformOrigin: 'center 45%', force3D: true });
      } else {
        gsap.set(el, { opacity: 0, scale: 1.04, transformOrigin: 'center 45%', force3D: true });
      }
    });

    // まだ障子が開ききっていない場合 (startTrigger === false) はここで待機
    if (!startTrigger) {
      return;
    }

    // ★障子が開いた！ここからシネマティックかつ超軽量 (60FPS) の演出開始
    if (tlRef.current) tlRef.current.kill();

    layerRefs.current.forEach((el) => {
      if (el) gsap.set(el, { willChange: 'transform, opacity' });
    });

    const tl = gsap.timeline({
      onComplete: () => {
        onCompleteRef.current?.();
        setTimeout(() => {
          showAllLayers();
        }, 150);
      },
    });
    tlRef.current = tl;

    // 背景・和傘・イラスト層（1〜TEXT_START_INDEX-1）の立体ハードウェア出現
    // 過去の正規実装(9ffabb5)の設計通り、Z奥行きに準拠して 0.03秒間隔で美しく連続カスケードさせる
    for (let i = 1; i < TEXT_START_INDEX; i++) {
      const el = layerRefs.current[i];
      if (!el) continue;
      const layer = LAYERS[i];
      const targetOpacity = layer ? layer.opacity : 1;

      const startDelay = layer.isFog ? 0.3 + (i * 0.018) : (i * 0.03);
      const dur = layer.isFog ? 2.1 : 1.5;

      tl.to(el, {
        opacity: targetOpacity,
        scale: 1,
        duration: dur,
        ease: 'power3.out',
      }, startDelay);
    }

    // タイポグラフィ文字層（TEXT_START_INDEX〜41）の結晶化
    for (let i = TEXT_START_INDEX; i < LAYERS.length; i++) {
      const el = layerRefs.current[i];
      if (!el) continue;
      const layer = LAYERS[i];
      const targetOpacity = layer ? layer.opacity : 1;

      const offset = (i - TEXT_START_INDEX) * 0.14;
      tl.to(el, {
        opacity: targetOpacity,
        scale: 1,
        duration: 1.35,
        ease: 'power3.out',
      }, 1.3 + offset);
    }

    return () => { tl.kill(); };
  }, [isReady, skipAnimation, startTrigger, showAllLayers]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        userSelect: 'none',
        overflow: 'hidden',
        backgroundColor: '#050711',
      }}
    >
      <div style={{ visibility: isHeroInView ? 'visible' : 'hidden', width: '100%', height: '100%' }}>
        <PosterCanvas ref={posterRef} skipAnimation={skipAnimation} />
      </div>
    </div>
  );
};

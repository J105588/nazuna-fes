import React, { useEffect, useRef, useCallback, useState } from 'react';
import gsap from 'gsap';
import { PosterCanvas, LAYERS, TEXT_START_INDEX } from './PosterCanvas';
import type { PosterRefs } from './PosterCanvas';

/*
  ========================================================================
  OpeningIntro - 「濃霧と結晶：オリジナル42層完全準拠の百輝夜行演出」
  ========================================================================
  
  【与えられた .psd の完全再現＆極上の霧演出】
  1. PSD全42可視レイヤーの完全制御:
     各レイヤーが保持する本来の不透明度 (layer.opacity) とブレンドモードを厳格に順守。
     クリッピングマスク補正済みのバウンディングボックス画像により、軽さと美しさを両立。
     
  2. 霧の中から現れるような滑らかな立体アニメーション:
     奥行き順（背景層 -> 中間構造物・和傘層 -> 雲海トーン層 -> 最前面文字層）に
     深いブラーと少し大きいスケールから、濃霧が優雅に晴れ渡るように息を吹き返します。
*/

interface OpeningIntroProps {
  skipAnimation?: boolean;
  onComplete?: () => void;
}

export const OpeningIntro: React.FC<OpeningIntroProps> = ({ skipAnimation = false, onComplete }) => {
  const posterRef = useRef<PosterRefs | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const [isReady, setIsReady] = useState(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const showAllLayers = useCallback(() => {
    if (!posterRef.current) return;
    const { layerRefs } = posterRef.current;
    layerRefs.current.forEach((el, idx) => {
      if (el) {
        const layer = LAYERS[idx];
        el.style.opacity = String(layer ? layer.opacity : 1);
        el.style.transform = 'translateZ(0) scale(1)';
        el.style.filter = 'none';
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
        if (img.complete) return img.decode().catch(() => {});
        return new Promise((resolve) => {
          img.onload = () => img.decode().then(resolve).catch(resolve);
          img.onerror = resolve;
        });
      });

      // バウンディングボックスで極小サイズなため瞬時(最大350ms)にデコード完了
      await Promise.race([
        Promise.all(decodePromises),
        new Promise((r) => setTimeout(r, 350)),
      ]);

      if (isMounted) setIsReady(true);
    };

    checkImages();
    return () => { isMounted = false; };
  }, [skipAnimation]);

  useEffect(() => {
    if (!isReady || !posterRef.current) return;

    if (skipAnimation || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      showAllLayers();
      onCompleteRef.current?.();
      return;
    }

    const { layerRefs } = posterRef.current;

    // 【初期スタンバイ: 濃霧と立体的奥行き】
    layerRefs.current.forEach((el, idx) => {
      if (!el) return;
      const layer = LAYERS[idx];
      if (!layer) return;

      if (layer.isText) {
        // タイポグラフィ層: 霧と光の結晶化スタンバイ
        gsap.set(el, {
          opacity: 0,
          scale: 1.05,
          filter: 'blur(16px)',
          transformOrigin: 'center center',
          force3D: true,
        });
      } else if (layer.isFog) {
        // 浮雲・霧・トーン調整層 (soft light / pin light 含む)
        gsap.set(el, {
          opacity: 0,
          scale: 1.14,
          filter: 'blur(26px) brightness(1.2)',
          transformOrigin: 'center center',
          force3D: true,
        });
      } else if (idx < 8) {
        // 最奥夜空・背景・空層
        gsap.set(el, {
          opacity: 0,
          scale: 1.06,
          filter: 'blur(18px)',
          transformOrigin: 'center 45%',
          force3D: true,
        });
      } else {
        // 中間構造物・掛け軸・人混み・和傘層
        gsap.set(el, {
          opacity: 0,
          scale: 1.08,
          filter: 'blur(22px)',
          transformOrigin: 'center 45%',
          force3D: true,
        });
      }
    });

    const tl = gsap.timeline({
      onComplete: () => {
        showAllLayers();
        layerRefs.current.forEach((el) => {
          if (el) gsap.set(el, { clearProps: 'filter,willChange,transform' });
        });
        onCompleteRef.current?.();
      },
    });
    tlRef.current = tl;

    // Phase 1 (0.0s ~ 2.4s): 濃霧の奥から背景・線画・和傘・雲海が滑らかに立ち現れる
    for (let i = 0; i < TEXT_START_INDEX; i++) {
      const el = layerRefs.current[i];
      if (!el) continue;
      const layer = LAYERS[i];
      const targetOpacity = layer ? layer.opacity : 1;

      const startDelay = layer.isFog ? 0.35 + (i * 0.02) : (i * 0.035);
      const dur = layer.isFog ? 2.3 : 1.6;

      tl.to(el, {
        opacity: targetOpacity,
        scale: 1,
        filter: 'blur(0px) brightness(1)',
        duration: dur,
        ease: 'power3.out',
      }, startDelay);
    }

    // Phase 2 (1.4s ~ 3.2s): タイポグラフィ（タイトル「百輝夜行」「夜行」・学校名）の結晶化
    for (let i = TEXT_START_INDEX; i < LAYERS.length; i++) {
      const el = layerRefs.current[i];
      if (!el) continue;
      const layer = LAYERS[i];
      const targetOpacity = layer ? layer.opacity : 1;

      const offset = (i - TEXT_START_INDEX) * 0.16;
      tl.to(el, {
        opacity: targetOpacity,
        scale: 1,
        filter: 'blur(0px)',
        duration: 1.45,
        ease: 'power3.out',
      }, 1.4 + offset);
    }

    return () => { tl.kill(); };
  }, [isReady, skipAnimation, showAllLayers]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        userSelect: 'none',
        overflow: 'hidden',
        backgroundColor: '#050711',
      }}
    >
      <PosterCanvas ref={posterRef} />
    </div>
  );
};





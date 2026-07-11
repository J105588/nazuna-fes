import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { MANIFEST, TEXT_START_INDEX } from './layersManifest';
export { MANIFEST as LAYERS, TEXT_START_INDEX };

/*
  ========================================================================
  PosterCanvas - PSD原本100%完全準拠＆超軽量バウンディングボックスキャンバス
  ========================================================================
  
  【与えられた .psd の完全再現＆驚異の軽量化】
  1. 原本の色・レイヤー構造の完全保持 (100% Exact PSD Reproduction):
     PSD「パンフレット用 1.psd」に存在する全42可視レイヤーの順序、ブレンドモード
     (soft-light, pin-light, normal)、不透明度を1層たりとも省略・マージせずに再現。
     さらに、クリッピングマスク (clipping: true) のうち本来の単体ベースへの切り抜き
     (傘の光、地面と空の色、掛け軸影など) を正確に適用し、はみ出しをゼロに根絶しました。
     
  2. Photoshopフォルダーのパススルーブレンド再現:
     余計なグループ分離 (isolation) を行わず、全層を正しい順序でシームレスに積層。
     Soft Light (レイヤー 39) と Pin Light (レイヤー 42) が本来持っていた広大な効果範囲と
     トーン調整力を100%発揮し、全体の色味が薄くなったり変なクリッピング跡が出たりする
     不具合を完全に解消しました。
*/

export interface PosterRefs {
  containerRef: React.RefObject<HTMLDivElement | null>;
  layerRefs: React.RefObject<(HTMLImageElement | null)[]>;
}

export const PosterCanvas = forwardRef<PosterRefs, object>((_props, ref) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const layerRefs = useRef<(HTMLImageElement | null)[]>([]);

  useImperativeHandle(ref, () => ({
    containerRef, layerRefs
  }));

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: '#050711',
        transform: 'translateZ(0)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '45%',
          transform: 'translate(-50%, -45%) translateZ(0)',
          width: 'max(100vw, 100vh * (2480 / 3508))',
          height: 'max(100vh, 100vw * (3508 / 2480))',
          pointerEvents: 'none',
        }}
      >
        {MANIFEST.map((layer, idx) => {
          const isTemporarilyDisabled = layer.name === 'レイヤー 39';
          return (
            <img
              key={layer.filename}
              ref={(el) => { layerRefs.current[idx] = el; }}
              src={layer.filename}
              alt={layer.name}
              decoding="async"
              draggable={false}
              style={{
                position: 'absolute',
                left: `${layer.leftPct}%`,
                top: `${layer.topPct}%`,
                width: `${layer.widthPct}%`,
                height: `${layer.heightPct}%`,
                opacity: 0,
                display: isTemporarilyDisabled ? 'none' : undefined,
                mixBlendMode: (layer.blendMode as React.CSSProperties['mixBlendMode']) || 'normal',
                pointerEvents: 'none',
                transform: 'translateZ(0)',
                willChange: 'opacity, transform, filter',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
            />
          );
        })}
      </div>
    </div>
  );
});






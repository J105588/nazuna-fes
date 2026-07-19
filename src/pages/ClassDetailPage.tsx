import React from 'react';
import useSWR from 'swr';
import type { Organization, VotePyramidData, NazunaGraphItem, InventoryStatus } from '../types/database';
import { fetchVotePyramid, openExternalMap, openGoogleFormVote, fetchNazunaGraphItems, fetchInventoryStatus, getNazunaGraphOwnerId } from '../lib/api';
import { OfficialPyramidGraphic } from '../components/common/OfficialPyramidGraphic';
import {
  MapPin,
  Heart,
  ExternalLink,
  Coffee,
  ArrowLeft
} from 'lucide-react';

/*
  ========================================================================
  ClassDetailPage - 出し物・展示 企画詳細 独立ページ
  ========================================================================
  モーダルではなく通常のページとして表示。
  画像とテキストは分離し、画像はアップロードされたものをそのまま表示。
*/

interface ClassDetailPageProps {
  org: Organization;
  onBack: () => void;
}

export const ClassDetailPage: React.FC<ClassDetailPageProps> = ({ org, onBack }) => {

  const { data: pyramid } = useSWR<VotePyramidData>(
    org ? `pyramid-${org.id}` : null,
    () => (org ? fetchVotePyramid(org.id) : Promise.reject('No org')),
    { refreshInterval: 20000 }
  );

  const isCafeExhibition = Boolean(org && org.genre === 'food' && org.use_menu_api);
  const nazunaGraphId = org ? getNazunaGraphOwnerId(org) : null;

  // NazunaGraph メニュー在庫アイテムリスト取得 (喫茶展示かつトグルオン時のみ)
  const { data: menuItems } = useSWR<NazunaGraphItem[]>(
    isCafeExhibition && nazunaGraphId ? `nazuna-graph-items-${nazunaGraphId}` : null,
    () => (nazunaGraphId ? fetchNazunaGraphItems({ owner_id: nazunaGraphId }) : Promise.reject('No org')),
    { refreshInterval: 15000 }
  );

  // 総合ステータス (喫茶展示かつトグルオン時のみ)
  const { data: currentStatus } = useSWR<InventoryStatus>(
    isCafeExhibition ? `detail-status-${org?.id}` : null,
    () => (org ? fetchInventoryStatus(org) : Promise.reject('No org')),
    { refreshInterval: 15000, fallbackData: 'STATUS_AVAILABLE' }
  );

  const isSoldOut = isCafeExhibition && currentStatus === 'STATUS_SOLD_OUT';

  const getGenreLabel = (genre: string) => {
    switch (genre) {
      case 'food': return '食品・カフェ';
      case 'attraction': return 'アトラクション';
      case 'exhibition': return '展示・アート';
      case 'stage': return 'ステージ';
      default: return genre;
    }
  };

  const renderPyramidIndicator = () => {
    if (!pyramid) {
      return (
        <div className="mt-8 p-6 rounded-xl bg-wafuu-kinari border border-wafuu-sumi/6 text-xs sm:text-sm text-wafuu-text-sub flex items-center justify-center font-serif">
          <svg className="w-5 h-5 mr-3 text-wafuu-kincha animate-spin" style={{ animationDuration: '4s' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2C6.5 2 2 6.5 2 12h20c0-5.5-4.5-10-10-10z" />
            <path d="M12 2v20" />
          </svg>
          <span>最新のピラミッド評価情報を取得中...</span>
        </div>
      );
    }

    return (
      <div className="mt-8">
        <OfficialPyramidGraphic
          tier={pyramid.pyramid_tier}
          tierLabel={pyramid.tier_label}
          releaseTitle={pyramid.release_title}
          isEmbargoed={pyramid.is_embargoed || pyramid.pyramid_tier === 'embargoed'}
          embargoMessage={pyramid.embargo_message}
        />
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-[#FAF8F5] font-serif relative overflow-hidden select-none">

      {/* 背景の市松模様あしらい */}
      <div className="absolute top-0 right-0 w-48 h-48 pattern-ichimatsu pointer-events-none opacity-40" />
      <div className="absolute bottom-0 left-0 w-48 h-48 pattern-ichimatsu pointer-events-none opacity-40" />

      {/* 戻るボタン (固定上部) */}
      <div className="sticky top-20 z-30 px-5 sm:px-8 pt-6 pb-2">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/90 backdrop-blur-sm text-wafuu-sumi hover:text-wafuu-shu border border-wafuu-sumi/10 hover:border-wafuu-shu/30 transition-all duration-300 shadow-sm hover:shadow-md font-sans text-sm font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>企画一覧に戻る</span>
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-5 sm:px-8 pb-16 relative z-10 animate-fade-in">

        {/* ヘッダー画像（自然サイズ、アップロード画像をそのまま表示） */}
        {org.image_url && (
          <div className="w-full overflow-hidden bg-white rounded-3xl mt-4 border border-wafuu-sumi/8 shadow-md">
            <img
              src={org.image_url}
              alt={org.name}
              className="w-full max-h-[500px] object-contain"
            />
          </div>
        )}

        {/* 団体名・ジャンル・フロア情報（画像から分離） */}
        <div className="mt-6 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3.5 py-1 rounded-full bg-wafuu-shu text-white font-bold text-xs tracking-wider shadow-sm font-serif">
              {getGenreLabel(org.genre)}
            </span>
            <span className="px-3.5 py-1 rounded-full bg-white text-wafuu-ai border border-wafuu-sumi/10 font-bold text-xs tracking-wider shadow-sm font-serif">
              {org.floor_info}
            </span>
            <span className="px-3.5 py-1 rounded-full bg-wafuu-kinari text-wafuu-sumi/70 border border-wafuu-sumi/8 font-mono text-xs font-bold">
              {org.room_code}
            </span>
          </div>
          <h1 className="font-bold text-2xl sm:text-4xl text-wafuu-sumi font-serif tracking-wide leading-tight">
            {org.name}
          </h1>
        </div>

        {/* コンテンツ */}
        <div className="mt-8 space-y-7 relative z-10">

          {/* 企画説明 */}
          <div className="space-y-3.5">
            <h4 className="text-sm font-bold text-wafuu-shu tracking-widest uppercase flex items-center gap-2">
              <span className="font-serif">企画・展示内容の詳細</span>
            </h4>
            <p className="text-sm sm:text-base text-wafuu-text-sub leading-relaxed bg-white p-6 rounded-xl border border-wafuu-sumi/8 shadow-sm font-serif">
              {org.description}
            </p>
          </div>

          {/* NazunaGraph メニュー＆販売状況一覧 */}
          {isCafeExhibition && menuItems && menuItems.length > 0 && (
            <div className="space-y-4 pt-2 border-t border-wafuu-sumi/10">
              <div className="flex items-center justify-between">
                <h4 className="text-sm sm:text-base font-bold text-wafuu-sumi font-serif flex items-center gap-2">
                  <Coffee className="w-4 h-4 text-wafuu-kincha" />
                  <span>メニュー・販売状況</span>
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {menuItems.map((item) => {
                  const isItemSoldOut = item.status.id === 3 || item.status.label === '完売';
                  const isItemFew = item.status.id === 2 || item.status.label === '残りわずか';
                  const isItemPrep = item.status.id === 4 || item.status.label === '準備中';

                  return (
                    <div
                      key={item.id}
                      className={`p-3.5 rounded-xl border flex items-start gap-3 transition-all ${isItemSoldOut || isItemPrep
                        ? 'bg-gray-50 border-gray-200 opacity-60 grayscale'
                        : isItemFew
                          ? 'bg-amber-50/60 border-amber-300'
                          : 'bg-white border-wafuu-sumi/15 shadow-sm hover:border-wafuu-shu/40'
                        }`}
                    >
                      {item.image_url && (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover shrink-0 bg-wafuu-silk border border-wafuu-sumi/10"
                        />
                      )}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-bold font-serif text-wafuu-ai bg-wafuu-silk px-2 py-0.5 rounded">
                            {item.category.name}
                          </span>
                          <span className={`text-[10px] font-bold font-serif px-2 py-0.5 rounded shadow-2xs text-white ${isItemSoldOut ? 'bg-red-600' : isItemPrep ? 'bg-gray-500' : isItemFew ? 'bg-amber-500' : 'bg-emerald-600'
                            }`}>
                            {item.status.label}
                          </span>
                        </div>
                        <h5 className="font-bold text-xs sm:text-sm text-wafuu-sumi font-serif line-clamp-1">
                          {item.name}
                        </h5>
                        <p className="text-[11px] text-wafuu-text-muted line-clamp-2 leading-tight font-sans">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* アクションボタン */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-5 border-t border-wafuu-sumi/6">
            <button
              disabled={isSoldOut}
              onClick={() => openGoogleFormVote(org.id, org.name)}
              className={`w-full py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-3 transition-all duration-300 text-sm sm:text-base ${isSoldOut
                ? 'bg-wafuu-kinari text-wafuu-text-muted cursor-not-allowed border border-wafuu-sumi/6 font-serif'
                : 'btn-wafuu-shu hover:scale-[1.02] font-serif'
                }`}
            >
              <Heart className="w-5 h-5 fill-current" />
              <span>{isSoldOut ? '受付停止中' : 'この団体に投票する (Forms)'}</span>
              {!isSoldOut && <ExternalLink className="w-4 h-4 opacity-80" />}
            </button>

            <button
              onClick={() => openExternalMap(org.room_code, org.floor_info)}
              className="w-full py-4 px-6 rounded-xl font-bold btn-wafuu-kincha flex items-center justify-center gap-3 hover:scale-[1.02] text-sm sm:text-base font-serif"
            >
              <MapPin className="w-5 h-5" />
              <span>校内マップで位置を確認</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          {renderPyramidIndicator()}
        </div>
      </div>
    </div>
  );
};

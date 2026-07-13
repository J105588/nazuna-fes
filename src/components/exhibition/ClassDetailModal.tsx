import React from 'react';
import useSWR from 'swr';
import type { Organization, VotePyramidData, NazunaGraphItem, InventoryStatus } from '../../types/database';
import { fetchVotePyramid, openExternalMap, openGoogleFormVote, fetchNazunaGraphItems, fetchInventoryStatus } from '../../lib/api';
import { OfficialPyramidGraphic } from '../common/OfficialPyramidGraphic';
import {
  X,
  MapPin,
  Heart,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Ban,
  Clock,
  Coffee
} from 'lucide-react';

interface ClassDetailModalProps {
  org: Organization | null;
  onClose: () => void;
}

export const ClassDetailModal: React.FC<ClassDetailModalProps> = ({ org, onClose }) => {
  const { data: pyramid } = useSWR<VotePyramidData>(
    org ? `pyramid-${org.id}` : null,
    () => (org ? fetchVotePyramid(org.id) : Promise.reject('No org')),
    { refreshInterval: 20000 }
  );

  const isCafeExhibition = Boolean(org && org.genre === 'food' && org.use_menu_api);

  // NazunaGraph メニュー在庫アイテムリスト取得 (喫茶展示かつトグルオン時のみ)
  const { data: menuItems } = useSWR<NazunaGraphItem[]>(
    isCafeExhibition ? `nazuna-graph-items-${org?.id}` : null,
    () => (org ? fetchNazunaGraphItems({ owner_id: org.menu_owner_id || org.id }) : Promise.reject('No org')),
    { refreshInterval: 15000 }
  );

  // 総合ステータス (喫茶展示かつトグルオン時のみ)
  const { data: currentStatus } = useSWR<InventoryStatus>(
    isCafeExhibition ? `modal-status-${org?.id}` : null,
    () => (org ? fetchInventoryStatus(org) : Promise.reject('No org')),
    { refreshInterval: 15000, fallbackData: 'STATUS_AVAILABLE' }
  );

  if (!org) return null;

  const isSoldOut = isCafeExhibition && currentStatus === 'STATUS_SOLD_OUT';
  const isPreparing = isCafeExhibition && currentStatus === 'STATUS_PREPARING';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-wafuu-sumi/50 backdrop-blur-sm animate-fade-in select-none">
      <div className="wafuu-panel w-full max-w-2xl max-h-[92vh] overflow-y-auto relative rounded-2xl border border-wafuu-sumi/10 shadow-[0_20px_60px_rgba(30,30,30,0.2)] animate-modal-scale">
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="absolute top-4.5 right-4.5 z-30 p-3 rounded-xl bg-white/90 hover:bg-wafuu-shu text-wafuu-sumi hover:text-white border border-wafuu-sumi/10 transition-all duration-300 shadow-sm hover:shadow-md"
          title="詳細を閉じる"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ヘッダー画像 */}
        <div className="relative h-72 w-full overflow-hidden bg-wafuu-silk">
          <img
            src={org.image_url || '/assets/poster/poster_complete.png'}
            alt={org.name}
            className={`w-full h-full object-cover ${isSoldOut || isPreparing ? 'filter grayscale' : ''}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />

          <div className="absolute bottom-6 left-6 right-6 z-20 space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-wafuu-shu text-white font-bold text-xs tracking-wider shadow-sm font-serif">
                {org.genre.toUpperCase()}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/90 text-wafuu-ai border border-wafuu-sumi/10 font-bold text-xs tracking-wider shadow-sm font-serif backdrop-blur-sm">
                {org.floor_info}
              </span>
            </div>
            <h2 className="font-bold text-2xl sm:text-4xl text-wafuu-sumi font-serif tracking-wide drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
              {org.name}
            </h2>
          </div>
        </div>

        {/* コンテンツ */}
        <div className="p-6 sm:p-9 space-y-7 relative z-10 bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4.5 rounded-xl bg-wafuu-kinari border border-wafuu-sumi/6">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-wafuu-text-sub">
              <span className="text-wafuu-text-muted">ステータス：</span>
              {currentStatus === 'STATUS_AVAILABLE' && (
                <span className="text-wafuu-ai font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> スムーズにご案内可能
                </span>
              )}
              {currentStatus === 'STATUS_FEW' && (
                <span className="text-[#9A7A1E] font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> 残りわずか・混雑
                </span>
              )}
              {currentStatus === 'STATUS_SOLD_OUT' && (
                <span className="text-wafuu-shu font-bold flex items-center gap-1.5">
                  <Ban className="w-4 h-4" /> 本日の受付終了・完売
                </span>
              )}
              {currentStatus === 'STATUS_PREPARING' && (
                <span className="text-gray-600 font-bold flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> 準備中・公開待ち
                </span>
              )}
            </div>
            <span className="font-mono text-xs text-wafuu-ai bg-white px-3 py-1 rounded-lg border border-wafuu-sumi/8 font-bold">
              ID: {org.room_code}
            </span>
          </div>

          <div className="space-y-3.5">
            <h4 className="text-sm font-bold text-wafuu-shu tracking-widest uppercase flex items-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C6.5 2 2 6.5 2 12h20c0-5.5-4.5-10-10-10z" />
                <path d="M12 2v20" />
              </svg>
              <span className="font-serif">企画・展示内容の詳細</span>
            </h4>
            <p className="text-sm sm:text-base text-wafuu-text-sub leading-relaxed bg-wafuu-kinari p-6 rounded-xl border border-wafuu-sumi/6 font-serif">
              {org.description}
            </p>
          </div>

          {/* NazunaGraph メニュー＆販売状況一覧 (/api/items 連携：喫茶展示かつトグルオン時のみ) */}
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

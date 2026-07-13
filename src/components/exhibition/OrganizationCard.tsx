import React from 'react';
import useSWR from 'swr';
import type { Organization, InventoryStatus } from '../../types/database';
import { fetchInventoryStatus } from '../../lib/api';
import { MapPin, ChevronRight, Ban, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface OrganizationCardProps {
  org: Organization;
  onSelectCard: (org: Organization) => void;
}

export const OrganizationCard: React.FC<OrganizationCardProps> = ({ org, onSelectCard }) => {
  const { data: status } = useSWR<InventoryStatus>(
    `inventory-${org.id}`,
    () => fetchInventoryStatus(org.id),
    {
      refreshInterval: 15000,
      fallbackData: org.inventory_status || 'STATUS_AVAILABLE'
    }
  );

  const isSoldOut = status === 'STATUS_SOLD_OUT';

  const renderStatusBadge = () => {
    switch (status) {
      case 'STATUS_AVAILABLE':
        return (
          <div className="status-pill status-available shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="font-serif tracking-wider">スムーズにご案内</span>
          </div>
        );
      case 'STATUS_FEW':
        return (
          <div className="status-pill status-few shadow-sm animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="font-serif tracking-wider">残りわずか</span>
          </div>
        );
      case 'STATUS_SOLD_OUT':
        return (
          <div className="status-pill status-soldout shadow-sm">
            <Ban className="w-3.5 h-3.5" />
            <span className="font-serif tracking-wider">本日の受付終了</span>
          </div>
        );
      default:
        return null;
    }
  };

  const getGenreLabel = (genre: string) => {
    switch (genre) {
      case 'food': return '食品・カフェ';
      case 'attraction': return 'アトラクション';
      case 'exhibition': return '展示・アート';
      case 'stage': return 'ステージ';
      default: return genre;
    }
  };

  return (
    <div
      onClick={() => onSelectCard(org)}
      className={`group cursor-pointer rounded-2xl overflow-hidden transition-all duration-500 flex flex-col bg-white border border-wafuu-sumi/8 hover:border-wafuu-shu/40 shadow-sm hover:shadow-[0_12px_32px_rgba(30,30,30,0.1)] hover:-translate-y-1 relative ${
        isSoldOut ? 'opacity-70' : ''
      }`}
    >
      {/* サムネイル画像 */}
      <div className="relative h-56 w-full overflow-hidden bg-wafuu-silk">
        <img
          src={org.image_url || '/assets/poster/poster_complete.png'}
          alt={org.name}
          className={`w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ${
            isSoldOut ? 'filter grayscale' : ''
          }`}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-80" />

        {/* ステータスバッジ */}
        <div className="absolute top-3.5 left-3.5 z-20 font-serif">
          {renderStatusBadge()}
        </div>

        {/* ジャンル＆種別 */}
        <div className="absolute bottom-3.5 left-3.5 z-20 flex items-center gap-2 font-serif">
          <span className="px-3 py-1 rounded-full bg-wafuu-shu text-white text-[10px] font-bold tracking-wider shadow-sm flex items-center gap-1">
            <span>{getGenreLabel(org.genre)}</span>
          </span>
          <span className="px-3 py-1 rounded-full bg-white/90 text-wafuu-text-sub border border-wafuu-sumi/10 text-[10px] font-bold tracking-wider shadow-sm backdrop-blur-sm">
            {org.category === 'class' ? 'クラス企画' : '部活動・有志'}
          </span>
        </div>
      </div>

      {/* コンテンツ */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4 relative z-20">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs text-wafuu-text-muted font-serif">
            <div className="flex items-center gap-1.5 text-wafuu-shu font-bold">
              <MapPin className="w-4 h-4" />
              <span>{org.floor_info}</span>
            </div>
            <span className="font-mono bg-wafuu-kinari px-2.5 py-1 rounded-lg text-xs font-bold text-wafuu-ai border border-wafuu-sumi/6">
              {org.room_code}
            </span>
          </div>

          <h4 className="font-bold font-serif text-xl text-wafuu-sumi group-hover:text-wafuu-shu transition-colors line-clamp-1 tracking-wide">
            {org.name}
          </h4>

          <p className="text-xs text-wafuu-text-muted line-clamp-2 leading-relaxed font-sans">
            {org.description}
          </p>
        </div>

        {/* アクション */}
        <div className="pt-4 border-t border-wafuu-sumi/6 flex items-center justify-between">
          <span className="text-xs font-bold text-wafuu-shu tracking-wider group-hover:underline flex items-center gap-1">
            <span>{isSoldOut ? '詳細情報を見る' : '詳細・投票へ進む'}</span>
          </span>

          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
              isSoldOut
                ? 'bg-wafuu-kinari text-wafuu-text-muted border border-wafuu-sumi/6'
                : 'bg-gradient-to-br from-wafuu-shu to-wafuu-shu-dark text-white group-hover:translate-x-1 shadow-sm group-hover:shadow-md'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

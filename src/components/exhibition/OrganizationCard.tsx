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
          <div className="status-pill status-available">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>販売中</span>
          </div>
        );
      case 'STATUS_FEW':
        return (
          <div className="status-pill status-few">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>残りわずか</span>
          </div>
        );
      case 'STATUS_SOLD_OUT':
        return (
          <div className="status-pill status-soldout">
            <Ban className="w-3.5 h-3.5" />
            <span>完売御礼</span>
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
      className={`wamodern-panel wamodern-panel-hover overflow-hidden rounded-xl flex flex-col cursor-pointer group transition-all relative ${
        isSoldOut ? 'border-[#E51937]/60 bg-[#160a12]/80 opacity-80' : ''
      }`}
    >
      {/* 完売時の緋赤シャドウ */}
      {isSoldOut && (
        <div className="absolute inset-0 bg-gradient-to-t from-[#E51937]/30 via-transparent to-transparent pointer-events-none z-10" />
      )}

      {/* ポスター・画像エリア */}
      <div className="relative h-52 w-full overflow-hidden bg-[#060814]">
        <img
          src={org.image_url || '/assets/poster/poster_complete.png'}
          alt={org.name}
          className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
            isSoldOut ? 'filter grayscale contrast-125' : ''
          }`}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/assets/poster/poster_complete.png';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e22] via-transparent to-transparent opacity-90" />

        {/* 在庫バッジ */}
        <div className="absolute top-3 right-3 z-20">{renderStatusBadge()}</div>

        {/* ジャンル＆種別 */}
        <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1.5">
          <span className="px-2.5 py-0.5 rounded bg-black/70 backdrop-blur-md text-[#F5D061] border border-[#F5D061]/40 text-[10px] font-bold">
            {getGenreLabel(org.genre)}
          </span>
          <span className="px-2.5 py-0.5 rounded bg-[#131a3b]/90 text-[#00D2FF] border border-[#00D2FF]/40 text-[10px] font-bold">
            {org.category === 'class' ? 'クラス企画' : '部活動・有志'}
          </span>
        </div>
      </div>

      {/* コンテンツエリア */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4 relative z-20">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-[#94A1B2] font-sans">
            <div className="flex items-center gap-1.5 text-[#00D2FF] font-medium">
              <MapPin className="w-3.5 h-3.5" />
              <span>{org.floor_info}</span>
            </div>
            <span className="font-mono bg-white/5 px-2 py-0.5 rounded text-[11px] text-[#F0F4F8]/80 border border-white/10">
              {org.room_code}
            </span>
          </div>

          <h4 className="font-bold text-lg text-white group-hover:text-[#F5D061] transition-colors line-clamp-1">
            {org.name}
          </h4>

          <p className="text-xs text-[#94A1B2] line-clamp-2 leading-relaxed font-sans">
            {org.description}
          </p>
        </div>

        {/* 下部アクション */}
        <div className="pt-3 border-t border-[rgba(255,255,255,0.08)] flex items-center justify-between">
          <span className="text-xs text-[#F5D061] font-semibold tracking-wider group-hover:underline">
            {isSoldOut ? '詳細を確認' : '詳細・投票へ進む'}
          </span>

          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              isSoldOut
                ? 'bg-white/5 text-white/30'
                : 'bg-gradient-to-r from-[#E51937] to-[#800010] text-white group-hover:translate-x-1 shadow-[0_0_12px_rgba(229,25,55,0.5)]'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

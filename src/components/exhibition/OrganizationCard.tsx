import React from 'react';
import useSWR from 'swr';
import type { Organization, InventoryStatus } from '../../types/database';
import { fetchInventoryStatus } from '../../lib/api';
import { MapPin, ChevronRight, Ban, AlertTriangle, CheckCircle2, Sparkles } from 'lucide-react';

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
          <div className="status-pill status-available shadow-lg">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#00D2FF]" />
            <span className="font-serif tracking-wider">販売中</span>
          </div>
        );
      case 'STATUS_FEW':
        return (
          <div className="status-pill status-few shadow-lg animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5 text-[#F5D061]" />
            <span className="font-serif tracking-wider">残りわずか</span>
          </div>
        );
      case 'STATUS_SOLD_OUT':
        return (
          <div className="status-pill status-soldout shadow-lg">
            <Ban className="w-3.5 h-3.5 text-[#ff8596]" />
            <span className="font-serif tracking-wider">完売御礼</span>
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
      className={`wamodern-panel wamodern-panel-hover overflow-hidden rounded-3xl flex flex-col cursor-pointer group transition-all duration-400 relative ${
        isSoldOut ? 'border-[#E51937]/70 bg-[#160a12]/85 opacity-85' : 'hover:shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_35px_rgba(245,208,97,0.25)]'
      }`}
    >
      {/* 完売時の緋赤シャドウ */}
      {isSoldOut && (
        <div className="absolute inset-0 bg-gradient-to-t from-[#E51937]/35 via-transparent to-transparent pointer-events-none z-10" />
      )}

      {/* ポスター・画像エリア */}
      <div className="relative h-56 w-full overflow-hidden bg-[#060814]">
        <img
          src={org.image_url || '/assets/poster/poster_complete.png'}
          alt={org.name}
          className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 ${
            isSoldOut ? 'filter grayscale contrast-125' : ''
          }`}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/assets/poster/poster_complete.png';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080c1f] via-[#080c1f]/30 to-transparent opacity-95" />

        {/* 在庫バッジ */}
        <div className="absolute top-3.5 right-3.5 z-20">{renderStatusBadge()}</div>

        {/* ジャンル＆種別 */}
        <div className="absolute bottom-3.5 left-3.5 z-20 flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-[#F5D061] border border-[#F5D061]/50 text-[10px] font-bold tracking-wider shadow-md flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" />
            <span>{getGenreLabel(org.genre)}</span>
          </span>
          <span className="px-3 py-1 rounded-full bg-[#131a3b]/95 text-[#00D2FF] border border-[#00D2FF]/50 text-[10px] font-bold tracking-wider shadow-md">
            {org.category === 'class' ? 'クラス企画' : '部活動・有志'}
          </span>
        </div>
      </div>

      {/* コンテンツエリア */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-5 relative z-20">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs text-[#94A1B2] font-sans">
            <div className="flex items-center gap-1.5 text-[#00D2FF] font-semibold">
              <MapPin className="w-4 h-4 text-[#00D2FF]" />
              <span>{org.floor_info}</span>
            </div>
            <span className="font-mono bg-white/5 px-2.5 py-1 rounded-lg text-xs font-bold text-[#F5D061] border border-[#F5D061]/30 shadow-inner">
              {org.room_code}
            </span>
          </div>

          <h4 className="font-bold font-serif text-xl text-white group-hover:text-[#F5D061] transition-colors line-clamp-1 tracking-wide">
            {org.name}
          </h4>

          <p className="text-xs text-[#94A1B2] line-clamp-2 leading-relaxed font-sans">
            {org.description}
          </p>
        </div>

        {/* 下部アクション */}
        <div className="pt-4 border-t border-[rgba(245,208,97,0.2)] flex items-center justify-between">
          <span className="text-xs font-bold text-[#F5D061] tracking-wider group-hover:underline flex items-center gap-1">
            <span>{isSoldOut ? '詳細情報を見る' : '詳細・投票へ進む'}</span>
          </span>

          <div
            className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all duration-300 ${
              isSoldOut
                ? 'bg-white/5 text-white/30 border border-white/10'
                : 'bg-gradient-to-br from-[#E51937] to-[#800010] text-white group-hover:translate-x-1.5 border border-[#F5D061]/70 shadow-[0_4px_15px_rgba(229,25,55,0.7)] group-hover:scale-110'
            }`}
          >
            <ChevronRight className="w-5 h-5 text-[#F5D061]" />
          </div>
        </div>
      </div>
    </div>
  );
};

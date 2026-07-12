import React from 'react';
import useSWR from 'swr';
import type { Organization, VotePyramidData } from '../../types/database';
import { fetchVotePyramid, openExternalMap, openGoogleFormVote } from '../../lib/api';
import {
  X,
  MapPin,
  Heart,
  ExternalLink,
  Award,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Ban
} from 'lucide-react';

interface ClassDetailModalProps {
  org: Organization | null;
  onClose: () => void;
}

export const ClassDetailModal: React.FC<ClassDetailModalProps> = ({ org, onClose }) => {
  if (!org) return null;

  const { data: pyramid, isValidating } = useSWR<VotePyramidData>(
    `pyramid-${org.id}`,
    () => fetchVotePyramid(org.id),
    { refreshInterval: 20000 }
  );

  const isSoldOut = org.inventory_status === 'STATUS_SOLD_OUT';

  const renderPyramidIndicator = () => {
    if (!pyramid) {
      return (
        <div className="flex items-center justify-center p-6 rounded-2xl bg-[#0a0e22]/90 border border-[rgba(255,255,255,0.1)] text-xs sm:text-sm text-[#94A1B2] shadow-inner">
          <Sparkles className="w-5 h-5 mr-3 text-[#F5D061] animate-spin" style={{ animationDuration: '4s' }} />
          <span>リアルタイム得票ピラミッドを算出・同期中...</span>
        </div>
      );
    }

    let borderColor = 'border-[rgba(255,255,255,0.15)]';
    let bgColor = 'bg-[#0a0e22]';
    let titleColor = 'text-white font-bold';
    let rankLabel = `${pyramid.rank}位`;
    let pyramidIconColor = 'text-[#94A1B2]';

    if (pyramid.pyramid_tier === 'gold') {
      borderColor = 'border-[#F5D061] shadow-[0_0_25px_rgba(245,208,97,0.3)]';
      bgColor = 'bg-gradient-to-br from-[#F5D061]/25 via-[#141c42] to-[#0a0e22]';
      titleColor = 'text-[#F5D061] font-black';
      pyramidIconColor = 'text-[#F5D061]';
    } else if (pyramid.pyramid_tier === 'silver') {
      borderColor = 'border-[#A8F5FF] shadow-[0_0_25px_rgba(168,245,255,0.25)]';
      bgColor = 'bg-gradient-to-br from-[#A8F5FF]/20 via-[#141c42] to-[#0a0e22]';
      titleColor = 'text-[#A8F5FF] font-bold';
      pyramidIconColor = 'text-[#A8F5FF]';
    } else if (pyramid.pyramid_tier === 'bronze') {
      borderColor = 'border-[#E5A823] shadow-[0_0_20px_rgba(229,168,35,0.2)]';
      bgColor = 'bg-gradient-to-br from-[#E5A823]/20 via-[#141c42] to-[#0a0e22]';
      titleColor = 'text-[#E5A823] font-bold';
      pyramidIconColor = 'text-[#E5A823]';
    }

    return (
      <div className={`p-6 rounded-2xl border ${borderColor} ${bgColor} relative overflow-hidden shadow-2xl transition-all duration-300`}>
        <div className="flex items-center justify-between z-10 relative">
          <div className="flex items-center gap-4">
            <div className={`p-3.5 rounded-xl bg-black/60 border border-white/15 ${pyramidIconColor} shadow-md`}>
              <Award className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest text-[#94A1B2] font-mono font-bold">
                  GAS Realtime Pyramid
                </span>
                {isValidating && <span className="w-2 h-2 rounded-full bg-[#00D2FF] animate-ping" />}
              </div>
              <h5 className={`text-lg sm:text-xl font-serif tracking-wide ${titleColor}`}>
                現在総合：第 {rankLabel} <span className="text-xs font-sans font-normal text-white/80 ml-1">(上位入賞圏)</span>
              </h5>
            </div>
          </div>

          <div className="text-right">
            <div className="text-3xl font-black text-white tracking-tight font-mono">
              {pyramid.total_votes}
              <span className="text-sm font-normal text-[#94A1B2] ml-1">票</span>
            </div>
            <span className="text-[11px] text-[#00D2FF] tracking-wider font-bold block mt-0.5">人気投票受付中</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl animate-fade-in select-none">
      <div className="wamodern-panel w-full max-w-2xl max-h-[92vh] overflow-y-auto relative rounded-3xl border border-[rgba(245,208,97,0.45)] shadow-[0_25px_90px_rgba(0,0,0,0.95),0_0_40px_rgba(245,208,97,0.15)] animate-modal-scale">
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="absolute top-4.5 right-4.5 z-30 p-3 rounded-2xl bg-black/80 hover:bg-[#E51937] text-white/80 hover:text-white border border-white/20 transition-all duration-300 shadow-lg hover:scale-110"
          title="詳細を閉じる"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ヘッダー画像 */}
        <div className="relative h-72 w-full overflow-hidden bg-[#060814]">
          <img
            src={org.image_url || '/assets/poster/poster_complete.png'}
            alt={org.name}
            className={`w-full h-full object-cover ${isSoldOut ? 'filter grayscale contrast-125' : ''}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080c1f] via-[#080c1f]/45 to-transparent" />

          <div className="absolute bottom-6 left-6 right-6 z-20 space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#E51937] text-white font-bold text-xs tracking-wider shadow-md">
                {org.genre.toUpperCase()}
              </span>
              <span className="px-3 py-1 rounded-full bg-[#131a3b] text-[#00D2FF] border border-[#00D2FF]/50 font-bold text-xs tracking-wider shadow-md">
                {org.floor_info}
              </span>
            </div>
            <h2 className="font-bold text-2xl sm:text-4xl text-white drop-shadow-md font-serif tracking-wide">
              {org.name}
            </h2>
          </div>
        </div>

        {/* コンテンツ */}
        <div className="p-6 sm:p-9 space-y-7 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4.5 rounded-2xl bg-[#060814]/90 border border-[rgba(255,255,255,0.12)] shadow-inner">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-white/90">
              <span className="text-[#94A1B2]">ステータス：</span>
              {org.inventory_status === 'STATUS_AVAILABLE' && (
                <span className="text-[#00D2FF] font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4.5 h-4.5 text-[#00D2FF]" /> 販売中・スムーズにご案内可能
                </span>
              )}
              {org.inventory_status === 'STATUS_FEW' && (
                <span className="text-[#F5D061] font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4.5 h-4.5 text-[#F5D061]" /> 残りわずか・窓の灯り
                </span>
              )}
              {org.inventory_status === 'STATUS_SOLD_OUT' && (
                <span className="text-[#ff8596] font-bold flex items-center gap-1.5">
                  <Ban className="w-4.5 h-4.5 text-[#ff8596]" /> 完売御礼・本日の受付終了
                </span>
              )}
            </div>
            <span className="font-mono text-xs text-[#F5D061] bg-white/5 px-3 py-1 rounded-lg border border-white/10 font-bold">
              ID: {org.room_code}
            </span>
          </div>

          {renderPyramidIndicator()}

          <div className="space-y-3.5">
            <h4 className="text-sm font-bold text-[#F5D061] tracking-widest uppercase flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F5D061]" />
              <span className="font-serif">企画・展示内容の詳細</span>
            </h4>
            <p className="text-sm sm:text-base text-[#F0F4F8]/95 leading-relaxed bg-[#060814]/80 p-6 rounded-2xl border border-[rgba(255,255,255,0.1)] font-sans shadow-inner">
              {org.description}
            </p>
          </div>

          {/* アクションボタン */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-5 border-t border-[rgba(245,208,97,0.25)]">
            <button
              disabled={isSoldOut}
              onClick={() => openGoogleFormVote(org.id, org.name)}
              className={`w-full py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all duration-300 text-sm sm:text-base ${
                isSoldOut
                  ? 'bg-white/5 text-white/30 cursor-not-allowed border border-white/10'
                  : 'btn-wamodern-red shadow-[0_8px_25px_rgba(229,25,55,0.6)] hover:scale-105'
              }`}
            >
              <Heart className="w-5 h-5 text-white fill-current" />
              <span>{isSoldOut ? '完売のため受付停止' : 'この団体に投票する (Forms)'}</span>
              {!isSoldOut && <ExternalLink className="w-4 h-4 text-white/80" />}
            </button>

            <button
              onClick={() => openExternalMap(org.room_code, org.floor_info)}
              className="w-full py-4 px-6 rounded-2xl font-bold btn-wamodern-gold flex items-center justify-center gap-3 shadow-[0_6px_20px_rgba(245,208,97,0.2)] hover:scale-105 text-sm sm:text-base"
            >
              <MapPin className="w-5 h-5 text-[#F5D061]" />
              <span>校内マップで位置を確認</span>
              <ExternalLink className="w-4 h-4 text-[#F5D061]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

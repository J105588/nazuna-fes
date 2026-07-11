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
        <div className="flex items-center justify-center p-6 rounded-xl bg-[#0a0e22] border border-[rgba(255,255,255,0.08)] text-xs text-[#94A1B2]">
          <Sparkles className="w-4 h-4 mr-2 text-[#F5D061]" />
          <span>リアルタイム得票ピラミッドを算出中...</span>
        </div>
      );
    }

    let borderColor = 'border-[rgba(255,255,255,0.12)]';
    let bgColor = 'bg-[#0a0e22]';
    let titleColor = 'text-white';
    let rankLabel = `${pyramid.rank}位`;
    let pyramidIconColor = 'text-[#94A1B2]';

    if (pyramid.pyramid_tier === 'gold') {
      borderColor = 'border-[#F5D061]/80';
      bgColor = 'bg-gradient-to-br from-[#F5D061]/15 via-[#131a3b] to-[#0a0e22]';
      titleColor = 'text-[#F5D061] font-bold';
      pyramidIconColor = 'text-[#F5D061]';
    } else if (pyramid.pyramid_tier === 'silver') {
      borderColor = 'border-[#A8F5FF]/80';
      bgColor = 'bg-gradient-to-br from-[#A8F5FF]/15 via-[#131a3b] to-[#0a0e22]';
      titleColor = 'text-[#A8F5FF] font-bold';
      pyramidIconColor = 'text-[#A8F5FF]';
    } else if (pyramid.pyramid_tier === 'bronze') {
      borderColor = 'border-[#E5A823]/80';
      bgColor = 'bg-gradient-to-br from-[#E5A823]/15 via-[#131a3b] to-[#0a0e22]';
      titleColor = 'text-[#E5A823] font-bold';
      pyramidIconColor = 'text-[#E5A823]';
    }

    return (
      <div className={`p-5 rounded-xl border ${borderColor} ${bgColor} relative overflow-hidden shadow-xl transition-all`}>
        <div className="flex items-center justify-between z-10 relative">
          <div className="flex items-center gap-3.5">
            <div className={`p-3 rounded-lg bg-black/50 border border-white/10 ${pyramidIconColor}`}>
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest text-[#94A1B2] font-mono">
                  GAS Realtime Pyramid
                </span>
                {isValidating && <span className="w-1.5 h-1.5 rounded-full bg-[#00D2FF]" />}
              </div>
              <h5 className={`text-lg font-serif ${titleColor}`}>
                現在総合：第 {rankLabel} (上位入賞圏)
              </h5>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-black text-white tracking-tight font-mono">
              {pyramid.total_votes}
              <span className="text-xs font-normal text-[#94A1B2] ml-1">票</span>
            </div>
            <span className="text-[11px] text-[#00D2FF] tracking-wider font-semibold">人気投票受付中</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="wamodern-panel w-full max-w-2xl max-h-[90vh] overflow-y-auto relative rounded-2xl border border-[rgba(245,208,97,0.35)] shadow-[0_25px_80px_rgba(0,0,0,0.95)]">
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/70 hover:bg-black text-white/80 hover:text-white border border-white/20 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ヘッダー画像 */}
        <div className="relative h-64 w-full overflow-hidden bg-[#060814]">
          <img
            src={org.image_url || '/assets/poster/poster_complete.png'}
            alt={org.name}
            className={`w-full h-full object-cover ${isSoldOut ? 'filter grayscale contrast-125' : ''}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e22] via-[#0a0e22]/40 to-transparent" />

          <div className="absolute bottom-6 left-6 right-6 z-20 space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-[#E51937] text-white font-bold text-[11px]">
                {org.genre.toUpperCase()}
              </span>
              <span className="px-2.5 py-0.5 rounded bg-[#131a3b] text-[#00D2FF] border border-[#00D2FF]/40 font-bold text-[11px]">
                {org.floor_info}
              </span>
            </div>
            <h2 className="font-bold text-2xl sm:text-3xl text-white drop-shadow-md font-serif">
              {org.name}
            </h2>
          </div>
        </div>

        {/* コンテンツ */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#060814]/80 border border-[rgba(255,255,255,0.08)]">
            <div className="flex items-center gap-2 text-xs text-white/90">
              <span>現在の状態：</span>
              {org.inventory_status === 'STATUS_AVAILABLE' && (
                <span className="text-[#00D2FF] font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> 販売中・案内スムーズ
                </span>
              )}
              {org.inventory_status === 'STATUS_FEW' && (
                <span className="text-[#F5D061] font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> 残りわずか・窓の灯り
                </span>
              )}
              {org.inventory_status === 'STATUS_SOLD_OUT' && (
                <span className="text-[#E51937] font-bold flex items-center gap-1.5">
                  <Ban className="w-4 h-4" /> 完売御礼・受付終了
                </span>
              )}
            </div>
            <span className="font-mono text-xs text-[#94A1B2]">ID: {org.room_code}</span>
          </div>

          {renderPyramidIndicator()}

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#F5D061] tracking-wider uppercase flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>企画・展示内容の詳細</span>
            </h4>
            <p className="text-sm text-[#F0F4F8]/90 leading-relaxed bg-[#060814]/60 p-5 rounded-xl border border-[rgba(255,255,255,0.08)] font-sans">
              {org.description}
            </p>
          </div>

          {/* アクションボタン */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[rgba(255,255,255,0.08)]">
            <button
              disabled={isSoldOut}
              onClick={() => openGoogleFormVote(org.id, org.name)}
              className={`w-full py-3.5 px-6 rounded-xl font-bold flex items-center justify-center gap-2.5 transition-all ${
                isSoldOut
                  ? 'bg-white/5 text-white/30 cursor-not-allowed border border-white/10'
                  : 'btn-wamodern-red shadow-lg'
              }`}
            >
              <Heart className="w-4 h-4 text-white fill-current" />
              <span>{isSoldOut ? '完売のため受付停止' : 'この団体に投票する (Forms)'}</span>
              {!isSoldOut && <ExternalLink className="w-3.5 h-3.5 text-white/70 ml-1" />}
            </button>

            <button
              onClick={() => openExternalMap(org.room_code, org.floor_info)}
              className="w-full py-3.5 px-6 rounded-xl font-bold btn-wamodern-gold flex items-center justify-center gap-2.5 shadow-lg"
            >
              <MapPin className="w-4 h-4" />
              <span>校内マップで位置を確認</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

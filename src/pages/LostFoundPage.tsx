import React, { useState } from 'react';
import type { LostItem } from '../types/database';
import { Search, MapPin, CheckCircle2, Clock, ShieldCheck, HelpCircle } from 'lucide-react';

interface LostFoundPageProps {
  lostItems: LostItem[];
}

export const LostFoundPage: React.FC<LostFoundPageProps> = ({ lostItems }) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'storage' | 'returned'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = lostItems.filter((item) => {
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.item_name.toLowerCase().includes(q) ||
        item.found_place.toLowerCase().includes(q) ||
        item.storage_location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-12 animate-fade-in font-serif max-w-6xl mx-auto py-10 px-4 sm:px-6">
      {/* ヒーローセクション */}
      <div className="wafuu-panel p-8 sm:p-12 rounded-3xl border border-wafuu-ekasumi/60 relative overflow-hidden shadow-md bg-gradient-to-br from-white via-[#FDFBF7] to-wafuu-kinari">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-wafuu-shu/60 to-transparent" />
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-wafuu-shu/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-wafuu-shu to-wafuu-shu-dark text-white shadow-sm border border-wafuu-ekasumi/40">
              <Search className="w-8 h-8 text-white" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-wafuu-shu block">
                LOST & FOUND DIRECTORY
              </span>
              <h1 className="text-2xl sm:text-4xl font-bold text-wafuu-sumi tracking-wider mt-1 font-serif">
                なずな祭 百輝夜行 落とし物・お忘れ物 総合掲示板
              </h1>
            </div>
          </div>

          <div className="bg-wafuu-kinari px-5 py-3 rounded-2xl border border-wafuu-sumi/10 flex items-center gap-2.5 text-xs text-wafuu-ai font-bold shadow-sm">
            <ShieldCheck className="w-5 h-5 text-wafuu-ai shrink-0" />
            <span>本部棟1F インフォメーションセンターにて統合保管・管理中</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-wafuu-text-sub leading-relaxed pt-5 mt-5 border-t border-wafuu-sumi/10 max-w-3xl font-sans">
          なずな祭期間中に会場内で拾得された落とし物・お忘れ物をリアルタイムに掲載しております。お心当たりのある品物が見つかった場合は、身分証明書・生徒手帳等をご持参の上、<strong>本部棟1F インフォメーションセンター窓口</strong>まで直接お越しください。
        </p>
      </div>

      {/* 検索・フィルターバー */}
      <div className="wafuu-panel p-6 sm:p-8 rounded-3xl border border-wafuu-sumi/10 space-y-6 shadow-sm bg-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* キーワード検索 */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-wafuu-shu" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="品名・拾得場所で検索（例：財布・傘・体育館・中庭…）"
              className="w-full bg-wafuu-kinari text-wafuu-sumi placeholder-wafuu-text-muted/60 pl-12 pr-4 py-3.5 rounded-2xl border border-wafuu-sumi/10 focus:outline-none focus:border-wafuu-shu text-sm font-sans"
            />
          </div>

          {/* ステータス絞り込み */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 font-sans">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all border ${
                filterStatus === 'all'
                  ? 'bg-gradient-to-r from-wafuu-shu to-wafuu-shu-dark text-white border-wafuu-shu shadow-sm'
                  : 'bg-wafuu-kinari text-wafuu-text-sub hover:text-wafuu-sumi border-wafuu-sumi/10'
              }`}
            >
              すべて表示 ({lostItems.length})
            </button>
            <button
              onClick={() => setFilterStatus('storage')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all border ${
                filterStatus === 'storage'
                  ? 'bg-wafuu-ai/10 text-wafuu-ai border-wafuu-ai shadow-sm'
                  : 'bg-wafuu-kinari text-wafuu-text-sub hover:text-wafuu-sumi border-wafuu-sumi/10'
              }`}
            >
              インフォメーション保管中 ({lostItems.filter((i) => i.status === 'storage').length})
            </button>
            <button
              onClick={() => setFilterStatus('returned')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all border ${
                filterStatus === 'returned'
                  ? 'bg-wafuu-kincha/10 text-wafuu-sumi border-wafuu-kincha shadow-sm'
                  : 'bg-wafuu-kinari text-wafuu-text-sub hover:text-wafuu-sumi border-wafuu-sumi/10'
              }`}
            >
              持ち主へ返還完了 ({lostItems.filter((i) => i.status === 'returned').length})
            </button>
          </div>
        </div>
      </div>

      {/* 落とし物リスト */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="wafuu-panel p-16 text-center rounded-3xl text-wafuu-text-muted space-y-4 border border-wafuu-sumi/10 shadow-sm bg-white">
            <CheckCircle2 className="w-12 h-12 mx-auto text-wafuu-kincha/50" />
            <p className="text-base font-bold text-wafuu-sumi">
              {searchQuery ? '検索条件に一致する落とし物はありませんでした。' : '現在、届出・登録されているお忘れ物はありません。'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map((item) => {
              const isStorage = item.status === 'storage';
              return (
                <div
                  key={item.id}
                  className={`wafuu-panel p-6 sm:p-7 rounded-3xl border transition-all space-y-4 ${
                    isStorage ? 'border-wafuu-sumi/15 bg-white shadow-sm' : 'border-wafuu-sumi/10 bg-wafuu-kinari/60 opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-wafuu-sumi/10 pb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold font-serif ${
                      isStorage ? 'bg-wafuu-ai/10 text-wafuu-ai border border-wafuu-ai/30' : 'bg-wafuu-sumi/10 text-wafuu-text-muted'
                    }`}>
                      {isStorage ? 'インフォメーション保管中' : '返還完了'}
                    </span>
                    <span className="font-mono text-xs text-wafuu-text-muted flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-wafuu-kincha" />
                      <span>{new Date(item.created_at).toLocaleString([], { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-bold text-xl text-wafuu-sumi tracking-wide font-serif">{item.item_name}</h3>
                    <p className="text-xs sm:text-sm text-wafuu-shu flex items-center gap-1.5 pt-1 font-sans font-bold">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span>拾得場所: <strong>{item.found_place}</strong></span>
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-wafuu-kinari border border-wafuu-sumi/8 text-xs text-wafuu-text-sub font-sans">
                    保管場所: {item.storage_location}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 問い合わせ案内ガイダンス */}
      <div className="wafuu-panel p-6 sm:p-8 rounded-3xl border border-wafuu-sumi/10 flex flex-col sm:flex-row items-center justify-between gap-6 bg-white">
        <div className="flex items-center gap-4">
          <HelpCircle className="w-8 h-8 text-wafuu-kincha shrink-0" />
          <div className="space-y-1">
            <h4 className="font-bold text-base text-wafuu-sumi font-serif">上記リストに該当する品物がない場合</h4>
            <p className="text-xs text-wafuu-text-sub font-sans">
              未登録・または拾得直後でお届け前の可能性があります。本部棟1F インフォメーション窓口またはお近くのシフト担当役員・巡回教職員へ直接お尋ねください。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

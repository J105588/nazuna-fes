import React, { useState } from 'react';
import type { LostItem } from '../types/database';
import { Search, MapPin, CheckCircle2, Clock, ShieldCheck, HelpCircle, Smartphone, Compass } from 'lucide-react';

interface LostFoundPageProps {
  lostItems: LostItem[];
}

export const LostFoundPage: React.FC<LostFoundPageProps> = ({ lostItems }) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'storage' | 'returned'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
    <div className="space-y-10 animate-fade-in font-serif max-w-6xl mx-auto py-12 px-4 sm:px-8 select-none">

      {/* ==========================================================
          1. ヒーローセクション（和柄＆金茶アクセント）
      ========================================================== */}
      <div className="wafuu-panel p-8 sm:p-12 rounded-3xl border border-wafuu-ekasumi/60 relative overflow-hidden shadow-lg bg-gradient-to-br from-white via-[#FDFBF7] to-[#F5ECE0]">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-wafuu-shu via-wafuu-kincha to-wafuu-ai" />
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-wafuu-shu/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-wafuu-shu via-wafuu-shu-dark to-[#8B1A1E] text-white shadow-md border border-white/20 shrink-0">
              <Search className="w-8 h-8 text-white" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold tracking-[0.2em] text-wafuu-shu block uppercase">
                REALTIME LOST & FOUND BOARD
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-wafuu-sumi tracking-wider font-serif">
                なずな祭 落とし物・お忘れ物掲示板
              </h1>
            </div>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-wafuu-sumi/80 leading-relaxed pt-5 mt-5 border-t border-wafuu-sumi/15 max-w-3xl font-sans">
          なずな祭期間中に校内・会場にて拾得されたお忘れ物を配信しております。
          写真および特徴をご確認の上、お探しの品物がある場合は以下の専用窓口へお越しください。
        </p>
      </div>

      {/* ==========================================================
          2. 受け取り手順・専用案内バナー（必須掲載メッセージ）
      ========================================================== */}
      <div className="p-7 sm:p-9 rounded-3xl bg-gradient-to-r from-[#1B2838] via-[#111A2B] to-[#1E293B] text-white shadow-xl border border-wafuu-kincha/50 relative overflow-hidden space-y-4">
        <div className="absolute top-0 right-0 w-96 h-96 bg-wafuu-kincha/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-wafuu-kincha text-[#111A2B] font-bold">
            <Smartphone className="w-6 h-6" />
          </div>
          <h2 className="text-lg sm:text-2xl font-black font-serif tracking-wide text-[#FFE895]">
            お忘れ物・落とし物のお受け取りについて
          </h2>
        </div>

        <div className="bg-black/40 p-5 sm:p-6 rounded-2xl border border-white/15 text-sm sm:text-base leading-relaxed text-wafuu-kinari font-serif shadow-inner">
          <p className="font-bold text-white text-base sm:text-lg">
            こちらの画面にお探しの落とし物があった場合は、本画面をお手持ちのスマートフォン等で表示の上、本館2階総合案内所窓口までご提示ください。
          </p>
          <p className="text-xs sm:text-sm text-[#E2E8F0]/80 pt-2 font-sans">
            ※ ご本人様確認のため、生徒手帳・学生証・運転免許証などの身分証明書や、スマートフォンのロック画面確認等をお願いする場合がございます。あらかじめご了承ください。
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono pt-1 text-wafuu-kinari/70">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-wafuu-kincha" />
            <span>窓口場所: 本館2階 総合案内所 （正面大階段上がって2階中央）</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-wafuu-kincha" />
            <span>対応時間: なずな祭開催時間内</span>
          </div>
        </div>
      </div>

      {/* ==========================================================
          3. 検索・ステータスフィルターバー
      ========================================================== */}
      <div className="wafuu-panel p-6 sm:p-8 rounded-3xl border border-wafuu-sumi/10 space-y-6 shadow-sm bg-white font-sans">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* キーワード検索 */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-wafuu-shu" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="品名・拾得場所で絞り込み（例：折り畳み傘・パスケース・第一体育館…）"
              className="w-full bg-[#FAF8F5] text-wafuu-sumi placeholder-wafuu-sumi/40 pl-12 pr-4 py-3.5 rounded-2xl border border-wafuu-sumi/15 focus:outline-none focus:border-wafuu-shu text-sm font-sans transition-colors"
            />
          </div>

          {/* ステータス絞り込み */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all border shrink-0 ${filterStatus === 'all'
                ? 'bg-gradient-to-r from-wafuu-sumi to-[#2A3B52] text-white border-wafuu-sumi shadow-sm'
                : 'bg-[#FAF8F5] text-wafuu-sumi/70 hover:text-wafuu-sumi border-wafuu-sumi/15'
                }`}
            >
              すべて表示 ({lostItems.length})
            </button>
            <button
              onClick={() => setFilterStatus('storage')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all border shrink-0 ${filterStatus === 'storage'
                ? 'bg-[#122b1e] text-[#4af096] border-[#4af096]/60 shadow-sm'
                : 'bg-[#FAF8F5] text-wafuu-sumi/70 hover:text-wafuu-sumi border-wafuu-sumi/15'
                }`}
            >
              総合案内所にて保管中 ({lostItems.filter((i) => i.status === 'storage').length})
            </button>
            <button
              onClick={() => setFilterStatus('returned')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all border shrink-0 ${filterStatus === 'returned'
                ? 'bg-wafuu-shu/10 text-wafuu-shu border-wafuu-shu shadow-sm'
                : 'bg-[#FAF8F5] text-wafuu-sumi/70 hover:text-wafuu-sumi border-wafuu-sumi/15'
                }`}
            >
              持ち主へ返却完了 ({lostItems.filter((i) => i.status === 'returned').length})
            </button>
          </div>
        </div>
      </div>

      {/* ==========================================================
          4. 落とし物カード一覧（写真対応リッチデザイン）
      ========================================================== */}
      <div className="space-y-4 font-sans">
        {filtered.length === 0 ? (
          <div className="wafuu-panel p-16 text-center rounded-3xl text-wafuu-sumi/60 space-y-4 border border-wafuu-sumi/10 shadow-sm bg-white font-serif">
            <CheckCircle2 className="w-12 h-12 mx-auto text-wafuu-kincha/60" />
            <p className="text-base font-bold text-wafuu-sumi">
              {searchQuery ? '検索条件に一致する落とし物はありませんでした。' : '現在、届出・登録されている落とし物はありません。'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-serif">
            {filtered.map((item) => {
              const isStorage = item.status === 'storage';
              return (
                <div
                  key={item.id}
                  className={`wafuu-panel p-6 sm:p-7 rounded-3xl border transition-all flex flex-col justify-between space-y-5 ${isStorage
                    ? 'border-wafuu-sumi/20 bg-white shadow-md hover:shadow-lg'
                    : 'border-wafuu-sumi/10 bg-[#FAF8F5]/80 opacity-70'
                    }`}
                >
                  <div className="space-y-4">
                    {/* 上部ステータスバッジと時刻 */}
                    <div className="flex items-center justify-between border-b border-wafuu-sumi/10 pb-3 font-sans">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold font-serif shadow-2xs ${isStorage
                        ? 'bg-[#102a1c] text-[#4af096] border border-[#4af096]/50'
                        : 'bg-wafuu-sumi/10 text-wafuu-sumi/60'
                        }`}>
                        {isStorage ? '総合案内所にて保管中' : '持ち主へ返却完了'}
                      </span>
                      <span className="font-mono text-xs text-wafuu-sumi/60 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-wafuu-kincha" />
                        <span>{new Date(item.created_at).toLocaleString([], { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
                      </span>
                    </div>

                    {/* 写真と品目の横並び/縦並び */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                      {item.image_url ? (
                        <div
                          onClick={() => setSelectedImage(item.image_url || null)}
                          className="w-full sm:w-28 h-40 sm:h-28 rounded-2xl overflow-hidden border border-wafuu-sumi/20 shrink-0 relative group cursor-pointer shadow-sm bg-black/5"
                        >
                          <img src={item.image_url} alt={item.item_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-bold font-sans">
                            拡大確認
                          </div>
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-2xl bg-[#FAF8F5] border border-wafuu-ekasumi/60 flex flex-col items-center justify-center shrink-0 text-wafuu-sumi/40 font-sans text-[10px]">
                          <Search className="w-6 h-6 mb-0.5 text-wafuu-kincha/70" />
                          <span>NO IMAGE</span>
                        </div>
                      )}

                      <div className="space-y-1.5 flex-1">
                        <h3 className="font-bold text-xl sm:text-2xl text-wafuu-sumi tracking-wide font-serif leading-tight">
                          {item.item_name}
                        </h3>
                        <div className="text-xs sm:text-sm text-wafuu-shu flex items-center gap-1.5 pt-1 font-sans font-bold">
                          <MapPin className="w-4 h-4 shrink-0" />
                          <span>拾得場所: <span className="underline">{item.found_place}</span></span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 下部：保管場所表示ボックス */}
                  <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-wafuu-sumi/10 flex items-center justify-between gap-3 text-xs text-wafuu-sumi/80 font-sans">
                    <div className="flex items-center gap-2 font-bold">
                      <ShieldCheck className="w-4 h-4 text-wafuu-ai shrink-0" />
                      <span>現在の保管場所</span>
                    </div>
                    <span className="font-bold text-wafuu-sumi font-serif text-sm">
                      {item.storage_location || '本館2階 総合案内所'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ==========================================================
          5. お問い合わせ・未登録拾得物についてガイダンス
      ========================================================== */}
      <div className="wafuu-panel p-6 sm:p-8 rounded-3xl border border-wafuu-sumi/10 flex flex-col sm:flex-row items-center justify-between gap-6 bg-white shadow-sm font-sans">
        <div className="flex items-center gap-4">
          <HelpCircle className="w-8 h-8 text-wafuu-kincha shrink-0" />
          <div className="space-y-1">
            <h4 className="font-bold text-base text-wafuu-sumi font-serif">上記リストに該当する品物が見当たらない場合</h4>
            <p className="text-xs sm:text-sm text-wafuu-sumi/75 leading-relaxed">
              拾得直後でシステム登録前の可能性があります。あるいはお手元の品物が見当たらなくなった場合は、直接<strong>「本館2階 総合案内所窓口」</strong>またはお近くの実行委員会役員・巡回教職員までお申し出ください。
            </p>
          </div>
        </div>
      </div>

      {/* 画像拡大モーダル */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
        >
          <div className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-3xl border border-white/20 bg-black">
            <img src={selectedImage} alt="落とし物拡大写真" className="max-w-full max-h-[80vh] object-contain mx-auto" />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 px-4 py-2 rounded-full bg-black/60 text-white font-bold text-xs hover:bg-black border border-white/20"
            >
              閉じる
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

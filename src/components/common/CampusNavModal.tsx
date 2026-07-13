import React, { useState } from 'react';
import { MapPin, ShieldAlert, Compass, X, Navigation, CheckCircle2 } from 'lucide-react';
import type { Organization } from '../../types/database';

interface CampusNavModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizations?: Organization[];
  initialRoomCode?: string;
}

export const CampusNavModal: React.FC<CampusNavModalProps> = ({
  isOpen,
  onClose,
  organizations = [],
  initialRoomCode
}) => {
  const [selectedFloor, setSelectedFloor] = useState<'all' | '1F' | '2F' | '3F' | '4F' | 'outdoor'>('all');
  const [searchQuery, setSearchQuery] = useState(initialRoomCode || '');
  const [activeRoute, setActiveRoute] = useState<string | null>(initialRoomCode || null);
  const [hasAcknowledgedSafety, setHasAcknowledgedSafety] = useState(false);

  if (!isOpen) return null;

  // フィルタリング
  const filteredOrgs = organizations.filter((org) => {
    if (!org.is_published) return false;
    if (selectedFloor !== 'all') {
      if (selectedFloor === 'outdoor' && !org.floor_info.includes('中庭') && !org.floor_info.includes('屋外')) return false;
      if (selectedFloor !== 'outdoor' && !org.floor_info.includes(selectedFloor) && !org.room_code.includes(selectedFloor)) return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return org.name.toLowerCase().includes(q) || org.room_code.toLowerCase().includes(q) || org.floor_info.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-wafuu-sumi/60 backdrop-blur-md animate-fade-in font-serif select-none">
      <div className="wafuu-panel w-full max-w-4xl p-6 sm:p-8 rounded-3xl border border-wafuu-sumi/10 shadow-[0_25px_80px_rgba(30,30,30,0.25)] relative overflow-hidden flex flex-col max-h-[92vh] bg-white animate-modal-scale">
        {/* 上部朱色アクセントライン */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-wafuu-shu to-transparent" />

        {/* --- 歩きスマホ防止：案内開始時＆案内中の常時安全警告バナー --- */}
        <div className="p-4 sm:p-5 rounded-2xl bg-wafuu-shu/10 border-2 border-wafuu-shu shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 shrink-0 relative z-10 animate-pulse">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-wafuu-shu text-white shrink-0 mt-0.5">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-bold text-wafuu-shu uppercase tracking-wider block">
                SAFETY WARNING / 歩きスマホ禁止徹底ガイダンス
              </span>
              <p className="text-xs sm:text-sm font-bold text-wafuu-sumi leading-relaxed font-sans">
                ⚠️ 【画面を見ながらの移動・歩行は大変危険です】案内中および校内移動中はスマートフォンを下げ、必ず通路脇・ベンチ等の安全な場所で立ち止まってから画面を確認・操作してください。
              </p>
            </div>
          </div>

          {!hasAcknowledgedSafety ? (
            <button
              onClick={() => setHasAcknowledgedSafety(true)}
              className="py-2.5 px-5 rounded-xl font-bold text-xs btn-wafuu-shu shadow-md shrink-0 transition-all font-serif"
            >
              安全確認（立ち止まって利用します）
            </button>
          ) : (
            <span className="status-pill status-available text-xs font-bold shrink-0 flex items-center gap-1.5 py-2 px-3">
              <CheckCircle2 className="w-4 h-4" />
              <span>安全操作確認済</span>
            </span>
          )}
        </div>

        {/* ヘッダー */}
        <div className="flex items-center justify-between border-b border-wafuu-sumi/10 pb-4 mb-6 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-gradient-to-br from-wafuu-shu to-wafuu-shu-dark text-white border border-wafuu-ekasumi/40 shadow-sm">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest text-wafuu-shu uppercase font-bold block">
                INTERACTIVE CAMPUS NAVIGATION
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-wafuu-sumi tracking-wider">
                市川学園 校内デジタルマップ＆ルート案内
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-wafuu-kinari hover:bg-wafuu-shu text-wafuu-sumi hover:text-white transition-all shadow-sm"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 階層タブ＆検索バー */}
        <div className="space-y-4 mb-6 shrink-0 font-sans">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {(['all', '1F', '2F', '3F', '4F', 'outdoor'] as const).map((floor) => (
                <button
                  key={floor}
                  onClick={() => setSelectedFloor(floor)}
                  className={`px-4 py-2 rounded-xl font-bold text-xs transition-all border shrink-0 ${
                    selectedFloor === floor
                      ? 'bg-gradient-to-r from-wafuu-shu to-wafuu-shu-dark text-white border-wafuu-shu shadow-sm scale-105'
                      : 'bg-wafuu-kinari text-wafuu-text-sub hover:text-wafuu-sumi border-wafuu-sumi/10'
                  }`}
                >
                  {floor === 'all' ? '全館マップ' : floor === 'outdoor' ? '中庭・屋外ステージ' : `普通・特別教室棟 ${floor}`}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="教室コード・企画名で検索（例：301, 物理部…）"
              className="bg-wafuu-kinari text-wafuu-sumi placeholder-wafuu-text-muted/60 px-4 py-2 rounded-xl border border-wafuu-sumi/10 text-xs focus:outline-none focus:border-wafuu-shu w-full sm:w-64"
            />
          </div>
        </div>

        {/* メインマップ＆案内ルート表示エリア */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-1 font-sans">
          {/* ルートシミュレーションパネル */}
          {activeRoute && (
            <div className="wafuu-panel p-5 rounded-2xl border-2 border-wafuu-kincha bg-wafuu-kinari space-y-3 shadow-md">
              <div className="flex items-center justify-between border-b border-wafuu-sumi/10 pb-2">
                <span className="text-xs font-bold text-wafuu-sumi flex items-center gap-2 font-serif">
                  <Navigation className="w-4 h-4 text-wafuu-shu" />
                  <span>選択中の案内先: <strong>【{activeRoute}】</strong> への推奨移動ルート</span>
                </span>
                <button onClick={() => setActiveRoute(null)} className="text-[11px] text-wafuu-shu hover:underline font-bold">
                  ルート解除
                </button>
              </div>
              <p className="text-xs text-wafuu-text-sub leading-relaxed font-serif">
                <strong>現在地（正門・インフォメーション）からの道順：</strong> 正門よりイチョウ並木を直進し、正面の本部棟エントランスを通過して階段/エレベーターで目的階へお進みください。廊下の角を曲がる際は歩きスマホを避け、周囲の混雑にご注意ください。
              </p>
            </div>
          )}

          {/* 教室・展示場所リスト */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredOrgs.length === 0 ? (
              <div className="col-span-2 p-12 text-center rounded-2xl bg-wafuu-kinari border border-wafuu-sumi/10 text-wafuu-text-muted text-sm font-serif">
                該当する教室・展示場所が見つかりませんでした。
              </div>
            ) : (
              filteredOrgs.map((org) => {
                const isTarget = activeRoute === org.room_code || activeRoute === org.name;
                return (
                  <div
                    key={org.id}
                    className={`wafuu-panel p-5 rounded-2xl border transition-all space-y-3 ${
                      isTarget
                        ? 'border-wafuu-kincha bg-wafuu-silk shadow-md'
                        : 'border-wafuu-sumi/10 bg-wafuu-kinari/60 hover:border-wafuu-ekasumi'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-wafuu-ai bg-white px-2.5 py-1 rounded-lg border border-wafuu-sumi/10 shadow-sm">
                          {org.room_code}
                        </span>
                        <span className="text-xs text-wafuu-text-sub font-serif">{org.floor_info}</span>
                      </div>
                      <span className="status-pill status-available text-[10px]">
                        {org.inventory_status === 'STATUS_SOLD_OUT' ? '受付終了' : org.inventory_status === 'STATUS_FEW' ? '混雑中' : 'スムーズに案内中'}
                      </span>
                    </div>

                    <h4 className="font-bold text-base text-wafuu-sumi font-serif tracking-wide">{org.name}</h4>
                    <p className="text-xs text-wafuu-text-muted line-clamp-1">{org.description}</p>

                    <button
                      onClick={() => setActiveRoute(org.room_code)}
                      className="w-full py-2.5 rounded-xl font-bold text-xs btn-wafuu-kincha flex items-center justify-center gap-2 shadow-sm font-serif"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>立ち止まってこの場所へのルートを確認</span>
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* フッター注意 */}
        <div className="pt-4 mt-4 border-t border-wafuu-sumi/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-xs text-wafuu-text-sub shrink-0 font-sans">
          <span>校内での歩きスマホおよび走行は重大な衝突事故の原因となります。ご協力をお願いいたします。</span>
          <button onClick={onClose} className="px-6 py-2 rounded-xl bg-wafuu-kinari hover:bg-wafuu-sumi text-wafuu-sumi hover:text-white font-bold text-xs transition-all font-serif">
            マップを閉じる
          </button>
        </div>
      </div>
    </div>
  );
};

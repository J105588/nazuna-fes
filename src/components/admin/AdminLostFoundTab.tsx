import React, { useState, useMemo } from 'react';
import {
  Search,
  PlusCircle,
  CheckCircle2,
  Package,
  MapPin,
  Image as ImageIcon,
  RotateCcw,
  Trash2,
  X
} from 'lucide-react';
import type { LostItem } from '../../types/database';

export interface AdminLostFoundTabProps {
  lostItems: LostItem[];
  onCreateLostItem: (
    itemName: string,
    foundPlace: string,
    storageLocation: string,
    imageUrl?: string
  ) => Promise<void>;
  onUpdateStatus: (id: string, status: 'storage' | 'returned') => Promise<void>;
  onDeleteLostItem: (id: string, itemName: string) => void;
}

export const AdminLostFoundTab: React.FC<AdminLostFoundTabProps> = ({
  lostItems,
  onCreateLostItem,
  onUpdateStatus,
  onDeleteLostItem
}) => {
  const [itemName, setItemName] = useState('');
  const [foundPlace, setFoundPlace] = useState('');
  const [storageLocation, setStorageLocation] = useState('本館2階総合案内所');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCreateDrawer, setShowCreateDrawer] = useState(false);

  const [statusFilter, setStatusFilter] = useState<'all' | 'storage' | 'returned'>('storage');
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim() || !foundPlace.trim()) return;
    setIsSubmitting(true);
    try {
      await onCreateLostItem(
        itemName.trim(),
        foundPlace.trim(),
        storageLocation.trim() || '本館2階総合案内所',
        imageUrl.trim() || undefined
      );
      setItemName('');
      setFoundPlace('');
      setStorageLocation('本館2階総合案内所');
      setImageUrl('');
      setShowCreateDrawer(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredItems = useMemo(() => {
    return [...lostItems]
      .filter((item) => {
        if (statusFilter !== 'all' && item.status !== statusFilter) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = item.item_name?.toLowerCase().includes(q);
          const matchFound = item.found_place?.toLowerCase().includes(q);
          const matchStorage = item.storage_location?.toLowerCase().includes(q);
          if (!matchName && !matchFound && !matchStorage) return false;
        }
        return true;
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [lostItems, statusFilter, searchQuery]);

  const storageSuggestions = [
    '本館2階総合案内所',
    '第一体育館 本部席',
    '生徒会室 (本館3階)',
    '中庭本部テント'
  ];

  return (
    <div className="space-y-6 select-none animate-in fade-in duration-300">
      {/* 画面ヘッダー */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
            <Search className="w-5 h-5 text-emerald-600" />
            <span>落とし物・拾得物掲示板管理</span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-mono border border-slate-200">
              全{lostItems.length}件 / 保管中 {lostItems.filter((l) => l.status === 'storage').length}件
            </span>
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            会場内で拾得された物品の登録・写真添付、持ち主への返却完了ステータスの更新を行います。
          </p>
        </div>

        <button
          onClick={() => setShowCreateDrawer(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:opacity-90 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>拾得物を新規登録</span>
        </button>
      </div>

      {/* 検索・ステータスフィルタバー */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        {/* ステータスセグメント */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'storage' as const, label: '保管中のみ表示', badge: lostItems.filter((l) => l.status === 'storage').length },
            { id: 'all' as const, label: 'すべて表示', badge: lostItems.length },
            { id: 'returned' as const, label: '返却完了済', badge: lostItems.filter((l) => l.status === 'returned').length }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                statusFilter === f.id
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs border border-emerald-500'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>{f.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${statusFilter === f.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700 border border-slate-200'}`}>
                {f.badge}
              </span>
            </button>
          ))}
        </div>

        {/* 検索バー */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="品名・場所から検索..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 font-mono focus:outline-none focus:border-emerald-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-200 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 拾得物カードグリッド */}
      {filteredItems.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3 shadow-sm">
          <Package className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="font-bold text-sm text-slate-800">該当する落とし物・拾得物はありません</h3>
          <p className="text-xs text-slate-500">条件を変更するか、右上の「拾得物を新規登録」より追加してください。</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => {
            const isReturned = item.status === 'returned';

            return (
              <div
                key={item.id}
                className={`bg-white border rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all group shadow-sm ${
                  isReturned
                    ? 'border-slate-200 opacity-75 hover:opacity-100 bg-slate-50'
                    : 'border-slate-200 hover:border-emerald-400'
                }`}
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border ${
                        isReturned
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-2xs'
                          : 'bg-amber-50 text-amber-700 border-amber-200 shadow-2xs'
                      }`}
                    >
                      {isReturned ? '返却完了' : '保管中 (未返却)'}
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      {new Date(item.created_at).toLocaleString()}
                    </span>
                  </div>

                  {/* 画像またはプレビュー */}
                  {item.image_url ? (
                    <div className="relative h-36 w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                      <img
                        src={item.image_url}
                        alt={item.item_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="h-28 w-full rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-slate-400 gap-1.5">
                      <ImageIcon className="w-6 h-6 opacity-60" />
                      <span className="text-[11px] font-mono">写真なし</span>
                    </div>
                  )}

                  <div>
                    <h4 className="font-bold text-base text-slate-900 line-clamp-1">{item.item_name}</h4>
                    <div className="space-y-1 mt-2 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">拾得場所: <strong className="text-slate-900">{item.found_place}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Package className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">保管窓口: <strong className="text-slate-900">{item.storage_location}</strong></span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onUpdateStatus(item.id, isReturned ? 'storage' : 'returned')}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-all border flex items-center justify-center gap-1.5 ${
                      isReturned
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500 shadow-sm'
                    }`}
                  >
                    {isReturned ? (
                      <>
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>保管中に戻す</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>持ち主に返却済みにする</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onDeleteLostItem(item.id, item.item_name)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 transition-all border border-slate-200 shrink-0"
                    title="削除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 新規登録ドロワー/モーダル (半透明の黒背景) */}
      {showCreateDrawer && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            className="bg-slate-900/95 border border-slate-700/80 text-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-4">
              <div>
                <span className="text-xs font-mono text-emerald-400 block uppercase tracking-wider">New Lost Item</span>
                <h3 className="font-bold text-lg text-white">拾得物の新規登録</h3>
              </div>
              <button onClick={() => setShowCreateDrawer(false)} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">拾得品目・特徴</label>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="例: 黒い折り畳み傘, 水色のスマートフォン"
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">拾得場所</label>
                <input
                  type="text"
                  value={foundPlace}
                  onChange={(e) => setFoundPlace(e.target.value)}
                  placeholder="例: 第一体育館 入口付近, 中庭ベンチ"
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">保管・引き取り窓口</label>
                <input
                  type="text"
                  value={storageLocation}
                  onChange={(e) => setStorageLocation(e.target.value)}
                  placeholder="例: 本館2階総合案内所"
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all"
                  required
                />
                {/* 窓口サジェスト */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {storageSuggestions.map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => setStorageLocation(sug)}
                      className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 border border-slate-700 transition-colors"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">写真画像URL (任意)</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-emerald-500 transition-all"
                />
                {imageUrl && (
                  <div className="mt-2 h-24 w-full rounded-xl overflow-hidden bg-slate-800 border border-slate-700 flex items-center justify-center">
                    <img src={imageUrl} alt="preview" className="h-full object-contain" />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-700/80">
                <button
                  type="button"
                  onClick={() => setShowCreateDrawer(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all border border-slate-700"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all shadow-md"
                >
                  {isSubmitting ? '登録処理中...' : '拾得物を登録・公開'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

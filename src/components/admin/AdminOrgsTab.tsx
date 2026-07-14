import React, { useState, useMemo } from 'react';
import {
  Layers,
  Search,
  Filter,
  Grid,
  List,
  Edit3,
  Eye,
  EyeOff,
  X,
  Coffee,
  CheckCircle2,
  Building2,
  MapPin,
  PlusCircle
} from 'lucide-react';
import type { Organization, OrganizationCategory, OrganizationGenre } from '../../types/database';

export interface AdminOrgsTabProps {
  organizations: Organization[];
  onTogglePublish: (orgId: string, current: boolean) => Promise<void>;
  onSaveOrg: (
    orgId: string,
    data: {
      name: string;
      description: string;
      image_url: string;
      room_code: string;
      floor_info: string;
      category: OrganizationCategory;
      genre: OrganizationGenre;
    },
    useMenuApi: boolean,
    menuOwnerId?: string
  ) => Promise<void>;
  onCreateOrg?: (data: {
    name: string;
    description: string;
    image_url: string;
    room_code: string;
    floor_info: string;
    category: OrganizationCategory;
    genre: OrganizationGenre;
    use_menu_api: boolean;
    menu_owner_id?: string;
  }) => Promise<void>;
}

export const AdminOrgsTab: React.FC<AdminOrgsTabProps> = ({
  organizations,
  onTogglePublish,
  onSaveOrg,
  onCreateOrg
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | OrganizationCategory>('all');
  const [genreFilter, setGenreFilter] = useState<'all' | OrganizationGenre>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // 編集・作成モーダルの状態
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [isCreatingOrg, setIsCreatingOrg] = useState(false);
  const [orgForm, setOrgForm] = useState<{
    name: string;
    description: string;
    image_url: string;
    room_code: string;
    floor_info: string;
    category: OrganizationCategory;
    genre: OrganizationGenre;
    use_menu_api: boolean;
    menu_owner_id: string;
  }>({
    name: '',
    description: '',
    image_url: '',
    room_code: '',
    floor_info: '',
    category: 'class',
    genre: 'exhibition',
    use_menu_api: false,
    menu_owner_id: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  // フィルタ処理
  const filteredOrgs = useMemo(() => {
    return organizations.filter((org) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = org.name?.toLowerCase().includes(q);
        const matchRoom = org.room_code?.toLowerCase().includes(q);
        const matchDesc = org.description?.toLowerCase().includes(q);
        const matchFloor = org.floor_info?.toLowerCase().includes(q);
        if (!matchName && !matchRoom && !matchDesc && !matchFloor) return false;
      }
      if (categoryFilter !== 'all' && org.category !== categoryFilter) return false;
      if (genreFilter !== 'all' && org.genre !== genreFilter) return false;
      if (statusFilter === 'published' && !org.is_published) return false;
      if (statusFilter === 'draft' && org.is_published) return false;
      return true;
    });
  }, [organizations, searchQuery, categoryFilter, genreFilter, statusFilter]);

  const handleOpenEdit = (org: Organization) => {
    setEditingOrg(org);
    setIsCreatingOrg(false);
    setOrgForm({
      name: org.name || '',
      description: org.description || '',
      image_url: org.image_url || '',
      room_code: org.room_code || '',
      floor_info: org.floor_info || '',
      category: (org.category as OrganizationCategory) || 'class',
      genre: (org.genre as OrganizationGenre) || 'exhibition',
      use_menu_api: Boolean(org.use_menu_api),
      menu_owner_id: org.menu_owner_id || ''
    });
  };

  const handleOpenCreate = () => {
    setEditingOrg(null);
    setOrgForm({
      name: '',
      description: '',
      image_url: '/assets/poster/poster_complete.png',
      room_code: '',
      floor_info: '本館',
      category: 'class',
      genre: 'exhibition',
      use_menu_api: false,
      menu_owner_id: ''
    });
    setIsCreatingOrg(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrg) return;
    setIsSaving(true);
    try {
      await onSaveOrg(
        editingOrg.id,
        {
          name: orgForm.name,
          description: orgForm.description,
          image_url: orgForm.image_url,
          room_code: orgForm.room_code,
          floor_info: orgForm.floor_info,
          category: orgForm.category,
          genre: orgForm.genre
        },
        orgForm.use_menu_api,
        orgForm.menu_owner_id
      );
      setEditingOrg(null);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onCreateOrg) return;
    setIsSaving(true);
    try {
      await onCreateOrg({
        name: orgForm.name,
        description: orgForm.description,
        image_url: orgForm.image_url || '/assets/poster/poster_complete.png',
        room_code: orgForm.room_code,
        floor_info: orgForm.floor_info,
        category: orgForm.category,
        genre: orgForm.genre,
        use_menu_api: orgForm.use_menu_api,
        menu_owner_id: orgForm.menu_owner_id
      });
      setIsCreatingOrg(false);
    } finally {
      setIsSaving(false);
    }
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'class':
        return { label: 'クラス展示', bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
      case 'club':
        return { label: '部活動・委員会', bg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' };
      case 'volunteer':
      default:
        return { label: '有志企画', bg: 'bg-purple-500/10 text-purple-400 border-purple-500/20' };
    }
  };

  const getGenreBadge = (genre: string) => {
    switch (genre) {
      case 'attraction':
        return 'アトラクション';
      case 'food':
        return '喫茶・食品';
      case 'stage':
        return 'ステージ';
      case 'exhibition':
      default:
        return '展示・アート';
    }
  };

  return (
    <div className="space-y-6 select-none animate-in fade-in duration-300">
      {/* ヘッダー＆統計サマリー */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-blue-600" />
            <span>出展団体・企画管理</span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-mono border border-slate-200">
              {filteredOrgs.length} / {organizations.length}件
            </span>
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            各教室・団体の基本情報、紹介文、公開ステータスの変更や NazunaGraph メニューAPI の設定を行います。
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {onCreateOrg && (
            <button
              onClick={handleOpenCreate}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-md"
            >
              <PlusCircle className="w-4 h-4" />
              <span>＋ 新規出展団体を登録</span>
            </button>
          )}
          {/* 表示モードトグル */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-white border border-slate-200 shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span className="hidden sm:inline">カードグリッド</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                viewMode === 'table'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">リスト一覧</span>
            </button>
          </div>
        </div>
      </div>

      {/* 検索・フィルタツールバー */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3.5 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
          {/* 検索バー */}
          <div className="md:col-span-1 relative">
            <Search className="w-4 h-4 text-blue-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="団体名・教室・キーワード検索..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 font-mono focus:outline-none focus:border-blue-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-slate-200 p-1 rounded-full transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* カテゴリフィルタ */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 shrink-0 font-medium">種別:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 transition-all"
            >
              <option value="all">すべて表示</option>
              <option value="class">クラス展示</option>
              <option value="club">部活動・委員会</option>
              <option value="volunteer">有志企画</option>
            </select>
          </div>

          {/* ジャンルフィルタ */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 shrink-0 font-medium">ジャンル:</span>
            <select
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 transition-all"
            >
              <option value="all">すべて表示</option>
              <option value="attraction">アトラクション</option>
              <option value="food">喫茶・食品</option>
              <option value="exhibition">展示・アート</option>
              <option value="stage">ステージ</option>
            </select>
          </div>

          {/* 公開状態フィルタ */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 shrink-0 font-medium">状態:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 transition-all"
            >
              <option value="all">すべての状態</option>
              <option value="published">公開中のみ</option>
              <option value="draft">非公開のみ</option>
            </select>
          </div>
        </div>
      </div>

      {/* 企画一覧表示 */}
      {filteredOrgs.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3 shadow-sm">
          <Filter className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="font-bold text-sm text-slate-800">該当する団体・企画が見つかりませんでした</h3>
          <p className="text-xs text-slate-500">検索条件やフィルタを変更してお試しください。</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setCategoryFilter('all');
              setGenreFilter('all');
              setStatusFilter('all');
            }}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-all"
          >
            フィルタをリセット
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* カードグリッド表示 */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredOrgs.map((org) => {
            const isPub = Boolean(org.is_published);
            const catBadge = getCategoryBadge(org.category);
            return (
              <div
                key={org.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all hover:border-blue-400 hover:shadow-lg group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2.5 py-0.5 rounded-lg text-[11px] font-semibold border ${catBadge.bg}`}>
                      {catBadge.label}
                    </span>
                    <span className="text-xs font-mono text-slate-600 flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
                      <Building2 className="w-3 h-3 text-slate-400" />
                      <span>{org.room_code || '未定'}</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {org.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{org.floor_info || 'フロア不明'}</span>
                      </span>
                      <span>•</span>
                      <span className="text-slate-700 font-medium">{getGenreBadge(org.genre)}</span>
                      {org.genre === 'food' && org.use_menu_api && (
                        <span className="text-blue-600 font-mono text-[10px] bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                          API同期
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 min-h-[3.5rem]">
                    {org.description || '紹介文が登録されていません。'}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleOpenEdit(org)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-all border border-slate-200"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>詳細編集</span>
                  </button>

                  <button
                    onClick={() => onTogglePublish(org.id, isPub)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all border shadow-xs ${
                      isPub
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                        : 'bg-red-50 text-red-700 border-red-300 hover:bg-red-100'
                    }`}
                  >
                    {isPub ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{isPub ? '公開中' : '非公開'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* テーブルリスト表示 */
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-600 font-medium">
                  <th className="py-3 px-4">団体・企画名</th>
                  <th className="py-3 px-4">種別 / ジャンル</th>
                  <th className="py-3 px-4">教室 / フロア</th>
                  <th className="py-3 px-4">API連携</th>
                  <th className="py-3 px-4">公開状態</th>
                  <th className="py-3 px-4 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredOrgs.map((org) => {
                  const isPub = Boolean(org.is_published);
                  const catBadge = getCategoryBadge(org.category);
                  return (
                    <tr key={org.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-sm text-slate-900">{org.name}</div>
                        <div className="text-slate-500 line-clamp-1 mt-0.5 max-w-xs">{org.description}</div>
                      </td>
                      <td className="py-3.5 px-4 space-y-1">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${catBadge.bg}`}>
                          {catBadge.label}
                        </span>
                        <div className="text-slate-700">{getGenreBadge(org.genre)}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        <div className="text-slate-900 font-bold">{org.room_code || '-'}</div>
                        <div className="text-slate-500 text-[11px]">{org.floor_info || '-'}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        {org.genre === 'food' ? (
                          org.use_menu_api ? (
                            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-mono text-[10px]">
                              ON
                            </span>
                          ) : (
                            <span className="text-slate-400 font-mono text-[10px]">OFF</span>
                          )
                        ) : (
                          <span className="text-slate-400 font-mono text-[10px]">-</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium border ${
                            isPub
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-red-50 text-red-700 border-red-200'
                          }`}
                        >
                          {isPub ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          <span>{isPub ? '公開中' : '非公開'}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEdit(org)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-all border border-slate-200"
                        >
                          詳細編集
                        </button>
                        <button
                          onClick={() => onTogglePublish(org.id, isPub)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                            isPub
                              ? 'bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 border-slate-200'
                              : 'bg-blue-600 hover:bg-blue-500 text-white border-blue-600'
                          }`}
                        >
                          {isPub ? '非公開へ' : '公開へ'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 団体情報編集・作成ドロワー/モーダル (半透明の黒背景) */}
      {(editingOrg || isCreatingOrg) && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            className="bg-slate-900/95 border border-slate-700/80 text-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-4">
              <div>
                <span className="text-xs font-mono text-blue-400 block uppercase tracking-wider">
                  {isCreatingOrg ? 'New Organization' : 'Edit Organization'}
                </span>
                <h3 className="font-bold text-lg text-white">
                  {isCreatingOrg ? '新規出展団体の登録' : `団体・企画の編集: ${editingOrg?.name}`}
                </h3>
              </div>
              <button
                onClick={() => { setEditingOrg(null); setIsCreatingOrg(false); }}
                className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={isCreatingOrg ? handleSaveCreate : handleSaveEdit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">団体・企画名</label>
                <input
                  type="text"
                  value={orgForm.name}
                  onChange={(e) => setOrgForm({ ...orgForm, name: e.target.value })}
                  placeholder="例: 3年A組「赤い和傘と極夜の謎解き迷宮」"
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">教室コード</label>
                  <input
                    type="text"
                    value={orgForm.room_code}
                    onChange={(e) => setOrgForm({ ...orgForm, room_code: e.target.value })}
                    placeholder="例: 3A, 3-3, 102"
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">フロア情報</label>
                  <input
                    type="text"
                    value={orgForm.floor_info}
                    onChange={(e) => setOrgForm({ ...orgForm, floor_info: e.target.value })}
                    placeholder="例: 本館3階 北側教室"
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">種別</label>
                  <select
                    value={orgForm.category}
                    onChange={(e) => setOrgForm({ ...orgForm, category: e.target.value as OrganizationCategory })}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
                  >
                    <option value="class" className="bg-slate-900 text-white">クラス企画</option>
                    <option value="club" className="bg-slate-900 text-white">部活動・委員会</option>
                    <option value="volunteer" className="bg-slate-900 text-white">有志企画</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">ジャンル</label>
                  <select
                    value={orgForm.genre}
                    onChange={(e) => setOrgForm({ ...orgForm, genre: e.target.value as OrganizationGenre })}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
                  >
                    <option value="attraction" className="bg-slate-900 text-white">アトラクション</option>
                    <option value="food" className="bg-slate-900 text-white">喫茶・食品</option>
                    <option value="exhibition" className="bg-slate-900 text-white">展示・アート</option>
                    <option value="stage" className="bg-slate-900 text-white">ステージ</option>
                  </select>
                </div>
              </div>

              {orgForm.genre === 'food' && (
                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <Coffee className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-white block">NazunaGraph メニュー在庫API連携</span>
                      <span className="text-[11px] text-slate-400 leading-relaxed block mt-0.5">
                        オンにすると定時リクエスト＆キャッシュにより、メニューや混雑状況が自動同期されます。
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={orgForm.use_menu_api}
                    onChange={(e) => setOrgForm({ ...orgForm, use_menu_api: e.target.checked })}
                    className="w-5 h-5 rounded border-slate-600 text-blue-600 focus:ring-blue-500 bg-slate-900 cursor-pointer shrink-0"
                  />
                </div>
              )}

              {orgForm.genre === 'food' && orgForm.use_menu_api && (
                <div className="p-4 rounded-2xl bg-indigo-950/60 border border-indigo-700/60 space-y-2">
                  <label className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                    <span>NazunaGraph 独立クラスID (`menu_owner_id`)</span>
                  </label>
                  <input
                    type="text"
                    value={orgForm.menu_owner_id}
                    onChange={(e) => setOrgForm({ ...orgForm, menu_owner_id: e.target.value })}
                    placeholder="例: 3-3, 3-A, 2-C (空白時は通常のクラスコードから自動取得)"
                    className="w-full bg-slate-900/90 border border-indigo-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-indigo-400 transition-all"
                  />
                  <p className="text-[11px] text-indigo-300/90 leading-relaxed">
                    ※ NazunaGraphAPIがオンにされたとき、クラスIDは通常の出展団体UUIDや部屋番号ではなく独立したものになります。3-3のような形式で入力することで、当該パラメータを付与してデータを取得します。
                  </p>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">紹介説明文</label>
                <textarea
                  rows={4}
                  value={orgForm.description}
                  onChange={(e) => setOrgForm({ ...orgForm, description: e.target.value })}
                  placeholder="企画の特徴や来場者へのアピールポイントを入力してください。"
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-all leading-relaxed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">メイン画像URL</label>
                <input
                  type="text"
                  value={orgForm.image_url}
                  onChange={(e) => setOrgForm({ ...orgForm, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-700/80">
                <button
                  type="button"
                  onClick={() => { setEditingOrg(null); setIsCreatingOrg(false); }}
                  disabled={isSaving}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all border border-slate-700"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-all flex items-center gap-2 shadow-md"
                >
                  {isSaving ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>保存中...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isCreatingOrg ? '新規団体を登録する' : '変更を保存する'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

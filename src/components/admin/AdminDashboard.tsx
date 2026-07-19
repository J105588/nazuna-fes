import React, { useState, useEffect, useCallback } from 'react';
import type {
  Organization,
  TimetableEvent,
  TimetableDay,
  Announcement,
  LostItem,
  AnnouncementCategory,
  StageLocation,
  OrganizationCategory,
  OrganizationGenre,
  AdminUser,
  PyramidRelease,
  PageSetting
} from '../../types/database';
import {
  toggleOrganizationPublish,
  toggleTimetableEventPublish,
  updateOrganizationInDB,
  updateTimetableEventInDB,
  updateOrganizationMenuApiInDB,
  createAnnouncementInDB,
  toggleAnnouncementPublish,
  deleteAnnouncementInDB,
  createLostItemInDB,
  updateLostItemStatusInDB,
  deleteLostItemInDB,
  createTimetableEventInDB,
  deleteTimetableEventInDB,
  fetchTimetableDaysFromDB,
  createTimetableDayInDB,
  deleteTimetableDayInDB,
  mockPyramidReleases,
  fetchPyramidReleasesFromDB,
  updatePyramidReleaseInDB,
  fetchOrganizationsFromDB,
  fetchTimetableEventsFromDB,
  fetchAnnouncementsFromDB,
  fetchLostItemsFromDB,
  createOrganizationInDB,
  createPyramidReleaseInDB,
  deletePyramidReleaseInDB,
  fetchPageSettingsFromDB,
  updatePageSettingInDB,
  mockPageSettings,
  subscribeToDataChanges
} from '../../lib/supabase';

// 分割・新設したコンポーネント群
import { AdminSidebar, type AdminTabId } from './AdminSidebar';
import { AdminConfirmModal } from './AdminConfirmModal';
import { AdminToast } from './AdminToast';
import { AdminOverviewTab } from './AdminOverviewTab';
import { AdminOrgsTab } from './AdminOrgsTab';
import { AdminEventsTab } from './AdminEventsTab';
import { AdminAnnouncementsTab } from './AdminAnnouncementsTab';
import { AdminLostFoundTab } from './AdminLostFoundTab';
import { AdminPyramidTab } from './AdminPyramidTab';
import { AdminUserManagement } from './AdminUserManagement';
import { AdminPagesTab } from './AdminPagesTab';

interface AdminDashboardProps {
  organizations: Organization[];
  timetableEvents: TimetableEvent[];
  announcements: Announcement[];
  lostItems: LostItem[];
  role: 'superadmin' | 'admin' | string;
  onLogout: () => void;
  currentUser?: AdminUser | null;
  onNavigateHome?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  organizations: initialOrgs,
  timetableEvents: initialEvents,
  announcements: initialAnnouncements,
  lostItems: initialLostItems,
  role,
  onLogout,
  currentUser,
  onNavigateHome
}) => {
  const isSuper = role === 'superadmin' || currentUser?.role === 'superadmin';
  const [activeTab, setActiveTab] = useState<AdminTabId>('overview');

  // ローカル状態管理
  const [organizations, setOrganizations] = useState<Organization[]>(initialOrgs);
  const [timetableEvents, setTimetableEvents] = useState<TimetableEvent[]>(initialEvents);
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [lostItems, setLostItems] = useState<LostItem[]>(initialLostItems);
  const [days, setDays] = useState<TimetableDay[]>([]);

  const [selectedReleaseIndex, setSelectedReleaseIndex] = useState(0);
  const [pyramidReleases, setPyramidReleases] = useState<PyramidRelease[]>(mockPyramidReleases || []);
  const [pageSettings, setPageSettings] = useState<PageSetting[]>(mockPageSettings);

  // トースト通知状態
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');

  // 確認モーダル状態
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    variant: 'danger' | 'warning' | 'info';
    confirmLabel: string;
    onConfirm: () => Promise<void> | void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    variant: 'danger',
    confirmLabel: '実行する',
    onConfirm: () => {}
  });

  const showToast = useCallback((msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
  }, []);

  // 初期データおよび同期のフェッチ
  useEffect(() => {
    fetchTimetableDaysFromDB().then((data) => {
      setDays(data);
    });
    fetchPyramidReleasesFromDB().then((data) => {
      if (data && data.length > 0) setPyramidReleases(data);
    });
    fetchPageSettingsFromDB().then((data) => {
      if (data && data.length > 0) setPageSettings(data);
    });

    const unsubscribe = subscribeToDataChanges(
      () => {},
      undefined,
      undefined,
      undefined,
      (newPages) => setPageSettings(newPages)
    );
    return () => unsubscribe();
  }, []);

  // Propsの更新をローカル状態へ反映
  useEffect(() => {
    setOrganizations(initialOrgs);
  }, [initialOrgs]);

  useEffect(() => {
    setTimetableEvents(initialEvents);
  }, [initialEvents]);

  useEffect(() => {
    setAnnouncements(initialAnnouncements);
  }, [initialAnnouncements]);

  useEffect(() => {
    setLostItems(initialLostItems);
  }, [initialLostItems]);

  const refreshOrgs = async () => {
    const data = await fetchOrganizationsFromDB();
    if (data) setOrganizations(data);
  };

  const refreshEvents = async () => {
    const data = await fetchTimetableEventsFromDB();
    if (data) setTimetableEvents(data);
  };

  const refreshAnnouncements = async () => {
    const data = await fetchAnnouncementsFromDB();
    if (data) setAnnouncements(data);
  };

  const refreshLostItems = async () => {
    const data = await fetchLostItemsFromDB();
    if (data) setLostItems(data);
  };

  // ページ公開操作
  const handleTogglePagePublic = async (pageId: string, nextPublic: boolean) => {
    try {
      await updatePageSettingInDB(pageId, { is_public: nextPublic });
      setPageSettings((prev) => prev.map((p) => (p.id === pageId ? { ...p, is_public: nextPublic } : p)));
      showToast(`ページ公開ステータスを「${nextPublic ? '公開中（メニュー表示）' : '準備中（メニュー非表示）'}」に変更しました。`, 'success');
    } catch {
      showToast('ページのステータス変更に失敗しました。', 'error');
    }
  };

  const handleUpdatePageMessage = async (pageId: string, custom_message: string) => {
    try {
      await updatePageSettingInDB(pageId, { custom_message });
      setPageSettings((prev) => prev.map((p) => (p.id === pageId ? { ...p, custom_message } : p)));
      showToast('準備中メッセージを保存しました。', 'success');
    } catch {
      showToast('メッセージの保存に失敗しました。', 'error');
    }
  };

  const handleBatchTogglePages = async (nextPublic: boolean) => {
    try {
      for (const page of pageSettings) {
        await updatePageSettingInDB(page.id, { is_public: nextPublic });
      }
      setPageSettings((prev) => prev.map((p) => ({ ...p, is_public: nextPublic })));
      showToast(`すべてのページを「${nextPublic ? '公開中（メニュー表示）' : '準備中（メニュー非表示）'}」に一括変更しました。`, 'success');
    } catch {
      showToast('一括変更に失敗しました。', 'error');
    }
  };

  // 1. 出展団体操作
  const handleToggleOrgPublish = async (orgId: string, current: boolean) => {
    try {
      await toggleOrganizationPublish(orgId, !current);
      setOrganizations((prev) => prev.map((o) => (o.id === orgId ? { ...o, is_published: !current } : o)));
      showToast(`公開ステータスを「${!current ? '公開中' : '非公開'}」に切り替えました。`, 'success');
    } catch {
      showToast('ステータス変更に失敗しました。', 'error');
    }
  };

  const handleSaveOrg = async (
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
  ) => {
    try {
      await updateOrganizationInDB(orgId, data);
      await updateOrganizationMenuApiInDB(orgId, useMenuApi, menuOwnerId);
      await refreshOrgs();
      showToast('団体・企画情報を保存しました。', 'success');
    } catch {
      showToast('保存中にエラーが発生しました。', 'error');
    }
  };

  const handleCreateOrg = async (data: {
    name: string;
    description: string;
    image_url: string;
    room_code: string;
    floor_info: string;
    category: OrganizationCategory;
    genre: OrganizationGenre;
    use_menu_api: boolean;
    menu_owner_id?: string;
  }) => {
    try {
      await createOrganizationInDB({
        name: data.name,
        description: data.description,
        image_url: data.image_url,
        room_code: data.room_code,
        floor_info: data.floor_info,
        category: data.category,
        genre: data.genre,
        inventory_status: 'STATUS_AVAILABLE',
        is_published: true,
        use_menu_api: data.use_menu_api,
        menu_owner_id: data.menu_owner_id
      });
      await refreshOrgs();
      showToast('新しい出展団体を登録しました。', 'success');
    } catch {
      showToast('出展団体の登録に失敗しました。', 'error');
    }
  };

  // 2. タイムテーブル操作
  const handleToggleEventPublish = async (id: string, current: boolean) => {
    try {
      await toggleTimetableEventPublish(id, !current);
      setTimetableEvents((prev) => prev.map((e) => (e.id === id ? { ...e, is_published: !current } : e)));
      showToast(`演目のステータスを「${!current ? '公開' : '非公開'}」に更新しました。`, 'success');
    } catch {
      showToast('更新に失敗しました。', 'error');
    }
  };

  const handleCreateEvent = async (data: {
    title: string;
    day_id: string;
    start_time: string;
    end_time: string;
    stage_location: StageLocation;
    description?: string;
    organization_id?: string;
    organization_name?: string;
    color?: string;
  }) => {
    try {
      await createTimetableEventInDB(data);
      await refreshEvents();
      showToast('新しいステージ演目を登録しました。', 'success');
    } catch {
      showToast('演目の登録に失敗しました。', 'error');
    }
  };

  const handleSaveEvent = async (
    id: string,
    data: {
      title: string;
      day_id: string;
      start_time: string;
      end_time: string;
      stage_location: StageLocation;
      description?: string;
      organization_id?: string;
      organization_name?: string;
      color?: string;
    }
  ) => {
    try {
      await updateTimetableEventInDB(id, data);
      await refreshEvents();
      showToast('ステージ演目情報を更新しました。', 'success');
    } catch {
      showToast('更新中にエラーが発生しました。', 'error');
    }
  };

  const handleDeleteEvent = (id: string, title: string) => {
    setConfirmModal({
      isOpen: true,
      title: '演目の削除確認',
      message: `ステージ演目「${title}」を削除しますか？\nこの操作は取り消すことができません。`,
      variant: 'danger',
      confirmLabel: '演目を削除する',
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        try {
          await deleteTimetableEventInDB(id);
          setTimetableEvents((prev) => prev.filter((e) => e.id !== id));
          showToast(`演目「${title}」を削除しました。`, 'success');
        } catch {
          showToast('削除中にエラーが発生しました。', 'error');
        }
      }
    });
  };

  const handleCreateDay = async (dateString: string, label: string) => {
    try {
      const added = await createTimetableDayInDB({
        date_string: dateString,
        label: label,
        display_order: days.length + 1
      });
      if (added) {
        setDays((prev) => [...prev, added]);
        showToast('新しい日にちタブを追加しました。', 'success');
      }
    } catch {
      showToast('日にちの追加に失敗しました。', 'error');
    }
  };

  const handleDeleteDay = (id: string, label: string) => {
    setConfirmModal({
      isOpen: true,
      title: '日にちタブの削除確認',
      message: `日にちタブ「${label}」を削除しますか？\n※ 関連付けられている演目がある場合は影響を受ける可能性があります。`,
      variant: 'warning',
      confirmLabel: 'タブを削除する',
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        try {
          await deleteTimetableDayInDB(id);
          setDays((prev) => prev.filter((d) => d.id !== id));
          showToast(`日にちタブ「${label}」を削除しました。`, 'success');
        } catch {
          showToast('削除に失敗しました。', 'error');
        }
      }
    });
  };

  // 3. お知らせ配信操作
  const handleCreateAnnouncement = async (title: string, content: string, category: AnnouncementCategory) => {
    try {
      await createAnnouncementInDB(title, content, category);
      await refreshAnnouncements();
      showToast('新しいお知らせを配信しました。', 'success');
    } catch {
      showToast('お知らせの配信に失敗しました。', 'error');
    }
  };

  const handleToggleAnnouncementPublish = async (id: string, current: boolean) => {
    try {
      await toggleAnnouncementPublish(id, !current);
      setAnnouncements((prev) => prev.map((a) => (a.id === id ? { ...a, is_published: !current } : a)));
      showToast(`配信を「${!current ? '公開中' : '停止'}」に変更しました。`, 'success');
    } catch {
      showToast('変更に失敗しました。', 'error');
    }
  };

  const handleDeleteAnnouncement = (id: string, title: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'お知らせの削除確認',
      message: `配信お知らせ「${title}」を完全に削除しますか？`,
      variant: 'danger',
      confirmLabel: 'お知らせを削除',
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        try {
          await deleteAnnouncementInDB(id);
          setAnnouncements((prev) => prev.filter((a) => a.id !== id));
          showToast('お知らせを削除しました。', 'success');
        } catch {
          showToast('削除に失敗しました。', 'error');
        }
      }
    });
  };

  // 4. 落とし物操作
  const handleCreateLostItem = async (
    itemName: string,
    foundPlace: string,
    storageLocation: string,
    imageUrl?: string
  ) => {
    try {
      await createLostItemInDB(itemName, foundPlace, storageLocation, imageUrl);
      await refreshLostItems();
      showToast('拾得物を掲示板に登録しました。', 'success');
    } catch {
      showToast('登録に失敗しました。', 'error');
    }
  };

  const handleUpdateLostItemStatus = async (id: string, status: 'storage' | 'returned') => {
    try {
      await updateLostItemStatusInDB(id, status);
      setLostItems((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
      showToast(`ステータスを「${status === 'storage' ? '保管中' : '返却完了'}」に変更しました。`, 'success');
    } catch {
      showToast('ステータス変更に失敗しました。', 'error');
    }
  };

  const handleDeleteLostItem = (id: string, itemName: string) => {
    setConfirmModal({
      isOpen: true,
      title: '拾得物データの削除確認',
      message: `拾得物「${itemName}」のデータを削除しますか？`,
      variant: 'danger',
      confirmLabel: 'データを削除',
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        try {
          await deleteLostItemInDB(id);
          setLostItems((prev) => prev.filter((l) => l.id !== id));
          showToast('落とし物データを削除しました。', 'success');
        } catch {
          showToast('削除に失敗しました。', 'error');
        }
      }
    });
  };

  // 5. ピラミッド結果開示操作
  const handleSavePyramidTitleMessage = async (releaseId: string, title: string, embargoMessage: string) => {
    try {
      await updatePyramidReleaseInDB(releaseId, { title, embargoMessage });
      setPyramidReleases((prev) =>
        prev.map((r) => ((r.releaseId || r.id) === releaseId ? { ...r, title, embargoMessage } : r))
      );
      showToast('ピラミッド結果の開示タイトル・メッセージを保存しました。', 'success');
    } catch {
      showToast('保存に失敗しました。', 'error');
    }
  };

  const handleSavePyramidRelease = async (releaseId: string, updates: Partial<PyramidRelease>) => {
    try {
      await updatePyramidReleaseInDB(releaseId, updates);
      setPyramidReleases((prev) =>
        prev.map((r) => ((r.releaseId || r.id) === releaseId ? { ...r, ...updates } : r))
      );
      showToast('ピラミッド結果・受賞構成を保存しました。', 'success');
    } catch {
      showToast('保存に失敗しました。', 'error');
    }
  };

  const handleCreatePyramidRelease = async (data: {
    title: string;
    scheduledTime: string;
    embargoMessage: string;
    pyramidTiers?: { high: string[]; upper: string[]; middle: string[] };
  }) => {
    try {
      const newRelease = await createPyramidReleaseInDB(data);
      setPyramidReleases((prev) => [...prev, newRelease]);
      showToast('新しい開示スケジュールを追加しました。', 'success');
    } catch {
      showToast('追加に失敗しました。', 'error');
    }
  };

  const handleDeletePyramidRelease = (releaseId: string, title: string) => {
    setConfirmModal({
      isOpen: true,
      title: '開示スケジュールの削除確認',
      message: `開示スケジュール「${title}」を削除しますか？`,
      variant: 'danger',
      confirmLabel: '削除する',
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        try {
          await deletePyramidReleaseInDB(releaseId);
          setPyramidReleases((prev) => prev.filter((r) => (r.releaseId || r.id) !== releaseId));
          if (selectedReleaseIndex >= pyramidReleases.length - 1) {
            setSelectedReleaseIndex(Math.max(0, pyramidReleases.length - 2));
          }
          showToast('開示スケジュールを削除しました。', 'success');
        } catch {
          showToast('削除に失敗しました。', 'error');
        }
      }
    });
  };

  const handleTogglePyramidEmbargo = async (releaseId: string, nextEmbargo: boolean) => {
    setConfirmModal({
      isOpen: true,
      title: nextEmbargo ? 'ピラミッド結果のロック確認' : 'ピラミッド結果の即時開示確認',
      message: nextEmbargo
        ? '結果をロック状態にしますか？\nユーザー画面では「ロック中メッセージ」が表示され、順位や結果は見えなくなります。'
        : '結果をすぐに公開（ロック解除）しますか？\nユーザーのスマートフォン端末に即座に順位と詳細が表示されます。',
      variant: nextEmbargo ? 'warning' : 'danger',
      confirmLabel: nextEmbargo ? 'ロックする (非公開)' : '即時開示する (公開)',
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        try {
          await updatePyramidReleaseInDB(releaseId, { isEmbargoed: nextEmbargo });
          setPyramidReleases((prev) =>
            prev.map((r) => ((r.releaseId || r.id) === releaseId ? { ...r, isEmbargoed: nextEmbargo } : r))
          );
          showToast(nextEmbargo ? '結果をロックしました。' : '結果を公開しました！', 'success');
        } catch {
          showToast('ステータスの更新に失敗しました。', 'error');
        }
      }
    });
  };

  return (
    <div className="admin-portal min-h-screen bg-[#FAF8F5] text-[#2C3E55] font-sans relative selection:bg-[#2C3E55] selection:text-white">
      {/* 和風アンビエントグロー */}
      <div className="fixed top-[-10%] left-[20%] w-[500px] h-[500px] bg-[#E2E8F0] rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-[#D14B41]/4 rounded-full blur-[150px] pointer-events-none" />

      {/* 共通のカスタム確認ダイアログ */}
      <AdminConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        variant={confirmModal.variant}
        confirmLabel={confirmModal.confirmLabel}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* 共通のトースト通知 */}
      <AdminToast
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage(null)}
      />

      {/* サイドバーナビゲーション (PC & モバイルセグメント) */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        role={role}
        currentUser={currentUser}
        onLogout={onLogout}
        onNavigateHome={onNavigateHome}
        counts={{
          orgs: organizations.length,
          events: timetableEvents.length,
          announcements: announcements.length,
          lostItems: lostItems.length,
          users: 0
        }}
      />

      {/* メインコンテンツ領域（サイドバーの固定幅 256px=16rem 分を正確に確保し中央ズレを防止） */}
      <main className="w-full md:w-[calc(100%-16rem)] md:ml-64 p-4 sm:p-8 lg:p-10 min-h-screen relative z-10">
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
          {activeTab === 'overview' && (
            <AdminOverviewTab
              organizations={organizations}
              timetableEvents={timetableEvents}
              announcements={announcements}
              lostItems={lostItems}
              currentUser={currentUser}
              role={role}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'users' && isSuper && (
            <AdminUserManagement currentUser={currentUser} />
          )}

          {activeTab === 'pages' && (
            <AdminPagesTab
              pageSettings={pageSettings}
              onTogglePublic={handleTogglePagePublic}
              onUpdateMessage={handleUpdatePageMessage}
              onBatchToggle={handleBatchTogglePages}
            />
          )}

          {activeTab === 'orgs' && (
            <AdminOrgsTab
              organizations={organizations}
              onTogglePublish={handleToggleOrgPublish}
              onSaveOrg={handleSaveOrg}
              onCreateOrg={handleCreateOrg}
            />
          )}

          {activeTab === 'events' && (
            <AdminEventsTab
              timetableEvents={timetableEvents}
              days={days}
              onTogglePublish={handleToggleEventPublish}
              onCreateEvent={handleCreateEvent}
              onSaveEvent={handleSaveEvent}
              onDeleteEvent={handleDeleteEvent}
              onCreateDay={handleCreateDay}
              onDeleteDay={handleDeleteDay}
              organizations={organizations}
            />
          )}

          {activeTab === 'announcements' && (
            <AdminAnnouncementsTab
              announcements={announcements}
              onCreateAnnouncement={handleCreateAnnouncement}
              onTogglePublish={handleToggleAnnouncementPublish}
              onDeleteAnnouncement={handleDeleteAnnouncement}
            />
          )}

          {activeTab === 'lostfound' && (
            <AdminLostFoundTab
              lostItems={lostItems}
              onCreateLostItem={handleCreateLostItem}
              onUpdateStatus={handleUpdateLostItemStatus}
              onDeleteLostItem={handleDeleteLostItem}
            />
          )}

          {activeTab === 'pyramid' && (
            <AdminPyramidTab
              pyramidReleases={pyramidReleases}
              organizations={organizations}
              selectedReleaseIndex={selectedReleaseIndex}
              setSelectedReleaseIndex={setSelectedReleaseIndex}
              onSaveTitleMessage={handleSavePyramidTitleMessage}
              onSaveRelease={handleSavePyramidRelease}
              onToggleEmbargo={handleTogglePyramidEmbargo}
              onCreateRelease={handleCreatePyramidRelease}
              onDeleteRelease={handleDeletePyramidRelease}
            />
          )}
        </div>
      </main>
    </div>
  );
};

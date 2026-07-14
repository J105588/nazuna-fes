import React, { useState, useEffect } from 'react';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { Home } from './pages/Home';
import { TimetablePage } from './pages/TimetablePage';
import { SchoolInfoPage } from './pages/SchoolInfoPage';
import { LostFoundPage } from './pages/LostFoundPage';
import { AdminPage } from './pages/AdminPage';
import { GuidanceDetailPage, type GuidanceSectionId } from './pages/GuidanceDetailPage';
import { PolicyPage, type PolicySectionId } from './pages/PolicyPage';
import { ExhibitionPage } from './pages/ExhibitionPage';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { UrgentAnnouncementModal } from './components/common/UrgentAnnouncementModal';
import { ShojiOpening } from './components/intro/ShojiOpening';
import { openExternalMap } from './lib/api';
import { NotFoundView } from './components/common/NotFoundView';
import {
  mockOrganizations,
  mockTimetableEvents,
  mockAnnouncements,
  mockLostItems,
  fetchOrganizationsFromDB,
  fetchTimetableEventsFromDB,
  fetchAnnouncementsFromDB,
  fetchLostItemsFromDB,
  fetchPageSettingsFromDB,
  mockPageSettings,
  subscribeToDataChanges,
  supabase
} from './lib/supabase';
import type { Organization, TimetableEvent, Announcement, LostItem, PageSetting } from './types/database';

export type TabId = 'home' | 'exhibitions' | 'timetable' | 'map' | 'news' | 'info' | 'lostfound' | 'admin' | 'guidance' | 'policy' | 'not_found';

function getTabFromUrl(): TabId {
  const hash = window.location.hash.replace(/^#\/?/, '').split('?')[0].toLowerCase();
  const path = window.location.pathname.replace(/^\//, '').split('/')[0].toLowerCase();
  const target = hash || path;

  if (!target || target === 'home' || target === 'index' || target === 'index.html') return 'home';
  if (target === 'news' || target === 'announcements' || target === 'notice') return 'news';
  if (target === 'exhibitions' || target === 'exhibition' || target === 'kikaku') return 'exhibitions';
  if (target === 'timetable' || target === 'schedule') return 'timetable';
  if (target === 'map' || target === 'campusmap' || target === 'icompass') return 'map';
  if (target === 'info' || target === 'school' || target === 'about') return 'info';
  if (target === 'lostfound' || target === 'lost') return 'lostfound';
  if (target === 'admin' || target === 'dashboard' || target === 'login') return 'admin';
  if (target === 'guidance' || target === 'guide') return 'guidance';
  if (target === 'policy' || target === 'privacy') return 'policy';
  return 'not_found';
}

export const App: React.FC = () => {
  const [currentTab, setCurrentTabState] = useState<TabId>(() => {
    const initial = getTabFromUrl();
    if (initial === 'map') {
      // 初期ロード時にURLが#map等の場合は外部マップを開き、画面はホームを表示
      setTimeout(() => openExternalMap(), 100);
      return 'home';
    }
    return initial;
  });

  // 5時間（18,000,000ミリ秒）以内ならオープニング演出をスキップする判定
  const checkShouldSkipIntro = () => {
    try {
      const lastPlayed = localStorage.getItem('last_shoji_played_time');
      if (lastPlayed) {
        const diff = Date.now() - parseInt(lastPlayed, 10);
        if (diff < 5 * 60 * 60 * 1000) {
          return true;
        }
      }
    } catch {}
    return false;
  };

  const [isIntroFinished, setIsIntroFinished] = useState<boolean>(() => {
    const initialTab = getTabFromUrl();
    // 初期ロードが home 以外の画面（またはスキップ判定時）は、オープニング演出待ちを行わず最初からヘッダー等を表示
    if (initialTab !== 'home' || checkShouldSkipIntro()) {
      return true;
    }
    return false;
  });
  const [introKey] = useState(0);
  const [isShojiFinished, setIsShojiFinished] = useState<boolean>(() => checkShouldSkipIntro());

  useEffect(() => {
    // home 以外の画面に遷移・リロードした際は確実にヘッダーを表示する
    if (currentTab !== 'home' && !isIntroFinished) {
      setIsIntroFinished(true);
    }
  }, [currentTab, isIntroFinished]);

  // ページ切り替えとURL履歴 (window.history / window.location.hash) の同期
  const setCurrentTab = (tab: TabId) => {
    if (tab === 'map') {
      openExternalMap();
      return;
    }
    setCurrentTabState(tab);
    const currentHash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
    if (currentHash !== tab && !(tab === 'home' && !currentHash)) {
      if (tab === 'home') {
        window.history.pushState(null, '', window.location.pathname || '/');
      } else {
        window.history.pushState(null, '', `#${tab}`);
      }
    }
  };

  // ブラウザの「戻る・進む」や直接URLハッシュ変更の監視
  useEffect(() => {
    const handleUrlChange = () => {
      setCurrentTabState(getTabFromUrl());
    };
    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  const [organizations, setOrganizations] = useState<Organization[]>(mockOrganizations);
  const [timetableEvents, setTimetableEvents] = useState<TimetableEvent[]>(mockTimetableEvents);
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [lostItems, setLostItems] = useState<LostItem[]>(mockLostItems);
  const [pageSettings, setPageSettings] = useState<PageSetting[]>(() => {
    try {
      const cached = localStorage.getItem('nazuna_cached_page_settings');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
    return mockPageSettings;
  });
  const [isSettingsLoaded, setIsSettingsLoaded] = useState<boolean>(() => {
    try {
      return !!localStorage.getItem('nazuna_cached_page_settings');
    } catch {
      return false;
    }
  });
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);

  const [genreQuick, setGenreQuick] = useState<string>('all');
  const [stageQuick, setStageQuick] = useState<string>('gym');
  const [searchQueryQuick, setSearchQueryQuick] = useState<string>('');
  const [floorQuick, setFloorQuick] = useState<string>('all');

  // 専用ページ切り替え用の初期セクション記憶
  const [activeGuidanceSection, setActiveGuidanceSection] = useState<GuidanceSectionId>('precautions');
  const [activePolicySection, setActivePolicySection] = useState<PolicySectionId>('filming-guidelines');

  useEffect(() => {
    // 初回マウント時にSupabase DBから正確に動的取得
    async function loadFromDB() {
      try {
        const orgs = await fetchOrganizationsFromDB();
        const evts = await fetchTimetableEventsFromDB();
        const anns = await fetchAnnouncementsFromDB();
        const losts = await fetchLostItemsFromDB();
        const pages = await fetchPageSettingsFromDB();

        if (orgs.length > 0) setOrganizations(orgs);
        if (evts.length > 0) setTimetableEvents(evts);
        if (anns.length > 0) setAnnouncements(anns);
        if (losts.length > 0) setLostItems(losts);
        if (pages.length > 0) {
          setPageSettings(pages);
          try {
            localStorage.setItem('nazuna_cached_page_settings', JSON.stringify(pages));
          } catch {}
        }

        if (supabase) {
          try {
            const { data: { session } } = await supabase.auth.getSession();
            setIsAdminLoggedIn(!!session?.user);
          } catch {}
        }
      } finally {
        setIsSettingsLoaded(true);
      }
    }
    loadFromDB();

    const unsubscribe = subscribeToDataChanges(
      (newOrgs: Organization[]) => setOrganizations(newOrgs),
      (newEvts: TimetableEvent[]) => setTimetableEvents(newEvts),
      (newAnns: Announcement[]) => setAnnouncements(newAnns),
      (newLosts: LostItem[]) => setLostItems(newLosts),
      (newPages: PageSetting[]) => {
        setPageSettings(newPages);
        try {
          localStorage.setItem('nazuna_cached_page_settings', JSON.stringify(newPages));
        } catch {}
        setIsSettingsLoaded(true);
      }
    );

    let authUnsubscribe: (() => void) | undefined;
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
        setIsAdminLoggedIn(!!session?.user);
      });
      authUnsubscribe = () => subscription.unsubscribe();
    }

    return () => {
      unsubscribe();
      if (authUnsubscribe) authUnsubscribe();
    };
  }, []);

  // ジャンルクイック選択で独立企画一覧ページに移動
  const handleSelectGenreQuick = (genre: string) => {
    setGenreQuick(genre);
    if (currentTab !== 'exhibitions') {
      setCurrentTab('exhibitions');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ステージクイック選択でTimetableに移動
  const handleSelectStageQuick = (stage: string) => {
    setStageQuick(stage);
    if (currentTab !== 'timetable') {
      setCurrentTab('timetable');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentTab === 'admin') {
    return (
      <div className="admin-portal min-h-screen w-full bg-[#F8FAFC] text-slate-800 font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden">
        <AdminPage
          organizations={organizations}
          timetableEvents={timetableEvents}
          announcements={announcements}
          lostItems={lostItems}
          onNavigateHome={() => {
            setCurrentTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-wafuu-kinari text-wafuu-sumi font-sans selection:bg-wafuu-shu selection:text-white flex flex-col justify-between">
      
      {/* 42層ポスター＆和紙・霧の障子オープニングアニメーション */}
      {!isShojiFinished && (
        <ShojiOpening
          onComplete={() => {
            setIsShojiFinished(true);
            try {
              localStorage.setItem('last_shoji_played_time', Date.now().toString());
            } catch {}
          }}
          key={introKey}
        />
      )}

      {/* 緊急速報・重要お知らせの全画面強制表示モーダル */}
      <UrgentAnnouncementModal
        announcements={announcements}
        isIntroFinished={isIntroFinished}
        onNavigateToNews={() => {
          setCurrentTab('news');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* モダン和風ナビゲーション */}
      <Navbar
        currentTab={currentTab === 'not_found' ? 'home' : currentTab}
        isIntroFinished={isIntroFinished}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectGenreQuick={handleSelectGenreQuick}
        onSelectStageQuick={handleSelectStageQuick}
        onOpenMapModal={() => {
          setCurrentTab('map');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        pageSettings={pageSettings}
      />

      {/* メインコンテンツ切り替え */}
      {(() => {
        if (currentTab === 'not_found') {
          return (
            <main className="w-full pt-20 flex-1 flex flex-col justify-center">
              <NotFoundView
                onNavigateHome={() => {
                  setCurrentTab('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onNavigateAdmin={() => {
                  setCurrentTab('admin');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                isAdminLoggedIn={isAdminLoggedIn}
                isHiddenPage={false}
              />
            </main>
          );
        }

        const activePageSetting = pageSettings?.find((p) => p.id === currentTab);
        const isCurrentPageMaintenance =
          activePageSetting &&
          !activePageSetting.is_public &&
          currentTab !== 'home';

        if (isCurrentPageMaintenance) {
          return (
            <main className="w-full pt-20 flex-1 flex flex-col justify-center">
              <NotFoundView
                onNavigateHome={() => {
                  setCurrentTab('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onNavigateAdmin={() => {
                  setCurrentTab('admin');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                isAdminLoggedIn={isAdminLoggedIn}
                isHiddenPage={true}
              />
            </main>
          );
        }

        if (!isSettingsLoaded && currentTab !== 'home') {
          return (
            <main className="w-full pt-20 min-h-[70vh] flex flex-col items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-slate-300 border-t-[#C5A059] animate-spin" />
                <p className="text-xs text-slate-400 font-mono tracking-wider">ページ状態を確認中...</p>
              </div>
            </main>
          );
        }

        return (
          <>
            {currentTab === 'home' && (
              <Home
                organizations={organizations}
                announcements={announcements}
                initialGenre={genreQuick}
                introKey={introKey}
                isShojiFinished={isShojiFinished}
                isIntroFinished={isIntroFinished}
                onIntroComplete={() => {
                  setIsIntroFinished(true);
                  try {
                    localStorage.setItem('last_shoji_played_time', Date.now().toString());
                  } catch {}
                }}
                onSelectTab={(tab) => {
                  setCurrentTab(tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onNavigateGuidancePage={(section) => {
                  if (section === 'campus-map') {
                    setCurrentTab('map');
                  } else {
                    setActiveGuidanceSection(section);
                    setCurrentTab('guidance');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                onNavigatePolicyPage={(section) => {
                  setActivePolicySection(section);
                  setCurrentTab('policy');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onNavigateExhibitionsPage={(query, genre, floor) => {
                  setSearchQueryQuick(query);
                  setGenreQuick(genre);
                  setFloorQuick(floor);
                  setCurrentTab('exhibitions');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}
            {currentTab === 'news' && (
              <main className="w-full pt-20">
                <AnnouncementsPage announcements={announcements} />
              </main>
            )}
            {currentTab === 'exhibitions' && (
              <main className="w-full pt-20">
                <ExhibitionPage
                  organizations={organizations}
                  initialQuery={searchQueryQuick}
                  initialGenre={genreQuick}
                  initialFloor={floorQuick}
                  onNavigateTab={(tab) => {
                    setCurrentTab(tab);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </main>
            )}
            {currentTab === 'timetable' && (
              <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28">
                <TimetablePage
                  events={timetableEvents}
                  initialStage={stageQuick as 'gym' | 'courtyard' | 'av_room'}
                />
              </main>
            )}
            {currentTab === 'info' && (
              <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28">
                <SchoolInfoPage />
              </main>
            )}
            {currentTab === 'lostfound' && (
              <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28">
                <LostFoundPage lostItems={lostItems} />
              </main>
            )}
            {currentTab === 'guidance' && (
              <main className="w-full">
                <GuidanceDetailPage
                  initialSection={activeGuidanceSection}
                  onNavigateTab={(tab) => setCurrentTab(tab)}
                />
              </main>
            )}
            {currentTab === 'policy' && (
              <main className="w-full">
                <PolicyPage
                  initialSection={activePolicySection}
                  onNavigateTab={(tab) => setCurrentTab(tab)}
                />
              </main>
            )}
          </>
        );
      })()}

      {/* フッター */}
      <Footer
        onNavigatePolicyPage={(section) => {
          setActivePolicySection(section);
          setCurrentTab('policy');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
};

export default App;

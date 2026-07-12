import React, { useState, useEffect } from 'react';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { Home } from './pages/Home';
import { TimetablePage } from './pages/TimetablePage';
import { SchoolInfoPage } from './pages/SchoolInfoPage';
import {
  mockOrganizations,
  mockTimetableEvents,
  subscribeToDataChanges
} from './lib/supabase';
import type { Organization, TimetableEvent } from './types/database';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'home' | 'timetable' | 'info'>('home');
  const [isIntroFinished, setIsIntroFinished] = useState(false);
  const [introKey, setIntroKey] = useState(0);

  const [organizations, setOrganizations] = useState<Organization[]>(mockOrganizations);
  const [timetableEvents, setTimetableEvents] = useState<TimetableEvent[]>(mockTimetableEvents);

  const [genreQuick, setGenreQuick] = useState<string>('all');
  const [stageQuick, setStageQuick] = useState<string>('gym');

  useEffect(() => {
    const unsubscribe = subscribeToDataChanges(() => {
      setOrganizations([...mockOrganizations]);
      setTimetableEvents([...mockTimetableEvents]);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-[#060919] text-[#F0F4F8] selection:bg-[#E51937] selection:text-white">
      {/* ナビゲーションバー (z-40 sticky / 演出完了時または別タブ時はメニューボタンを表示) */}
      <Navbar
        currentTab={currentTab}
        isIntroFinished={isIntroFinished || currentTab !== 'home'}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectGenreQuick={(genre) => {
          setGenreQuick(genre);
          setCurrentTab('home');
          setTimeout(() => {
            const el = document.getElementById('exhibition-index');
            el?.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        }}
        onSelectStageQuick={(stage) => {
          setStageQuick(stage);
          setCurrentTab('timetable');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onReplayIntro={() => {
          setCurrentTab('home');
          setIsIntroFinished(false);
          setIntroKey((prev) => prev + 1);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* メインコンテンツ */}
      {currentTab === 'home' && (
        <Home
          organizations={organizations}
          initialGenre={genreQuick}
          introKey={introKey}
          onIntroComplete={() => setIsIntroFinished(true)}
          onSelectTab={(tab) => {
            setCurrentTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
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

      {/* フッター */}
      <Footer />
    </div>
  );
};

export default App;

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { WelcomeHero } from './components/WelcomeHero';
import { AITutorTab } from './components/AITutorTab';
import { SnapSolveTab } from './components/SnapSolveTab';
import { LessonNotesTab } from './components/LessonNotesTab';
import { QuizTab } from './components/QuizTab';
import { AssignmentGeneratorTab } from './components/AssignmentGeneratorTab';
import { StudyPlannerTab } from './components/StudyPlannerTab';
import { TranslatorTab } from './components/TranslatorTab';
import { AIExplainerTab } from './components/AIExplainerTab';
import { ExamModeTab } from './components/ExamModeTab';
import { DashboardTab } from './components/DashboardTab';
import { MessagesTab } from './components/MessagesTab';
import { CommunityTab } from './components/CommunityTab';
import { ProfileTab } from './components/ProfileTab';
import { NotificationsTab } from './components/NotificationsTab';
import { AdminTab } from './components/AdminTab';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { SavedNotesModal, SavedNote } from './components/SavedNotesModal';
import { BAUHomeSelector } from './components/BAUHomeSelector';
import { BAUSubjectPage } from './components/BAUSubjectPage';
import { BAUSearchModal } from './components/BAUSearchModal';
import { BAUAdminAddModal } from './components/BAUAdminAddModal';
import { BAUFavoritesModal } from './components/BAUFavoritesModal';
import { OFFICIAL_BAU_FACULTIES, OFFICIAL_BAU_DEPARTMENTS, OFFICIAL_BAU_COURSES } from './data/bauData';
import { BAUFaculty, BAUDepartment, BAUCourse, BAUContext, BAUBookmark, GradeLevel, LanguageMode, SubjectCategory, TabType, UserProfile } from './types';
import { fetchCurrentProfile } from './services/messagingApi';
import { Check, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('bau_hub');
  const [languageMode, setLanguageMode] = useState<LanguageMode>('bilingual');
  const [gradeLevel, setGradeLevel] = useState<GradeLevel>('university');

  // User Profile State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    fetchCurrentProfile()
      .then(res => setCurrentUser(res.user))
      .catch(() => {});
  }, []);

  // Modal states
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);

  // BAU Data State
  const [faculties, setFaculties] = useState<BAUFaculty[]>(OFFICIAL_BAU_FACULTIES);
  const [departments, setDepartments] = useState<BAUDepartment[]>(OFFICIAL_BAU_DEPARTMENTS);
  const [courses, setCourses] = useState<BAUCourse[]>(() => {
    try {
      const stored = localStorage.getItem('bau_custom_courses');
      const custom = stored ? JSON.parse(stored) : [];
      return [...OFFICIAL_BAU_COURSES, ...custom];
    } catch {
      return OFFICIAL_BAU_COURSES;
    }
  });

  const [selectedContext, setSelectedContext] = useState<BAUContext>(() => {
    return {
      facultyId: 'vet',
      departmentId: 'dvm_anatomy',
      program: 'DVM',
      year: 1,
      semester: 1,
      courseId: 'vet_anat_101',
      courseCode: 'ANAT 101',
      courseTitle: 'General Veterinary Anatomy'
    };
  });

  const [selectedCourse, setSelectedCourse] = useState<BAUCourse | null>(() => {
    return OFFICIAL_BAU_COURSES.find(c => c.id === 'vet_anat_101') || OFFICIAL_BAU_COURSES[0];
  });

  const [bookmarks, setBookmarks] = useState<BAUBookmark[]>(() => {
    try {
      const stored = localStorage.getItem('bau_bookmarks');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Modal states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

  const [savedNotes, setSavedNotes] = useState<SavedNote[]>(() => {
    try {
      const stored = localStorage.getItem('uei_saved_notes') || localStorage.getItem('shiksho_saved_notes');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isSavedNotesOpen, setIsSavedNotesOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('uei_saved_notes', JSON.stringify(savedNotes));
    } catch (e) {
      console.error('Failed to save notes to localStorage', e);
    }
  }, [savedNotes]);

  useEffect(() => {
    try {
      localStorage.setItem('bau_bookmarks', JSON.stringify(bookmarks));
    } catch (e) {
      console.error('Failed to save bookmarks to localStorage', e);
    }
  }, [bookmarks]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveAsNote = (title: string, content: string, subject: SubjectCategory = 'agriculture') => {
    const newNote: SavedNote = {
      id: `saved_${Date.now()}`,
      title,
      content,
      subject,
      createdAt: Date.now()
    };
    setSavedNotes((prev) => [newNote, ...prev]);
    showToast('নোটটি লাইব্রেরিতে সংরক্ষিত হয়েছে! 📚');
  };

  const handleDeleteNote = (id: string) => {
    setSavedNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const handleToggleBookmark = (id: string, type: 'course', title: string) => {
    setBookmarks(prev => {
      const exists = prev.some(b => b.itemId === id);
      if (exists) {
        showToast('বুকমার্ক সরানো হয়েছে।');
        return prev.filter(b => b.itemId !== id);
      } else {
        const newBm: BAUBookmark = {
          id: `bm_${Date.now()}`,
          type,
          title,
          itemId: id,
          timestamp: Date.now()
        };
        showToast('বুকমার্ক যুক্ত করা হয়েছে! ⭐');
        return [newBm, ...prev];
      }
    });
  };

  const handleAddCustomCourse = (newCourse: BAUCourse) => {
    setCourses(prev => {
      const updated = [newCourse, ...prev];
      try {
        const customOnly = updated.filter(c => c.id.startsWith('custom_course_'));
        localStorage.setItem('bau_custom_courses', JSON.stringify(customOnly));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
    setSelectedCourse(newCourse);
    setSelectedContext({
      facultyId: newCourse.facultyId,
      departmentId: newCourse.departmentId,
      program: newCourse.program,
      year: newCourse.year,
      semester: newCourse.semester,
      courseId: newCourse.id,
      courseCode: newCourse.courseCode,
      courseTitle: newCourse.courseTitle
    });
    showToast('নতুন কোর্স সফলভাবে যুক্ত হয়েছে! 🎉');
  };

  const handleOpenSubjectPage = (course: BAUCourse) => {
    setSelectedCourse(course);
    setSelectedContext({
      facultyId: course.facultyId,
      departmentId: course.departmentId,
      program: course.program,
      year: course.year,
      semester: course.semester,
      courseId: course.id,
      courseCode: course.courseCode,
      courseTitle: course.courseTitle
    });
    setActiveTab('subject_page');
  };

  const handleOpenAITutorWithCourse = (course: BAUCourse) => {
    setSelectedCourse(course);
    setSelectedContext({
      facultyId: course.facultyId,
      departmentId: course.departmentId,
      program: course.program,
      year: course.year,
      semester: course.semester,
      courseId: course.id,
      courseCode: course.courseCode,
      courseTitle: course.courseTitle
    });
    setActiveTab('tutor');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans pb-16 md:pb-0">
      
      {/* Navbar Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'favorites') {
            setIsFavoritesOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        languageMode={languageMode}
        setLanguageMode={setLanguageMode}
        gradeLevel={gradeLevel}
        setGradeLevel={setGradeLevel}
        savedNotesCount={savedNotes.length}
        onOpenSavedNotes={() => setIsSavedNotesOpen(true)}
        onOpenSearch={() => setIsGlobalSearchOpen(true)}
        currentUserRole={currentUser?.role}
      />

      {/* Main Tab View */}
      <main className="flex-1 py-4 sm:py-6">
        
        {/* BAU Academic Selector Banner always available at top */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <BAUHomeSelector
            faculties={faculties}
            departments={departments}
            courses={courses}
            selectedContext={selectedContext}
            onSelectContext={(ctx) => {
              setSelectedContext(ctx);
              if (ctx.courseId) {
                const found = courses.find(c => c.id === ctx.courseId);
                if (found) setSelectedCourse(found);
              }
            }}
            onOpenSubjectPage={handleOpenSubjectPage}
            onOpenAITutor={handleOpenAITutorWithCourse}
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            bookmarks={bookmarks.map(b => b.itemId)}
            onToggleBookmark={handleToggleBookmark}
            languageMode={languageMode}
          />
        </div>

        {/* UEI Welcome Screen & Feature Cards */}
        <WelcomeHero
          activeTab={activeTab}
          onSelectTab={setActiveTab}
        />

        {/* Dedicated BAU Subject Page */}
        {activeTab === 'subject_page' && selectedCourse && (
          <BAUSubjectPage
            course={selectedCourse}
            onBack={() => setActiveTab('bau_hub')}
            languageMode={languageMode}
            onSaveAsNote={handleSaveAsNote}
            isBookmarked={bookmarks.some(b => b.itemId === selectedCourse.id)}
            onToggleBookmark={() => handleToggleBookmark(selectedCourse.id, 'course', `${selectedCourse.courseCode}: ${selectedCourse.courseTitle}`)}
            onNavigateTab={setActiveTab}
          />
        )}

        {/* Messaging & Direct Chat Tab */}
        {activeTab === 'messages' && (
          <MessagesTab
            languageMode={languageMode}
          />
        )}

        {/* Student & Faculty Community Forum Tab */}
        {activeTab === 'community' && (
          <CommunityTab
            languageMode={languageMode}
            currentUser={currentUser}
            onOpenMessagesWithUser={(userId) => {
              setActiveTab('messages');
            }}
          />
        )}

        {/* User Profile & Academic Record Tab */}
        {activeTab === 'profile' && (
          <ProfileTab
            languageMode={languageMode}
            currentUser={currentUser}
            onProfileUpdated={(updated) => setCurrentUser(updated)}
          />
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <NotificationsTab
            languageMode={languageMode}
            onNavigateTab={(tab) => setActiveTab(tab as TabType)}
          />
        )}

        {/* Admin Governance & Moderation Tab */}
        {activeTab === 'admin' && (
          <AdminTab
            languageMode={languageMode}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'tutor' && (
          <AITutorTab
            languageMode={languageMode}
            gradeLevel={gradeLevel}
            onSaveAsNote={handleSaveAsNote}
            bauContext={selectedContext}
          />
        )}

        {activeTab === 'snap' && (
          <SnapSolveTab
            languageMode={languageMode}
            gradeLevel={gradeLevel}
            onSaveAsNote={handleSaveAsNote}
          />
        )}

        {activeTab === 'notes' && (
          <LessonNotesTab
            languageMode={languageMode}
            gradeLevel={gradeLevel}
            onSaveAsNote={handleSaveAsNote}
          />
        )}

        {activeTab === 'assignment' && (
          <AssignmentGeneratorTab
            languageMode={languageMode}
            gradeLevel={gradeLevel}
            onSaveAsNote={handleSaveAsNote}
          />
        )}

        {activeTab === 'quiz' && (
          <QuizTab
            languageMode={languageMode}
            gradeLevel={gradeLevel}
          />
        )}

        {activeTab === 'exam' && (
          <ExamModeTab
            languageMode={languageMode}
            gradeLevel={gradeLevel}
          />
        )}

        {activeTab === 'planner' && (
          <StudyPlannerTab
            languageMode={languageMode}
            gradeLevel={gradeLevel}
            onSaveAsNote={handleSaveAsNote}
          />
        )}

        {activeTab === 'explainer' && (
          <AIExplainerTab
            languageMode={languageMode}
            gradeLevel={gradeLevel}
            onSaveAsNote={handleSaveAsNote}
          />
        )}

        {activeTab === 'translator' && (
          <TranslatorTab
            languageMode={languageMode}
            onSaveAsNote={handleSaveAsNote}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardTab
            savedNotesCount={savedNotes.length}
            onNavigateTab={setActiveTab}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="hidden md:block py-6 border-t border-slate-200/80 bg-white text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <p className="flex items-center gap-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>BAU Academic AI Hub & UEI — Bangladesh Agricultural University</span>
          </p>
          <p className="text-slate-400">Official Database & AI Assistant • Powered by Gemini 3.6 Flash</p>
        </div>
      </footer>

      {/* Modals */}
      <BAUSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        faculties={faculties}
        departments={departments}
        courses={courses}
        onSelectCourse={handleOpenSubjectPage}
        languageMode={languageMode}
      />

      <BAUAdminAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        faculties={faculties}
        departments={departments}
        onAddCourse={handleAddCustomCourse}
        languageMode={languageMode}
      />

      <BAUFavoritesModal
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        bookmarks={bookmarks}
        courses={courses}
        onRemoveBookmark={(id) => setBookmarks(prev => prev.filter(b => b.id !== id))}
        onSelectCourse={handleOpenSubjectPage}
        languageMode={languageMode}
      />

      {/* Saved Notes Modal */}
      <SavedNotesModal
        isOpen={isSavedNotesOpen}
        onClose={() => setIsSavedNotesOpen(false)}
        savedNotes={savedNotes}
        onDeleteNote={handleDeleteNote}
      />

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isGlobalSearchOpen}
        onClose={() => setIsGlobalSearchOpen(false)}
        onNavigateTab={(tab) => setActiveTab(tab as TabType)}
        onOpenMessageWithUser={(userId) => setActiveTab('messages')}
        languageMode={languageMode}
      />

      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl text-xs font-semibold flex items-center space-x-2 animate-in fade-in slide-in-from-bottom-4">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}

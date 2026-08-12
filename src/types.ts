export type LanguageMode = 'bn' | 'en' | 'bilingual';

export type TabType = 
  | 'home'
  | 'bau_hub'
  | 'subject_page'
  | 'agecon'
  | 'messages'
  | 'community'
  | 'profile'
  | 'admin'
  | 'notifications'
  | 'viva'
  | 'practical'
  | 'favorites'
  | 'tutor' 
  | 'snap' 
  | 'notes' 
  | 'assignment' 
  | 'quiz' 
  | 'exam' 
  | 'planner' 
  | 'explainer' 
  | 'translator' 
  | 'dashboard';

// BAU Academic Structure Interfaces
export interface BAUFaculty {
  id: string;
  code: string;
  nameEn: string;
  nameBn: string;
  descriptionEn: string;
  descriptionBn: string;
  established: string;
  departmentsCount: number;
}

export interface BAUDepartment {
  id: string;
  facultyId: string;
  code: string;
  nameEn: string;
  nameBn: string;
  descriptionEn: string;
  descriptionBn: string;
  programs: string[];
  researchAreas: string[];
  sourceName: string;
  sourceURL: string;
  lastVerified: string;
}

export interface BAUCourse {
  id: string;
  facultyId: string;
  facultyNameBn: string;
  facultyNameEn: string;
  departmentId: string;
  departmentNameBn: string;
  departmentNameEn: string;
  program: string;
  year: number;
  semester: number;
  courseCode: string;
  courseTitle: string;
  courseTitleBn: string;
  credit: number | string;
  courseType: 'Theoretical' | 'Practical' | 'Combined';
  description: string;
  descriptionBn: string;
  topics: string[];
  practicalTopics?: string[];
  references: string[];
  sourceName: string;
  sourceURL: string;
  lastVerified: string;
  verificationStatus: 'verified' | 'pending';
}

export interface BAUContext {
  facultyId?: string;
  departmentId?: string;
  program?: string;
  year?: number;
  semester?: number;
  courseId?: string;
  courseCode?: string;
  courseTitle?: string;
}

export interface VivaQuestion {
  id: string;
  questionBn: string;
  questionEn: string;
  shortAnswerBn: string;
  shortAnswerEn: string;
  detailedExplanationBn: string;
  detailedExplanationEn: string;
  category: 'Basic' | 'Intermediate' | 'Advanced' | 'Practical Viva';
}

export interface PracticalExperiment {
  id: string;
  titleBn: string;
  titleEn: string;
  objectives: string[];
  materials: string[];
  procedure: string[];
  observation: string;
  calculation?: string;
  result: string;
  discussion: string;
  precautions: string[];
  vivaQuestions: { question: string; answer: string }[];
}

export interface BAUBookmark {
  id: string;
  type: 'faculty' | 'department' | 'course' | 'topic' | 'note';
  title: string;
  subtitle?: string;
  itemId: string;
  timestamp: number;
}

export interface RecentlyViewedItem {
  id: string;
  type: 'course' | 'question' | 'note' | 'quiz';
  title: string;
  subtitle?: string;
  timestamp: number;
  actionTab?: TabType;
}

export type GradeLevel = 
  | 'class_1_5' 
  | 'class_6_8' 
  | 'ssc_class_9_10' 
  | 'hsc_class_11_12' 
  | 'university' 
  | 'general';

export type SubjectCategory = 
  | 'math' 
  | 'mathematics' 
  | 'physics' 
  | 'chemistry' 
  | 'biology' 
  | 'english' 
  | 'agriculture'
  | 'economics'
  | 'ict' 
  | 'bangla' 
  | 'bengali'
  | 'general_knowledge' 
  | 'other';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  language?: LanguageMode;
  timestamp: number;
  audioBase64?: string;
  suggestedFollowups?: string[];
  isError?: boolean;
  failedQuery?: string;
}

export interface ImportantTerm {
  term: string;
  meaningBn: string;
  meaningEn: string;
}

export interface LessonNote {
  id: string;
  topic: string;
  subject: SubjectCategory;
  grade: GradeLevel;
  summaryBn: string;
  summaryEn: string;
  keyConcepts: string[];
  formulasOrRules: string[];
  importantTerms: ImportantTerm[];
  practiceQuestions: string[];
  createdAt: number;
}

export interface QuizQuestion {
  id: string;
  questionBn: string;
  questionEn: string;
  optionsBn: string[];
  optionsEn: string[];
  correctIndex: number;
  explanationBn: string;
  explanationEn: string;
}

export interface Quiz {
  id: string;
  title: string;
  subject: SubjectCategory;
  grade: GradeLevel;
  questions: QuizQuestion[];
  userAnswers: Record<number, number>;
  score?: number;
  completed?: boolean;
  createdAt: number;
}

export interface SolutionStep {
  stepNumber: number;
  titleBn: string;
  titleEn: string;
  explanationBn: string;
  explanationEn: string;
}

export interface SnapSolveResult {
  extractedQuestionText: string;
  subjectDetected: string;
  subject?: string;
  solutionSteps: SolutionStep[];
  finalAnswerBn: string;
  finalAnswerEn: string;
  conceptExplanationBn: string;
  conceptExplanationEn: string;
  keyFormula?: string;
  confidenceWarning?: string;
}

export interface AssignmentResult {
  title: string;
  topic: string;
  gradeLevel: GradeLevel;
  classLevel?: string;
  language: LanguageMode;
  wordCount: number;
  introduction: string;
  mainBodySections: { sectionTitle: string; content: string }[];
  mainDiscussion?: string | string[];
  conclusion: string;
  references: string[];
  keyTakeaways: string[];
  examples?: string[];
}

export interface StudyPlanDay {
  dayNumber: number;
  dayNameBn: string;
  dayNameEn: string;
  topicsToCover: { subject: string; topicName: string; durationMinutes: number; goal: string }[];
  revisionStrategy: string;
}

export interface StudyPlanResult {
  planTitle: string;
  title?: string;
  targetExamOrGoal: string;
  totalDays: number;
  dailyStudyHours: number;
  summary?: string;
  weeklyPlan: StudyPlanDay[];
  dailySchedule?: { time: string; activity: string; timeSlot?: string; subject?: string }[];
  weeklyMilestones?: string[];
  examPrepStrategy?: string;
  tips?: string[];
  motivationTipBn: string;
  motivationTipEn: string;
}

export interface TranslationResult {
  originalText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  academicTerms: { term: string; translation: string; definition: string; meaning?: string }[];
  keyTerms?: { term: string; translation: string; definition: string; meaning?: string }[];
  grammarNotes: string;
}

export interface SimplifiedExplanationResult {
  originalConcept: string;
  topic?: string;
  targetLevel: string;
  simpleAnalogyBn: string;
  simpleAnalogyEn: string;
  realWorldAnalogy?: string;
  coreExplanationBn: string;
  explanationBn?: string;
  coreExplanationEn: string;
  explanationEn?: string;
  realWorldExampleBn: string;
  realWorldExampleEn: string;
  keyTakeaways: string[];
}

export interface ExamScoreEntry {
  date: string;
  subject: string;
  score: number;
  totalQuestions: number;
  total?: number;
}

export interface UserProgressStats {
  totalQuestionsAsked: number;
  totalQuestionsAnswered?: number;
  snapsSolved: number;
  notesGenerated: number;
  quizzesTaken: number;
  totalQuizzesTaken?: number;
  averageQuizScore: number;
  averageScore?: number;
  studyHoursCompleted: number;
  frequentSubjects: { subject: string; count: number }[];
  recentSubjects?: { subject: string; count: number }[];
  examScores?: ExamScoreEntry[];
}

// ---------------------------
// Messaging & Auth Interfaces
// ---------------------------
export type UserRole = 'student' | 'teacher' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isVerifiedTeacher?: boolean;
  facultyId?: string;
  facultyName?: string;
  departmentId?: string;
  departmentName?: string;
  program?: string;
  year?: number;
  semester?: number;
  designationOrYear?: string;
  studentOrTeacherId?: string;
  bio?: string;
  avatarUrl?: string;
  onlineStatus?: 'online' | 'offline' | 'busy';
  lastSeen?: number;
  blockedUserIds?: string[];
  joinedCommunityIds?: string[];
  savedPostIds?: string[];
  followedTeacherIds?: string[];
  status?: 'active' | 'suspended' | 'banned';
  privacyWhoCanMessage?: 'everyone' | 'teachers_only' | 'department_only';
  createdAt: number;
}

export type MessageType = 'text' | 'image' | 'pdf' | 'voice';

export interface MessageAttachment {
  type: 'image' | 'pdf' | 'voice';
  url: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  durationSeconds?: number;
}

export interface DirectMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  senderRole: UserRole;
  content: string;
  messageType: MessageType;
  attachment?: MessageAttachment;
  timestamp: number;
  readBy: string[];
  deletedFor: string[];
  isDeletedForEveryone?: boolean;
}

export interface Conversation {
  id: string;
  type: 'direct' | 'group';
  name?: string;
  description?: string;
  avatarUrl?: string;
  participantIds: string[];
  participants?: UserProfile[];
  createdBy?: string;
  lastMessage?: {
    content: string;
    senderId: string;
    senderName: string;
    timestamp: number;
    messageType: MessageType;
  };
  unreadCount?: number;
  updatedAt: number;
  createdAt: number;
}

export interface UserReport {
  id: string;
  reporterId: string;
  reportedUserId: string;
  reason: string;
  details?: string;
  status: 'pending' | 'reviewed';
  timestamp: number;
}

// ---------------------------
// Community & Posts Interfaces
// ---------------------------
export type PostCategory = 
  | 'Study' 
  | 'BAU' 
  | 'Assignment' 
  | 'Question' 
  | 'Practical' 
  | 'Notes' 
  | 'Study Tips' 
  | 'Announcement';

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorRole: UserRole;
  isVerifiedTeacher?: boolean;
  communityId?: string;
  communityName?: string;
  facultyId?: string;
  departmentId?: string;
  courseId?: string;
  courseCode?: string;
  category: PostCategory;
  title: string;
  content: string;
  attachment?: {
    type: 'image' | 'pdf';
    url: string;
    fileName?: string;
  };
  reactions: string[]; // array of userIds who liked
  likesCount: number;
  commentsCount: number;
  isPinned?: boolean;
  isAiAnswered?: boolean;
  aiAnswerText?: string;
  createdAt: number;
  updatedAt: number;
}

export interface PostComment {
  id: string;
  postId: string;
  parentId?: string; // for nested replies
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorRole: UserRole;
  isVerifiedTeacher?: boolean;
  content: string;
  reactions: string[];
  likesCount: number;
  createdAt: number;
}

export interface BAUCommunityGroup {
  id: string;
  facultyId: string;
  facultyName: string;
  departmentId: string;
  departmentName: string;
  program: string;
  name: string;
  description: string;
  membersCount: number;
  joinedUserIds: string[];
  avatarUrl?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: 'message' | 'comment' | 'reply' | 'reaction' | 'group_message' | 'announcement' | 'teacher_message' | 'ai_response';
  title: string;
  message: string;
  linkTab?: TabType;
  relatedId?: string;
  isRead: boolean;
  createdAt: number;
}

export interface TeacherVerificationRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  facultyName: string;
  departmentName: string;
  teacherId: string;
  designation: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: number;
}

export interface AdminReportItem {
  id: string;
  reporterId: string;
  reporterName: string;
  targetType: 'user' | 'post' | 'comment' | 'message' | 'group';
  targetId: string;
  targetTitleOrContent?: string;
  reportedUserId?: string;
  reportedUserName?: string;
  reason: string;
  details?: string;
  status: 'pending' | 'reviewed' | 'action_taken';
  timestamp: number;
}

export interface GlobalSearchResult {
  users: UserProfile[];
  posts: CommunityPost[];
  communities: BAUCommunityGroup[];
  groups: Conversation[];
  courses: BAUCourse[];
}


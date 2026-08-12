import { Request, Response, Router } from 'express';
import crypto from 'crypto';
import { GoogleGenAI } from "@google/genai";

export interface UserAccount {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: 'student' | 'teacher' | 'admin';
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
  blockedUserIds: string[];
  joinedCommunityIds?: string[];
  savedPostIds?: string[];
  followedTeacherIds?: string[];
  status?: 'active' | 'suspended' | 'banned';
  privacyWhoCanMessage?: 'everyone' | 'teachers_only' | 'department_only';
  createdAt: number;
}

export interface StoredMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  senderRole: 'student' | 'teacher' | 'admin';
  content: string;
  messageType: 'text' | 'image' | 'pdf' | 'voice';
  attachment?: {
    type: 'image' | 'pdf' | 'voice';
    url: string;
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
    durationSeconds?: number;
  };
  timestamp: number;
  readBy: string[];
  deletedFor: string[];
  isDeletedForEveryone?: boolean;
}

export interface StoredConversation {
  id: string;
  type: 'direct' | 'group';
  name?: string;
  description?: string;
  avatarUrl?: string;
  participantIds: string[];
  createdBy?: string;
  updatedAt: number;
  createdAt: number;
}

export interface StoredReport {
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

export interface StoredCommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorRole: 'student' | 'teacher' | 'admin';
  isVerifiedTeacher?: boolean;
  communityId?: string;
  communityName?: string;
  facultyId?: string;
  departmentId?: string;
  courseId?: string;
  courseCode?: string;
  category: 'Study' | 'BAU' | 'Assignment' | 'Question' | 'Practical' | 'Notes' | 'Study Tips' | 'Announcement';
  title: string;
  content: string;
  attachment?: {
    type: 'image' | 'pdf';
    url: string;
    fileName?: string;
  };
  reactions: string[];
  likesCount: number;
  commentsCount: number;
  isPinned?: boolean;
  isAiAnswered?: boolean;
  aiAnswerText?: string;
  createdAt: number;
  updatedAt: number;
}

export interface StoredComment {
  id: string;
  postId: string;
  parentId?: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorRole: 'student' | 'teacher' | 'admin';
  isVerifiedTeacher?: boolean;
  content: string;
  reactions: string[];
  likesCount: number;
  createdAt: number;
}

export interface StoredCommunityGroup {
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

export interface StoredNotification {
  id: string;
  userId: string;
  type: 'message' | 'comment' | 'reply' | 'reaction' | 'group_message' | 'announcement' | 'teacher_message' | 'ai_response';
  title: string;
  message: string;
  linkTab?: string;
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

// In-Memory Database with Pre-populated BAU Accounts
const usersMap = new Map<string, UserAccount>();
const tokensMap = new Map<string, string>(); // token -> userId
const conversationsMap = new Map<string, StoredConversation>();
const messagesList: StoredMessage[] = [];
const reportsList: StoredReport[] = [];
const postsList: StoredCommunityPost[] = [];
const commentsList: StoredComment[] = [];
const communityGroupsMap = new Map<string, StoredCommunityGroup>();
const notificationsList: StoredNotification[] = [];
const teacherVerificationsList: TeacherVerificationRequest[] = [];

// SSE Event Listeners: Map of userId -> Set of express Response objects
const sseClients = new Map<string, Set<Response>>();

// Hash helper
function hashPassword(pwd: string): string {
  return crypto.createHash('sha256').update(pwd + 'bau_uei_salt_2026').digest('hex');
}

// Sanitize string against XSS script tags
function sanitizeText(str: string): string {
  if (!str) return '';
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/script/gi, '');
}

// Seed Initial BAU Users & Conversations
function initializeSeedData() {
  if (usersMap.size > 0) return;

  const now = Date.now();

  const seedUsers: UserAccount[] = [
    {
      id: 'usr_student_tanvir',
      email: 'tanvir.bau@gmail.com',
      passwordHash: hashPassword('student123'),
      name: 'Tanvir Ahmed',
      role: 'student',
      facultyId: 'vet',
      facultyName: 'Faculty of Veterinary Science',
      departmentId: 'dvm_anatomy',
      departmentName: 'Dept of Anatomy & Histology',
      designationOrYear: 'Level 1, Semester 2',
      studentOrTeacherId: 'BAU-2023-0142',
      bio: 'Enthusiastic DVM student interested in Animal Health & Bio-technology. 🐄',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      onlineStatus: 'online',
      lastSeen: now,
      blockedUserIds: [],
      privacyWhoCanMessage: 'everyone',
      createdAt: now - 86400000 * 30
    },
    {
      id: 'usr_teacher_rafiq',
      email: 'rafiq.agronomy@bau.edu.bd',
      passwordHash: hashPassword('teacher123'),
      name: 'Prof. Dr. M. A. Rafiq',
      role: 'teacher',
      isVerifiedTeacher: true,
      facultyId: 'agri',
      facultyName: 'Faculty of Agriculture',
      departmentId: 'agronomy',
      departmentName: 'Dept of Agronomy',
      designationOrYear: 'Professor & Department Head',
      studentOrTeacherId: 'BAU-FAC-0104',
      bio: 'Senior Agricultural Researcher specialising in Sustainable Crop Science and Climate Adaptation.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      onlineStatus: 'online',
      lastSeen: now,
      blockedUserIds: [],
      privacyWhoCanMessage: 'everyone',
      createdAt: now - 86400000 * 100
    },
    {
      id: 'usr_teacher_salma',
      email: 'salma.vet@bau.edu.bd',
      passwordHash: hashPassword('teacher123'),
      name: 'Dr. Salma Begum',
      role: 'teacher',
      isVerifiedTeacher: true,
      facultyId: 'vet',
      facultyName: 'Faculty of Veterinary Science',
      departmentId: 'dvm_anatomy',
      departmentName: 'Dept of Anatomy & Histology',
      designationOrYear: 'Associate Professor',
      studentOrTeacherId: 'BAU-FAC-0211',
      bio: 'Veterinary Anatomist & Histology Laboratory Supervisor at BAU. Open to academic queries.',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      onlineStatus: 'busy',
      lastSeen: now,
      blockedUserIds: [],
      privacyWhoCanMessage: 'everyone',
      createdAt: now - 86400000 * 90
    },
    {
      id: 'usr_student_nabila',
      email: 'nabila.fisheries@gmail.com',
      passwordHash: hashPassword('student123'),
      name: 'Nabila Hossain',
      role: 'student',
      facultyId: 'fish',
      facultyName: 'Faculty of Fisheries',
      departmentId: 'aquaculture',
      departmentName: 'Dept of Aquaculture',
      designationOrYear: 'B.Sc. Fisheries Level 2',
      studentOrTeacherId: 'BAU-2022-0891',
      bio: 'Fisheries undergrad researching inland aquaculture systems & fish health management. 🐟',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      onlineStatus: 'offline',
      lastSeen: now - 3600000 * 2,
      blockedUserIds: [],
      privacyWhoCanMessage: 'everyone',
      createdAt: now - 86400000 * 20
    },
    {
      id: 'usr_teacher_kabir',
      email: 'kabir.fmp@bau.edu.bd',
      passwordHash: hashPassword('teacher123'),
      name: 'Prof. Dr. Humayun Kabir',
      role: 'teacher',
      isVerifiedTeacher: true,
      facultyId: 'engg',
      facultyName: 'Faculty of Agricultural Engineering & Technology',
      departmentId: 'fmp',
      departmentName: 'Dept of Farm Power & Machinery',
      designationOrYear: 'Professor',
      studentOrTeacherId: 'BAU-FAC-0315',
      bio: 'Teaching Agricultural Machinery & Automation Systems.',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      onlineStatus: 'online',
      lastSeen: now,
      blockedUserIds: [],
      privacyWhoCanMessage: 'everyone',
      createdAt: now - 86400000 * 80
    },
    {
      id: 'usr_admin_system',
      email: 'admin.bau@bau.edu.bd',
      passwordHash: hashPassword('admin123'),
      name: 'BAU System Admin',
      role: 'admin',
      isVerifiedTeacher: true,
      facultyId: 'agri',
      facultyName: 'BAU Academic Administration',
      departmentId: 'admin',
      departmentName: 'Registrar & AI Hub Moderation',
      designationOrYear: 'Chief Moderator & System Admin',
      studentOrTeacherId: 'BAU-ADM-0001',
      bio: 'Official BAU Academic AI Hub & UEI Moderator Account. Overseeing verified teachers and academic content standards.',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      onlineStatus: 'online',
      lastSeen: now,
      blockedUserIds: [],
      privacyWhoCanMessage: 'everyone',
      createdAt: now - 86400000 * 200
    }
  ];

  seedUsers.forEach(u => usersMap.set(u.id, u));

  // Seed BAU Community Groups Hierarchy
  const seedCommunityGroups: StoredCommunityGroup[] = [
    {
      id: 'cg_agri_agronomy',
      facultyId: 'agri',
      facultyName: 'Faculty of Agriculture',
      departmentId: 'agronomy',
      departmentName: 'Dept of Agronomy',
      program: 'Undergraduate B.Sc. Ag.',
      name: '🌾 Agronomy Department Community',
      description: 'Official academic community for Agronomy crop science, weed management, seed tech, and trial research.',
      membersCount: 142,
      joinedUserIds: ['usr_teacher_rafiq', 'usr_student_tanvir'],
      avatarUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'cg_vet_anatomy',
      facultyId: 'vet',
      facultyName: 'Faculty of Veterinary Science',
      departmentId: 'dvm_anatomy',
      departmentName: 'Dept of Anatomy & Histology',
      program: 'Undergraduate DVM',
      name: '🩺 Veterinary Anatomy & Histology Community',
      description: 'Academic discussion forum for DVM anatomy, osteology diagrams, histology microscopic slides, and viva preparation.',
      membersCount: 198,
      joinedUserIds: ['usr_teacher_salma', 'usr_student_tanvir'],
      avatarUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'cg_fish_aquaculture',
      facultyId: 'fish',
      facultyName: 'Faculty of Fisheries',
      departmentId: 'aquaculture',
      departmentName: 'Dept of Aquaculture',
      program: 'Undergraduate B.Sc. Fisheries',
      name: '🐟 Aquaculture & Fisheries Science Community',
      description: 'Discussion forum for inland aquaculture, water chemistry, hatchery tech, and aquatic biology.',
      membersCount: 110,
      joinedUserIds: ['usr_student_nabila'],
      avatarUrl: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'cg_engg_fmp',
      facultyId: 'engg',
      facultyName: 'Faculty of Agricultural Engineering & Technology',
      departmentId: 'fmp',
      departmentName: 'Dept of Farm Power & Machinery',
      program: 'Undergraduate B.Sc. Agri. Engg.',
      name: '⚙️ Farm Power & Machinery Community',
      description: 'Focus on farm mechanization, tractor engine thermodynamics, and precision agriculture robotics.',
      membersCount: 95,
      joinedUserIds: ['usr_teacher_kabir'],
      avatarUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=150&auto=format&fit=crop&q=80'
    }
  ];

  seedCommunityGroups.forEach(g => communityGroupsMap.set(g.id, g));

  // Seed Initial Community Posts
  const seedPosts: StoredCommunityPost[] = [
    {
      id: 'post_1',
      authorId: 'usr_teacher_salma',
      authorName: 'Dr. Salma Begum',
      authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      authorRole: 'teacher',
      isVerifiedTeacher: true,
      category: 'Announcement',
      facultyId: 'vet',
      departmentId: 'dvm_anatomy',
      courseId: 'c_anat101',
      courseCode: 'ANAT 101',
      communityId: 'cg_vet_anatomy',
      communityName: '🩺 Veterinary Anatomy & Histology Community',
      title: 'ANAT 101 Histology Practical Exam Schedule & Microscope Slide Identification Guide',
      content: 'Dear Level 1 DVM students, the upcoming Histology Practical Exam will focus on epithelial tissues, osteon bone structures, and cardiac muscle fiber intercalated discs. Make sure your practical notebooks and lab diagrams are completed before submission.',
      reactions: ['usr_student_tanvir', 'usr_student_nabila'],
      likesCount: 18,
      commentsCount: 2,
      isPinned: true,
      createdAt: now - 3600000 * 12,
      updatedAt: now - 3600000 * 12
    },
    {
      id: 'post_2',
      authorId: 'usr_student_tanvir',
      authorName: 'Tanvir Ahmed',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      authorRole: 'student',
      category: 'Question',
      facultyId: 'vet',
      departmentId: 'dvm_anatomy',
      courseId: 'c_anat101',
      courseCode: 'ANAT 101',
      communityId: 'cg_vet_anatomy',
      communityName: '🩺 Veterinary Anatomy & Histology Community',
      title: 'How to easily distinguish Haversian canals vs Volkmann\'s canals in compact bone osteology?',
      content: 'I\'m preparing for tomorrow\'s osteology lab viva. Could someone clearly explain the key structural difference between Haversian canals and Volkmann\'s canals in compact bone tissue?',
      reactions: ['usr_teacher_salma', 'usr_teacher_rafiq'],
      likesCount: 12,
      commentsCount: 2,
      isAiAnswered: true,
      aiAnswerText: '### 📖 1. Definition (সংজ্ঞা)\nHaversian canals are longitudinal central channels running parallel to the long axis of bone containing blood vessels and nerves, whereas Volkmann\'s canals are transverse/oblique channels running perpendicularly to connect adjacent Haversian canals with the periosteum.\n\n### 💡 2. Detailed Explanation\n- **Orientation**: Haversian = Vertical (Longitudinal); Volkmann\'s = Horizontal (Transverse).\n- **Concentric Lamellae**: Haversian canals are surrounded by concentric rings of bone matrix (osteons); Volkmann\'s canals pass through lamellae without concentric rings.\n\n### 🌟 3. Real-world Analogy\nHaversian canals are like vertical elevator shafts in a high-rise building, while Volkmann\'s canals are horizontal connecting hallways on each floor.',
      createdAt: now - 3600000 * 6,
      updatedAt: now - 3600000 * 6
    },
    {
      id: 'post_3',
      authorId: 'usr_teacher_rafiq',
      authorName: 'Prof. Dr. M. A. Rafiq',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      authorRole: 'teacher',
      isVerifiedTeacher: true,
      category: 'Study Tips',
      facultyId: 'agri',
      departmentId: 'agronomy',
      courseCode: 'AGRO 201',
      communityId: 'cg_agri_agronomy',
      communityName: '🌾 Agronomy Department Community',
      title: '5 Effective Field Trial Recording Practices for Agronomy Research',
      content: '1. Record soil moisture & solar illuminance at the exact same hour every morning.\n2. Label experimental plant plots with UV-resistant tags.\n3. Take high-resolution photographs of leaf area index (LAI) progression.\n4. Document weed species emergence early in the vegetative phase.\n5. Keep duplicate digital spreadsheet logs alongside physical field journals.',
      reactions: ['usr_student_tanvir', 'usr_student_nabila', 'usr_teacher_salma'],
      likesCount: 24,
      commentsCount: 1,
      createdAt: now - 3600000 * 24,
      updatedAt: now - 3600000 * 24
    }
  ];

  postsList.push(...seedPosts);

  // Seed Post Comments
  const seedComments: StoredComment[] = [
    {
      id: 'cmt_1',
      postId: 'post_2',
      authorId: 'usr_teacher_salma',
      authorName: 'Dr. Salma Begum',
      authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      authorRole: 'teacher',
      isVerifiedTeacher: true,
      content: 'Excellent question Tanvir! Remember during the viva to point out that Volkmann\'s canals enter perpendicularly from the periosteum bringing nutrient arteries into the bone.',
      reactions: ['usr_student_tanvir'],
      likesCount: 5,
      createdAt: now - 3600000 * 4
    },
    {
      id: 'cmt_2',
      postId: 'post_2',
      parentId: 'cmt_1',
      authorId: 'usr_student_tanvir',
      authorName: 'Tanvir Ahmed',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      authorRole: 'student',
      content: 'Thank you so much Dr. Salma! I will remember to highlight the periosteal entry points in tomorrow\'s practical slide presentation.',
      reactions: [],
      likesCount: 2,
      createdAt: now - 3600000 * 3
    }
  ];

  commentsList.push(...seedComments);

  // Seed Notifications
  const seedNotifications: StoredNotification[] = [
    {
      id: 'notif_1',
      userId: 'usr_student_tanvir',
      type: 'comment',
      title: 'New Comment on Your Question',
      message: 'Dr. Salma Begum (Verified Teacher) commented on your question: "How to easily distinguish Haversian canals..."',
      linkTab: 'community',
      relatedId: 'post_2',
      isRead: false,
      createdAt: now - 3600000 * 4
    },
    {
      id: 'notif_2',
      userId: 'usr_student_tanvir',
      type: 'announcement',
      title: 'BAU Faculty Announcement',
      message: 'Prof. Dr. M. A. Rafiq posted an announcement: "5 Effective Field Trial Recording Practices..."',
      linkTab: 'community',
      relatedId: 'post_3',
      isRead: true,
      createdAt: now - 3600000 * 20
    }
  ];

  notificationsList.push(...seedNotifications);

  // Seed Teacher Verification Request for Admin Testing
  teacherVerificationsList.push({
    id: 'tvr_1',
    userId: 'usr_teacher_kabir',
    userName: 'Prof. Dr. Humayun Kabir',
    userEmail: 'kabir.fmp@bau.edu.bd',
    facultyName: 'Faculty of Agricultural Engineering & Technology',
    departmentName: 'Dept of Farm Power & Machinery',
    teacherId: 'BAU-FAC-0315',
    designation: 'Professor',
    status: 'pending',
    timestamp: now - 86400000 * 2
  });

  // Seed Default Conversations
  const seedConversations: StoredConversation[] = [
    {
      id: 'conv_group_bau_lounge',
      type: 'group',
      name: '🎓 BAU Student & Faculty Lounge',
      description: 'Official BAU Community Lounge for open academic discussions, notices, and student help.',
      avatarUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=150&auto=format&fit=crop&q=80',
      participantIds: ['usr_student_tanvir', 'usr_teacher_rafiq', 'usr_teacher_salma', 'usr_student_nabila', 'usr_teacher_kabir'],
      createdBy: 'usr_teacher_rafiq',
      updatedAt: now - 1800000,
      createdAt: now - 86400000 * 15
    },
    {
      id: 'conv_group_dvm_study',
      type: 'group',
      name: '🩺 DVM Level-1 Study Group',
      description: 'Veterinary Science academic discussion, lecture notes, and lab viva preparation.',
      avatarUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=150&auto=format&fit=crop&q=80',
      participantIds: ['usr_student_tanvir', 'usr_teacher_salma'],
      createdBy: 'usr_teacher_salma',
      updatedAt: now - 3600000,
      createdAt: now - 86400000 * 10
    },
    {
      id: 'conv_direct_tanvir_salma',
      type: 'direct',
      participantIds: ['usr_student_tanvir', 'usr_teacher_salma'],
      updatedAt: now - 900000,
      createdAt: now - 86400000 * 5
    },
    {
      id: 'conv_direct_tanvir_rafiq',
      type: 'direct',
      participantIds: ['usr_student_tanvir', 'usr_teacher_rafiq'],
      updatedAt: now - 7200000,
      createdAt: now - 86400000 * 3
    }
  ];

  seedConversations.forEach(c => conversationsMap.set(c.id, c));

  // Seed Default Messages
  const seedMessages: StoredMessage[] = [
    {
      id: 'msg_1',
      conversationId: 'conv_group_bau_lounge',
      senderId: 'usr_teacher_rafiq',
      senderName: 'Prof. Dr. M. A. Rafiq',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      senderRole: 'teacher',
      content: 'Welcome all students and faculty to the BAU Academic Community Lounge! Feel free to share study resources or ask academic questions.',
      messageType: 'text',
      timestamp: now - 1800000 * 4,
      readBy: ['usr_student_tanvir', 'usr_teacher_salma', 'usr_student_nabila'],
      deletedFor: []
    },
    {
      id: 'msg_2',
      conversationId: 'conv_group_bau_lounge',
      senderId: 'usr_student_tanvir',
      senderName: 'Tanvir Ahmed',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      senderRole: 'student',
      content: 'আসসালামু আলাইকুম স্যার! ধন্যবাদ এই প্ল্যাটফর্মটির জন্য। DVM ১ম বর্ষের শিক্ষার্থীদের জন্য জেনারেল এনাটমি নোটস এখানে পেয়ে খুব উপকার হচ্ছে।',
      messageType: 'text',
      timestamp: now - 1800000 * 2,
      readBy: ['usr_teacher_rafiq', 'usr_teacher_salma'],
      deletedFor: []
    },
    {
      id: 'msg_3',
      conversationId: 'conv_direct_tanvir_salma',
      senderId: 'usr_student_tanvir',
      senderName: 'Tanvir Ahmed',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      senderRole: 'student',
      content: 'ম্যাডাম, কালকের ANAT 101 প্র্যাকটিক্যাল ক্লাসে Osteology স্কেলেটন ডায়াগ্রাম সাবমিট করার শেষ সময় কখন?',
      messageType: 'text',
      timestamp: now - 1800000,
      readBy: ['usr_teacher_salma'],
      deletedFor: []
    },
    {
      id: 'msg_4',
      conversationId: 'conv_direct_tanvir_salma',
      senderId: 'usr_teacher_salma',
      senderName: 'Dr. Salma Begum',
      senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      senderRole: 'teacher',
      content: 'ওয়ালাইকুম আসসালাম তানভীর। কাল দুপুর ২:০০ টার মধ্যে ডিপার্টমেন্ট ল্যাবে জমা দিবে। ল্যাব রিপোর্টে যেন অস্টিওলজি লেবেলিং সঠিকভাবে করা থাকে।',
      messageType: 'text',
      timestamp: now - 900000,
      readBy: ['usr_student_tanvir'],
      deletedFor: []
    }
  ];

  messagesList.push(...seedMessages);
}

// Broadcast SSE Event to specific user(s)
function broadcastToUser(userId: string, eventName: string, data: any) {
  const userClients = sseClients.get(userId);
  if (!userClients || userClients.size === 0) return;

  const payload = `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`;
  userClients.forEach(res => {
    try {
      res.write(payload);
    } catch {
      // ignore broken pipes
    }
  });
}

// Authentication Middleware
function authenticateToken(req: Request, res: Response, next: () => void) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication token required.' });
  }

  const userId = tokensMap.get(token);
  if (!userId || !usersMap.has(userId)) {
    return res.status(403).json({ error: 'Invalid or expired authentication token.' });
  }

  (req as any).user = usersMap.get(userId);
  next();
}

// ---------------------------
// Express Router Setup
// ---------------------------
export function createChatRouter(): Router {
  initializeSeedData();
  const router = Router();

  // 1. Auth: Register
  router.post('/auth/register', (req: Request, res: Response) => {
    try {
      const { name, email, password, role = 'student', facultyId, facultyName, departmentId, departmentName, designationOrYear, studentOrTeacherId, bio, avatarUrl } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required.' });
      }

      // Check if email exists
      const existing = Array.from(usersMap.values()).find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return res.status(400).json({ error: 'User with this email already exists.' });
      }

      const id = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const newUser: UserAccount = {
        id,
        email,
        passwordHash: hashPassword(password),
        name: sanitizeText(name),
        role: role === 'teacher' ? 'teacher' : 'student',
        facultyId,
        facultyName,
        departmentId,
        departmentName,
        designationOrYear: sanitizeText(designationOrYear || ''),
        studentOrTeacherId: sanitizeText(studentOrTeacherId || ''),
        bio: sanitizeText(bio || ''),
        avatarUrl: avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
        onlineStatus: 'online',
        lastSeen: Date.now(),
        blockedUserIds: [],
        privacyWhoCanMessage: 'everyone',
        createdAt: Date.now()
      };

      usersMap.set(id, newUser);

      // Auto join public BAU Lounge
      const bauLounge = conversationsMap.get('conv_group_bau_lounge');
      if (bauLounge && !bauLounge.participantIds.includes(id)) {
        bauLounge.participantIds.push(id);
      }

      // Generate Session Token
      const token = `tok_${id}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      tokensMap.set(token, id);

      const { passwordHash: _, ...publicProfile } = newUser;
      res.json({ token, user: publicProfile });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Registration failed.' });
    }
  });

  // 2. Auth: Login
  router.post('/auth/login', (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
      }

      const user = Array.from(usersMap.values()).find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user || user.passwordHash !== hashPassword(password)) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      user.onlineStatus = 'online';
      user.lastSeen = Date.now();

      const token = `tok_${user.id}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      tokensMap.set(token, user.id);

      const { passwordHash: _, ...publicProfile } = user;
      res.json({ token, user: publicProfile });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Login failed.' });
    }
  });

  // 3. Auth: Seed Fast Login (1-click account switch for testing)
  router.post('/auth/seed-login', (req: Request, res: Response) => {
    try {
      const { userId } = req.body;
      const user = usersMap.get(userId || 'usr_student_tanvir');

      if (!user) {
        return res.status(404).json({ error: 'Seed account not found.' });
      }

      user.onlineStatus = 'online';
      user.lastSeen = Date.now();

      const token = `tok_${user.id}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      tokensMap.set(token, user.id);

      const { passwordHash: _, ...publicProfile } = user;
      res.json({ token, user: publicProfile });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Seed login failed.' });
    }
  });

  // 4. Auth: Get Current Profile
  router.get('/auth/me', authenticateToken, (req: Request, res: Response) => {
    const user = (req as any).user;
    const { passwordHash: _, ...publicProfile } = user;
    res.json({ user: publicProfile });
  });

  // 5. Profile: Update
  router.put('/users/profile', authenticateToken, (req: Request, res: Response) => {
    try {
      const user = (req as any).user as UserAccount;
      const { name, bio, avatarUrl, designationOrYear, studentOrTeacherId, facultyId, facultyName, departmentId, departmentName, privacyWhoCanMessage, onlineStatus } = req.body;

      if (name) user.name = sanitizeText(name);
      if (bio !== undefined) user.bio = sanitizeText(bio);
      if (avatarUrl) user.avatarUrl = avatarUrl;
      if (designationOrYear) user.designationOrYear = sanitizeText(designationOrYear);
      if (studentOrTeacherId) user.studentOrTeacherId = sanitizeText(studentOrTeacherId);
      if (facultyId) user.facultyId = facultyId;
      if (facultyName) user.facultyName = facultyName;
      if (departmentId) user.departmentId = departmentId;
      if (departmentName) user.departmentName = departmentName;
      if (privacyWhoCanMessage) user.privacyWhoCanMessage = privacyWhoCanMessage;
      if (onlineStatus) user.onlineStatus = onlineStatus;

      const { passwordHash: _, ...publicProfile } = user;
      res.json({ user: publicProfile });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to update profile.' });
    }
  });

  // 6. Users: Search Directory
  router.get('/users/search', authenticateToken, (req: Request, res: Response) => {
    try {
      const currentUser = (req as any).user as UserAccount;
      const query = (req.query.q as string || '').toLowerCase().trim();
      const role = req.query.role as string;
      const departmentId = req.query.departmentId as string;

      let results = Array.from(usersMap.values())
        .filter(u => u.id !== currentUser.id)
        .map(u => {
          const { passwordHash: _, ...publicProfile } = u;
          return publicProfile;
        });

      if (role) {
        results = results.filter(u => u.role === role);
      }

      if (departmentId) {
        results = results.filter(u => u.departmentId === departmentId);
      }

      if (query) {
        results = results.filter(u => 
          u.name.toLowerCase().includes(query) ||
          u.email.toLowerCase().includes(query) ||
          (u.departmentName && u.departmentName.toLowerCase().includes(query)) ||
          (u.facultyName && u.facultyName.toLowerCase().includes(query)) ||
          (u.designationOrYear && u.designationOrYear.toLowerCase().includes(query))
        );
      }

      res.json({ users: results });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'User search failed.' });
    }
  });

  // 7. Users: Block / Unblock User
  router.post('/users/block', authenticateToken, (req: Request, res: Response) => {
    try {
      const currentUser = (req as any).user as UserAccount;
      const { targetUserId } = req.body;

      if (!targetUserId || !usersMap.has(targetUserId)) {
        return res.status(404).json({ error: 'User to block not found.' });
      }

      if (!currentUser.blockedUserIds.includes(targetUserId)) {
        currentUser.blockedUserIds.push(targetUserId);
      }

      res.json({ success: true, blockedUserIds: currentUser.blockedUserIds });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Block user failed.' });
    }
  });

  router.delete('/users/block/:targetUserId', authenticateToken, (req: Request, res: Response) => {
    try {
      const currentUser = (req as any).user as UserAccount;
      const { targetUserId } = req.params;

      currentUser.blockedUserIds = currentUser.blockedUserIds.filter(id => id !== targetUserId);
      res.json({ success: true, blockedUserIds: currentUser.blockedUserIds });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Unblock user failed.' });
    }
  });

  // 8. Users: Report User
  router.post('/users/report', authenticateToken, (req: Request, res: Response) => {
    try {
      const currentUser = (req as any).user as UserAccount;
      const { reportedUserId, reason, details } = req.body;

      if (!reportedUserId || !reason) {
        return res.status(400).json({ error: 'Reported user and reason are required.' });
      }

      const report: StoredReport = {
        id: `rep_${Date.now()}`,
        reporterId: currentUser.id,
        reporterName: currentUser.name,
        targetType: 'user',
        targetId: reportedUserId,
        reportedUserId,
        reason: sanitizeText(reason),
        details: sanitizeText(details || ''),
        status: 'pending',
        timestamp: Date.now()
      };

      reportsList.push(report);
      res.json({ success: true, reportId: report.id });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Report user failed.' });
    }
  });

  // 9. Conversations: List for Current User
  router.get('/conversations', authenticateToken, (req: Request, res: Response) => {
    try {
      const currentUser = (req as any).user as UserAccount;

      const userConvs = Array.from(conversationsMap.values())
        .filter(c => c.participantIds.includes(currentUser.id))
        .map(c => {
          // Resolve participants public profiles
          const participants = c.participantIds
            .map(pid => usersMap.get(pid))
            .filter(Boolean)
            .map(u => {
              const { passwordHash: _, ...publicProfile } = u!;
              return publicProfile;
            });

          // Calculate unread count for current user
          const unreadCount = messagesList.filter(m => 
            m.conversationId === c.id &&
            m.senderId !== currentUser.id &&
            !m.readBy.includes(currentUser.id) &&
            !m.deletedFor.includes(currentUser.id)
          ).length;

          // Find last message
          const lastMsg = [...messagesList]
            .filter(m => m.conversationId === c.id && !m.deletedFor.includes(currentUser.id))
            .sort((a, b) => b.timestamp - a.timestamp)[0];

          return {
            ...c,
            participants,
            unreadCount,
            lastMessage: lastMsg ? {
              content: lastMsg.isDeletedForEveryone ? '🚫 This message was deleted' : lastMsg.content,
              senderId: lastMsg.senderId,
              senderName: lastMsg.senderName,
              timestamp: lastMsg.timestamp,
              messageType: lastMsg.messageType
            } : undefined
          };
        })
        .sort((a, b) => b.updatedAt - a.updatedAt);

      res.json({ conversations: userConvs });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to list conversations.' });
    }
  });

  // 10. Conversations: Create 1-on-1 or Group
  router.post('/conversations', authenticateToken, (req: Request, res: Response) => {
    try {
      const currentUser = (req as any).user as UserAccount;
      const { type = 'direct', targetUserId, name, description, avatarUrl, participantIds = [] } = req.body;

      if (type === 'direct') {
        if (!targetUserId) {
          return res.status(400).json({ error: 'targetUserId is required for direct chat.' });
        }

        const targetUser = usersMap.get(targetUserId);
        if (!targetUser) {
          return res.status(404).json({ error: 'Target user not found.' });
        }

        // Privacy Check: Has target blocked currentUser or set restriction?
        if (targetUser.blockedUserIds.includes(currentUser.id)) {
          return res.status(403).json({ error: 'You cannot send messages to this user.' });
        }

        // Check if direct conversation already exists
        const existing = Array.from(conversationsMap.values()).find(c => 
          c.type === 'direct' &&
          c.participantIds.length === 2 &&
          c.participantIds.includes(currentUser.id) &&
          c.participantIds.includes(targetUserId)
        );

        if (existing) {
          const participants = existing.participantIds
            .map(pid => usersMap.get(pid))
            .filter(Boolean)
            .map(u => {
              const { passwordHash: _, ...p } = u!;
              return p;
            });
          return res.json({ conversation: { ...existing, participants } });
        }

        // Create new direct conversation
        const newConv: StoredConversation = {
          id: `conv_dir_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          type: 'direct',
          participantIds: [currentUser.id, targetUserId],
          createdAt: Date.now(),
          updatedAt: Date.now()
        };

        conversationsMap.set(newConv.id, newConv);

        const participants = newConv.participantIds
          .map(pid => usersMap.get(pid))
          .filter(Boolean)
          .map(u => {
            const { passwordHash: _, ...p } = u!;
            return p;
          });

        return res.json({ conversation: { ...newConv, participants } });
      } else {
        // Group Chat Creation
        if (!name) {
          return res.status(400).json({ error: 'Group name is required.' });
        }

        const allParticipants = Array.from(new Set([currentUser.id, ...participantIds]));

        const newGroup: StoredConversation = {
          id: `conv_grp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          type: 'group',
          name: sanitizeText(name),
          description: sanitizeText(description || ''),
          avatarUrl: avatarUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(name)}`,
          participantIds: allParticipants,
          createdBy: currentUser.id,
          createdAt: Date.now(),
          updatedAt: Date.now()
        };

        conversationsMap.set(newGroup.id, newGroup);

        const participants = newGroup.participantIds
          .map(pid => usersMap.get(pid))
          .filter(Boolean)
          .map(u => {
            const { passwordHash: _, ...p } = u!;
            return p;
          });

        return res.json({ conversation: { ...newGroup, participants } });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to create conversation.' });
    }
  });

  // 11. Messages: Fetch Messages for Conversation
  router.get('/conversations/:id/messages', authenticateToken, (req: Request, res: Response) => {
    try {
      const currentUser = (req as any).user as UserAccount;
      const { id } = req.params;

      const conversation = conversationsMap.get(id);
      if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found.' });
      }

      // Authorization Gate
      if (!conversation.participantIds.includes(currentUser.id)) {
        return res.status(403).json({ error: 'Access denied: You are not a member of this conversation.' });
      }

      const convMessages = messagesList
        .filter(m => m.conversationId === id && !m.deletedFor.includes(currentUser.id))
        .map(m => {
          if (m.isDeletedForEveryone) {
            return {
              ...m,
              content: '🚫 This message was deleted',
              attachment: undefined
            };
          }
          return m;
        })
        .sort((a, b) => a.timestamp - b.timestamp);

      res.json({ messages: convMessages });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch messages.' });
    }
  });

  // 12. Messages: Send Message
  router.post('/conversations/:id/messages', authenticateToken, (req: Request, res: Response) => {
    try {
      const currentUser = (req as any).user as UserAccount;
      const { id } = req.params;
      const { content = '', messageType = 'text', attachment } = req.body;

      const conversation = conversationsMap.get(id);
      if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found.' });
      }

      // Authorization Gate
      if (!conversation.participantIds.includes(currentUser.id)) {
        return res.status(403).json({ error: 'Access denied: You are not a member of this conversation.' });
      }

      if (!content.trim() && !attachment) {
        return res.status(400).json({ error: 'Message content or attachment is required.' });
      }

      const newMsg: StoredMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        conversationId: id,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatarUrl,
        senderRole: currentUser.role,
        content: sanitizeText(content),
        messageType: messageType,
        attachment,
        timestamp: Date.now(),
        readBy: [currentUser.id],
        deletedFor: []
      };

      messagesList.push(newMsg);
      conversation.updatedAt = Date.now();

      // Broadcast real-time SSE event to all online conversation participants
      conversation.participantIds.forEach(pid => {
        if (pid !== currentUser.id) {
          broadcastToUser(pid, 'message:new', {
            conversationId: id,
            message: newMsg
          });
        }
      });

      res.json({ message: newMsg });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to send message.' });
    }
  });

  // 13. Messages: Delete Message
  router.delete('/conversations/:id/messages/:msgId', authenticateToken, (req: Request, res: Response) => {
    try {
      const currentUser = (req as any).user as UserAccount;
      const { id, msgId } = req.params;
      const mode = (req.query.mode as string) || 'for_me';

      const message = messagesList.find(m => m.id === msgId && m.conversationId === id);
      if (!message) {
        return res.status(404).json({ error: 'Message not found.' });
      }

      if (mode === 'for_everyone') {
        if (message.senderId !== currentUser.id) {
          return res.status(403).json({ error: 'You can only delete your own messages for everyone.' });
        }
        message.isDeletedForEveryone = true;
      } else {
        if (!message.deletedFor.includes(currentUser.id)) {
          message.deletedFor.push(currentUser.id);
        }
      }

      // Broadcast SSE update
      const conversation = conversationsMap.get(id);
      if (conversation) {
        conversation.participantIds.forEach(pid => {
          broadcastToUser(pid, 'message:deleted', { conversationId: id, messageId: msgId, mode });
        });
      }

      res.json({ success: true, messageId: msgId });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to delete message.' });
    }
  });

  // 14. Messages: Mark Read
  router.post('/conversations/:id/read', authenticateToken, (req: Request, res: Response) => {
    try {
      const currentUser = (req as any).user as UserAccount;
      const { id } = req.params;

      const conversation = conversationsMap.get(id);
      if (!conversation || !conversation.participantIds.includes(currentUser.id)) {
        return res.status(403).json({ error: 'Access denied.' });
      }

      let countMarked = 0;
      messagesList.forEach(m => {
        if (m.conversationId === id && !m.readBy.includes(currentUser.id)) {
          m.readBy.push(currentUser.id);
          countMarked++;
        }
      });

      if (countMarked > 0) {
        conversation.participantIds.forEach(pid => {
          if (pid !== currentUser.id) {
            broadcastToUser(pid, 'message:read', { conversationId: id, readByUserId: currentUser.id });
          }
        });
      }

      res.json({ success: true, countMarked });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to mark messages as read.' });
    }
  });

  // 15. File Upload Handler (Image, PDF, Audio)
  router.post('/upload', authenticateToken, (req: Request, res: Response) => {
    try {
      const { fileBase64, fileName, mimeType, fileType } = req.body;

      if (!fileBase64) {
        return res.status(400).json({ error: 'File data is required.' });
      }

      // Sanitization & Validation: Check MIME types
      const allowedMimeTypes = [
        'image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif',
        'application/pdf',
        'audio/webm', 'audio/mp3', 'audio/wav', 'audio/m4a', 'audio/ogg'
      ];

      if (mimeType && !allowedMimeTypes.includes(mimeType.toLowerCase())) {
        return res.status(400).json({ error: 'Invalid or unsupported file type. Allowed: Images, PDF documents, Audio files.' });
      }

      // File Size Check (< 10MB approx)
      const base64Length = fileBase64.length;
      const sizeInBytes = (base64Length * 3) / 4;
      if (sizeInBytes > 10 * 1024 * 1024) {
        return res.status(400).json({ error: 'File size exceeds 10MB limit.' });
      }

      // Return Data URL safely
      const dataUrl = fileBase64.startsWith('data:') 
        ? fileBase64 
        : `data:${mimeType || 'application/octet-stream'};base64,${fileBase64}`;

      res.json({
        url: dataUrl,
        fileName: sanitizeText(fileName || 'file'),
        fileSize: Math.round(sizeInBytes),
        mimeType
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Upload failed.' });
    }
  });

  // 16. Real-time SSE Stream Endpoint
  router.get('/messages/stream', (req: Request, res: Response) => {
    const token = req.query.token as string;
    if (!token || !tokensMap.has(token)) {
      return res.status(401).json({ error: 'Unauthorized SSE connection.' });
    }

    const userId = tokensMap.get(token)!;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    if (!sseClients.has(userId)) {
      sseClients.set(userId, new Set());
    }
    sseClients.get(userId)!.add(res);

    // Initial heartbeat
    res.write(`event: connected\ndata: ${JSON.stringify({ status: 'connected', userId })}\n\n`);

    req.on('close', () => {
      const userSet = sseClients.get(userId);
      if (userSet) {
        userSet.delete(res);
        if (userSet.size === 0) {
          sseClients.delete(userId);
        }
      }
    });
  });

  // 17. Community Posts: List
  router.get('/community/posts', (req: Request, res: Response) => {
    try {
      const category = req.query.category as string;
      const communityId = req.query.communityId as string;
      const courseId = req.query.courseId as string;
      const courseCode = req.query.courseCode as string;
      const authorId = req.query.authorId as string;
      const savedOnly = req.query.savedOnly === 'true';
      const q = (req.query.q as string || '').toLowerCase().trim();

      let results = [...postsList];

      if (category && category !== 'All') {
        results = results.filter(p => p.category === category);
      }
      if (communityId) {
        results = results.filter(p => p.communityId === communityId);
      }
      if (courseId) {
        results = results.filter(p => p.courseId === courseId);
      }
      if (courseCode) {
        results = results.filter(p => p.courseCode?.toLowerCase() === courseCode.toLowerCase());
      }
      if (authorId) {
        results = results.filter(p => p.authorId === authorId);
      }
      if (savedOnly) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        const userId = token ? tokensMap.get(token) : null;
        const currentUser = userId ? usersMap.get(userId) : null;
        if (currentUser && currentUser.savedPostIds) {
          results = results.filter(p => currentUser.savedPostIds?.includes(p.id));
        } else {
          results = [];
        }
      }

      if (q) {
        results = results.filter(p => 
          p.title.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q) ||
          p.authorName.toLowerCase().includes(q) ||
          (p.courseCode && p.courseCode.toLowerCase().includes(q))
        );
      }

      results.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0) || b.createdAt - a.createdAt);

      res.json({ posts: results });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to list posts.' });
    }
  });

  // 18. Community Posts: Create
  router.post('/community/posts', authenticateToken, (req: Request, res: Response) => {
    try {
      const currentUser = (req as any).user as UserAccount;
      const { title, content, category = 'Study', communityId, courseId, courseCode, attachment } = req.body;

      if (!title || !content) {
        return res.status(400).json({ error: 'Post title and content are required.' });
      }

      let communityName = 'General Community';
      if (communityId && communityGroupsMap.has(communityId)) {
        communityName = communityGroupsMap.get(communityId)!.name;
      }

      const newPost: StoredCommunityPost = {
        id: `post_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        authorId: currentUser.id,
        authorName: currentUser.name,
        authorAvatar: currentUser.avatarUrl,
        authorRole: currentUser.role,
        isVerifiedTeacher: currentUser.isVerifiedTeacher || currentUser.role === 'teacher',
        category,
        communityId,
        communityName,
        facultyId: currentUser.facultyId,
        departmentId: currentUser.departmentId,
        courseId,
        courseCode,
        title: sanitizeText(title),
        content: sanitizeText(content),
        attachment,
        reactions: [],
        likesCount: 0,
        commentsCount: 0,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      postsList.unshift(newPost);

      res.json({ post: newPost });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to create post.' });
    }
  });

  // 19. Community Posts: React / Like
  router.post('/community/posts/:id/react', authenticateToken, (req: Request, res: Response) => {
    try {
      const currentUser = (req as any).user as UserAccount;
      const { id } = req.params;

      const post = postsList.find(p => p.id === id);
      if (!post) {
        return res.status(404).json({ error: 'Post not found.' });
      }

      const hasLiked = post.reactions.includes(currentUser.id);
      if (hasLiked) {
        post.reactions = post.reactions.filter(uid => uid !== currentUser.id);
      } else {
        post.reactions.push(currentUser.id);

        if (post.authorId !== currentUser.id) {
          notificationsList.unshift({
            id: `notif_${Date.now()}`,
            userId: post.authorId,
            type: 'reaction',
            title: 'New Reaction on Your Post',
            message: `${currentUser.name} liked your post: "${post.title.substring(0, 40)}..."`,
            linkTab: 'community',
            relatedId: post.id,
            isRead: false,
            createdAt: Date.now()
          });
        }
      }
      post.likesCount = post.reactions.length;

      res.json({ success: true, likesCount: post.likesCount, reactions: post.reactions });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to react to post.' });
    }
  });

  // 20. Community Posts: Save / Unsave
  router.post('/community/posts/:id/save', authenticateToken, (req: Request, res: Response) => {
    try {
      const currentUser = (req as any).user as UserAccount;
      const { id } = req.params;

      if (!currentUser.savedPostIds) currentUser.savedPostIds = [];

      const isSaved = currentUser.savedPostIds.includes(id);
      if (isSaved) {
        currentUser.savedPostIds = currentUser.savedPostIds.filter(pid => pid !== id);
      } else {
        currentUser.savedPostIds.push(id);
      }

      res.json({ success: true, isSaved: !isSaved, savedPostIds: currentUser.savedPostIds });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to save post.' });
    }
  });

  // 21. Community Posts: Delete Own or Admin
  router.delete('/community/posts/:id', authenticateToken, (req: Request, res: Response) => {
    try {
      const currentUser = (req as any).user as UserAccount;
      const { id } = req.params;

      const index = postsList.findIndex(p => p.id === id);
      if (index === -1) {
        return res.status(404).json({ error: 'Post not found.' });
      }

      const post = postsList[index];
      if (post.authorId !== currentUser.id && currentUser.role !== 'admin') {
        return res.status(403).json({ error: 'You are only allowed to delete your own posts.' });
      }

      postsList.splice(index, 1);
      res.json({ success: true, deletedPostId: id });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to delete post.' });
    }
  });

  // 22. Community Posts: Ask UEI AI
  router.post('/community/posts/:id/ask-ai', authenticateToken, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const post = postsList.find(p => p.id === id);
      if (!post) {
        return res.status(404).json({ error: 'Post not found.' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'Gemini API Key is not configured on server.' });
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Student Question Title: ${post.title}\nStudent Question Content: ${post.content}\n\nProvide an expert, clear academic explanation in bilingual Bengali & English suitable for Bangladesh Agricultural University students.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          systemInstruction: 'You are UEI AI Tutor for Bangladesh Agricultural University. Provide structured markdown explanation with definitions and key formulas.'
        }
      });

      const aiText = response.text || 'UEI AI Explanation generated.';
      post.isAiAnswered = true;
      post.aiAnswerText = aiText;

      res.json({ success: true, aiAnswerText: aiText });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to generate AI response for post.' });
    }
  });

  // 23. Comments: List & Add
  router.get('/community/posts/:id/comments', (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const postComments = commentsList
        .filter(c => c.postId === id)
        .sort((a, b) => a.createdAt - b.createdAt);
      res.json({ comments: postComments });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to list comments.' });
    }
  });

  router.post('/community/posts/:id/comments', authenticateToken, (req: Request, res: Response) => {
    try {
      const currentUser = (req as any).user as UserAccount;
      const { id } = req.params;
      const { content, parentId } = req.body;

      if (!content || !content.trim()) {
        return res.status(400).json({ error: 'Comment content cannot be empty.' });
      }

      const post = postsList.find(p => p.id === id);
      if (!post) {
        return res.status(404).json({ error: 'Post not found.' });
      }

      const newComment: StoredComment = {
        id: `cmt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        postId: id,
        parentId,
        authorId: currentUser.id,
        authorName: currentUser.name,
        authorAvatar: currentUser.avatarUrl,
        authorRole: currentUser.role,
        isVerifiedTeacher: currentUser.isVerifiedTeacher || currentUser.role === 'teacher',
        content: sanitizeText(content),
        reactions: [],
        likesCount: 0,
        createdAt: Date.now()
      };

      commentsList.push(newComment);
      post.commentsCount = commentsList.filter(c => c.postId === id).length;

      if (post.authorId !== currentUser.id) {
        notificationsList.unshift({
          id: `notif_${Date.now()}`,
          userId: post.authorId,
          type: parentId ? 'reply' : 'comment',
          title: parentId ? 'New Reply on Post' : 'New Comment on Your Post',
          message: `${currentUser.name} commented on "${post.title.substring(0, 35)}..."`,
          linkTab: 'community',
          relatedId: post.id,
          isRead: false,
          createdAt: Date.now()
        });
      }

      res.json({ comment: newComment, commentsCount: post.commentsCount });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to add comment.' });
    }
  });

  // 24. BAU Communities Groups List & Join
  router.get('/community/groups', (req: Request, res: Response) => {
    res.json({ groups: Array.from(communityGroupsMap.values()) });
  });

  router.post('/community/groups/join', authenticateToken, (req: Request, res: Response) => {
    try {
      const currentUser = (req as any).user as UserAccount;
      const { groupId } = req.body;

      const group = communityGroupsMap.get(groupId);
      if (!group) {
        return res.status(404).json({ error: 'Community group not found.' });
      }

      if (!currentUser.joinedCommunityIds) currentUser.joinedCommunityIds = [];

      const isMember = group.joinedUserIds.includes(currentUser.id);
      if (isMember) {
        group.joinedUserIds = group.joinedUserIds.filter(uid => uid !== currentUser.id);
        currentUser.joinedCommunityIds = currentUser.joinedCommunityIds.filter(gid => gid !== groupId);
      } else {
        group.joinedUserIds.push(currentUser.id);
        currentUser.joinedCommunityIds.push(groupId);
      }

      group.membersCount = group.joinedUserIds.length;

      res.json({ success: true, isJoined: !isMember, membersCount: group.membersCount });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to join community.' });
    }
  });

  // 25. Teacher Follow & Verification
  router.post('/teachers/follow', authenticateToken, (req: Request, res: Response) => {
    try {
      const currentUser = (req as any).user as UserAccount;
      const { teacherId } = req.body;

      if (!currentUser.followedTeacherIds) currentUser.followedTeacherIds = [];

      const isFollowing = currentUser.followedTeacherIds.includes(teacherId);
      if (isFollowing) {
        currentUser.followedTeacherIds = currentUser.followedTeacherIds.filter(id => id !== teacherId);
      } else {
        currentUser.followedTeacherIds.push(teacherId);
      }

      res.json({ success: true, isFollowing: !isFollowing, followedTeacherIds: currentUser.followedTeacherIds });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to follow teacher.' });
    }
  });

  router.post('/teachers/verify-request', authenticateToken, (req: Request, res: Response) => {
    try {
      const currentUser = (req as any).user as UserAccount;
      const { teacherId, designation, facultyName, departmentName } = req.body;

      if (!teacherId || !designation) {
        return res.status(400).json({ error: 'Teacher ID and designation are required.' });
      }

      const request: TeacherVerificationRequest = {
        id: `tvr_${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        userEmail: currentUser.email,
        facultyName: facultyName || currentUser.facultyName || 'BAU Faculty',
        departmentName: departmentName || currentUser.departmentName || 'BAU Department',
        teacherId: sanitizeText(teacherId),
        designation: sanitizeText(designation),
        status: 'pending',
        timestamp: Date.now()
      };

      teacherVerificationsList.push(request);
      res.json({ success: true, requestId: request.id });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Verification request failed.' });
    }
  });

  // 26. Notifications API
  router.get('/notifications', authenticateToken, (req: Request, res: Response) => {
    try {
      const currentUser = (req as any).user as UserAccount;
      const userNotifs = notificationsList
        .filter(n => n.userId === currentUser.id)
        .sort((a, b) => b.createdAt - a.createdAt);

      const unreadCount = userNotifs.filter(n => !n.isRead).length;

      res.json({ notifications: userNotifs, unreadCount });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch notifications.' });
    }
  });

  router.post('/notifications/read', authenticateToken, (req: Request, res: Response) => {
    try {
      const currentUser = (req as any).user as UserAccount;
      const { notifId } = req.body;

      const notif = notificationsList.find(n => n.id === notifId && n.userId === currentUser.id);
      if (notif) notif.isRead = true;

      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to mark notification read.' });
    }
  });

  router.post('/notifications/read-all', authenticateToken, (req: Request, res: Response) => {
    try {
      const currentUser = (req as any).user as UserAccount;
      notificationsList.forEach(n => {
        if (n.userId === currentUser.id) n.isRead = true;
      });
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to mark all notifications read.' });
    }
  });

  // 27. Global Search API
  router.get('/search', (req: Request, res: Response) => {
    try {
      const q = (req.query.q as string || '').toLowerCase().trim();
      if (!q) {
        return res.json({ users: [], posts: [], communities: [], groups: [], courses: [] });
      }

      const matchingUsers = Array.from(usersMap.values())
        .filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.departmentName && u.departmentName.toLowerCase().includes(q)))
        .map(u => { const { passwordHash: _, ...p } = u; return p; });

      const matchingPosts = postsList.filter(p => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q));
      const matchingCommunities = Array.from(communityGroupsMap.values()).filter(g => g.name.toLowerCase().includes(q) || g.departmentName.toLowerCase().includes(q));
      const matchingGroups = Array.from(conversationsMap.values()).filter(c => c.type === 'group' && c.name && c.name.toLowerCase().includes(q));

      res.json({
        users: matchingUsers,
        posts: matchingPosts,
        communities: matchingCommunities,
        groups: matchingGroups
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Global search failed.' });
    }
  });

  // 28. Admin Dashboard Endpoints
  router.get('/admin/stats', authenticateToken, (req: Request, res: Response) => {
    try {
      const currentUser = (req as any).user as UserAccount;
      if (currentUser.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required.' });
      }

      res.json({
        totalUsers: usersMap.size,
        totalPosts: postsList.length,
        totalMessages: messagesList.length,
        pendingReportsCount: reportsList.filter(r => r.status === 'pending').length,
        pendingTeacherVerificationsCount: teacherVerificationsList.filter(v => v.status === 'pending').length,
        activeCommunitiesCount: communityGroupsMap.size
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch admin stats.' });
    }
  });

  router.get('/admin/reports', authenticateToken, (req: Request, res: Response) => {
    try {
      const currentUser = (req as any).user as UserAccount;
      if (currentUser.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required.' });
      }

      res.json({ reports: reportsList });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch reports.' });
    }
  });

  router.post('/admin/reports/:id/action', authenticateToken, (req: Request, res: Response) => {
    try {
      const currentUser = (req as any).user as UserAccount;
      if (currentUser.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required.' });
      }

      const { id } = req.params;
      const { action } = req.body;

      const report = reportsList.find(r => r.id === id);
      if (!report) {
        return res.status(404).json({ error: 'Report not found.' });
      }

      report.status = 'reviewed';

      if (action === 'remove_content' && report.targetType === 'post') {
        const pIndex = postsList.findIndex(p => p.id === report.targetId);
        if (pIndex !== -1) postsList.splice(pIndex, 1);
      } else if (action === 'ban_user' && report.reportedUserId) {
        const u = usersMap.get(report.reportedUserId);
        if (u) u.status = 'banned';
      }

      res.json({ success: true, report });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to process report action.' });
    }
  });

  router.get('/admin/teacher-verifications', authenticateToken, (req: Request, res: Response) => {
    try {
      const currentUser = (req as any).user as UserAccount;
      if (currentUser.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required.' });
      }

      res.json({ verifications: teacherVerificationsList });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch teacher verifications.' });
    }
  });

  router.post('/admin/teacher-verifications/:id/action', authenticateToken, (req: Request, res: Response) => {
    try {
      const currentUser = (req as any).user as UserAccount;
      if (currentUser.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required.' });
      }

      const { id } = req.params;
      const { action } = req.body;

      const reqItem = teacherVerificationsList.find(v => v.id === id);
      if (!reqItem) {
        return res.status(404).json({ error: 'Verification request not found.' });
      }

      reqItem.status = action === 'approve' ? 'approved' : 'rejected';

      if (action === 'approve') {
        const user = usersMap.get(reqItem.userId);
        if (user) {
          user.role = 'teacher';
          user.isVerifiedTeacher = true;
        }
      }

      res.json({ success: true, verification: reqItem });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to process teacher verification.' });
    }
  });

  router.get('/admin/users', authenticateToken, (req: Request, res: Response) => {
    try {
      const currentUser = (req as any).user as UserAccount;
      if (currentUser.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required.' });
      }

      const usersList = Array.from(usersMap.values()).map(u => {
        const { passwordHash: _, ...p } = u;
        return p;
      });

      res.json({ users: usersList });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to list users for admin.' });
    }
  });

  return router;
}

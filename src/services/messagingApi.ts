import { UserProfile, DirectMessage, Conversation } from '../types';

const TOKEN_KEY = 'uei_auth_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`/api${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'API Request failed');
  }
  return data;
}

// 1. Auth Services
export async function registerUser(payload: any): Promise<{ token: string; user: UserProfile }> {
  const data = await apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  setStoredToken(data.token);
  return data;
}

export async function loginUser(email: string, password: string): Promise<{ token: string; user: UserProfile }> {
  const data = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  setStoredToken(data.token);
  return data;
}

export async function seedLogin(userId: string): Promise<{ token: string; user: UserProfile }> {
  const data = await apiFetch('/auth/seed-login', {
    method: 'POST',
    body: JSON.stringify({ userId })
  });
  setStoredToken(data.token);
  return data;
}

export async function fetchCurrentProfile(): Promise<{ user: UserProfile }> {
  return await apiFetch('/auth/me');
}

export async function updateProfile(payload: Partial<UserProfile>): Promise<{ user: UserProfile }> {
  return await apiFetch('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
}

// 2. User Directory & Search
export async function searchUsers(q: string = '', role?: string, departmentId?: string): Promise<{ users: UserProfile[] }> {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (role) params.set('role', role);
  if (departmentId) params.set('departmentId', departmentId);

  return await apiFetch(`/users/search?${params.toString()}`);
}

export async function blockUser(targetUserId: string): Promise<{ success: boolean; blockedUserIds: string[] }> {
  return await apiFetch('/users/block', {
    method: 'POST',
    body: JSON.stringify({ targetUserId })
  });
}

export async function unblockUser(targetUserId: string): Promise<{ success: boolean; blockedUserIds: string[] }> {
  return await apiFetch(`/users/block/${targetUserId}`, {
    method: 'DELETE'
  });
}

export async function reportUser(reportedUserId: string, reason: string, details?: string): Promise<{ success: boolean }> {
  return await apiFetch('/users/report', {
    method: 'POST',
    body: JSON.stringify({ reportedUserId, reason, details })
  });
}

// 3. Conversations Services
export async function fetchConversations(): Promise<{ conversations: Conversation[] }> {
  return await apiFetch('/conversations');
}

export async function createDirectConversation(targetUserId: string): Promise<{ conversation: Conversation }> {
  return await apiFetch('/conversations', {
    method: 'POST',
    body: JSON.stringify({ type: 'direct', targetUserId })
  });
}

export async function createGroupConversation(name: string, description?: string, avatarUrl?: string, participantIds?: string[]): Promise<{ conversation: Conversation }> {
  return await apiFetch('/conversations', {
    method: 'POST',
    body: JSON.stringify({ type: 'group', name, description, avatarUrl, participantIds })
  });
}

// 4. Messages Services
export async function fetchMessages(conversationId: string): Promise<{ messages: DirectMessage[] }> {
  return await apiFetch(`/conversations/${conversationId}/messages`);
}

export async function sendMessage(conversationId: string, content: string, messageType: 'text' | 'image' | 'pdf' | 'voice' = 'text', attachment?: any): Promise<{ message: DirectMessage }> {
  return await apiFetch(`/conversations/${conversationId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ content, messageType, attachment })
  });
}

export async function deleteMessage(conversationId: string, messageId: string, mode: 'for_me' | 'for_everyone' = 'for_me'): Promise<{ success: boolean }> {
  return await apiFetch(`/conversations/${conversationId}/messages/${messageId}?mode=${mode}`, {
    method: 'DELETE'
  });
}

export async function markConversationRead(conversationId: string): Promise<{ success: boolean }> {
  return await apiFetch(`/conversations/${conversationId}/read`, {
    method: 'POST'
  });
}

// 5. File Upload
export async function uploadFile(fileBase64: string, fileName: string, mimeType: string): Promise<{ url: string; fileName: string; fileSize: number; mimeType: string }> {
  return await apiFetch('/upload', {
    method: 'POST',
    body: JSON.stringify({ fileBase64, fileName, mimeType })
  });
}

// 6. Real-Time SSE Stream Listener
export function setupRealtimeStream(onEvent: (event: { type: string; payload: any }) => void): () => void {
  const token = getStoredToken();
  if (!token) return () => {};

  const es = new EventSource(`/api/messages/stream?token=${encodeURIComponent(token)}`);

  es.addEventListener('message:new', (e: MessageEvent) => {
    try {
      const data = JSON.parse(e.data);
      onEvent({ type: 'message:new', payload: data });
    } catch (err) {
      console.error('SSE Message Parse Error', err);
    }
  });

  es.addEventListener('message:deleted', (e: MessageEvent) => {
    try {
      const data = JSON.parse(e.data);
      onEvent({ type: 'message:deleted', payload: data });
    } catch (err) {
      console.error('SSE Message Parse Error', err);
    }
  });

  es.addEventListener('message:read', (e: MessageEvent) => {
    try {
      const data = JSON.parse(e.data);
      onEvent({ type: 'message:read', payload: data });
    } catch (err) {
      console.error('SSE Message Parse Error', err);
    }
  });

  return () => {
    es.close();
  };
}

// 7. Community Services
export async function fetchCommunityPosts(filters: {
  category?: string;
  communityId?: string;
  courseId?: string;
  courseCode?: string;
  authorId?: string;
  savedOnly?: boolean;
  q?: string;
} = {}): Promise<{ posts: any[] }> {
  const params = new URLSearchParams();
  if (filters.category) params.set('category', filters.category);
  if (filters.communityId) params.set('communityId', filters.communityId);
  if (filters.courseId) params.set('courseId', filters.courseId);
  if (filters.courseCode) params.set('courseCode', filters.courseCode);
  if (filters.authorId) params.set('authorId', filters.authorId);
  if (filters.savedOnly) params.set('savedOnly', 'true');
  if (filters.q) params.set('q', filters.q);

  return await apiFetch(`/community/posts?${params.toString()}`);
}

export async function createCommunityPost(payload: {
  title: string;
  content: string;
  category?: string;
  communityId?: string;
  courseId?: string;
  courseCode?: string;
  attachment?: any;
}): Promise<{ post: any }> {
  return await apiFetch('/community/posts', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function reactCommunityPost(postId: string): Promise<{ success: boolean; likesCount: number; reactions: string[] }> {
  return await apiFetch(`/community/posts/${postId}/react`, {
    method: 'POST'
  });
}

export async function saveCommunityPost(postId: string): Promise<{ success: boolean; isSaved: boolean; savedPostIds: string[] }> {
  return await apiFetch(`/community/posts/${postId}/save`, {
    method: 'POST'
  });
}

export async function deleteCommunityPost(postId: string): Promise<{ success: boolean }> {
  return await apiFetch(`/community/posts/${postId}`, {
    method: 'DELETE'
  });
}

export async function askAiOnCommunityPost(postId: string): Promise<{ success: boolean; aiAnswerText: string }> {
  return await apiFetch(`/community/posts/${postId}/ask-ai`, {
    method: 'POST'
  });
}

export async function fetchPostComments(postId: string): Promise<{ comments: any[] }> {
  return await apiFetch(`/community/posts/${postId}/comments`);
}

export async function addPostComment(postId: string, content: string, parentId?: string): Promise<{ comment: any; commentsCount: number }> {
  return await apiFetch(`/community/posts/${postId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ content, parentId })
  });
}

export async function fetchCommunityGroups(): Promise<{ groups: any[] }> {
  return await apiFetch('/community/groups');
}

export async function joinCommunityGroup(groupId: string): Promise<{ success: boolean; isJoined: boolean; membersCount: number }> {
  return await apiFetch('/community/groups/join', {
    method: 'POST',
    body: JSON.stringify({ groupId })
  });
}

// 8. Teacher Follow & Verification
export async function followTeacher(teacherId: string): Promise<{ success: boolean; isFollowing: boolean; followedTeacherIds: string[] }> {
  return await apiFetch('/teachers/follow', {
    method: 'POST',
    body: JSON.stringify({ teacherId })
  });
}

export async function requestTeacherVerification(payload: {
  teacherId: string;
  designation: string;
  facultyName?: string;
  departmentName?: string;
}): Promise<{ success: boolean; requestId: string }> {
  return await apiFetch('/teachers/verify-request', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

// 9. Notifications Services
export async function fetchNotifications(): Promise<{ notifications: any[]; unreadCount: number }> {
  return await apiFetch('/notifications');
}

export async function markNotificationRead(notifId: string): Promise<{ success: boolean }> {
  return await apiFetch('/notifications/read', {
    method: 'POST',
    body: JSON.stringify({ notifId })
  });
}

export async function markAllNotificationsRead(): Promise<{ success: boolean }> {
  return await apiFetch('/notifications/read-all', {
    method: 'POST'
  });
}

// 10. Global Search
export async function globalSearch(q: string): Promise<{
  users: any[];
  posts: any[];
  communities: any[];
  groups: any[];
}> {
  return await apiFetch(`/search?q=${encodeURIComponent(q)}`);
}

// 11. Admin Services
export async function fetchAdminStats(): Promise<any> {
  return await apiFetch('/admin/stats');
}

export async function fetchAdminReports(): Promise<{ reports: any[] }> {
  return await apiFetch('/admin/reports');
}

export async function actionAdminReport(reportId: string, action: 'dismiss' | 'remove_content' | 'ban_user'): Promise<{ success: boolean }> {
  return await apiFetch(`/admin/reports/${reportId}/action`, {
    method: 'POST',
    body: JSON.stringify({ action })
  });
}

export async function fetchAdminTeacherVerifications(): Promise<{ verifications: any[] }> {
  return await apiFetch('/admin/teacher-verifications');
}

export async function actionAdminTeacherVerification(id: string, action: 'approve' | 'reject'): Promise<{ success: boolean }> {
  return await apiFetch(`/admin/teacher-verifications/${id}/action`, {
    method: 'POST',
    body: JSON.stringify({ action })
  });
}

export async function fetchAdminUsers(): Promise<{ users: any[] }> {
  return await apiFetch('/admin/users');
}


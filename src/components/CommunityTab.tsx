import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  MessageSquare, 
  ThumbsUp, 
  Bookmark, 
  Share2, 
  Plus, 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle, 
  Bot, 
  Send, 
  Paperclip, 
  FileText, 
  Image as ImageIcon, 
  Trash2, 
  UserCheck, 
  Building2, 
  GraduationCap, 
  Clock, 
  X,
  ChevronDown,
  ChevronUp,
  Pin
} from 'lucide-react';
import { 
  fetchCommunityPosts, 
  createCommunityPost, 
  reactCommunityPost, 
  saveCommunityPost, 
  deleteCommunityPost, 
  askAiOnCommunityPost, 
  fetchPostComments, 
  addPostComment, 
  fetchCommunityGroups, 
  joinCommunityGroup, 
  followTeacher, 
  uploadFile,
  reportUser
} from '../services/messagingApi';
import { UserProfile } from '../types';

interface CommunityTabProps {
  languageMode?: string;
  currentUser: UserProfile | null;
  onOpenMessagesWithUser?: (userId: string) => void;
}

export const CommunityTab: React.FC<CommunityTabProps> = ({
  languageMode = 'bilingual',
  currentUser,
  onOpenMessagesWithUser
}) => {
  const isBn = languageMode === 'bn';

  // State
  const [posts, setPosts] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedGroupId, setSelectedGroupId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activePostDetail, setActivePostDetail] = useState<any | null>(null);
  const [commentsList, setCommentsList] = useState<any[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [reportModalData, setReportModalData] = useState<{ targetId: string; targetType: 'post' | 'user'; title: string } | null>(null);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');

  // Create Form State
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postCategory, setPostCategory] = useState('Study');
  const [postCommunityId, setPostCommunityId] = useState('');
  const [postCourseCode, setPostCourseCode] = useState('');
  const [postAttachment, setPostAttachment] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);

  // AI Generation Loading per post
  const [aiGeneratingMap, setAiGeneratingMap] = useState<Record<string, boolean>>({});

  const categories = [
    { id: 'All', labelBn: 'সব পোস্ট', labelEn: 'All Posts', icon: '🌐' },
    { id: 'Study', labelBn: 'পড়াশোনা', labelEn: 'Study', icon: '📚' },
    { id: 'BAU', labelBn: 'বাকৃবি সংবাদ', labelEn: 'BAU News', icon: '🎓' },
    { id: 'Assignment', labelBn: 'অ্যাসাইনমেন্ট', labelEn: 'Assignment', icon: '📝' },
    { id: 'Question', labelBn: 'প্রশ্ন', labelEn: 'Question', icon: '❓' },
    { id: 'Practical', labelBn: 'ব্যবহারিক', labelEn: 'Practical', icon: '🧪' },
    { id: 'Notes', labelBn: 'নোটস', labelEn: 'Notes', icon: '📖' },
    { id: 'Study Tips', labelBn: 'স্টাডি টিপস', labelEn: 'Study Tips', icon: '💡' },
    { id: 'Announcement', labelBn: 'ঘোষণা', labelEn: 'Announcement', icon: '📢' }
  ];

  useEffect(() => {
    loadPosts();
    loadGroups();
  }, [selectedCategory, selectedGroupId, showSavedOnly, searchQuery]);

  const loadPosts = async () => {
    setLoadingPosts(true);
    try {
      const data = await fetchCommunityPosts({
        category: selectedCategory,
        communityId: selectedGroupId !== 'all' ? selectedGroupId : undefined,
        savedOnly: showSavedOnly,
        q: searchQuery
      });
      setPosts(data.posts || []);
    } catch (err) {
      console.error('Failed to load community posts:', err);
    } finally {
      setLoadingPosts(false);
    }
  };

  const loadGroups = async () => {
    try {
      const data = await fetchCommunityGroups();
      setGroups(data.groups || []);
    } catch (err) {
      console.error('Failed to load community groups:', err);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) return;

    setIsSubmittingPost(true);
    try {
      await createCommunityPost({
        title: postTitle,
        content: postContent,
        category: postCategory,
        communityId: postCommunityId || undefined,
        courseCode: postCourseCode || undefined,
        attachment: postAttachment
      });

      // Reset form
      setPostTitle('');
      setPostContent('');
      setPostAttachment(null);
      setPostCourseCode('');
      setIsCreateModalOpen(false);
      loadPosts();
    } catch (err: any) {
      alert(err.message || 'Failed to create post.');
    } finally {
      setIsSubmittingPost(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        const res = await uploadFile(base64, file.name, file.type);
        setPostAttachment({
          type: file.type.startsWith('image/') ? 'image' : 'pdf',
          url: res.url,
          fileName: res.fileName
        });
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      alert('File upload failed.');
      setIsUploading(false);
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      const res = await reactCommunityPost(postId);
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, likesCount: res.likesCount, reactions: res.reactions } : p));
      if (activePostDetail?.id === postId) {
        setActivePostDetail((prev: any) => ({ ...prev, likesCount: res.likesCount, reactions: res.reactions }));
      }
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  const handleSavePost = async (postId: string) => {
    try {
      await saveCommunityPost(postId);
      alert(isBn ? 'পোস্টটি সংরক্ষিত হয়েছে!' : 'Post saved successfully!');
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm(isBn ? 'আপনি কি নিশ্চিত যে এই পোস্টটি মুছে ফেলতে চান?' : 'Are you sure you want to delete this post?')) return;
    try {
      await deleteCommunityPost(postId);
      setPosts(prev => prev.filter(p => p.id !== postId));
      if (activePostDetail?.id === postId) setActivePostDetail(null);
    } catch (err: any) {
      alert(err.message || 'Failed to delete post.');
    }
  };

  const handleAskAi = async (postId: string) => {
    setAiGeneratingMap(prev => ({ ...prev, [postId]: true }));
    try {
      const res = await askAiOnCommunityPost(postId);
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, isAiAnswered: true, aiAnswerText: res.aiAnswerText } : p));
      if (activePostDetail?.id === postId) {
        setActivePostDetail((prev: any) => ({ ...prev, isAiAnswered: true, aiAnswerText: res.aiAnswerText }));
      }
    } catch (err: any) {
      alert(err.message || 'AI Answer generation failed.');
    } finally {
      setAiGeneratingMap(prev => ({ ...prev, [postId]: false }));
    }
  };

  const openPostDetail = async (post: any) => {
    setActivePostDetail(post);
    setLoadingComments(true);
    try {
      const data = await fetchPostComments(post.id);
      setCommentsList(data.comments || []);
    } catch (err) {
      console.error('Failed to load comments:', err);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !activePostDetail) return;

    try {
      const data = await addPostComment(activePostDetail.id, newCommentText);
      setCommentsList(prev => [...prev, data.comment]);
      setPosts(prev => prev.map(p => p.id === activePostDetail.id ? { ...p, commentsCount: data.commentsCount } : p));
      setActivePostDetail((prev: any) => ({ ...prev, commentsCount: data.commentsCount }));
      setNewCommentText('');
    } catch (err: any) {
      alert(err.message || 'Failed to add comment.');
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    try {
      const res = await joinCommunityGroup(groupId);
      setGroups(prev => prev.map(g => g.id === groupId ? { ...g, membersCount: res.membersCount, isJoined: res.isJoined } : g));
    } catch (err) {
      console.error('Join error:', err);
    }
  };

  const handleFollowTeacher = async (teacherId: string) => {
    try {
      await followTeacher(teacherId);
      alert(isBn ? 'শিক্ষককে অনুসরন করা হচ্ছে!' : 'Now following teacher!');
    } catch (err) {
      console.error('Follow error:', err);
    }
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportModalData || !reportReason.trim()) return;

    try {
      await reportUser(reportModalData.targetId, reportReason, reportDetails);
      alert(isBn ? 'আপনার রিপোর্ট টি গৃহীত হয়েছে।' : 'Report submitted for admin review.');
      setReportModalData(null);
      setReportReason('');
      setReportDetails('');
    } catch (err) {
      alert('Failed to submit report.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-emerald-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-no-repeat bg-cover bg-center pointer-events-none" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80")' }} />
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-500/30">
              <Building2 className="w-3.5 h-3.5" />
              <span>{isBn ? 'বাকৃবি একাডেমি অ্যান্ড স্টুডেন্ট ফোরাম' : 'BAU Academic Student Forum'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              🌐 {isBn ? 'বাকৃবি স্টুডেন্ট কমিউনিটি' : 'BAU Student Community'}
            </h1>
            <p className="text-emerald-100/80 text-sm mt-1 max-w-xl">
              {isBn 
                ? 'অনুষদ ও বিভাগ ভিত্তিক প্রশ্ন ও উত্তর, নোটস শেয়ার, শিক্ষকের পরামর্শ এবং অ্যাসাইনমেন্ট হেল্প ফোরাম।'
                : 'Faculty & department discussions, note sharing, verified teacher guidance, and academic Q&A forum.'
              }
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl transition shadow-lg hover:shadow-emerald-500/25 active:scale-95"
            >
              <Plus className="w-5 h-5" />
              <span>{isBn ? 'নতুন পোস্ট লিখুন' : 'Create New Post'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Filters/Feed, Right BAU Hierarchy Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left 3 Columns: Feed & Categories */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.id); setShowSavedOnly(false); }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id && !showSavedOnly
                    ? 'bg-emerald-700 text-white shadow-md'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{isBn ? cat.labelBn : cat.labelEn}</span>
              </button>
            ))}

            <button
              onClick={() => setShowSavedOnly(!showSavedOnly)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                showSavedOnly
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>{isBn ? 'সংরক্ষিত পোস্ট' : 'Saved Posts'}</span>
            </button>
          </div>

          {/* Search Input Bar */}
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isBn ? 'কমিউনিটি পোস্টে খুঁজুন (কোর্স কোড, বিষয় বা শিরোনাম)...' : 'Search community posts by title, content, or course code...'}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-sm"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Posts Feed List */}
          {loadingPosts ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 animate-pulse space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200" />
                    <div className="space-y-1">
                      <div className="w-32 h-4 bg-slate-200 rounded" />
                      <div className="w-20 h-3 bg-slate-200 rounded" />
                    </div>
                  </div>
                  <div className="w-3/4 h-5 bg-slate-200 rounded" />
                  <div className="w-full h-16 bg-slate-100 rounded" />
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl text-center border border-slate-200 space-y-3">
              <div className="text-4xl">📭</div>
              <h3 className="text-lg font-bold text-slate-800">
                {isBn ? 'কোন পোস্ট পাওয়া যায়নি' : 'No posts found'}
              </h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto">
                {isBn ? 'এই ক্যাটাগরিতে এখনও কোন আলোচনা শুরু হয়নি। প্রথম পোস্টটি আপনিই লিখুন!' : 'No discussions match your filter. Be the first to start a conversation!'}
              </p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center gap-2 bg-emerald-600 text-white font-semibold px-4 py-2 rounded-xl hover:bg-emerald-700 text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>{isBn ? 'পোস্ট তৈরি করুন' : 'Create Post'}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map(post => (
                <div
                  key={post.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition space-y-4"
                >
                  {/* Card Header: Author Info */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={post.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                        alt={post.authorName}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-100"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 text-sm">{post.authorName}</span>
                          {post.isVerifiedTeacher && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold" title="Verified BAU Teacher">
                              <UserCheck className="w-3 h-3 text-emerald-600" />
                              <span>Verified Teacher</span>
                            </span>
                          )}
                          {post.authorRole === 'admin' && (
                            <span className="bg-purple-100 text-purple-800 text-[10px] px-1.5 py-0.5 rounded font-semibold">
                              Admin
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                          {post.communityName && (
                            <>
                              <span>•</span>
                              <span className="text-emerald-700 font-medium">{post.communityName}</span>
                            </>
                          )}
                          {post.courseCode && (
                            <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 font-mono text-[11px] rounded">
                              {post.courseCode}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-100">
                        {post.category}
                      </span>
                      {post.isPinned && (
                        <span className="p-1 bg-amber-50 text-amber-700 rounded-lg" title="Pinned Post">
                          <Pin className="w-4 h-4 fill-amber-500 text-amber-500" />
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Post Title & Content */}
                  <div>
                    <h2
                      onClick={() => openPostDetail(post)}
                      className="text-lg font-bold text-slate-900 hover:text-emerald-700 cursor-pointer transition"
                    >
                      {post.title}
                    </h2>
                    <p className="text-slate-700 text-sm mt-2 whitespace-pre-line leading-relaxed">
                      {post.content}
                    </p>
                  </div>

                  {/* Attachment Preview */}
                  {post.attachment && (
                    <div className="mt-2 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 p-3">
                      {post.attachment.type === 'image' ? (
                        <img
                          src={post.attachment.url}
                          alt="Attachment"
                          className="max-h-72 w-full object-cover rounded-lg"
                        />
                      ) : (
                        <a
                          href={post.attachment.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-3 p-2 bg-white rounded-lg border border-slate-200 hover:border-emerald-400 transition"
                        >
                          <FileText className="w-8 h-8 text-rose-500" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate">{post.attachment.fileName || 'PDF Document'}</p>
                            <p className="text-xs text-slate-500">{isBn ? 'ডকুমেন্ট খুলুন' : 'Click to open PDF'}</p>
                          </div>
                        </a>
                      )}
                    </div>
                  )}

                  {/* UEI AI Answer Banner if generated */}
                  {post.isAiAnswered && post.aiAnswerText && (
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4 text-xs text-slate-800 space-y-2">
                      <div className="flex items-center gap-2 font-bold text-emerald-800">
                        <Bot className="w-4 h-4 text-emerald-600" />
                        <span>🤖 UEI AI Tutor Explanation (বাকৃবি একাডেমি উত্তর)</span>
                      </div>
                      <div className="prose prose-sm text-slate-700 whitespace-pre-line leading-relaxed">
                        {post.aiAnswerText}
                      </div>
                    </div>
                  )}

                  {/* Card Actions Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-600">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLikePost(post.id)}
                        className={`flex items-center gap-1.5 font-semibold transition ${
                          currentUser && post.reactions?.includes(currentUser.id)
                            ? 'text-emerald-700'
                            : 'hover:text-slate-900'
                        }`}
                      >
                        <ThumbsUp className={`w-4 h-4 ${currentUser && post.reactions?.includes(currentUser.id) ? 'fill-emerald-600' : ''}`} />
                        <span>{post.likesCount || 0}</span>
                      </button>

                      <button
                        onClick={() => openPostDetail(post)}
                        className="flex items-center gap-1.5 font-semibold hover:text-slate-900 transition"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>{post.commentsCount || 0} {isBn ? 'মন্তব্য' : 'Comments'}</span>
                      </button>

                      <button
                        onClick={() => handleSavePost(post.id)}
                        className="flex items-center gap-1.5 font-semibold hover:text-slate-900 transition"
                      >
                        <Bookmark className="w-4 h-4" />
                        <span>{isBn ? 'সংরক্ষণ' : 'Save'}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Ask UEI AI Button */}
                      {!post.isAiAnswered && (
                        <button
                          onClick={() => handleAskAi(post.id)}
                          disabled={aiGeneratingMap[post.id]}
                          className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-700 to-teal-800 text-white font-semibold px-3 py-1.5 rounded-lg text-xs shadow-sm hover:opacity-90 disabled:opacity-50"
                        >
                          <Bot className="w-3.5 h-3.5" />
                          <span>{aiGeneratingMap[post.id] ? (isBn ? 'উত্তর তৈরি হচ্ছে...' : 'AI Thinking...') : 'Ask UEI AI'}</span>
                        </button>
                      )}

                      {/* Messaging Author Button */}
                      {onOpenMessagesWithUser && post.authorId !== currentUser?.id && (
                        <button
                          onClick={() => onOpenMessagesWithUser(post.authorId)}
                          className="p-1.5 text-slate-500 hover:text-emerald-700 rounded-lg hover:bg-slate-100"
                          title={isBn ? 'ইনবক্সে বার্তা পাঠান' : 'Send message to author'}
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      )}

                      {/* Delete / Report Menu */}
                      {(currentUser?.id === post.authorId || currentUser?.role === 'admin') ? (
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                          title="Delete Post"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => setReportModalData({ targetId: post.id, targetType: 'post', title: post.title })}
                          className="p-1.5 text-slate-400 hover:text-amber-600 rounded-lg hover:bg-amber-50"
                          title="Report Post"
                        >
                          <AlertTriangle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Column: BAU Academic Communities & Verified Teachers */}
        <div className="space-y-6">
          
          {/* BAU Academic Communities Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 font-bold text-slate-900 border-b border-slate-100 pb-3">
              <Building2 className="w-5 h-5 text-emerald-700" />
              <span>{isBn ? 'অনুষদ ও বিভাগ গ্রুপ' : 'BAU Faculty Groups'}</span>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setSelectedGroupId('all')}
                className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between ${
                  selectedGroupId === 'all' ? 'bg-emerald-100 text-emerald-900' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span>🌐 {isBn ? 'সকল কমিউনিটি গ্রুপ' : 'All Community Groups'}</span>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-slate-200">{groups.length}</span>
              </button>

              {groups.map(group => (
                <div key={group.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">{group.name}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{group.facultyName}</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">{group.description}</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-500 font-medium">{group.membersCount || 0} {isBn ? 'সদস্য' : 'members'}</span>
                    <button
                      onClick={() => handleJoinGroup(group.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                        group.isJoined
                          ? 'bg-slate-200 text-slate-700'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      {group.isJoined ? (isBn ? 'সংযুক্ত' : 'Joined') : (isBn ? '+ যোগ দিন' : '+ Join')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Teacher Guidelines Card */}
          <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 font-bold text-emerald-300 text-sm">
              <UserCheck className="w-5 h-5 text-emerald-400" />
              <span>{isBn ? 'শিক্ষকদের জন্য নির্দেশিকা' : 'Verified Teacher System'}</span>
            </div>
            <p className="text-xs text-emerald-100/80 leading-relaxed">
              {isBn
                ? 'বাকৃবির সম্মানিত শিক্ষকগণ তাদের প্রশ্ন, সমাধান এবং ক্লাস নোটস পোস্ট করলে তাদের প্রোফাইলে "Verified Teacher" ব্যাজ যুক্ত হয়।'
                : 'BAU Faculty members with verified accounts receive a verified checkmark and can answer student queries directly.'
              }
            </p>
          </div>

        </div>
      </div>

      {/* CREATE POST MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                📝 {isBn ? 'নতুন কমিউনিটি পোস্ট লিখুন' : 'Create Community Post'}
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isBn ? 'পোস্ট শিরোনাম' : 'Post Title'} *
                </label>
                <input
                  type="text"
                  required
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder={isBn ? 'যেমন: ANAT 101 প্র্যাকটিক্যাল পরীক্ষার গুরুত্বপূর্ণ টপিক...' : 'e.g. Key viva questions for ANAT 101 practical exam...'}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isBn ? 'ক্যাটাগরি' : 'Category'}
                  </label>
                  <select
                    value={postCategory}
                    onChange={(e) => setPostCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-sm bg-white"
                  >
                    {categories.filter(c => c.id !== 'All').map(c => (
                      <option key={c.id} value={c.id}>{c.icon} {c.id}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isBn ? 'কোর্স কোড (ঐচ্ছিক)' : 'Course Code (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={postCourseCode}
                    onChange={(e) => setPostCourseCode(e.target.value)}
                    placeholder="e.g. ANAT 101"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isBn ? 'কমিউনিটি গ্রুপ নির্বাচন করুন' : 'Select Community Group'}
                </label>
                <select
                  value={postCommunityId}
                  onChange={(e) => setPostCommunityId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-sm bg-white"
                >
                  <option value="">-- General Community --</option>
                  {groups.map(g => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isBn ? 'বিবরণ' : 'Content Details'} *
                </label>
                <textarea
                  required
                  rows={5}
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder={isBn ? 'আপনার প্রশ্ন, নোটস বা আলোচনা বিস্তারিত লিখুন...' : 'Write your academic question, summary notes, or discussion details here...'}
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>

              {/* Attachment Button */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isBn ? 'ছবি অথবা পিডিএফ যুক্ত করুন' : 'Attach Image or PDF Document'}
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                />
                {isUploading && <span className="text-xs text-emerald-600 mt-1 block">Uploading file...</span>}
                {postAttachment && (
                  <div className="mt-2 text-xs text-emerald-800 font-medium">
                    ✓ Attached: {postAttachment.fileName || 'File'}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPost}
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 disabled:opacity-50"
                >
                  {isSubmittingPost ? (isBn ? 'পোস্ট হচ্ছে...' : 'Posting...') : (isBn ? 'পোস্ট প্রকাশ করুন' : 'Publish Post')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POST DETAIL & COMMENTS MODAL */}
      {activePostDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-md font-bold text-slate-900 truncate pr-4">
                {activePostDetail.title}
              </h3>
              <button onClick={() => setActivePostDetail(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              <p className="text-sm text-slate-800 whitespace-pre-line leading-relaxed">
                {activePostDetail.content}
              </p>

              {/* Comments Section */}
              <div className="border-t border-slate-100 pt-4 space-y-3">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  💬 {isBn ? 'মন্তব্যসমূহ' : 'Comments'} ({commentsList.length})
                </h4>

                {loadingComments ? (
                  <div className="text-center text-xs text-slate-400 py-4">Loading comments...</div>
                ) : commentsList.length === 0 ? (
                  <div className="text-center text-xs text-slate-500 py-4">
                    {isBn ? 'এখনও কোন মন্তব্য নেই। প্রথম মন্তব্যটি লিখুন!' : 'No comments yet. Write the first comment!'}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {commentsList.map(comment => (
                      <div key={comment.id} className="p-3 bg-slate-50 rounded-xl space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-900">{comment.authorName}</span>
                          <span className="text-slate-400">{new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-xs text-slate-700 whitespace-pre-line">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Comment Form Input */}
            <form onSubmit={handleAddComment} className="flex gap-2 pt-2 border-t border-slate-100">
              <input
                type="text"
                required
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder={isBn ? 'আপনার মন্তব্য লিখুন...' : 'Write a comment...'}
                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs"
              />
              <button
                type="submit"
                className="bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl text-xs hover:bg-emerald-700 flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isBn ? 'পাঠান' : 'Send'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* REPORT MODAL */}
      {reportModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-md font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span>{isBn ? 'পোস্ট রিপোর্ট করুন' : 'Report Post'}</span>
            </h3>

            <form onSubmit={handleSubmitReport} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isBn ? 'রিপোর্টের কারণ' : 'Reason for Report'}
                </label>
                <select
                  required
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white"
                >
                  <option value="">-- Select Reason --</option>
                  <option value="Spam or Misleading">Spam or Misleading Information</option>
                  <option value="Inappropriate Content">Inappropriate Content</option>
                  <option value="Harassment or Hate Speech">Harassment or Hate Speech</option>
                  <option value="Copyright Violation">Copyright / Plagiarism</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isBn ? 'অতিরিক্ত তথ্য (ঐচ্ছিক)' : 'Additional Details'}
                </label>
                <textarea
                  rows={3}
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReportModalData(null)}
                  className="px-3.5 py-1.5 rounded-xl border text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-amber-600 text-white font-bold text-xs"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

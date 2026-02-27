'use client';

import Link from 'next/link';

interface ActivityRecord {
    id: string;
    date: string;
    title: string;
    notes: string | null;
    totalVolume: number;
    totalExercises: number;
    likesCount?: number;
    commentsCount?: number;
    comments?: any[];
    isLiked?: boolean;
}

// Client-side interactions
import { useState } from 'react';
import { toggleLike } from '@/app/actions/social';

function SocialActions({ activity }: { activity: ActivityRecord }) {
    const [isLiked, setIsLiked] = useState(activity.isLiked || false);
    const [likesCount, setLikesCount] = useState(activity.likesCount || 0);

    // Comment State
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState<any[]>(activity.comments || []);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Import addComment at the top with toggleLike
    // import { toggleLike, addComment } from '@/app/actions/social';

    const handleLike = async () => {
        // Optimistic UI
        const newLikedState = !isLiked;
        setIsLiked(newLikedState);
        setLikesCount(prev => newLikedState ? prev + 1 : Math.max(0, prev - 1));

        const res = await toggleLike(activity.id, !newLikedState);
        if (res.error) {
            // Revert on error
            setIsLiked(!newLikedState);
            setLikesCount(prev => !newLikedState ? prev + 1 : Math.max(0, prev - 1));
        }
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim() || isSubmitting) return;

        setIsSubmitting(true);
        // We need to import addComment
        const { addComment } = await import('@/app/actions/social');
        const res = await addComment(activity.id, commentText);
        setIsSubmitting(false);

        if (res.error) {
            // Error handling (using alert or toast if available here, for now alert)
            alert(res.error);
        } else if (res.comment) {
            setComments(prev => [...prev, res.comment]);
            setCommentText('');
        }
    };

    return (
        <div className="w-full">
            <div className="flex gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800/80">
                <button
                    onClick={handleLike}
                    className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${isLiked
                        ? 'text-red-500'
                        : 'text-gray-500 dark:text-zinc-400 hover:text-red-400'
                        }`}
                >
                    <div className="relative">
                        <span className="relative z-10">{isLiked ? '❤️' : '🤍'}</span>
                        {isLiked && <span className="absolute inset-0 text-red-500 blur-[2px] opacity-50 z-0">❤️</span>}
                    </div>
                    <span>{likesCount > 0 ? likesCount : 'ถูกใจ'}</span>
                </button>
                <button
                    onClick={() => setShowComments(!showComments)}
                    className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${showComments ? 'text-blue-500' : 'text-gray-500 dark:text-zinc-400 hover:text-blue-500 dark:hover:text-blue-400'
                        }`}
                >
                    <span>💬</span>
                    <span>{comments.length > 0 ? comments.length : activity.commentsCount && activity.commentsCount > 0 ? activity.commentsCount : 'คอมเมนต์'}</span>
                </button>
            </div>

            {/* Comments Section */}
            {
                showComments && (
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800/50 space-y-3">
                        {/* Comments List */}
                        <div className="space-y-3 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                            {comments.length === 0 ? (
                                <p className="text-xs text-center text-gray-400 dark:text-zinc-500 italic">ยังไม่มีคอมเมนต์ เป็นคนแรกที่คอมเมนต์สิ!</p>
                            ) : (
                                comments.map(c => (
                                    <div key={c.id} className="bg-gray-50 dark:bg-zinc-900/50 p-3 rounded-xl border border-gray-100 dark:border-zinc-800 text-sm flex gap-3">
                                        <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-zinc-800 shrink-0 flex items-center justify-center text-[10px] overflow-hidden">
                                            {c.profiles?.avatar_url ? (
                                                <img src={c.profiles.avatar_url} alt="A" className="w-full h-full object-cover" />
                                            ) : (
                                                c.profiles?.name?.[0]?.toUpperCase() || 'U'
                                            )}
                                        </div>
                                        <div>
                                            <span className="font-bold text-gray-900 dark:text-zinc-200 text-xs mr-2">{c.profiles?.name || 'Unknown'}</span>
                                            <span className="text-gray-600 dark:text-zinc-400">{c.content}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Comment Input Form */}
                        <form onSubmit={handleCommentSubmit} className="flex gap-2 mt-2">
                            <input
                                type="text"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="แสดงความคิดเห็น..."
                                className="flex-1 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-2 text-sm text-gray-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500"
                                disabled={isSubmitting}
                            />
                            <button
                                type="submit"
                                disabled={!commentText.trim() || isSubmitting}
                                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl disabled:opacity-50 transition-colors"
                            >
                                {isSubmitting ? '⏳' : '🚀'}
                            </button>
                        </form>

                    </div>
                )
            }
        </div>
    );
}

export function TimelineWidget({ activities }: { activities: ActivityRecord[] }) {
    if (!activities || activities.length === 0) {
        return (
            <div className="bg-white/70 dark:bg-zinc-900/70 p-6 rounded-3xl shadow-sm dark:shadow-md border border-white/40 dark:border-zinc-800 backdrop-blur-md mb-8">
                <h3 className="text-xl font-black text-gray-800 dark:text-zinc-100 flex items-center gap-2 tracking-tight mb-4">
                    🔥 <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-500 dark:from-red-400 dark:to-orange-500">กิจกรรมล่าสุด</span>
                </h3>
                <div className="text-center py-6 text-gray-500 dark:text-zinc-500 font-medium">
                    ยังไม่มีประวัติการฝึกซ้อม
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white/70 dark:bg-zinc-900/70 p-6 rounded-3xl shadow-sm dark:shadow-md border border-white/40 dark:border-zinc-800 backdrop-blur-md mb-8 hover:shadow-md dark:hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-gray-800 dark:text-zinc-100 flex items-center gap-2 tracking-tight">
                    🔥 <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-500 dark:from-red-400 dark:to-orange-500">กิจกรรมล่าสุด</span>
                </h3>
                <Link href="/logs" className="text-sm text-blue-600 dark:text-blue-400 font-bold hover:underline">
                    ดูประวัติ
                </Link>
            </div>

            <div className="relative pl-6 border-l-2 border-gray-100 dark:border-zinc-800/80 space-y-6">
                {activities.map((activity, index) => {
                    // Prettify date formatting (e.g. "เมื่อ 2 วันก่อน" or regular date)
                    const activityDate = new Date(activity.date);
                    const today = new Date();

                    // Reset time portion for accurate day difference
                    activityDate.setHours(0, 0, 0, 0);
                    const todayDate = new Date(today.getTime());
                    todayDate.setHours(0, 0, 0, 0);

                    const diffTime = Math.abs(todayDate.getTime() - activityDate.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    let dateDisplay = activityDate.toLocaleDateString();
                    if (diffDays === 0) dateDisplay = "วันนี้";
                    else if (diffDays === 1) dateDisplay = "เมื่อวาน";
                    else if (diffDays <= 7) dateDisplay = `เมื่อ ${diffDays} วันก่อน`;

                    return (
                        <div key={activity.id} className="relative group">
                            {/* Timeline Dot */}
                            <div className={`absolute -left-[31px] w-4 h-4 rounded-full border-2 border-white dark:border-zinc-900 shadow-sm ${index === 0 ? 'bg-orange-500 dark:bg-red-500' : 'bg-blue-400 dark:bg-zinc-600'
                                }`} />

                            <div className="bg-white dark:bg-zinc-950/50 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800/80 hover:border-orange-200 dark:hover:border-red-900/50 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-gray-900 dark:text-zinc-100 text-lg">{activity.title}</h4>
                                    <span className="text-xs font-semibold text-gray-500 dark:text-zinc-500 bg-gray-100 dark:bg-zinc-900 px-2 py-1 rounded-lg">
                                        {dateDisplay}
                                    </span>
                                </div>

                                <div className="flex gap-4 text-sm mt-3">
                                    <div className="flex items-center gap-1.5 text-gray-600 dark:text-zinc-400">
                                        <svg className="w-4 h-4 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        <span className="font-semibold">{activity.totalExercises} ท่า</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-gray-600 dark:text-zinc-400">
                                        <svg className="w-4 h-4 text-purple-500 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                                        </svg>
                                        <span className="font-semibold">{activity.totalVolume.toLocaleString()} kg</span>
                                    </div>
                                </div>

                                {activity.notes && (
                                    <p className="mt-3 text-sm text-gray-500 dark:text-zinc-400 italic bg-gray-50 dark:bg-zinc-900/50 p-3 rounded-xl border border-gray-100 dark:border-zinc-800">
                                        &quot;{activity.notes}&quot;
                                    </p>
                                )}

                                {/* Social Actions */}
                                <SocialActions activity={activity} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

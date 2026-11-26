import { CommunityPost, CommunityPostReport, ProductCategory } from '@/types';
import { supabase, isSupabaseConfigured } from './supabase';

export interface CreatePostInput {
  title: string;
  description: string;
  category: ProductCategory | string;
  images: string[];
  requiredMaterials: string[];
  instructions: string[];
  difficulty?: 'Easy' | 'Moderate' | 'Advanced';
  estimatedTime?: string;
}

export interface CreatePostReportInput {
  postId: string;
  postTitle: string;
  reason: 'inappropriate_content' | 'spam_promotional' | 'dangerous_practice' | 'copyright_plagiarism' | 'other';
  details: string;
}

const LOCAL_STORAGE_POSTS_KEY = 'reusehub_community_custom_posts';
const LOCAL_STORAGE_LIKES_KEY = 'reusehub_community_user_likes';
const LOCAL_STORAGE_SAVES_KEY = 'reusehub_community_user_saves';
const LOCAL_STORAGE_REPORTS_KEY = 'reusehub_community_reports';

// Initial seed posts matching database schema
export const INITIAL_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post-seed-1',
    authorId: 'usr-maya',
    authorName: 'Maya Lin',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    authorTitle: 'Woodworking & Upcycle Mentor',
    title: 'Reclaimed Pallet Wood Vertical Herb Garden Planter',
    description: 'Turned discarded shipping pallet timber into a space-efficient 4-tiered vertical wall planter for kitchen basil, rosemary, and mint. Perfect for small apartment balconies or urban courtyards.',
    category: 'Furniture',
    images: [
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
    ],
    primaryImage: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80',
    requiredMaterials: [
      '1 heat-treated wooden pallet (look for HT stamp)',
      '1 roll landscape weed fabric',
      'Heavy duty staple gun & 10mm staples',
      '120-grit sandpaper',
      'Organic potting soil & herb seedlings',
    ],
    instructions: [
      'Inspect pallet for HT (heat-treated) brand; avoid chemically fumigated (MB) pallets.',
      'Sand all exterior slats and edges thoroughly to prevent splinters.',
      'Fasten breathable landscape fabric across the back, sides, and bottom of each trough using staples spaced 2 inches apart.',
      'Fill each tier with nutrient-rich compost potting soil, packing gently.',
      'Plant herb starts closely together and water thoroughly until water trickles through drainage pores.',
    ],
    difficulty: 'Moderate',
    estimatedTime: '2 hrs',
    likesCount: 42,
    savesCount: 18,
    createdAt: '3 days ago',
  },
  {
    id: 'post-seed-2',
    authorId: 'usr-david',
    authorName: 'David Kim',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    authorTitle: 'Zero-Waste Designer',
    title: 'Zero-Waste Denim Studio Apron with Chest Pocket',
    description: 'Constructed a rugged workshop apron out of two pairs of worn-out denim jeans with shredded knees. Leveraged original back pockets for holding screwdrivers, pencils, and shears.',
    category: 'Clothing',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
    ],
    primaryImage: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    requiredMaterials: [
      '2 pairs of discarded denim jeans',
      'Heavy-duty polyester thread',
      'Fabric shears or rotary cutter',
      'Sewing machine or denim hand needle',
      'Cotton twill tape (optional for neck strap)',
    ],
    instructions: [
      'Cut off jean legs and slit the inner inseams flat to create large fabric panels.',
      'Trim main front bib and apron skirt to length, angling sides inward toward the chest.',
      'Topstitch the back pocket cut from the original jeans directly onto the center chest.',
      'Slice 2-inch wide vertical strips from leftover pant hems to construct durable neck and waist ties.',
      'Reinforce all strap connection points with square box-and-cross stitching for workshop longevity.',
    ],
    difficulty: 'Moderate',
    estimatedTime: '2.5 hrs',
    likesCount: 57,
    savesCount: 24,
    createdAt: '2 days ago',
  },
  {
    id: 'post-seed-3',
    authorId: 'usr-elena',
    authorName: 'Elena Rostova',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    authorTitle: 'Eco-Craft Enthusiast',
    title: 'Rustic Mason Jar Sconce Chandelier with Fairy Lights',
    description: 'Repurposed 3 salsa jars and an old oak floorboard offcut into a warm, battery-operated rustic wall sconce that creates a cosy reading ambiance without any electrical mains wiring.',
    category: 'Glass',
    images: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
    ],
    primaryImage: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
    requiredMaterials: [
      '3 cleaned glass food jars with lids',
      'Reclaimed hardwood plank (24 inches)',
      'Jute twine cord or iron pipe clamps',
      '3 sets of warm white LED micro fairy lights with timer',
      'Sawtooth picture hangers',
    ],
    instructions: [
      'Submerge jars in warm water and baking soda paste to dissolve label glue completely.',
      'Sand and oil the reclaimed wood plank to showcase its natural grain.',
      'Fasten iron pipe clamps or wrap jute twine tightly around jar necks and mount to wood backing.',
      'Coil fairy light strings into each jar and conceal small battery packs behind the board.',
      'Mount securely using wall anchors and set automatic 6-hour evening timer.',
    ],
    difficulty: 'Easy',
    estimatedTime: '1 hr',
    likesCount: 38,
    savesCount: 15,
    createdAt: '1 day ago',
  },
  {
    id: 'post-seed-4',
    authorId: 'usr-marcus',
    authorName: 'Marcus Chen',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    authorTitle: 'Hardware Hacker & Maker',
    title: 'Upcycled E-Waste Motherboard Desk Clock',
    description: 'Turned a fried computer motherboard from an old server chassis into a precision quartz desk clock. A geeky conversation piece that celebrates industrial tech aesthetics while diverting toxic e-waste.',
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    ],
    primaryImage: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    requiredMaterials: [
      'Decommissioned computer motherboard or graphics card',
      'High-torque quartz clock movement mechanism ($4 kit)',
      'Gold or contrasting clock hands',
      'Acrylic sheet stand or mini wooden easel',
    ],
    instructions: [
      'Clean motherboard with 99% isopropyl alcohol and soft antistatic brush.',
      'Locate center CPU socket area or drill a clean 5/16-inch hole using high-speed drill bit.',
      'Mount quartz movement shaft from the back and secure brass washer and hex nut.',
      'Press hour, minute, and second hands gently into place at the 12 o’clock orientation.',
      'Insert AA battery and stand upright on acrylic display easel.',
    ],
    difficulty: 'Easy',
    estimatedTime: '45 mins',
    likesCount: 63,
    savesCount: 31,
    createdAt: 'Yesterday',
  },
  {
    id: 'post-seed-5',
    authorId: 'usr-sarah',
    authorName: 'Sarah Jenkins',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    authorTitle: 'Sustainable Living Educator',
    title: 'Self-Watering Sub-Irrigated Herb Planters from PET Bottles',
    description: 'Made 6 self-watering seedling starters using clear plastic water bottles and natural cotton macrame wicks. Great educational STEM project to do with kids that saves countless hours of daily watering.',
    category: 'Plastic',
    images: [
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
    ],
    primaryImage: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
    requiredMaterials: [
      'Clean 1-liter or 2-liter clear plastic beverage bottles',
      'Cotton rope or candle wick (8 inches per planter)',
      'Sandpaper or masking tape for smooth rim edge',
      'Potting mix with vermiculite & basil/thyme seeds',
    ],
    instructions: [
      'Cut bottle horizontally into two parts roughly 4 inches from the base.',
      'Sand cut edges with 120-grit paper to remove any sharp plastic edge burrs.',
      'Pierce a 1/4-inch hole through the plastic cap and thread cotton wick through.',
      'Invert top funnel into the base water reservoir and fill top with moist potting soil.',
      'Pour water into base reservoir; capillary action draws moisture automatically up to plant roots.',
    ],
    difficulty: 'Easy',
    estimatedTime: '30 mins',
    likesCount: 29,
    savesCount: 12,
    createdAt: 'Today',
  },
];

/**
 * Local helper functions
 */
function getLocalCustomPosts(): CommunityPost[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_POSTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalCustomPosts(posts: CommunityPost[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_POSTS_KEY, JSON.stringify(posts));
  } catch (err) {
    console.warn('LocalStorage error:', err);
  }
}

export function getUserLikes(): string[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_LIKES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getUserSaves(): string[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_SAVES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * 1. Fetch Community Posts with filtering
 */
export async function getCommunityPosts(options?: {
  category?: string;
  myPostsOnly?: boolean;
  savedOnly?: boolean;
  searchQuery?: string;
  userId?: string;
}): Promise<CommunityPost[]> {
  let allPosts: CommunityPost[] = [];

  // 1. Try Supabase
  if (isSupabaseConfigured) {
    try {
      let query = supabase
        .from('community_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (options?.category && options.category !== 'All') {
        query = query.eq('category', options.category);
      }
      if (options?.myPostsOnly && options.userId) {
        query = query.eq('author_id', options.userId);
      }

      const { data, error } = await query;
      if (!error && data) {
        allPosts = data.map((item: any) => ({
          id: item.id,
          authorId: item.author_id,
          authorName: item.author_name,
          authorAvatar: item.author_avatar,
          authorTitle: item.author_title || 'Community Maker',
          title: item.title,
          description: item.description,
          category: item.category,
          images: item.images && item.images.length > 0 ? item.images : [item.primary_image],
          primaryImage: item.primary_image,
          requiredMaterials: item.required_materials || [],
          instructions: item.instructions || [],
          difficulty: item.difficulty || 'Moderate',
          estimatedTime: item.estimated_time || '1 hr',
          likesCount: Number(item.likes_count) || 0,
          savesCount: Number(item.saves_count) || 0,
          createdAt: new Date(item.created_at).toLocaleDateString(),
        }));
      }
    } catch (err) {
      console.warn('Supabase community posts query note:', err);
    }
  }

  // Fallback to local custom posts + initial seeds ONLY when !isSupabaseConfigured
  if (!isSupabaseConfigured) {
    const custom = getLocalCustomPosts();
    allPosts = [...custom, ...INITIAL_COMMUNITY_POSTS];
  }

  const userLikes = getUserLikes();
  const userSaves = getUserSaves();

  // Attach isLiked / isSaved flags
  allPosts = allPosts.map((p) => ({
    ...p,
    isLiked: userLikes.includes(p.id),
    isSaved: userSaves.includes(p.id),
  }));

  // Apply in-memory client filters
  return allPosts.filter((post) => {
    if (options?.category && options.category !== 'All' && post.category !== options.category) {
      return false;
    }
    if (options?.myPostsOnly && options.userId) {
      if (post.authorId !== options.userId && post.authorId !== 'demo-user-id') return false;
    }
    if (options?.savedOnly) {
      if (!userSaves.includes(post.id)) return false;
    }
    if (options?.searchQuery && options.searchQuery.trim()) {
      const q = options.searchQuery.toLowerCase().trim();
      const matchTitle = post.title.toLowerCase().includes(q);
      const matchDesc = post.description.toLowerCase().includes(q);
      const matchCat = String(post.category).toLowerCase().includes(q);
      const matchMat = post.requiredMaterials.some((m) => m.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchCat && !matchMat) return false;
    }
    return true;
  });
}

/**
 * 2. Fetch Single Post by ID
 */
export async function getCommunityPostById(id: string, userId?: string): Promise<CommunityPost | null> {
  const all = await getCommunityPosts({ userId });
  return all.find((p) => p.id === id) || null;
}

/**
 * 3. Create a New Community Project Post
 */
export async function createCommunityPost(
  input: CreatePostInput,
  user?: { id: string; fullName: string; avatarUrl?: string }
): Promise<CommunityPost> {
  const primaryImage = input.images[0] || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80';

  const newPost: CommunityPost = {
    id: `post-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    authorId: user?.id || 'demo-user-id',
    authorName: user?.fullName || 'Community Maker',
    authorAvatar: user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    authorTitle: 'Eco-Maker',
    title: input.title,
    description: input.description,
    category: input.category,
    images: input.images.length > 0 ? input.images : [primaryImage],
    primaryImage,
    requiredMaterials: input.requiredMaterials,
    instructions: input.instructions,
    difficulty: input.difficulty || 'Moderate',
    estimatedTime: input.estimatedTime || '1.5 hrs',
    likesCount: 1,
    savesCount: 0,
    isLiked: false,
    isSaved: false,
    createdAt: 'Just now',
  };

  // 1. Try Supabase
  if (isSupabaseConfigured && user?.id) {
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .insert({
          author_id: user.id,
          author_name: newPost.authorName,
          author_avatar: newPost.authorAvatar,
          author_title: newPost.authorTitle,
          title: newPost.title,
          description: newPost.description,
          category: String(newPost.category),
          images: newPost.images,
          primary_image: newPost.primaryImage,
          required_materials: newPost.requiredMaterials,
          instructions: newPost.instructions,
          difficulty: newPost.difficulty,
          estimated_time: newPost.estimatedTime,
        })
        .select()
        .single();

      if (!error && data) {
        newPost.id = data.id;
      }
    } catch (err) {
      console.warn('Supabase post insert note:', err);
    }
  }

  // 2. Persist locally
  const custom = getLocalCustomPosts();
  saveLocalCustomPosts([newPost, ...custom]);

  return newPost;
}

/**
 * 4. Update an existing post (Secure permissions: must be author)
 */
export async function updateCommunityPost(
  id: string,
  updates: Partial<CreatePostInput>,
  currentUserId?: string
): Promise<CommunityPost> {
  const custom = getLocalCustomPosts();
  const existingIdx = custom.findIndex((p) => p.id === id);

  let target: CommunityPost | null = null;
  if (existingIdx !== -1) {
    target = custom[existingIdx];
  } else {
    target = INITIAL_COMMUNITY_POSTS.find((p) => p.id === id) || null;
  }

  if (!target) {
    throw new Error('Post not found');
  }

  // Security check: Only author can edit
  if (currentUserId && target.authorId !== currentUserId && target.authorId !== 'demo-user-id') {
    throw new Error('Unauthorized: You can edit only your own posts.');
  }

  const updatedImages = updates.images && updates.images.length > 0 ? updates.images : target.images;
  const updatedPrimary = updatedImages[0] || target.primaryImage;

  const updatedPost: CommunityPost = {
    ...target,
    title: updates.title ?? target.title,
    description: updates.description ?? target.description,
    category: updates.category ?? target.category,
    images: updatedImages,
    primaryImage: updatedPrimary,
    requiredMaterials: updates.requiredMaterials ?? target.requiredMaterials,
    instructions: updates.instructions ?? target.instructions,
    difficulty: updates.difficulty ?? target.difficulty,
    estimatedTime: updates.estimatedTime ?? target.estimatedTime,
  };

  // 1. Try Supabase
  if (isSupabaseConfigured && currentUserId) {
    try {
      await supabase
        .from('community_posts')
        .update({
          title: updatedPost.title,
          description: updatedPost.description,
          category: String(updatedPost.category),
          images: updatedPost.images,
          primary_image: updatedPost.primaryImage,
          required_materials: updatedPost.requiredMaterials,
          instructions: updatedPost.instructions,
          difficulty: updatedPost.difficulty,
          estimated_time: updatedPost.estimatedTime,
        })
        .eq('id', id)
        .eq('author_id', currentUserId);
    } catch (err) {
      console.warn('Supabase post update note:', err);
    }
  }

  // 2. Persist locally
  if (existingIdx !== -1) {
    custom[existingIdx] = updatedPost;
    saveLocalCustomPosts(custom);
  } else {
    saveLocalCustomPosts([updatedPost, ...custom]);
  }

  return updatedPost;
}

/**
 * 5. Delete a post (Secure permissions: must be author)
 */
export async function deleteCommunityPost(id: string, currentUserId?: string): Promise<boolean> {
  const custom = getLocalCustomPosts();
  const existing = custom.find((p) => p.id === id) || INITIAL_COMMUNITY_POSTS.find((p) => p.id === id);

  if (existing && currentUserId && existing.authorId !== currentUserId && existing.authorId !== 'demo-user-id') {
    throw new Error('Unauthorized: You can delete only your own posts.');
  }

  if (isSupabaseConfigured && currentUserId) {
    try {
      await supabase
        .from('community_posts')
        .delete()
        .eq('id', id)
        .eq('author_id', currentUserId);
    } catch (err) {
      console.warn('Supabase post delete note:', err);
    }
  }

  const filtered = custom.filter((p) => p.id !== id);
  saveLocalCustomPosts(filtered);
  return true;
}

/**
 * 6. Toggle Like on a Post
 */
export async function toggleLikePost(
  postId: string,
  userId?: string
): Promise<{ isLiked: boolean; likesCount: number }> {
  const likes = getUserLikes();
  const isLiked = likes.includes(postId);
  const updatedLikes = isLiked ? likes.filter((id) => id !== postId) : [...likes, postId];

  localStorage.setItem(LOCAL_STORAGE_LIKES_KEY, JSON.stringify(updatedLikes));

  // Sync with Supabase
  if (isSupabaseConfigured && userId) {
    try {
      if (isLiked) {
        let { error } = await supabase
          .from('post_likes')
          .delete()
          .eq('user_id', userId)
          .eq('post_id', postId);
        if (error && error.code === '42P01') {
          await supabase.from('community_post_likes').delete().eq('user_id', userId).eq('post_id', postId);
        }
      } else {
        let { error } = await supabase
          .from('post_likes')
          .insert({ user_id: userId, post_id: postId });
        if (error && error.code === '42P01') {
          await supabase.from('community_post_likes').insert({ user_id: userId, post_id: postId });
        }
      }
    } catch (err) {
      console.warn('Supabase like sync note:', err);
    }
  }

  return { isLiked: !isLiked, likesCount: isLiked ? -1 : 1 };
}

/**
 * 7. Toggle Save / Bookmark on a Post
 */
export async function toggleSavePost(
  postId: string,
  userId?: string
): Promise<{ isSaved: boolean; savesCount: number }> {
  const saves = getUserSaves();
  const isSaved = saves.includes(postId);
  const updatedSaves = isSaved ? saves.filter((id) => id !== postId) : [...saves, postId];

  localStorage.setItem(LOCAL_STORAGE_SAVES_KEY, JSON.stringify(updatedSaves));

  // Sync with Supabase
  if (isSupabaseConfigured && userId) {
    try {
      if (isSaved) {
        let { error } = await supabase
          .from('saved_posts')
          .delete()
          .eq('user_id', userId)
          .eq('post_id', postId);
        if (error && error.code === '42P01') {
          await supabase.from('community_post_saves').delete().eq('user_id', userId).eq('post_id', postId);
        }
      } else {
        let { error } = await supabase
          .from('saved_posts')
          .insert({ user_id: userId, post_id: postId });
        if (error && error.code === '42P01') {
          await supabase.from('community_post_saves').insert({ user_id: userId, post_id: postId });
        }
      }
    } catch (err) {
      console.warn('Supabase save post sync note:', err);
    }
  }

  return { isSaved: !isSaved, savesCount: isSaved ? -1 : 1 };
}

/**
 * 8. Submit a Content Moderation Report
 */
export async function reportCommunityPost(
  input: CreatePostReportInput,
  reporterId?: string
): Promise<CommunityPostReport> {
  const report: CommunityPostReport = {
    id: `rep-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    postId: input.postId,
    postTitle: input.postTitle,
    reporterId,
    reason: input.reason,
    details: input.details,
    createdAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured) {
    try {
      await supabase.from('content_reports').insert({
        content_type: 'community_post',
        content_id: input.postId,
        content_title: input.postTitle,
        reporter_id: reporterId || null,
        reason: input.reason,
        details: input.details,
      });
    } catch (err) {
      console.warn('Supabase report insert note:', err);
    }
  }

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_REPORTS_KEY);
    const existing = raw ? JSON.parse(raw) : [];
    localStorage.setItem(LOCAL_STORAGE_REPORTS_KEY, JSON.stringify([report, ...existing]));
  } catch (err) {
    console.warn('LocalStorage report error:', err);
  }

  return report;
}

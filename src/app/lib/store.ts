// lib/store.ts
import create from "zustand";

type Post = {
  title: string;
  content: string;
  postId?: number;
  id?: number;
};

type PostStore = {
  posts: Post[];
  page: number;
  limit: number;
  count: number;
  setPosts: (posts: Post[]) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  fetchPosts: (page: number, limit: number) => Promise<void>;
  addPost: (post: Post) => Promise<void>;
  updatePost: (id: number, updatedPost: Post) => Promise<void>;
  deletePost: (id: number) => Promise<void>;
};
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
console.log("API_BASE_URL", API_BASE_URL);
export const usePostStore = create<PostStore>((set) => ({
  posts: [],
  page: 1,
  limit: 5, // Default limit per page
  count: 0,
  setPosts: (posts) => set({ posts }),
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit }),
  fetchPosts: async (page, limit) => {
    if (!API_BASE_URL) {
      console.error("API_BASE_URL is not defined");
      return;
    }
    const response = await fetch(
      `${API_BASE_URL}/dev/api/posts?page=${page}&limit=${limit}`
    );
    const data = await response.json();
    set({
      posts: data.data,
      count: data.count,
      page,
      limit,
    });
  },
  addPost: async (post) => {
    const response = await fetch(`${API_BASE_URL}/dev/api/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
    });
    const newPost = await response.json();
    set((state) => ({ posts: [newPost, ...state.posts] }));
  },
  updatePost: async (id, updatedPost) => {
    const response = await fetch(`${API_BASE_URL}/dev/api/posts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedPost),
    });
    const updatedData = await response.json();
    set((state) => ({
      posts: state.posts.map((post) =>
        post.postId === id ? updatedData : post
      ),
    }));
  },
  deletePost: async (id) => {
    await fetch(`${API_BASE_URL}/dev/api/posts/${id}`, {
      method: "DELETE",
    });
    set((state) => ({
      posts: state.posts.filter((post) => post.postId !== id),
    }));
  },
}));

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { SignInWithPasswordCredentials, SignUpWithPasswordCredentials } from "@supabase/supabase-js";
import { createClient } from "./server";
import { Post } from "@/types/post";

export async function signin(formData: SignInWithPasswordCredentials) {
  const supabase = createClient();
  // type-casting here for convenience
  // in practice, you should validate your inputs
  // const data = {
  //   email: formData.get('email') as string,
  //   password: formData.get('password') as string,
  // }

  const { error } = await supabase.auth.signInWithPassword(formData);

  if (error) {
    console.error("Sign Up Error:", error);

    throw new Error("로그인 중 오류가 발생했습니다.");
    // redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: SignUpWithPasswordCredentials) {
  const supabase = createClient();
  // }

  const { error } = await supabase.auth.signUp(formData);

  if (error) {
    console.error("Sign Up Error :", error);

    throw new Error("회원가입 중 오류가 발생했습니다.");
    // redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signout() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/");
}

// 현재 사용자 조회
export async function fetchCurrentUser() {
  const supabase = createClient();
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error || !user) {
    console.error(error);
    return null;
  }

  return user;
}

// post_id로 게시글 정보 조회
export async function getPostById(postId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("post_id, user_id, created_at, music_id, youtube_url, content")
    .eq("post_id", postId)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}

// MyComment
export async function fetchUserPostsByComment(): Promise<Post[]> {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) throw Error("로그인이 필요합니다.");

  const { data: userComments, error: commentsError } = await supabase
    .from("comments")
    .select("post_id")
    .eq("user_id", user.id);

  if (commentsError) throw Error("사용자가 작성한 댓글을 불러오는데 실패했습니다.");

  const postIds = userComments.map((comment) => comment.post_id);
  const { data: userPosts, error: postsError } = await supabase
    .from("posts")
    .select("*, profiles(nickname, profile_img)")
    .in("post_id", postIds);
  if (postsError) throw Error("댓글에 해당한 게시물을 불러오는데 실패했습니다.");

  return userPosts;
}

// 좋아요 목록 조회
export const fetchLikePosts = async () => {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) throw Error("로그인이 필요합니다.");

  const { data, error: likeListError } = await supabase.from("likes").select("post_id").eq("user_id", user.id);

  if (likeListError) throw Error("사용자의 좋아요 목록을 불러오는데 실패했습니다.");

  const postIds = data.map((comment) => comment.post_id);
  const { data: likePosts, error: likePostError } = await supabase
    .from("posts")
    .select("*, profiles(nickname, profile_img)")
    .in("post_id", postIds);

  if (likePostError) throw new Error("좋아요한 게시글을 불러오는데 실패했습니다.");

  return likePosts;
};

export const getPublicUrl = (name: string, path: string) => {
  const supabase = createClient();
  const {
    data: { publicUrl }
  } = supabase.storage.from(name).getPublicUrl(path);

  return publicUrl;
};

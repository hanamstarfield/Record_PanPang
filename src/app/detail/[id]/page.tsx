import { notFound } from "next/navigation";
import { fetchCurrentUser, getPostById } from "@/utils/supabase/server-actions";
import CommentSection from "@/components/features/comment/CommentSection";
import PostSection from "@/components/features/post/PostSection";

interface Props {
  params: { id: string };
}

const DetailIdPage = async ({ params }: Props) => {
  const post = await getPostById(params.id);
  const user = await fetchCurrentUser();

  if (!post) {
    return notFound(); // 게시글이 없으면 404 처리
  }

  return (
    <>
      <PostSection postId={params.id} user={user} />
      <div className="mt-6">
        <CommentSection postId={post.post_id} />
      </div>
    </>
  );
};

export default DetailIdPage;

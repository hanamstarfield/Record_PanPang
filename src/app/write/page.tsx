import PostForm from "@/components/features/post/PostForm";
import SpotifySearch from "@/components/features/spotifySearch/page";

const WritePage = () => {
  return (
    <div className="container mx-auto flex flex-col gap-5">
      <SpotifySearch />
      <PostForm />
    </div>
  );
};

export default WritePage;

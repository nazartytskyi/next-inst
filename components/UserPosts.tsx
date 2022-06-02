import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { Post as PostType, getPostFromData } from '../types/Post';
import Post from './Post';

const UserPosts: React.FunctionComponent<{ username: String }> = ({ username }) => {
  const [posts, setPosts] = useState<PostType[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'posts'), where('username', '==', username), orderBy('timestamp', 'desc')),
      (snapshot) => {
        console.log(snapshot.docs);
        console.log(username);
        setPosts(
          snapshot.docs.map((doc) =>
            getPostFromData(doc.get('username'), doc.get('avatar'), doc.get('image'), doc.get('caption'), doc.id)
          )
        );
      },
      (error) => {
        console.log(error);
      }
    );

    return unsubscribe;
  }, []);

  return (
    <div className='md:max-w-2xl xl:max-w-4xl mx-auto'>
      {posts.length != 0 ? (
        posts.map(
          (post) =>
            post.postImage && (
              <Post
                key={post.id}
                id={post.id}
                username={post.username}
                userImage={post.userImage}
                postImage={post.postImage}
                caption={post.caption}
              />
            )
        )
      ) : (
        <div className='flex flex-col items-center justify-center min-h-screen py-2 -mt-56 px-14 text-center'>
          <h1 className='text-lg font-bold mb-4'>This user hasn{"'"}t added any posts yet.</h1>
          <p className='text-sm'>
            Wait, perhaps <span className='font-bold'>{username}</span> will add his first post soon.
          </p>
        </div>
      )}
    </div>
  );
};

export default UserPosts;

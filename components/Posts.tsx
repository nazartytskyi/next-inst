import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { Post as PostType, getPostFromData } from '../types/Post';
import Post from './Post';

const Posts: React.FunctionComponent = () => {
  const [posts, setPosts] = useState<PostType[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(db, 'posts'), orderBy('timestamp', 'desc')), (snapshot) => {
      setPosts(
        snapshot.docs.map((doc) =>
          getPostFromData(doc.get('username'), doc.get('avatar'), doc.get('image'), doc.get('caption'), doc.id)
        )
      );
    });

    return unsubscribe;
  }, []);

  return (
    <div>
      {posts.map(
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
      )}
    </div>
  );
};

export default Posts;

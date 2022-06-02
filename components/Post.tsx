import Image from 'next/image';
import {
  BookmarkIcon,
  HeartIcon,
  ChatIcon,
  EmojiHappyIcon,
  PaperAirplaneIcon,
  DotsHorizontalIcon,
} from '@heroicons/react/outline';
import { HeartIcon as HeartIconFilled } from '@heroicons/react/solid';
import { Post } from '../types/Post';
import { useSession } from 'next-auth/react';
import { MouseEvent, useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Comment, getCommentFromData } from '../types/Comment';
import Moment from 'react-moment';
import { getLikeFromData, Like } from '../types/Like';
import { useRouter } from 'next/router';

const Post: React.FunctionComponent<Post> = ({ id, username, userImage, postImage, caption }) => {
  const { data: session } = useSession();
  const [isMenuShown, setMenuShown] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [likes, setLikes] = useState<Like[]>([]);
  const [hasLiked, setHasLiked] = useState(false);
  const router = useRouter();

  const sendComment = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const commentToSend = comment;
    setComment('');

    await addDoc(collection(db, 'posts', id!, 'comments'), {
      username: session?.user?.username,
      comment: commentToSend.trim(),
      avatar: session?.user?.image,
      timestamp: serverTimestamp(),
    });
  };

  const likePost = async () => {
    if (hasLiked) {
      await deleteDoc(doc(db, 'posts', id!, 'likes', session?.user?.uid!));
    } else {
      await setDoc(doc(db, 'posts', id!, 'likes', session?.user?.uid!), {
        username: session?.user?.username,
      });
    }
  };

  const deletePost = async () => {
    await deleteDoc(doc(db, 'posts', id!));
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'posts', id!, 'comments'), orderBy('timestamp', 'desc')),
      (snapshot) => {
        setComments(
          snapshot.docs.map((doc) =>
            getCommentFromData(
              doc.id,
              doc.get('username'),
              doc.get('avatar'),
              doc.get('comment'),
              doc.get('timestamp')?.toDate()
            )
          )
        );
      }
    );

    return unsubscribe;
  }, [db, id]);

  useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(db, 'posts', id!, 'likes')), (snapshot) => {
      setLikes(snapshot.docs.map((doc) => getLikeFromData(doc.id, doc.get('username'))));
    });

    return unsubscribe;
  }, [db, id]);

  useEffect(() => {
    setHasLiked(likes.findIndex((like) => like.id === session?.user?.uid) !== -1);
  }, [likes]);

  console.log(hasLiked);

  return (
    <div className='bg-white my-7 border rounded-sm'>
      {/* Header */}
      <div className='flex items-center p-5'>
        <div className='w-12 p-1 mr-3 cursor-pointer rounded-full border'>
          <Image
            className='rounded-full'
            width='1'
            height='1'
            onClick={() => router.push(`/${username}`)}
            src={userImage}
            layout='responsive'
            objectFit='cover'
            alt='Profile picture'
          />
        </div>
        <p onClick={() => router.push(`/${username}`)} className='flex-1 font-bold'>
          {username}
        </p>
        {session && session.user?.username == username && (
          <>
            <div className='relative inline-block text-left'>
              <DotsHorizontalIcon className='h-5 cursor-pointer' onClick={() => setMenuShown(!isMenuShown)} />

              <div
                className={`${
                  isMenuShown ? '' : 'hidden'
                } origin-top-right absolute z-10 right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none`}
                role='menu'
                aria-orientation='vertical'
                aria-labelledby='menu-button'
              >
                <div className='py-1' role='none'>
                  <div
                    className='text-gray-700 block px-4 py-2 text-sm cursor-pointer'
                    role='menuitem'
                    id='menu-item-0'
                    onClick={() => deletePost()}
                  >
                    Delete post
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Image */}
      <Image width='4' height='3' src={postImage} layout='responsive' objectFit='cover' alt='Post picture' />

      {/* Buttons */}
      {session && (
        <div className='flex justify-between p-4 pb-0'>
          <div className='flex space-x-4'>
            {hasLiked ? (
              <HeartIconFilled onClick={likePost} className='postButton text-red-500' />
            ) : (
              <HeartIcon onClick={likePost} className='postButton' />
            )}
            <ChatIcon className='postButton' />
            <PaperAirplaneIcon className='postButton' />
          </div>
          <BookmarkIcon className='postButton' />
        </div>
      )}

      {/* Captions */}
      <p className='p-5 truncate'>
        {likes.length > 0 && <p className='font-bold mb-1'>{likes.length} likes</p>}
        <span className='font-bold mr-2'>{username}</span>
        {caption}
      </p>

      {/* Comments */}
      {comments.length > 0 && (
        <div className='ml-10 h-min max-h-40 overflow-y-scroll scrollbar-thumb-black scrollbar-thin'>
          {comments.map((comment) => (
            <div key={comment.id} className='flex items-center space-x-2 mb-3'>
              <div className='w-7'>
                <Image
                  className='rounded-full'
                  width='1'
                  height='1'
                  onClick={() => router.push(`/${comment.username}`)}
                  src={comment.avatar}
                  layout='responsive'
                  objectFit='cover'
                  alt='Profile picture'
                />
              </div>
              <p className='text-sm flex-1'>
                <span className='font-bold' onClick={() => router.push(`/${comment.username}`)}>
                  {comment.username}
                </span>{' '}
                {comment.comment}
              </p>
              <Moment fromNow className='pr-5 text-sm'>
                {comment.time}
              </Moment>
            </div>
          ))}
        </div>
      )}

      {/* Input box */}
      {session && (
        <form className='flex items-center p-4'>
          <EmojiHappyIcon className='h-7' />
          <input
            placeholder='Add a comment...'
            type='text'
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className='border-none flex-1 focus:ring-0 outline-none'
          />
          <button
            type='submit'
            disabled={!comment.trim()}
            className='font-semibold text-blue-400'
            onClick={sendComment}
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
};

export default Post;

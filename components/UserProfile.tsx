import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { User } from '../types/User';

const UserProfile: React.FunctionComponent<User> = (user) => {
  const { data: session } = useSession();

  return (
    <div className='flex items-center justify-between md:max-w-xl xl:max-w-3xl mx-5 md:mx-auto mt-8 mb-14'>
      <div className='w-36 p-0.5 mt-cursor-pointer rounded-full border'>
        <Image
          className='rounded-full'
          width='1'
          height='1'
          src={user?.avatar}
          layout='responsive'
          objectFit='cover'
          alt='Profile picture'
        />
      </div>

      <div className='flex-1 mx-10'>
        <h2 className='font-thin text-2xl'>{user?.username}</h2>
        <h3 className='text-sm text-gray-400'>{user?.company}</h3>
        <h4 className='text-sm font-bold mt-4'>{user?.publications} publications</h4>
      </div>

      {session && session.user?.username == user.username && (
        <button className='text-sm text-blue-400 font-semibold' onClick={() => signOut()}>
          Sign Out
        </button>
      )}
    </div>
  );
};

export default UserProfile;

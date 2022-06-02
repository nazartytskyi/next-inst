import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';

const MiniProfile: React.FunctionComponent = () => {
  const { data: session } = useSession();

  return (
    <div className='flex items-center justify-between mt-14 ml-10'>
      <div className='w-16 p-0.5 mt-cursor-pointer rounded-full border'>
        <Image
          className='rounded-full'
          width='1'
          height='1'
          src={session?.user?.image!}
          layout='responsive'
          objectFit='cover'
          alt='Profile picture'
        />
      </div>

      <div className='flex-1 mx-4'>
        <h2 className='font-bold'>{session?.user?.username}</h2>
        <h3 className='text-sm text-gray-400'>Welcome to Instagram</h3>
      </div>

      <button className='text-sm text-blue-400 font-semibold' onClick={() => signOut()}>
        Sign Out
      </button>
    </div>
  );
};

export default MiniProfile;

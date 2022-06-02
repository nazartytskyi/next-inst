import Image from 'next/image';
import {
  SearchIcon,
  PlusCircleIcon,
  UserGroupIcon,
  HeartIcon,
  PaperAirplaneIcon,
  MenuIcon,
} from '@heroicons/react/outline';
import { HomeIcon } from '@heroicons/react/solid';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';
import { modalState } from '../atoms/modelAtom';

const Header: React.FunctionComponent = () => {
  const { data: session } = useSession();
  const [open, setOpen] = useRecoilState(modalState);
  const router = useRouter();

  return (
    <div className='shadow-sm border-b bg-white sticky top-0 z-50'>
      <div className='flex justify-between max-w-6xl mx-5 lg:mx-auto'>
        {/* Left - Instagram logo */}
        <div
          className='relative w-24 hidden lg:inline-grid flex-shrink-0 cursor-pointer'
          onClick={() => router.push('/')}
        >
          <Image src='https://links.papareact.com/ocw' layout='fill' objectFit='contain' alt='' />
        </div>

        <div
          className='relative w-10 inline-grid lg:hidden flex-shrink-0 cursor-pointer'
          onClick={() => router.push('/')}
        >
          <Image src='https://links.papareact.com/jjm' layout='fill' objectFit='contain' alt='' />
        </div>

        {/* Middle - Search input field */}
        <div className='max-w-xs'>
          <div className='relative mt-1 p-3 rounded-md'>
            <div className='absolute inset-y-0 pl-3 flex items-center pointer-events-none'>
              <SearchIcon className='h-5 w-5 text-gray-500' />
            </div>
            <input
              className='bg-gray-50 block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-black focus:border-black'
              type='text'
              placeholder='Search'
            />
          </div>
        </div>

        {/* Right */}
        <div className='flex items-center justify-end space-x-4'>
          <HomeIcon className='navigationButton' onClick={() => router.push('/')} />
          <MenuIcon className='h-6 md:hidden cursor-pointer' />

          {session ? (
            <>
              <div className='relative navigationButton'>
                <PaperAirplaneIcon className='navigationButton hover:scale-100' />
                <div className='absolute -top-1.5 -right-1.5 text-xs h-5 w-5 bg-red-500 rounded-full flex items-center justify-center animate-pulse text-white'>
                  3
                </div>
              </div>
              <PlusCircleIcon onClick={() => setOpen(true)} className='navigationButton' />
              <UserGroupIcon className='navigationButton' />
              <HeartIcon className='navigationButton' />

              <div className='relative w-10 inline-grid cursor-pointer'>
                <Image
                  className='rounded-full'
                  onClick={() => router.push(`/${session.user?.username}`)}
                  width='1'
                  height='1'
                  src={session.user?.image!}
                  layout='responsive'
                  objectFit='cover'
                  alt='Profile picture'
                />
              </div>
            </>
          ) : (
            <button onClick={() => signIn()}>Sign In</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;

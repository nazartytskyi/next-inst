import Image from 'next/image';
import { useRouter } from 'next/router';

const NotFound: React.FunctionComponent = () => {
  const router = useRouter();

  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2 -mt-56 px-14 text-center'>
      <div className='relative w-80'>
        <Image
          width='5'
          height='2'
          src='https://links.papareact.com/ocw'
          layout='responsive'
          objectFit='contain'
          alt=''
        />
      </div>
      <h1 className='text-lg font-bold mb-4'>Sorry, this page is not available.</h1>
      <p className='text-sm'>
        You may have used the wrong link or the page has been removed.
        <span className='ml-1 text-blue-400 cursor-pointer' onClick={() => router.push('/')}>
          Back to Instagram.
        </span>
      </p>
    </div>
  );
};

export default NotFound;

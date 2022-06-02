import Image from 'next/image';

const Story: React.FunctionComponent<{ username: string; avatar: string }> = (user) => {
  return (
    <div className='group cursor-pointer'>
      <div className='relative w-14 p-0.5 mb-1.5 rounded-full border-2 border-red-500 group-hover:scale-110 transition-all ease-out'>
        <Image
          className='rounded-full'
          width='1'
          height='1'
          src={user.avatar}
          alt=''
          layout='responsive'
          objectFit='contain'
        />
      </div>
      <p className='text-xs w-14 text-center truncate'>{user.username}</p>
    </div>
  );
};

export default Story;

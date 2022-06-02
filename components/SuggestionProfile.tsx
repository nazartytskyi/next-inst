import Image from 'next/image';

const SuggestionProfile: React.FunctionComponent<{ username: string; avatar: string; company: string }> = (user) => {
  return (
    <div className='flex items-center justify-between mt-3'>
      <div className='relative w-10 p-0.5 rounded-full border'>
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

      <div className='flex-1 mx-4'>
        <h2 className='font-semibold text-sm'>{user.username}</h2>
        <h3 className='text-xs text-gray-400'>Works at {user.company}</h3>
      </div>

      <button className='text-blue-400 text-xs font-semibold'>Follow</button>
    </div>
  );
};

export default SuggestionProfile;

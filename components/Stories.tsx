import { faker } from '@faker-js/faker';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { User, getUserFromData } from '../types/User';
import Story from './Story';

const Stories: React.FunctionComponent = () => {
  const { data: session } = useSession();
  const [suggestions, setSuggestions] = useState<User[]>([]);

  useEffect(() => {
    const suggestions = [...Array<User>(20)].map((_, i) => {
      return getUserFromData(faker.internet.userName(), faker.internet.avatar(), {
        id: i,
      });
    });

    setSuggestions(suggestions);
  }, []);

  return (
    <div className='flex space-x-2 p-6 mt-8 bg-white border border-gray-200 rounded-sm overflow-x-scroll scrollbar-thin scrollbar-thumb-black'>
      {session && <Story key={session.user?.uid} username={session.user?.username!} avatar={session.user?.image!} />}

      {suggestions.map((profile) => (
        <Story key={profile.id} username={profile.username} avatar={profile.avatar} />
      ))}
    </div>
  );
};

export default Stories;

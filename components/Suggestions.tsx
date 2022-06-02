import faker from '@faker-js/faker';
import { useEffect, useState } from 'react';
import { getUserFromData, User } from '../types/User';
import SuggestionProfile from './SuggestionProfile';

const Suggestions: React.FunctionComponent = () => {
  const [suggestions, setSuggestions] = useState<User[]>([]);

  useEffect(() => {
    const suggestions = [...Array<User>(5)].map((_, i) => {
      return getUserFromData(faker.internet.userName(), faker.internet.avatar(), {
        id: i,
        company: faker.company.companyName(),
      });
    });

    setSuggestions(suggestions);
  }, []);

  return (
    <div className='mt-4 ml-10'>
      <div className='flex justify-between text-sm mb-5'>
        <h3 className='font-bold text-gray-400'>Suggestions for you</h3>
        <button className='text-gray-600 font-semibold'>See All</button>
      </div>

      {suggestions.map((profile) => (
        <SuggestionProfile
          key={profile.id}
          username={profile.username}
          avatar={profile.avatar}
          company={profile.company!}
        />
      ))}
    </div>
  );
};

export default Suggestions;

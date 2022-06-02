import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { db } from '../../../firebase';

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    // ...add more providers here
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async session({ session, token, user }) {
      let userNotExist: boolean = true;
      let username = session!.user!.name!.split(' ').join('').toLocaleLowerCase();

      const users = await getDocs(collection(db, 'users'));

      users.docs.forEach((userDoc) => {
        const usernameDoc = userDoc.id;

        if (usernameDoc == username) {
          const user = userDoc.data();
          session!.user!.name = user.name;
          session!.user!.email = user.email;
          session!.user!.image = user.avatar;
          session!.user!.publications = user.publications;
          userNotExist = false;
        }
      });

      if (userNotExist) {
        await setDoc(doc(db, 'users', username), {
          name: session?.user?.name,
          avatar: session?.user?.image,
          email: session?.user?.email,
          publications: 0,
        });
      }

      session!.user!.publications = 0;
      session!.user!.username = username;
      session!.user!.uid = token.sub;

      return session;
    },
  },
  secret: process.env.SECRET,
});

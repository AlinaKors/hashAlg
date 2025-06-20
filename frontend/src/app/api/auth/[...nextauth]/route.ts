import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';

declare module 'next-auth' {
  interface Session {
    user: {
      id?: string | null;
      name?: string | null;
      email?: string | null;
      role: 'admin' | 'user';
    };
  }

  interface User {
    role?: 'admin' | 'user';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: 'admin' | 'user';
    id: string;
  }
}

const handler = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET!,
  callbacks: {
    async jwt({ token, user, account }) {
      if (user && account) {
        token.role = user.name === 'Alina' ? 'admin' : 'user';
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }

      return session;
    },
  },
  events: {
    async signIn({ user }) {
      try {
        await fetch('http://localhost:4000/api/audit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            action: 'USER_SIGNIN',
            name: user.name,
            email: user.email,
            role: user.name === 'Alina' ? 'admin' : 'user',
          }),
        });
      } catch (err) {
        console.error('Ошибка логирования входа:', err);
      }
    },
    async signOut({ token }) {
      try {
        await fetch('http://localhost:4000/api/audit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: token.sub,
            action: 'USER_SIGNOUT',
            name: token.name,
            email: token.email,
            role: token.role,
          }),
        });
      } catch (err) {
        console.error('Ошибка логирования выхода:', err);
      }
    },
  },
});

export { handler as GET, handler as POST };

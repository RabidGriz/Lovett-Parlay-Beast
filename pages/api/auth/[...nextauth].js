import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    Credentials({
      name: "Demo",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const users = [
          { id: "u1", email: process.env.DEMO_USER || "demo@lovett.ai", pass: process.env.DEMO_PASS || "demo123" },
          { id: "u2", email: process.env.DEMO2_USER || "friend@lovett.ai", pass: process.env.DEMO2_PASS || "friend123" }
        ];
        const u = users.find(x => x.email === credentials?.email && x.pass === credentials?.password);
        return u ? { id: u.id, name: u.email.split("@")[0], email: u.email } : null;
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  // pages: { signIn: "/api/auth/signin" } // optional; default is fine
  // remove custom redirect callback to avoid loops
};

export default NextAuth(authOptions);

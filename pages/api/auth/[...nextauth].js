import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export default NextAuth({
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
        const match = users.find(u => u.email === credentials?.email && u.pass === credentials?.password);
        return match ? { id: match.id, name: match.email.split("@")[0], email: match.email } : null;
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET
});

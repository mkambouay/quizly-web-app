import { authOptions } from "@/lib/nextauth";
import NextAuth from "next-auth";

// dentro de NextAuth es donde va toda la config que hicimos en nuestro authOptions en nextauth.ts
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

export async function getServerSideProps() {
  // Always land on the NextAuth sign-in page first
  return {
    redirect: { destination: "/api/auth/signin", permanent: false }
  };
}
export default function Index() { return null; }

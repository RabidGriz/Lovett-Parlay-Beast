export async function getServerSideProps() {
  return {
    redirect: { destination: "/api/auth/signin?callbackUrl=/dashboard", permanent: false }
  };
}
export default function Index(){ return null; }

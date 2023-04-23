import { useAuth, useUser } from "generated-wundergraph/nextjs";
import Container from "../components/Container";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Test from "../components/Test";

const Home = () => {
  const { data: user } = useUser();

  return (
    <Container title="Home | SwiftKeys">
      <main className="container relative mx-auto flex h-screen flex-col overflow-hidden px-4">
        <Navbar />
        {!user && <Hero />}
        {user && <Test />}
      </main>
    </Container>
  );
};

export default Home;

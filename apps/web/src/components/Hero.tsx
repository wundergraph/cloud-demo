import { AuthProviderId } from "generated-wundergraph/client";
import { useAuth } from "generated-wundergraph/nextjs";
import { FaGoogle } from "react-icons/fa";
import { Button } from "ui";

const Hero = () => {
  const { login } = useAuth();

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <h1 className="-mt-24 text-center text-5xl font-bold leading-[55px] text-white lg:text-7xl">
        Think you can type fast?
      </h1>

      <Button
        size="large"
        leftIcon={<FaGoogle />}
        className="mt-12"
        onClick={() => {
          login(AuthProviderId.github);
        }}
      >
        Login to start
      </Button>
    </div>
  );
};

export default Hero;

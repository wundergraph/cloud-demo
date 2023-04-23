import { useAuth, useUser } from "generated-wundergraph/nextjs";
import Link from "next/link";
import { useRouter } from "next/router";
import { IoMdStats } from "react-icons/io";
import Image from "next/image";
import { Button } from "ui";

const Navbar = () => {
  const { logout } = useAuth();
  const { data: user } = useUser();
  const { push, asPath } = useRouter();

  return (
    <div className="flex h-20 w-full items-center justify-between text-white lg:h-28">
      <Link href="/">
        <Image width={200} height={100} src="/logo.svg" alt="Home" />
      </Link>
      {user && (
        <div className="flex items-center gap-x-2 lg:gap-x-6">
          {asPath !== "/stats" && (
            <Button
              appearance="none"
              onClick={() => push("/stats")}
              leftIcon={<IoMdStats />}
              className="!px-3 text-lg font-semibold hover:bg-white hover:text-black"
            >
              Stats
            </Button>
          )}
          <Button appearance="outline" onClick={() => logout()}>
            Logout
          </Button>
        </div>
      )}
    </div>
  );
};

export default Navbar;

import { format } from "date-fns";
import { useQuery, useUser } from "generated-wundergraph";
import { GetStatsResponseData } from "generated-wundergraph/models";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ScreenState } from "ui";
import Container from "../components/Container";
import Navbar from "../components/Navbar";

const Stats = () => {
  const { data: user, isLoading: isUserLoading } = useUser();
  const { replace } = useRouter();

  useEffect(() => {
    if (!user && !isUserLoading) {
      replace("/");
    }
  }, [user, replace, isUserLoading]);

  const {
    data: result,
    mutate: refetch,
    error,
    isLoading,
  } = useQuery({
    operationName: "getStats",
  });

  const [stats, setStats] = useState<{
    fifteen?: GetStatsResponseData["db_groupByResults"][number];
    thirty?: GetStatsResponseData["db_groupByResults"][number];
    fortyFive?: GetStatsResponseData["db_groupByResults"][number];
    sixty?: GetStatsResponseData["db_groupByResults"][number];
  }>();

  const [results, setResults] = useState<
    GetStatsResponseData["db_findManyResults"]
  >([]);

  useEffect(() => {
    if (result) {
      setResults(result.db_findManyResults);
      setStats({
        fifteen: result.db_groupByResults.find((r) => r.time === 15),
        thirty: result.db_groupByResults.find((r) => r.time === 30),
        fortyFive: result.db_groupByResults.find((r) => r.time === 45),
        sixty: result.db_groupByResults.find((r) => r.time === 60),
      });
    }
  }, [result]);

  if (!user)
    return (
      <ScreenState
        loading={false}
        title="Unauthorized"
        subtitle="Redirecting you back home!"
      />
    );

  if (error)
    return (
      <ScreenState
        title="Error loading page"
        subtitle="Please try again"
        button="Retry"
        loading={false}
        onHandleClick={() => {
          refetch();
        }}
      />
    );

  if (isLoading) return <ScreenState title="Loading your stats" />;

  if (!stats || !results) return null;

  return (
    <Container title="Stats | SwiftKeys">
      <div className="container relative mx-auto h-full w-full overflow-x-hidden px-4 pb-12">
        <Navbar />
        <div className="flex flex-col gap-12 rounded-lg bg-zinc-700 px-6 py-8 xl:flex-row xl:items-center">
          <div className="flex items-center gap-x-6">
            <Image
              src={user.picture}
              alt={user.name}
              height={100}
              width={100}
              className="rounded-full"
            />
            <div>
              <h1 className="text-2xl font-bold text-white">{user.name}</h1>
              <p>
                Joined{" "}
                {format(
                  new Date((user as any).customClaims.createdAt),
                  "dd MMM yyyy"
                )}
              </p>
            </div>
          </div>
          <div className="grid w-full flex-1 grid-cols-2 items-center justify-between gap-y-8 gap-x-4 xl:flex">
            <div className="col-span-2 h-36 w-full rounded-lg bg-zinc-600 p-4 xl:w-64">
              <table className="table w-full table-fixed text-left">
                <thead>
                  <tr>
                    <th className="text-sm font-normal text-zinc-300">
                      highest wpm
                    </th>
                    <th className="text-sm font-normal text-zinc-300">
                      highest accuracy
                    </th>
                  </tr>
                </thead>
                <tbody className=" text-lg">
                  <tr>
                    <td>
                      {result.db_aggregateResults._max?.wpm?.toPrecision(2) ??
                        0}
                    </td>
                    <td>
                      {result.db_aggregateResults._max?.accuracy?.toFixed(2) ??
                        0}
                      %
                    </td>
                  </tr>
                </tbody>
                <thead>
                  <tr>
                    <th className="text-sm font-normal text-zinc-300">
                      avg wpm
                    </th>
                    <th className="text-sm font-normal text-zinc-300">
                      avg accuracy
                    </th>
                  </tr>
                </thead>
                <tbody className=" text-lg">
                  <tr>
                    <td>
                      {result.db_aggregateResults._avg?.wpm?.toPrecision(2) ??
                        0}
                    </td>
                    <td>
                      {result.db_aggregateResults._avg?.accuracy?.toFixed(2) ??
                        0}
                      %
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/* Other stats */}
            <div className="flex h-36 flex-1 flex-col gap-y-2 rounded-lg bg-zinc-600 p-4">
              <small className="text-zinc-300">
                15 seconds <br /> {stats.fifteen?._count._all ?? 0} tests
              </small>
              <h2 className="text-lg text-white">
                {stats.fifteen?._avg?.wpm?.toPrecision(2) ?? "-"}
              </h2>
              <h2 className="text-lg text-white">
                {stats.fifteen?._avg?.accuracy?.toFixed(2) ?? "-"}
                {stats.fifteen?._avg?.accuracy && "%"}
              </h2>
            </div>
            <div className="flex h-36 flex-1 flex-col gap-y-2 rounded-lg bg-zinc-600 p-4">
              <small className="text-zinc-300">
                30 seconds <br /> {stats.thirty?._count._all ?? 0} tests
              </small>
              <h2 className="text-lg text-white">
                {stats.thirty?._avg?.wpm?.toPrecision(2) ?? "-"}
              </h2>
              <h2 className="text-lg text-white">
                {stats.thirty?._avg?.accuracy?.toFixed(2) ?? "-"}
                {stats.thirty?._avg?.accuracy && "%"}
              </h2>
            </div>
            <div className="flex h-36 flex-1 flex-col gap-y-2 rounded-lg bg-zinc-600 p-4">
              <small className="text-zinc-300">
                45 seconds <br /> {stats.fortyFive?._count._all ?? 0} tests
              </small>
              <h2 className="text-lg text-white">
                {stats.fortyFive?._avg?.wpm?.toPrecision(2) ?? "-"}
              </h2>
              <h2 className="text-lg text-white">
                {stats.fortyFive?._avg?.accuracy?.toFixed(2) ?? "-"}
                {stats.fortyFive?._avg?.accuracy && "%"}
              </h2>
            </div>
            <div className="flex h-36 flex-1 flex-col gap-y-2 rounded-lg bg-zinc-600 p-4">
              <small className="text-zinc-300">
                60 seconds <br /> {stats.sixty?._count._all ?? 0} tests
              </small>
              <h2 className="text-lg text-white">
                {stats.sixty?._avg?.wpm?.toPrecision(2) ?? "-"}
              </h2>
              <h2 className="text-lg text-white">
                {stats.sixty?._avg?.accuracy?.toFixed(2) ?? "-"}
                {stats.sixty?._avg?.accuracy && "%"}
              </h2>
            </div>
          </div>
        </div>
        {/* History */}
        <div className="overflow-x-auto">
          <table className="mt-12 w-full table-auto text-left text-xs md:text-sm xl:text-base">
            <thead className="bg-zinc-800 uppercase text-zinc-400">
              <tr>
                <th scope="col" className="py-3 px-6">
                  WPM
                </th>
                <th scope="col" className="py-3 px-6">
                  Accuracy
                </th>
                <th scope="col" className="py-3 px-6">
                  Correct words
                </th>
                <th scope="col" className="py-3 px-6">
                  Wrong words
                </th>
                <th scope="col" className="py-3 px-6">
                  Duration
                </th>
                <th scope="col" className="py-3 px-6">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {results
                .filter((r) => r)
                .map(
                  ({ id, wpm, accuracy, correct, wrong, time, createdAt }) => {
                    return (
                      <tr className="w-full border-b border-zinc-500" key={id}>
                        <td className="py-4 px-6">{wpm}</td>
                        <td className="py-4 px-6">{accuracy}%</td>
                        <td className="py-4 px-6">{correct}</td>
                        <td className="py-4 px-6">{wrong}</td>
                        <td className="py-4 px-6">{time}s</td>
                        <td className="py-4 px-6">
                          {format(new Date(createdAt), "dd MMM yyyy")}
                        </td>
                      </tr>
                    );
                  }
                )}
            </tbody>
          </table>
        </div>
      </div>
    </Container>
  );
};

export default Stats;

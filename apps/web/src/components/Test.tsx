import { cx } from "@emotion/css";
import { useCallback, useEffect, useState } from "react";
import { FaSave, FaUndo } from "react-icons/fa";
import { MdSpaceBar } from "react-icons/md";
import { Button } from "ui";
import useCountdown from "../utils/useCountdown";
import { useMutation } from "generated-wundergraph/nextjs";
import randomWords from "random-words";
import { useRouter } from "next/router";

type History = {
  word: string;
  correct: boolean;
};

const Results = ({
  history,
  timer,
  init,
}: {
  history: History[];
  timer: number;
  init: () => void;
}) => {
  const { trigger, isMutating } = useMutation({
    operationName: "saveResult",
  });

  const { replace } = useRouter();

  const save = async () => {
    await trigger({
      accuracy:
        Math.round(
          (history.filter((h) => h.correct).length / history.length) * 100
        ) || 0,
      correct: history.filter((h) => h.correct).length,
      wpm: Math.round((history.filter((h) => h.correct).length / timer) * 60),
      wrong: history.filter((h) => !h.correct).length,
      time: timer,
    });
    replace("/stats");
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-y-12 overflow-x-hidden px-4">
      <div className="flex flex-col gap-y-6 border px-8 pb-12 pt-6">
        <h1 className="mx-auto -mt-10 w-max bg-zinc-900 px-4 text-2xl font-bold lg:m-0 lg:-mt-12 lg:text-4xl">
          Results
        </h1>
        <div className="flex items-center gap-x-12 lg:gap-x-24">
          {/* WPM */}
          <div className="flex flex-col items-start gap-y-2">
            <p className="text-lg font-bold text-gray-300 lg:text-2xl">wpm</p>
            <h2 className="text-4xl font-bold lg:text-7xl">
              {Math.round(
                (history.filter((h) => h.correct).length / timer) * 60
              )}
            </h2>
          </div>
          {/* Accuracy */}
          <div className="flex flex-col items-start gap-y-2">
            <p className="text-lg font-bold text-gray-300 lg:text-2xl">acc</p>
            <h2 className="text-4xl font-bold lg:text-7xl">
              {Math.round(
                (history.filter((h) => h.correct).length / history.length) * 100
              ) || 0}
              %
            </h2>
          </div>
          {/* Correct words */}
          <div className="flex flex-col items-start gap-y-2">
            <p className="text-lg font-bold text-gray-300 lg:text-2xl">
              correct
            </p>
            <h2 className="text-4xl font-bold lg:text-7xl">
              {history.filter((h) => h.correct).length}
            </h2>
          </div>
          {/* Wrong words */}
          <div className="flex flex-col items-start gap-y-2">
            <p className="text-lg font-bold text-gray-300 lg:text-2xl">wrong</p>
            <h2 className="text-4xl font-bold lg:text-7xl">
              {history.filter((h) => !h.correct).length}
            </h2>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-x-12 gap-y-4 md:flex-row">
        <Button
          loading={isMutating}
          leftIcon={<FaSave />}
          onClick={() => save()}
        >
          Save
        </Button>
        <Button
          className="mx-auto text-gray-400 hover:text-white"
          appearance="none"
          leftIcon={<FaUndo />}
          onClick={() => init()}
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

const Test = () => {
  const [error, setError] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentWordInput, setCurrentWordInput] = useState("");
  const [history, setHistory] = useState<History[]>([]);
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [timer, setTimer] = useState(30);
  const [snippet, setSnippet] = useState<string[]>([]);

  const { timeLeft, start, reset } = useCountdown(timer * 1000, 1000);

  const fetchSnippet = useCallback((wordCount: number) => {
    const words = randomWords(wordCount);
    setSnippet(words);
  }, []);

  const init = useCallback(async () => {
    try {
      setError(false);
      fetchSnippet(50);
      setCurrentWordInput("");
      setCurrentWordIndex(0);
      setHistory([]);
      setIsTestRunning(false);
      setShowResults(false);
      reset();
      document.getElementById("word-input")?.focus();
    } catch (e) {
      console.error(e);
      setError(true);
    }
  }, [fetchSnippet, reset]);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (timeLeft === 0) {
      setIsTestRunning(false);
      setShowResults(true);
    }
  }, [timeLeft]);

  document.getElementsByClassName("current-word")[0]?.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });

  if (showResults) {
    return <Results history={history} timer={timer} init={init} />;
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-y-4 ">
      {/* Snippet area */}
      {error ? (
        <div className="flex h-[215px] w-full flex-col items-center justify-center gap-y-4 rounded-lg border border-zinc-500">
          <h1 className="text-2xl font-bold text-gray-300">Error</h1>
          <p className="text-gray-300">
            An error occured while fetching the snippet. Please hit reset.
          </p>
        </div>
      ) : (
        <>
          <div
            id="snippet"
            className="relative flex h-[140px] w-full flex-wrap items-start overflow-hidden text-xl md:text-3xl"
          >
            {snippet.map((word, wi) => (
              <div
                className={cx("my-1 mr-1 rounded-sm px-1.5 py-px", {
                  "bg-zinc-700 transition-all": wi === currentWordIndex,
                  "bg-red-800":
                    wi === currentWordIndex &&
                    currentWordInput !== word &&
                    currentWordInput.length >= word.length,
                  "current-word": wi === currentWordIndex,
                })}
                key={word + wi}
              >
                {word.split("").map((letter, li) => (
                  <span
                    className={cx({
                      "text-gray-500": wi !== currentWordIndex,
                      "text-gray-300": wi === currentWordIndex,
                      "text-red-500":
                        wi < currentWordIndex && !history[wi]?.correct,
                      "!text-white":
                        wi < currentWordIndex && history[wi]?.correct,
                    })}
                    key={letter + li}
                  >
                    {letter}
                  </span>
                ))}
              </div>
            ))}
          </div>
          {/* Input */}
          <div className="flex w-full items-center rounded-md border border-gray-600 transition-colors focus-within:border-gray-300">
            <input
              id="word-input"
              autoComplete="off"
              autoFocus
              className="w-full bg-transparent px-4 py-2.5 text-xl focus:outline-none md:text-3xl"
              value={currentWordInput}
              onChange={(e) => {
                if (e.target.value !== " ") {
                  if (!isTestRunning) {
                    setIsTestRunning(true);
                    start(timer * 1000);
                  }
                  setCurrentWordInput(e.target.value);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === " " && currentWordInput.length > 0) {
                  setHistory([
                    ...history,
                    {
                      word: currentWordInput,
                      correct: currentWordInput === snippet[currentWordIndex],
                    },
                  ]);
                  setCurrentWordInput("");
                  setCurrentWordIndex(currentWordIndex + 1);
                }
              }}
            />
            {isTestRunning && (
              <p className="flex-shrink-0">{timeLeft / 1000 || "Time up!"}</p>
            )}
            <kbd className="mx-4 rounded-sm bg-gray-600 px-2 py-px">
              <MdSpaceBar className="h-6 w-6 md:h-9 md:w-9" />
            </kbd>
          </div>
        </>
      )}
      {/* Controls */}

      <div className="relative mt-12">
        <div className="flex flex-col items-start gap-y-4">
          <div className="flex w-[170px] gap-x-4 rounded-sm border border-zinc-500">
            <button
              type="button"
              className={cx("h-7 w-full rounded-sm text-white transition-all", {
                "bg-blue-700": timer === 15,
              })}
              onClick={() => setTimer(15)}
            >
              15
            </button>
            <button
              type="button"
              className={cx("h-7 w-full rounded-sm text-white transition-all", {
                "bg-blue-700": timer === 30,
              })}
              onClick={() => setTimer(30)}
            >
              30
            </button>
            <button
              type="button"
              className={cx("h-7 w-full rounded-sm text-white transition-all", {
                "bg-blue-700": timer === 45,
              })}
              onClick={() => setTimer(45)}
            >
              45
            </button>
            <button
              type="button"
              className={cx("h-7 w-full rounded-sm text-white transition-all", {
                "bg-blue-700": timer === 60,
              })}
              onClick={() => setTimer(60)}
            >
              60
            </button>
          </div>
        </div>
        <Button
          className="absolute left-0 right-0 mx-auto mt-8 text-gray-400 hover:text-white"
          appearance="none"
          leftIcon={<FaUndo />}
          onClick={() => init()}
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export default Test;

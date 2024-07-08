"use client";
import Header from "@/components/Header";
import BubbleChart from "@/components/BubbleChart";
import useLocalStorageData from "@/hooks/useLocalStorageData";
import useFetchData from "@/hooks/useFetchData";
import { useEffect, useState } from "react";
interface MainContentProps {
  params: {
    nickname: string;
    tag: string;
  };
}

export default function MainContent({ params }: MainContentProps) {
  const { getData, removeData } = useLocalStorageData();
  const [valuableChampions, setValuableChampions] = useState([]);
  const [errorDuringFetch, setErrorDuringFetch] = useState(false);
  useEffect(() => {
    const championsMastery = getData();
    console.log(championsMastery);
    if (!championsMastery) {
      setErrorDuringFetch(true);
    } else {
      setErrorDuringFetch(false);
      const filteredMastery = championsMastery
        .filter((el: any) => el.championPoints >= 12000)
        .map((el: any) => el);
      setValuableChampions(filteredMastery);
    }
  }, [params]);

  return (
    <>
      <Header initialNickname={params.nickname} initialTag={params.tag} />
      {errorDuringFetch ? (
        <>
          <p>ERROR</p>
          <span>
            Couldn't find summoner "{params.nickname.split("%20").join(" ")}"
            and tag #{params.tag}
          </span>
        </>
      ) : (
        <BubbleChart
          data={valuableChampions}
          nickname={params.nickname}
          tag={params.tag}
        />
      )}
    </>
  );
}

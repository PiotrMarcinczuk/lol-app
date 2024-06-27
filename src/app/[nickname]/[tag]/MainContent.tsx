"use client";
import Header from "@/components/Header";
import BubbleChart from "@/components/BubbleChart";
import useLocalStorageData from "@/hooks/useLocalStorageData";
import { useEffect } from "react";
export default function MainContent() {
  const { getData } = useLocalStorageData();
  let valuableChampions;

  useEffect(() => {
    const championsMastery = getData();

    valuableChampions = championsMastery
      .filter((el: any) => el.championPoints >= 30000)
      .map((el: any) => el);
    console.log(valuableChampions);
  });

  return (
    <>
      <Header /> <BubbleChart data={valuableChampions} />
    </>
  );
}

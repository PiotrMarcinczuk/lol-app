"use client";
import Header from "@/app/components/Header/Header";
import BubbleChart from "@/app/components/BubbleChart/BubbleChart";
import useLocalStorageData from "@/app/components/customHooks/useLocalStorageData";
import { useEffect } from "react";
export default function MainContent() {
  const { getData } = useLocalStorageData();
  let valuableChampions;

  const championsMastery = getData();

  valuableChampions = championsMastery
    .filter((el: any) => el.championPoints >= 20000)
    .map((el: any) => el);

  return (
    <>
      <Header /> <BubbleChart data={valuableChampions} />
    </>
  );
}

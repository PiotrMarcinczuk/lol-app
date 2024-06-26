"use client";
import axios from "axios";
import useLocalStorageData from "./useLocalStorageData";
import { http } from "../../config";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function useFetchData() {
  const router = useRouter();
  const [userData, setUserData] = useState({
    nickname: "",
    tag: "",
    puuid: "",
  });
  const { setData } = useLocalStorageData();

  const fetchAccessData = async (nickname: string, tag: string) => {
    axios
      .post(`${http}/getPuuid`, {
        nickname: nickname,
        tag: tag,
      })
      .then((response) => {
        console.log(response.data);
        setUserData({
          nickname: response.data.gameName,
          tag: response.data.tagLine,
          puuid: response.data.puuid,
        });
      })

      .catch((error) => {
        console.error("Error fetching data:", error);
        return;
      });
  };

  const fetchChampionMastery = async (puuid: string) => {
    axios
      .post(`${http}/getChampionMastery`, {
        puuid: puuid,
      })
      .then((response) => {
        router.refresh();
        setData(response);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        return;
      });
  };

  return {
    fetchAccessData,
    fetchChampionMastery,
    userData,
  };
}

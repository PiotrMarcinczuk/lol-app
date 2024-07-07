import axios from "axios";
import useLocalStorageData from "./useLocalStorageData";
import { http } from "../app/config";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function useFetchData() {
  const router = useRouter();
  const [userData, setUserData] = useState({
    nickname: localStorage.getItem("nickname") || "",
    tag: localStorage.getItem("tag") || "",
    puuid: "",
  });
  const { setData } = useLocalStorageData();

  const fetchAccessData = async (
    nickname: string,
    tag: string,
    setValidating: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    axios
      .post(`${http}/getPuuid`, {
        nickname: nickname,
        tag: tag,
      })
      .then((response) => {
        setUserData({
          nickname: response.data.gameName,
          tag: response.data.tagLine,
          puuid: response.data.puuid,
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        if (error.response.status === 403) setValidating(true);
        return;
      });
  };

  const fetchChampionMastery = async (puuid: string, region: string) => {
    axios
      .post(`${http}/getChampionMastery`, {
        puuid: puuid,
        region: region,
      })
      .then((response) => {
        router.refresh();
        console.log(response.data);
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

"use client";
import { useRef, useEffect } from "react";
import useFetchData from "../customHooks/useFetchData";
import styles from "./header.module.css";
import { useRouter } from "next/navigation";
export default function Header() {
  const router = useRouter();
  const searchedNick = useRef("");
  const searchedTag = useRef("");
  const { fetchAccessData, userData, fetchChampionMastery } = useFetchData();
  const { nickname, tag, puuid } = userData;

  useEffect(() => {
    if (!nickname || !tag || !puuid) return;
    fetchChampionMastery(puuid);
    router.push(`/${userData.nickname}/${userData.tag}`);
  }, [userData]);

  const handleNicknameInputChange = (e: any) => {
    searchedNick.current = e.target.value;
  };

  const handleTagInputChange = (e: any) => {
    searchedTag.current = e.target.value;
  };

  const handleClickLoop = () => {
    fetchAccessData(searchedNick.current, searchedTag.current);
  };

  const handleKeyDown = (e: any) => {
    if (e.key !== "Enter") return;
    fetchAccessData(searchedNick.current, searchedTag.current);
  };

  return (
    <div className={styles.header}>
      <div className={styles.search_container}>
        <input
          type="text"
          className={styles.search_input}
          onChange={handleNicknameInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Enter nickname"
        ></input>
        <input
          type="text"
          className={styles.search_input_tag}
          onChange={handleTagInputChange}
          onKeyDown={handleKeyDown}
          placeholder="#tag"
        ></input>
        <span
          onClick={handleClickLoop}
          className={`${styles.search_icon} material-symbols-outlined`}
        >
          search
        </span>
      </div>
    </div>
  );
}

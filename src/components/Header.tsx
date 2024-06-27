"use client";
import { useRef, useState, useEffect } from "react";
import useFetchData from "../hooks/useFetchData";
import styles from "./header.module.css";

export default function Header() {
  const searchedNick = useRef("");
  const searchedTag = useRef("");
  const [region, setRegion] = useState("EUNE");
  const [validating, setValidating] = useState(false);
  const { fetchAccessData, userData, fetchChampionMastery } = useFetchData();
  const { nickname, tag, puuid } = userData;

  useEffect(() => {
    if (!nickname || !tag || !puuid) return;
    fetchChampionMastery(puuid, region);
    // router.push({
    //   pathname: `/${nickname}/${tag}`,
    //   query: { nickname: nickname, tag: tag },
    // });
  }, [nickname, tag, puuid, region]);

  const handleNicknameInputChange = (e: any) => {
    searchedNick.current = e.target.value;
  };

  const handleTagInputChange = (e: any) => {
    searchedTag.current = e.target.value;
  };

  const handleClickLoop = () => {
    fetchAccessData(searchedNick.current, searchedTag.current, setValidating);
  };

  const handleKeyDown = (e: any) => {
    if (e.key !== "Enter") return;
    fetchAccessData(searchedNick.current, searchedTag.current, setValidating);
  };

  const handleChangeSelectInput = (e: any) => {
    setRegion(e.target.value);
  };

  return (
    <>
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
        <select onChange={handleChangeSelectInput} defaultValue={region}>
          <option value="EUNE">EUNE</option>
          <option value="EUW">EUW</option>
        </select>
      </div>
      {validating && (
        <span className={styles.validation}>
          User with this nickname or tag doesn't exist
        </span>
      )}
    </>
  );
}

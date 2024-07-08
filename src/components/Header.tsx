"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import useFetchData from "../hooks/useFetchData";
import styles from "./header.module.css";
import useLocalStorageData from "@/hooks/useLocalStorageData";
import { useRouter } from "next/navigation";

interface HeaderProps {
  initialNickname: string;
  initialTag: string;
}

export default function Header({ initialNickname, initialTag }: HeaderProps) {
  const [searchedNick, setSearchedNick] = useState("");
  const [searchedTag, setSearchedTag] = useState("");
  const { push } = useRouter();
  const [region, setRegion] = useState(() => {
    return localStorage.getItem("region") || "EUNE";
  });
  const [validating, setValidating] = useState(false);
  const { removeData } = useLocalStorageData();
  const { fetchAccessData, userData, fetchChampionMastery } = useFetchData();

  const { nickname, tag, puuid } = userData;

  useEffect(() => {
    removeData();
    if (!nickname || !tag || !puuid) {
      return;
    }

    fetchChampionMastery(puuid, region);
    console.log(nickname);
    console.log(region);
    push(`/${nickname}/${tag}`);
  }, [nickname, tag, puuid]);

  useEffect(() => {
    if (initialNickname && initialTag) {
      fetchAccessData(initialNickname, initialTag, setValidating);
      return;
    }
  }, [initialNickname, initialTag]);

  const handleNicknameInputChange = (e: any) => {
    setSearchedNick(e.target.value);
  };

  const handleTagInputChange = (e: any) => {
    setSearchedTag(e.target.value);
  };

  const handleClickLoop = () => {
    fetchAccessData(searchedNick, searchedTag, setValidating);
    push(`/${searchedNick}/${searchedTag}`);
    setSearchedNick("");
    setSearchedTag("");
  };

  const handleKeyDown = (e: any) => {
    if (e.key !== "Enter") return;
    fetchAccessData(searchedNick, searchedTag, setValidating);
    setSearchedNick("");
    setSearchedTag("");
    push(`/${searchedNick}/${searchedTag}`);
  };

  const handleChangeSelectInput = (e: any) => {
    setRegion(e.target.value);
    localStorage.setItem("region", e.target.value);
  };

  return (
    <>
      <Link href="/">
        <Image
          src={"/SznycLOL_logo.png"}
          alt="logo SznycLOL"
          className={styles.logo}
          width={54}
          height={54}
        />
      </Link>

      <div className={styles.header}>
        <div className={styles.search_container}>
          <input
            type="text"
            className={styles.search_input}
            onChange={handleNicknameInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Enter nickname"
            value={searchedNick}
          ></input>
          <input
            type="text"
            className={styles.search_input_tag}
            onChange={handleTagInputChange}
            onKeyDown={handleKeyDown}
            placeholder="#tag"
            value={searchedTag}
          ></input>
          <span
            onClick={handleClickLoop}
            className={`${styles.search_icon} material-symbols-outlined`}
          >
            search
          </span>
        </div>
        <select
          className={styles.select_region}
          onChange={handleChangeSelectInput}
          defaultValue={region}
        >
          <option value="EUNE">EUNE</option>
          <option value="EUW">EUW</option>
        </select>

        {nickname && tag && (
          <div className={styles.user_info}>
            <span>{nickname}</span>
            <br></br>
            <span className={styles.user_tag}>{` #${tag.toUpperCase()}`}</span>
          </div>
        )}
      </div>
      {validating && (
        <span className={styles.validation}>
          User with this nickname or tag doesn't exist
        </span>
      )}
    </>
  );
}

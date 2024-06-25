"use client";
import { useState, useRef } from "react";
import useFetchData from "../customHooks/useFetchData";
import useData from "../customHooks/useData";
import styles from "./header.module.css";
import LoopIconSVG from "../../../../public/search.svg";
export default function Header() {
  const searchedNick = useRef("");

  const handleInputChange = (e: any) => {
    searchedNick.current = e.target.value;
  };

  const handleClickLoop = () => {
    console.log(searchedNick);
    useFetchData(searchedNick.current, "HWDD");
  };

  const handleKeyDown = (e: any) => {
    console.log(e.key);
    if (e.key !== "Enter") return;
    console.log(searchedNick);
  };

  return (
    <div className={styles.header}>
      <div className={styles.search_container}>
        <input
          type="text"
          className={styles.search_input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Enter nickname"
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

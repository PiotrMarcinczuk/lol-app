import { useState, useRef, useEffect } from "react";

export default function useData(data: any) {
  const nicknameRef = useRef("");
  const puuidRef = useRef("");

  useEffect(() => {
    console.log(data);
    nicknameRef.current = data?.name;
    puuidRef.current = data?.puuid;
  }, [data]);
}

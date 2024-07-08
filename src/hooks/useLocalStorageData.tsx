export default function useLocalStorageData() {
  const setData = (response: any) => {
    console.log("set data");
    localStorage.setItem("championMastery", JSON.stringify(response.data));
  };

  const getData = () => {
    const result = localStorage.getItem("championMastery");
    if (result) {
      return JSON.parse(result);
    }
    return null;
  };

  const removeData = () => {
    localStorage.removeItem("championMastery");
  };

  const setUserInfo = (username: string, tag: string) => {
    localStorage.setItem("nickname", username);
    localStorage.setItem("tag", tag);
  };

  const getUserInfo = () => {
    let result = [];
    result.push(localStorage.getItem("nickname"));
    result.push(localStorage.getItem("tag"));
    return result;
  };

  return { setData, getData, setUserInfo, getUserInfo, removeData };
}

export default function useLocalStorageData() {
  const setData = (response: any) => {
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
  return { setData, getData, removeData };
}

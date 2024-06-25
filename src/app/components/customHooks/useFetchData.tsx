import { http } from "../../config";
export default function useFetchData(nickname: string, tag: string) {
  const fetchData = async () => {
    const apiKey = process.env.NEXT_PUBLIC_SZNYCLOL_API_KEY;
    try {
      const response = await http.get(
        `/riot/account/v1/accounts/by-riot-id/${nickname}/${tag}?api_key=${apiKey}`
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  fetchData();
}

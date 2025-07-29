
import { useEffect, useState } from "react"
import { fetchData } from "../utils"
import { Loader, Loader2 } from "lucide-react";

export default function Example() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    
    async function fetchDataFromBackend() {
      setLoading(true);
      try {
        const data = await fetchData('healthcheck');
        if (data && !ignore) {
          setData(data);
        }
      } catch (error) {
        if (!ignore) {
          setError(error.message || "Faild to fetch data");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchDataFromBackend();
    return () => {
      ignore = true;
    } 
  }, []);

  if (loading) {
    return <div className="min-h-screen min-w-full flex items-center content-center">
      <Loader />
    </div>
  }

  if (error) {
    return <div className="min-h-screen min-w-full flex items-center content-center">
    <h1 className="text-4xl">{error}</h1>
  </div>
  }

  return (
    <>
      {data ? <div className="min-h-screen min-w-full flex items-center content-center">
        <h1 className="text-4xl">{JSON.stringify(data)}</h1>
    </div> : null}
    </>
  )
}


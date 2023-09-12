import { useEffect, useState } from "react";
import COINS_JSON from "../json/mainnet.json";

const totalCoin = COINS_JSON.length;

export function useCoin(fetchDelay = 0) {
  const [items, setItems] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(0);

  const limit = 10;

  const loadCoin = async (currentOffset: number) => {
    setIsLoading(true);

    if (offset > 0) {
      await new Promise((resolve) => setTimeout(resolve, fetchDelay));
    }

    const data = COINS_JSON.slice(currentOffset, currentOffset + limit);

    setHasMore(items.length <= totalCoin);
    setItems((prevItems) => [...prevItems, ...data]);
    setIsLoading(false);
  };

  useEffect(() => {
    loadCoin(offset);
  }, []);

  const onLoadMore = () => {
    const newOffset = offset + limit;

    setOffset(newOffset);
    loadCoin(newOffset);
  };

  return {
    items,
    hasMore,
    isLoading,
    onLoadMore,
  };
}

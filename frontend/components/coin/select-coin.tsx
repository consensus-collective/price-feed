import { Select, Avatar, SelectItem } from "@nextui-org/react";
import { useInfiniteScroll } from "@nextui-org/use-infinite-scroll";
import { Coins } from ".";
import { useCoin } from "@/hooks/use-coin.hook";

interface IProps {
  coins: Coins;
  index: number;
  label: string;
  placeholder: string;
  onChangeCoin: (coins: Coins) => void;
  onOpen: (state: boolean, index: number) => void;
}

export default function SelectCoin(props: IProps) {
  const { index, coins, label, placeholder, onChangeCoin, onOpen } = props;

  const coin = coins[index];
  const selectedKeys = coin?.name ? [coin.name] : [];
  const disabledCoin = coins[index === 0 ? 1 : 0];
  const disabledKeys = disabledCoin?.name ? [disabledCoin?.name] : [];

  const { items, hasMore, isLoading, onLoadMore } = useCoin(500);

  const [, scrollerRef] = useInfiniteScroll({
    hasMore,
    isEnabled: coin.open,
    shouldUseLoader: false,
    onLoadMore,
  });

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    const otherIndex = index === 0 ? 1 : 0;
    const otherCoin = coins[otherIndex];

    if (value !== "" && otherCoin.name === value) {
      const newCoin = items.find((coin: any) => coin.name !== value);
      if (newCoin) {
        coins[otherIndex].name = newCoin.name;
        coins[otherIndex].logoURI = newCoin.logoURI;
      }
    }

    coins[index].name = value;

    onChangeCoin(coins);
  };

  return (
    <Select
      items={items}
      isOpen={coin.open}
      isLoading={isLoading}
      label={label}
      className={index === 0 ? "max-w-xs" : ""}
      placeholder={placeholder}
      onChange={onChange}
      scrollRef={scrollerRef}
      onClick={() => onOpen(!coin.open, index)}
      selectedKeys={selectedKeys}
      disabledKeys={disabledKeys}
      renderValue={(items) => {
        return items.map((item) => (
          <div key={item.key} className="flex items-center gap-2">
            <Avatar
              alt={item.data.name}
              className="w-6 h-6"
              src={item.data.logoURI}
            />
            <div className="flex flex-col">
              <span>{item.data.symbol}</span>
            </div>
          </div>
        ));
      }}
    >
      {(item) => (
        <SelectItem
          key={item.name}
          textValue={item.symbol}
          startContent={
            <Avatar alt={item.name} className="w-6 h-6" src={item.logoURI} />
          }
        >
          {item.symbol}
        </SelectItem>
      )}
    </Select>
  );
}

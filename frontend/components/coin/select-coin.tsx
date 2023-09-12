import { Select, Avatar, SelectItem } from "@nextui-org/react";
import { useInfiniteScroll } from "@nextui-org/use-infinite-scroll";
import { Coins, ICoin } from ".";
import { useCoin } from "@/hooks/use-coin.hook";

interface IProps {
  coins: Coins;
  index: number;
  label: string;
  placeholder: string;
  onSelectCoin: (coins: Coins) => void;
  onChangeCoin: (coins: Coins) => void;
  onOpen: (state: boolean, index: number) => void;
}

export default function SelectCoin(props: IProps) {
  const {
    index,
    coins,
    label,
    placeholder,
    onChangeCoin,
    onSelectCoin,
    onOpen,
  } = props;

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

  const onSelect = (coin: ICoin) => {
    coins[index].logoURI = coins[index].name !== "" ? coin.logoURI : "";
    onSelectCoin(coins);
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
      onOpenChange={() => onOpen(!coin.open, index)}
      selectedKeys={selectedKeys}
      disabledKeys={disabledKeys}
      startContent={
        coin.logoURI && (
          <Avatar alt={coin.name} className="w-6 h-6" src={coin.logoURI} />
        )
      }
    >
      {(item) => (
        <SelectItem
          key={item.name}
          textValue={item.symbol}
          onClick={() => onSelect(item as unknown as ICoin)}
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

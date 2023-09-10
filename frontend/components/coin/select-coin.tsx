import { Select, Avatar, SelectItem } from "@nextui-org/react";
import { Coins, ICoin } from ".";

interface IProps {
  coins: Coins;
  index: number;
  label: string;
  placeholder: string;
  onSelectCoin: (coins: Coins) => void;
  onChangeCoin: (coins: Coins) => void;
  onOpen: (state: boolean, index: number) => void;
}

const COINS = [
  {
    name: "BTC",
    url: "https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=026",
  },
  {
    name: "ETH",
    url: "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=026",
  },
];

export function SelectCoin(props: IProps) {
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

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    const otherIndex = index === 0 ? 1 : 0;
    const otherCoin = coins[otherIndex];

    if (value !== "" && otherCoin.name === value) {
      const newCoin = COINS.find((coin) => coin.name !== value);
      if (newCoin) {
        coins[otherIndex].name = newCoin.name;
        coins[otherIndex].url = newCoin.url;
      }
    }

    coins[index].name = value;

    onChangeCoin(coins);
  };

  const onSelect = (coin: ICoin) => {
    coins[index].url = coins[index].name !== "" ? coin.url : "";
    onSelectCoin(coins);
  };

  return (
    <Select
      isOpen={coin.open}
      label={label}
      className={index === 0 ? "max-w-xs" : ""}
      placeholder={placeholder}
      onChange={onChange}
      onClick={() => onOpen(!coin.open, index)}
      selectedKeys={selectedKeys}
      disabledKeys={disabledKeys}
      startContent={
        coin.url && (
          <Avatar alt={coin.name} className="w-6 h-6" src={coin.url} />
        )
      }
    >
      {COINS.map((coin) => (
        <SelectItem
          key={coin.name}
          textValue={coin.name}
          onClick={() => onSelect(coin as ICoin)}
          startContent={
            <Avatar alt={coin.name} className="w-6 h-6" src={coin.url} />
          }
        >
          {coin.name}
        </SelectItem>
      ))}
    </Select>
  );
}

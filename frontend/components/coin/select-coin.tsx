import { Select, Avatar, SelectItem } from "@nextui-org/react";
import { Coins, ICoin } from ".";
import COINS_JSON from "./mainnet.json";

interface IProps {
  coins: Coins;
  index: number;
  label: string;
  placeholder: string;
  onSelectCoin: (coins: Coins) => void;
  onChangeCoin: (coins: Coins) => void;
  onOpen: (state: boolean, index: number) => void;
}

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
      const newCoin = COINS_JSON.find((coin) => coin.name !== value);
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
      isOpen={coin.open}
      label={label}
      className={index === 0 ? "max-w-xs" : ""}
      placeholder={placeholder}
      onChange={onChange}
      onClick={() => onOpen(!coin.open, index)}
      selectedKeys={selectedKeys}
      disabledKeys={disabledKeys}
      startContent={
        coin.logoURI && (
          <Avatar alt={coin.name} className="w-6 h-6" src={coin.logoURI} />
        )
      }
    >
      {COINS_JSON.map((coin) => (
        <SelectItem
          key={coin.name}
          textValue={coin.symbol}
          onClick={() => onSelect(coin as unknown as ICoin)}
          startContent={
            <Avatar alt={coin.name} className="w-6 h-6" src={coin.logoURI} />
          }
        >
          {coin.symbol}
        </SelectItem>
      ))}
    </Select>
  );
}

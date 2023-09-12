import React, { MutableRefObject, useState } from "react";
import { ShowIf } from "../common/show-if";
import { Input, Button, Accordion, AccordionItem } from "@nextui-org/react";
import { useOutsideClick } from "@/hooks/use-outside-click.hook";
import dynamic from "next/dynamic";

const SelectCoin = dynamic(() => import("./select-coin"), { ssr: false });

export type Coins = [ICoin, ICoin];

export interface ICoin {
  open: boolean;
  name?: string;
  logoURI?: string;
}

const PRICE: Record<string, number> = {
  BTC: 25817.8,
  ETH: 1622.77,
};

const InitCoins = [{ open: false }, { open: false }] as Coins;
const InitAmounts = ["0", "0"] as [string, string];

export function Coin() {
  const [coins, setCoins] = useState(InitCoins);
  const [amounts, setAmounts] = useState(InitAmounts);
  const [infos, setInfos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const isSame = coins[0].name === coins[1].name;
  const isZero = Number(amounts[0]) <= 0;
  const isNotExist = !coins[0].name || !coins[1].name;
  const isDisable = isNotExist || isSame || isZero;

  const onClose = () => {
    setCoins((coins) => {
      coins.forEach((coin) => {
        coin.open = false;
      });

      return [...coins];
    });
  };

  const ref = useOutsideClick(onClose);

  const onChangeAmount = (value: string) => {
    const amount = validateNumber(value);
    if (!amount) {
      return;
    }

    amounts[0] = amount;
    setAmounts(() => [amounts[0], "0"]);
    setInfos([]);
  };

  const onGetPrice = () => {
    if (isNotExist) return;

    const [first, second] = coins;

    try {
      onSelectCoin(coins);
      setLoading(true);

      const ratio = PRICE[first.name as string] / PRICE[second.name as string];
      const price = Number(amounts[0]) * ratio;
      setAmounts((amounts) => [amounts[0], price.toFixed(5)]);
      setInfos([
        `1 ${second.name} = ${(1 / ratio).toFixed(5)} ${first.name}`,
        `1 ${first.name} = ${ratio.toFixed(5)} ${second.name}`,
      ]);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const onSelectCoin = (coins: Coins) => {
    setCoins(() => [
      { ...coins[0], open: false },
      { ...coins[1], open: false },
    ]);
  };

  const onSwitchCoin = () => {
    setInfos([]);
    setAmounts(() => [amounts[0], "0"]);
    onSelectCoin([coins[1], coins[0]]);
  };

  const onChangeCoin = (coins: Coins) => {
    setAmounts(() => ["0", "0"]);
    setInfos([]);
    onSelectCoin(coins);
  };

  const onOpen = (state: boolean, index: number) => {
    const otherIndex = index === 0 ? 1 : 0;
    coins[index].open = state;
    coins[otherIndex].open = false;
    setCoins(() => [...coins]);
  };

  const onSwap = () => {
    window.open("https://app.uniswap.org/#/swap");
  };

  return (
    <React.Fragment>
      <div
        ref={ref as MutableRefObject<HTMLDivElement>}
        className="flex flex-col gap-4 relative"
        onClick={() => onSelectCoin(coins)}
      >
        <div className=" flex flex-row gap-4">
          <SelectCoin
            index={0}
            coins={coins}
            label="From:"
            placeholder="Select coin"
            onOpen={onOpen}
            onChangeCoin={onChangeCoin}
          />
          <Input
            label="Amount"
            type="text"
            className="max-w-xs"
            value={amounts[0]}
            onValueChange={onChangeAmount}
          />
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 p-1 bg-white rounded-full">
          <Button
            onClick={onSwitchCoin}
            radius="full"
            variant="faded"
            color="warning"
            isIconOnly
          >
            <i className="bi bi-arrow-down-up" style={{ color: "black" }} />
          </Button>
        </div>
        <div className=" flex flex-row gap-4">
          <SelectCoin
            index={1}
            coins={coins}
            label="To:"
            placeholder="Select coin"
            onOpen={onOpen}
            onChangeCoin={onChangeCoin}
          />
        </div>
      </div>
      <Button
        color="primary"
        isLoading={loading}
        isDisabled={loading || isDisable}
        onClick={onGetPrice}
      >
        {loading ? "Loading..." : "Get Prices"}
      </Button>
      <ShowIf condition={Number(amounts[1]) > 0}>
        <Accordion variant="splitted">
          <AccordionItem
            key={1}
            title={
              <p style={{ fontSize: "15px", color: "rgba(1, 1, 1, 0.6)" }}>
                Price:
              </p>
            }
            subtitle={
              <p style={{ fontSize: "16px", color: "black" }}>
                {amounts[1]} {coins[1].name}
              </p>
            }
          >
            <hr style={{ marginBottom: "10px", color: "black" }} />
            {infos.map((info) => (
              <p
                key={info}
                style={{ fontSize: "13px", color: "rgba(1, 1, 1, 0.6)" }}
              >
                {info}
              </p>
            ))}
            <div
              className="flex flex-col gap-3 justify-around items-center"
              onMouseEnter={() => setDisabled(false)}
              onMouseLeave={() => setDisabled(true)}
            >
              <Button color="primary" isDisabled={disabled} onClick={onSwap}>
                Swap Token
              </Button>
            </div>
          </AccordionItem>
        </Accordion>
      </ShowIf>
    </React.Fragment>
  );
}

function validateNumber(value: string): string {
  const regex = new RegExp(/^\d*\.?\d*$/);
  if (!regex.exec(value)) {
    return "";
  }

  const values = value.split(".");
  if (values.length === 1) {
    return Number(values[0]).toString();
  }

  if (values[1] && values[1].length > 5) {
    return "";
  }

  return values.join(".");
}

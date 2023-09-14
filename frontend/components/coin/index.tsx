import React, { MutableRefObject, useState } from "react";
import { ShowIf } from "../common/show-if";
import { Input, Button, Accordion, AccordionItem } from "@nextui-org/react";
import { useOutsideClick } from "@/hooks/use-outside-click.hook";
import dynamic from "next/dynamic";
import { ROUTER_LIST, getTokenPrice } from "./price";
import { formatUnits, parseUnits } from "ethers";

const SelectCoin = dynamic(() => import("./select-coin"), { ssr: false });

export type Coins = [ICoin, ICoin];

export interface ICoin {
  open: boolean;
  symbol: string;
  address: string;
  decimals: number;
  name?: string;
  logoURI?: string;
}

const InitCoins = [{ open: false }, { open: false }] as Coins;
const InitAmounts = ["0"] as [string];

export function Coin() {
  const [coins, setCoins] = useState(InitCoins);
  const [amounts, setAmounts] = useState(InitAmounts);
  const [infos, setInfos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [prices, setPrices] = useState<string[]>([]);
  const [enabledButtons, setEnabledButtons] = useState(prices.map(() => false));

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
    setAmounts(() => [amounts[0]]);
    setInfos([]);
  };

  const getPriceFromRouter = async (routerAddress: string) => {
    if (isNotExist) return;

    const [first, second] = coins;

    try {
      const amountInBN = parseUnits(amounts[0], first.decimals);
      const price = formatUnits(
        await getTokenPrice(routerAddress, amountInBN, [
          first.address,
          second.address,
        ]),
        second.decimals,
      );

      return Number(price).toFixed(2);
    } catch {
      // ignore
    };
  };

  const onGetPrices = async () => {
    setLoading(true);

    const priceList = [];

    for (const router of ROUTER_LIST) {
      const price = await getPriceFromRouter(router.routerAddress);
      if (price !== undefined){
        priceList.push(price);
      } else {
        priceList.push("undefined");
      };
    }
    setPrices(priceList);
    setLoading(false);
  }

  const onSelectCoin = (coins: Coins) => {
    setCoins(() => [
      { ...coins[0], open: false },
      { ...coins[1], open: false },
    ]);
  };

  const onSwitchCoin = () => {
    setInfos([]);
    setAmounts(() => [amounts[0]]);
    onSelectCoin([coins[1], coins[0]]);
  };

  const onChangeCoin = (coins: Coins) => {
    setAmounts(() => ["0"]);
    setInfos([]);
    onSelectCoin(coins);
  };

  const onOpen = (state: boolean, index: number) => {
    const otherIndex = index === 0 ? 1 : 0;
    coins[index].open = state;
    coins[otherIndex].open = false;
    setCoins(() => [...coins]);
  };

  const onSwap = (link: string) => {
    window.open(link);
  };

  const handleMouseEnter = (index: number) => {
    const updatedEnabledButtons = [...enabledButtons];
    updatedEnabledButtons[index] = true;
    setEnabledButtons(updatedEnabledButtons);
  };

  const handleMouseLeave = (index: number) => {
    const updatedEnabledButtons = [...enabledButtons];
    updatedEnabledButtons[index] = false;
    setEnabledButtons(updatedEnabledButtons);
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
        onClick={onGetPrices}
      >
        {loading ? "Loading..." : "Get Prices"}
      </Button>
      <ShowIf condition={prices.length > 0}>
        {prices.map((price, index) => (
          <Accordion variant="splitted">
            <AccordionItem
              key={index}
              title={
                <p style={{ fontSize: "15px", color: "rgba(1, 1, 1, 0.6)" }}>
                  {ROUTER_LIST[index].name}: 
                </p>
              }
              subtitle={
                <p style={{ fontSize: "16px", color: "black" }}>
                  {price} {coins[1].symbol}
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
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={() => handleMouseLeave(index)}
              >
              <Button 
                color="primary" 
                isDisabled={!enabledButtons[index]} 
                onClick={() => onSwap(ROUTER_LIST[index].url)}
              >
                Swap Token
              </Button>
            </div>
          </AccordionItem>
        </Accordion>
        ))}
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

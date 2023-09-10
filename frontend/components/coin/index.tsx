import React, { useState } from "react";
import { ShowIf } from "../common/show-if";
import { Input, Button, Accordion, AccordionItem } from "@nextui-org/react";
import { SelectCoin } from "./select-coin";

export interface ICoin {
  name?: string;
  url?: string;
}

const PRICE: Record<string, number> = {
  BTC: 25817.8,
  ETH: 1622.77,
};

export function Coin() {
  const [loading, setLoading] = useState<boolean>(false);
  const [coins, setCoins] = useState<[ICoin, ICoin]>([{}, {}]);
  const [amounts, setAmounts] = useState<[string, string]>(["0", "0"]);
  const [infos, setInfos] = useState<string[]>([]);

  const isSame = coins[0].name === coins[1].name;
  const isZero = Number(amounts[0]) <= 0;
  const isExist = coins[0].name || coins[1].name;
  const isDisable = !isExist || isSame || isZero;

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
    if (!isExist) return;
    try {
      setLoading(true);

      const [first, second] = coins;
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

  const onSwitchCoin = () => {
    setCoins(() => [coins[1], coins[0]]);
    setInfos([]);
    setAmounts(() => [amounts[0], "0"]);
  };

  const onChangeCoin = (coins: [ICoin, ICoin]) => {
    setCoins(() => [...coins]);
    setAmounts(() => ["0", "0"]);
    setInfos([]);
  };

  const onSelectCoin = (coins: [ICoin, ICoin]) => {
    setCoins(() => [...coins]);
  };

  return (
    <React.Fragment>
      <div className="flex flex-col gap-4 relative">
        <div className=" flex flex-row gap-4">
          <SelectCoin
            index={0}
            coins={coins}
            label="From:"
            placeholder="Select coin"
            onChangeCoin={onChangeCoin}
            onSelectCoin={onSelectCoin}
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
            onChangeCoin={onChangeCoin}
            onSelectCoin={onSelectCoin}
          />
        </div>
      </div>
      <ShowIf condition={Number(amounts[1]) > 0}>
        <Accordion variant="splitted">
          <AccordionItem
            key={1}
            title="Price"
            subtitle={`${amounts[1]} ${coins[1].name}`}
          >
            <hr style={{ marginBottom: "10px" }} />
            {infos.map((info) => (
              <p style={{ fontSize: "13px", color: "rgba(1, 1, 1, 0.6)" }}>
                {info}
              </p>
            ))}
          </AccordionItem>
        </Accordion>
      </ShowIf>
      <Button
        color="primary"
        isLoading={loading}
        isDisabled={loading || isDisable}
        onClick={onGetPrice}
      >
        {loading ? "Loading..." : "Get Prices"}
      </Button>
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

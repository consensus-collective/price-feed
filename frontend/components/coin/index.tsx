import React, { useState } from "react";
import { ShowIf } from "../common/show-if";
import { Input, Button, Accordion, AccordionItem } from "@nextui-org/react";
import { SelectCoin } from "./select-coin";

export interface ICoin {
  name?: string;
  url?: string;
}

export function Coin() {
  const [loading, setLoading] = useState<boolean>(false);
  const [coins, setCoins] = useState<[ICoin, ICoin]>([{}, {}]);
  const [amounts, setAmounts] = useState<[string, string]>(["0", "0"]);
  const [info, setInfo] = useState<string>("");

  const isSame = coins[0].name === coins[1].name;
  const isZero = Number(amounts[0]) <= 0;
  const isExist = coins[0].name || coins[1].name
  const isDisable = !isExist || isSame || isZero;

  const onChangeAmount = (value: string) => {
    const amount = validateNumber(value);
    if (!amount) {
      return;
    }

    amounts[0] = amount;
    setAmounts(() => [amounts[0], "0"]);
    setInfo("");
  };

  const onGetPrice = () => {
    try {
      setLoading(true);

      const [first, second] = coins;
      console.log(first, second);
      const price = Number(amounts[0]) * 15.83;
      setInfo("1 ETH = 0.062979699 BTC");
      setAmounts((amounts) => [amounts[0], price.toString()]);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const onSwitchCoin = () => {
    setCoins(() => [coins[1], coins[0]]);

    if (Number(amounts[0]) > 0 && Number(amounts[1]) > 0) {
      setAmounts(() => [amounts[1], amounts[0]]);
    } else {
      setInfo("");
      setAmounts(() => ["0", "0"]);
    }
  };

  const onChangeCoin = (coins: [ICoin, ICoin]) => {
    setCoins(() => [...coins]);
    setAmounts(() => ["0", "0"]);
    setInfo("");
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
            {info}
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

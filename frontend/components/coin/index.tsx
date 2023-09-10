import React, { useState } from "react";
import { ShowIf } from "../common/show-if";
import { Select, SelectItem, Input, Button } from "@nextui-org/react";

const COINS = ["BTC", "ETH"];

export function Coin() {
  const [loading, setLoading] = useState<boolean>(false);
  const [coins, setCoins] = useState<[string, string]>(["", ""]);
  const [amounts, setAmounts] = useState<[string, string]>(["0", "0"]);
  const [info, setInfo] = useState<string>("");

  const isSame = coins[0] === coins[1];
  const isDisable = !coins[0] || !coins[1] || isSame || Number(amounts[0]) <= 0;

  const onChangeAmount = (value: string) => {
    const amount = validateNumber(value);
    if (!amount) {
      return;
    }

    amounts[0] = amount;
    setAmounts(() => [amounts[0], "0"]);
    setInfo("");
  };

  const onChangeCoin = (
    event: React.ChangeEvent<HTMLSelectElement>,
    index: number,
  ) => {
    const value = event.target.value;
    const otherIndex = index === 0 ? 1 : 0;
    const otherCoin = coins[otherIndex];

    if (value !== "" && otherCoin === value) {
      const newCoin = COINS.find((coin) => coin !== value);
      if (newCoin) coins[otherIndex] = newCoin;
    }

    coins[index] = value;
    setCoins(() => [...coins]);
    setAmounts(() => ["0", "0"]);
    setInfo("");
  };

  const onGetPrice = () => {
    try {
      setLoading(true);

      const [first, second] = coins;
      console.log(first, second);
      const price = Number(amounts[0]) * 15.83;
      amounts[1] = price.toString();
      setInfo("1 ETH = 0.062979699 BTC");
      setAmounts(() => [...amounts]);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const onSwitchCoin = () => {
    setCoins(() => [coins[1], coins[0]]);
    if (Number(amounts[0]) > 0 && Number(amounts[1]) > 0) {
      const tmpAmount = amounts[0];
      const tmpPrice = amounts[1];
      amounts[0] = tmpPrice;
      amounts[1] = tmpAmount;
      setAmounts(() => [...amounts]);
    } else {
      setInfo("");
      setAmounts(() => ["0", "0"]);
    }
  };

  return (
    <React.Fragment>
      <div className="flex flex-col gap-4 relative">
        <div className=" flex flex-row gap-4">
          <Select
            label="Coin"
            className="max-w-xs"
            placeholder="Select coin"
            onChange={(event) => onChangeCoin(event, 0)}
            selectedKeys={!coins[0] ? [] : [coins[0]]}
            disabledKeys={[coins[1]]}
          >
            {COINS.map((coin) => (
              <SelectItem key={coin} value={coin}>
                {coin}
              </SelectItem>
            ))}
          </Select>
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
            // className="align-center"
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
          <Select
            label="Coin"
            className="max-w-xs"
            placeholder="Select coin"
            onChange={(event) => onChangeCoin(event, 1)}
            selectedKeys={!coins[1] ? [] : [coins[1]]}
            disabledKeys={[coins[0]]}
          >
            {COINS.map((coin) => (
              <SelectItem key={coin} value={coin}>
                {coin}
              </SelectItem>
            ))}
          </Select>
          <Input
            label="Price"
            className="max-w-xs"
            type="text"
            value={amounts[1]}
            isDisabled
          />
        </div>
      </div>
      <ShowIf condition={info !== ""}>
        <Input type="text" value={info} disabled />
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

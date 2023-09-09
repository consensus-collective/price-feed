import React, { useState } from "react";
import { ShowIf } from "../common/show-if";

const COINS = ["BTC", "ETH"];

export function Coin() {
  const [loading, setLoading] = useState<boolean>(false);
  const [coins, setCoins] = useState<[string, string]>(["", ""]);
  const [amount, setAmount] = useState<string>("0");
  const [price, setPrice] = useState<string>("0");
  const [info, setInfo] = useState<string>("");

  const isSame = coins[0] === coins[1];
  const isDisable = !coins[0] || !coins[1] || isSame || Number(amount) <= 0;

  const reset = () => {
    setInfo("");
    setPrice("0");
  };

  const onChangeAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const amount = validateNumber(value);
    if (!amount) {
      return;
    }

    setAmount(amount);
    reset();
  };

  const onChangeCoin = (
    event: React.ChangeEvent<HTMLSelectElement>,
    index: number,
  ) => {
    const value = event.target.value;
    const otherIndex = index === 0 ? 1 : 0;
    const otherCoin = coins[otherIndex];

    if (otherCoin === value) {
      const newCoin = COINS.find((coin) => coin !== value);
      if (newCoin) coins[otherIndex] = newCoin;
    }

    coins[index] = value;
    setCoins(() => [...coins]);
    setAmount("0");
    reset();
  };

  const onGetPrice = () => {
    try {
      setLoading(true);

      const [first, second] = coins;
      console.log(first, second);
      const price = Number(amount) * 15.83;
      setInfo("1 ETH = 0.062979699 BTC");
      setPrice(price.toString());
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const onSwitchCoin = () => {
    setCoins(() => [coins[1], coins[0]]);
    reset();
    setAmount("0");
  };

  return (
    <React.Fragment>
      <div className="input-group">
        <select
          className="form-select"
          value={coins[0]}
          onChange={(event) => onChangeCoin(event, 0)}
        >
          <option disabled value="">
            Select coin...
          </option>
          {COINS.map((coin) => {
            return (
              <option key={coin} value={coin}>
                {coin}
              </option>
            );
          })}
        </select>
        <input
          type="text"
          className="form-control"
          placeholder="amount"
          onChange={onChangeAmount}
          value={amount}
          style={{ textAlign: "right" }}
        />
      </div>
      <div className="input-group">
        <select
          className="form-select"
          value={coins[1]}
          onChange={(event) => onChangeCoin(event, 1)}
        >
          <option disabled value="">
            Select coin...
          </option>
          {COINS.map((coin) => {
            return (
              <option key={coin} value={coin}>
                {coin}
              </option>
            );
          })}
        </select>
        <input
          type="text"
          className="form-control"
          placeholder="price"
          value={price}
          disabled
          style={{ textAlign: "right" }}
        />
      </div>
      <ShowIf condition={info !== ""}>
        <div className="input-group">
          <input type="text" className="form-control" value={info} disabled />
        </div>
      </ShowIf>
      <button
        disabled={loading || isDisable}
        className="btn btn-primary"
        type="button"
        onClick={onGetPrice}
      >
        Get Prices
      </button>
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

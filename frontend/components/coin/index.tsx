import React, { useState } from "react";
import { ShowIf } from "../common/show-if";

const COINS = ["BTC", "ETH"];

interface Coins {
  first: string;
  second: string;
}

export function Coin() {
  const [loading, setLoading] = useState<boolean>(false);
  const [coins, setCoins] = useState<Coins>({ first: "", second: "" });
  const [amount, setAmount] = useState<string>("0");
  const [price, setPrice] = useState<string>("0");
  const [disabled, setDisabled] = useState<boolean>(false);
  const [conversion, setConversion] = useState<string>("");

  const isDisable = !coins.first || !coins.second || Number(amount) <= 0;

  const onChangeAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const amount = validateNumber(value);
    if (!amount) {
      return;
    }

    setDisabled(false);
    setConversion("");
    setAmount(amount);
    setPrice("0");
  };

  const onChangeFirstCoin = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setDisabled(false);
    setConversion("");
    setPrice("0");
    setCoins((coin) => {
      if (coin.second !== value) {
        return {
          ...coin,
          first: value,
        };
      }

      const secondCoin = COINS.find((coin) => coin !== value) ?? "";
      return {
        first: value,
        second: secondCoin,
      };
    });
  };

  const onChangeSecondCoin = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setDisabled(false);
    setConversion("");
    setPrice("0");
    setCoins((coin) => ({ ...coin, second: value }));
  };

  const onGetPrice = () => {
    try {
      setLoading(true);

      const { first, second } = coins;
      console.log(first, second);
      const price = Number(amount) * 15.83;
      setConversion("1 ETH = 0.062979699 BTC");
      setPrice(price.toString());
      setDisabled(true);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <div className="input-group">
        <select
          className="form-select"
          value={coins.first}
          onChange={onChangeFirstCoin}
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
          value={coins.second}
          onChange={onChangeSecondCoin}
        >
          <option disabled value="">
            Select coin...
          </option>
          {COINS.map((coin) => {
            return (
              <option disabled={coins.first === coin} key={coin} value={coin}>
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
      <ShowIf condition={conversion !== ""}>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            value={conversion}
            disabled
          />
        </div>
      </ShowIf>
      <button
        disabled={loading || isDisable || disabled}
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

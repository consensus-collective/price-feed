import { Coin } from "../coin";

export function PriceFeed() {
  return (
    <div
      className="flex flex-col justify-around items-center"
      style={{ gap: "4rem", height: "550px" }}
    >
      <div className="flex flex-col items-center">
        <h1 style={{ fontSize: "64px" }}>Price Feed</h1>
        <h3 style={{ color: "rgba(1, 1, 1, 0.6)", fontSize: "1.75rem" }}>
          The ultimate solution to create web3 applications
        </h3>
      </div>

      <div
        className="flex flex-col gap-4 rounded p-5 shadow bg-white"
        style={{ width: "500px" }}
      >
        <Coin />
      </div>
    </div>
  );
}

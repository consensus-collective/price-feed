import { PublicClient, createPublicClient, http } from "viem";
import RouterAbi from "../../abis/IUniswapV2Router02.json";
import { BigNumberish } from "ethers";
import { mainnet } from "wagmi";

const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const USDT_ADDRESS = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

export const UNISWAP_V2 = {
  name: "Uniswap",
  routerAddress: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
  url: "https://app.uniswap.org/#/swap",
};

export const SUSHISWAP_V2 =  {
  name: "Sushi Swap",
  routerAddress: "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F",
  url: "https://www.sushi.com/swap"
};

export const PANCAKESWAP_V2 = {
  name: "Pancake Swap",
  routerAddress: "0xEfF92A263d31888d860bD50809A8D171709b7b1c",
  url: "https://pancakeswap.finance/swap?chain=eth"
};

export const ROUTER_LIST = [UNISWAP_V2, SUSHISWAP_V2, PANCAKESWAP_V2];

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http("https://rpc.ankr.com/eth"),
});

export async function getAmountsOut(
  routerAddress: string,
  amountIn: BigNumberish,
  path: any[],
): Promise<BigNumberish | undefined> {
  const data = await publicClient.readContract({
    address: routerAddress as `0x${string}`,
    abi: RouterAbi,
    functionName: "getAmountsOut",
    args: [amountIn, path],
  });

  try {
    if (Array.isArray(data)) {
      return data[data.length - 1] as BigNumberish;
    } else return data as BigNumberish;
  } catch {
    return undefined;
  }
}

export async function getTokenPrice(
  routerAddress: string,
  amountIn: BigNumberish,
  path: string[],
) {
  const bridgeTokens = [WETH_ADDRESS, USDC_ADDRESS, USDT_ADDRESS];
  const promises: any[] = [];
  promises.push(await getAmountsOut(routerAddress, amountIn, path));

  for (const bToken of bridgeTokens) {
    if (!path.includes(bToken)) {
      promises.push(
        await getAmountsOut(routerAddress, amountIn, [
          path[0],
          bToken,
          path[1],
        ]),
      );
    }
  }

  const prices = await Promise.all(promises);
  return prices.reduce((prev: BigNumberish, current: BigNumberish) =>
    prev > current ? prev : current,
  );
}

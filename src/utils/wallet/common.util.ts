// import { IMintListing } from '@/types/projects';
import { Big } from 'big.js';
import { IMintListing } from '@/types/projects';

const getExplorerUrl = (code: string, type: 'address' | 'tx'): string => {
  let url = `${import.meta.env.VITE_SOLANA_EXPLORER}/${type}/${code}`;
  if (import.meta.env.VITE_STAGE === 'test') {
    url += '?cluster=testnet';
  } else if (import.meta.env.VITE_STAGE === 'dev') {
    url += '?cluster=devnet';
  }
  return url;
};
const generateListingList = (
  list: IMintListing[],
  amount: number,
): { status: 'error' | 'success'; result: IMintListing[] } => {
  let currentAmount = Big(amount);
  const result: IMintListing[] = [];
  const availableTotal = list.reduce(
    (partialSum, info) => Big(partialSum).plus(Big(info.available)).toNumber(),
    0,
  );
  if (amount > availableTotal) {
    return {
      status: 'error',
      result,
    };
  }
  list.sort((a, b) => b.available - a.available);
  for (let i = 0; i < list.length; i++) {
    if (currentAmount.toNumber() <= 0) break;
    if (list[i].available > 0) {
      result.push({
        address: list[i].address,
        available: Big(
          currentAmount.toNumber() >= list[i].available
            ? list[i].available
            : currentAmount.toNumber(),
        )
          .plus(Big(list[i].delegated || 0))
          .toNumber(),
        real_available: Big(
          currentAmount.toNumber() >= list[i].available
            ? list[i].available
            : currentAmount.toNumber(),
        ).toNumber(),
        delegated: 0,
        total: 0,
      });
      currentAmount = currentAmount.plus(Big(-list[i].available));
    }
  }
  return {
    status: 'success',
    result,
  };
};

function getRandomU16() {
  const maxU16 = 65535;
  return Math.floor(Math.random() * (maxU16 + 1));
}

function splitArray<T = any>(arr: any[], len: number): T[][] {
  return arr.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / len);

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [];
    }

    resultArray[chunkIndex].push(item);

    return resultArray;
  }, []) as T[][];
}

export { getExplorerUrl, generateListingList, getRandomU16, splitArray };

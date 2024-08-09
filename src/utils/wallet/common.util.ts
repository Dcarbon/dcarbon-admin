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
  list.sort((a, b) => b.total - a.total);
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
export { getExplorerUrl, generateListingList };

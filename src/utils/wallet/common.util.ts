// import { IMintListing } from '@/types/projects';

const getExplorerUrl = (code: string, type: 'address' | 'tx'): string => {
  let url = `${import.meta.env.VITE_SOLANA_EXPLORER}/${type}/${code}`;
  if (import.meta.env.VITE_STAGE === 'test') {
    url += '?cluster=testnet';
  } else if (import.meta.env.VITE_STAGE === 'dev') {
    url += '?cluster=devnet';
  }
  return url;
};
// const generateListingList = (
//   list: IMintListing[],
//   amount: number,
// ): { status: 'error' | 'success'; result: IMintListing[] } => {
//   let currentAmount = amount;
//   const result: IMintListing[] = [];
//   const availableTotal = list.reduce(
//     (partialSum, history) => partialSum + Number(history.available || 0),
//     0,
//   );
//   if (amount > availableTotal) {
//     return {
//       status: 'error',
//       result,
//     };
//   }
//   list.sort((a, b) => b.total - a.total);
//   for (let i = 0; i < list.length; i++) {
//     if (currentAmount <= 0) break;
//     result.push({
//       address: list[i].address,
//       available:
//         currentAmount >= list[i].available ? list[i].available : currentAmount,
//       delegated: 0,
//       total: 0,
//     });
//     currentAmount -= list[i].available;
//   }
// };
export { getExplorerUrl };

const getExplorerUrl = (code: string, type: 'address' | 'tx'): string => {
  let url = `${import.meta.env.VITE_SOLANA_EXPLORER}/${type}/${code}`;
  if (import.meta.env.VITE_STAGE === 'test') {
    url += '?cluster=testnet';
  } else if (import.meta.env.VITE_STAGE === 'dev') {
    url += '?cluster=devnet';
  }
  return url;
};
export { getExplorerUrl };

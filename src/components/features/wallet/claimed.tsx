import { memo } from 'react';

import TransactionTable from './table';

const Claimed = memo(() => {
  const data = {} as TransactionPages;
  return <TransactionTable data={data as TransactionPages} />;
});
export default Claimed;

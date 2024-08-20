import { memo } from 'react';
import { getManagersCarbonList } from '@adapters/manager.ts';
import { DEFAULT_PAGING } from '@constants/common.constant.ts';
import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';
import CarbonScreen from '@components/features/wallet/carbon/carbon.screen.tsx';
import { QUERY_KEYS } from '@utils/constants';

const CarbonContainer = memo(() => {
  const { publicKey } = useWallet();
  const searchParams = useSearch({ from: '/_auth/wallet/' });
  const { data: carbonListResult, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.MANAGER.CARBON_LIST, publicKey, searchParams],
    queryFn: () => {
      return getManagersCarbonList({
        wallet: publicKey ? publicKey.toString() : '',
        page: searchParams.page,
        limit: searchParams.limit,
      });
    },
    enabled: !!publicKey && (!!searchParams.page || !!searchParams.limit),
  });
  return (
    <CarbonScreen
      loading={isLoading}
      searchParams={searchParams}
      claimInfo={carbonListResult?.data || []}
      paging={{
        page: carbonListResult?.paging?.page || DEFAULT_PAGING.page,
        total: carbonListResult?.paging?.total || 0,
        limit: carbonListResult?.paging?.limit || DEFAULT_PAGING.limit,
      }}
    />
  );
});
export default CarbonContainer;

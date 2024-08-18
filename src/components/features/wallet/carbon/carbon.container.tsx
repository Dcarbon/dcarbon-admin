import { memo, useEffect, useState } from 'react';
import { DEFAULT_PAGING } from '@constants/common.constant.ts';
import { CARBON_IDL } from '@contracts/carbon/carbon.idl.ts';
import { PublicKey } from '@solana/web3.js';
import { useSearch } from '@tanstack/react-router';
import bs58 from 'bs58';
import CarbonScreen from '@components/features/wallet/carbon/carbon.screen.tsx';
import { customPaging, getProgram } from '@utils/wallet';

interface ICarbonClaimState {
  page: number;
  total: number;
  limit: number;
  data: ICarbonClaimInfo[];
}

const CarbonContainer = memo(() => {
  const [claimInfo, setClaimInfo] = useState<ICarbonClaimState>();
  const [loading, setLoading] = useState(false);
  const searchParams = useSearch({ from: '/_auth/wallet/' });

  const getListCarbonForClaim = async () => {
    try {
      setLoading(true);
      const { connection, program } = getProgram();
      const accounts = await connection.getProgramAccounts(program.programId, {
        filters: [
          {
            memcmp: {
              offset: 0,
              bytes: bs58.encode(
                CARBON_IDL?.accounts.find(
                  (acc: { name: string; discriminator: number[] }) =>
                    acc.name === 'Claim',
                )?.discriminator as number[],
              ),
            },
          },
        ],
      });
      const { data, page, total, limit } = customPaging<any>(
        accounts as any,
        searchParams.page,
      );
      const claimInfo: ICarbonClaimInfo[] = [];
      data.forEach((acc: any) => {
        if (acc.account.data) {
          const isClaimedBuff = (acc.account.data as Buffer).subarray(8, 8 + 1);
          const isClaimed = Array.from(isClaimedBuff).map(
            (byte) => byte === 1,
          )[0];
          const mint = (acc.account.data as Buffer).subarray(8 + 1, 8 + 1 + 32);
          const amount = (acc.account.data as Buffer)
            .subarray(8 + 1 + 32, 8 + 1 + 32 + 8)
            .readDoubleLE();
          const projectId = (acc.account.data as Buffer)
            .subarray(8 + 1 + 32 + 8, 8 + 1 + 32 + 8 + 2)
            .readInt16LE();
          claimInfo.push({
            isClaimed,
            mint: new PublicKey(mint).toString(),
            amount,
            projectId,
          });
        }
      });
      setClaimInfo({
        total,
        page,
        limit,
        data: claimInfo,
      });
    } catch (e) {
      //
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getListCarbonForClaim().then();
  }, [searchParams.page]);
  return (
    <CarbonScreen
      loading={loading}
      searchParams={searchParams}
      claimInfo={claimInfo?.data || []}
      paging={{
        page: claimInfo?.page || 1,
        total: claimInfo?.total || 0,
        limit: claimInfo?.limit || DEFAULT_PAGING.limit,
      }}
    />
  );
});
export default CarbonContainer;

import { useEffect, useState } from 'react';
import { carbonForListing, getDashBoardProject } from '@/adapters/project';
import { QUERY_KEYS } from '@/utils/constants';
import { getSplToken } from '@adapters/config.ts';
import Icon, { ExclamationCircleOutlined } from '@ant-design/icons';
import { CARBON_IDL } from '@contracts/carbon/carbon.idl.ts';
import SellIcon from '@icons/sell.icon.tsx';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { Empty, Flex, Row, Tooltip } from 'antd';
import bs58 from 'bs58';
import SubmitButton from '@components/common/button/submit-button.tsx';
import ListingForm from '@components/features/project/dashboard/listing-modal.tsx';
import { truncateText, u16ToBytes } from '@utils/helpers';
import { getProgram } from '@utils/wallet';

import AnalyticsCard from '../analytics-card';
import TotalOutputCard from '../total-output-card';

const SellIc = () => (
  <Icon size={20} component={() => <SellIcon size={20} />} />
);

const ProjectDashboard = () => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [visible, setVisible] = useState(false);
  const [ownerWallet, setOwnerWallet] = useState('');
  const param = useParams({
    from: '/_auth/project/$slug',
    select: (params) => ({ id: params.slug }),
  });
  const { data } = useQuery({
    queryKey: [QUERY_KEYS.GET_PROJECT_DASHBOARD, param.id],
    queryFn: () => getDashBoardProject(param.id),
  });
  const { data: splTokenList } = useQuery({
    queryKey: [QUERY_KEYS.CONFIG.SPL_TOKEN],
    queryFn: () => getSplToken(),
  });
  const { data: carbonForList, refetch } = useQuery({
    queryKey: [QUERY_KEYS.PROJECT.CARBON_FOR_LISTING, param.id, ownerWallet],
    queryFn: () => carbonForListing(param.id, ownerWallet || undefined),
    enabled: !!ownerWallet,
  });
  const projectOwnerWallet = async () => {
    const program = getProgram(connection);
    const accounts = await connection.getProgramAccounts(program.programId, {
      dataSlice: { offset: 0, length: 0 },
      filters: [
        {
          memcmp: {
            offset: 0,
            bytes: bs58.encode(
              CARBON_IDL?.accounts.find(
                (acc: { name: string; discriminator: number[] }) =>
                  acc.name === 'Device',
              )?.discriminator as number[],
            ),
          },
        },
        {
          memcmp: {
            offset: 8 + 2 + 2,
            bytes: bs58.encode(u16ToBytes(Number(param.id))),
          },
        },
      ],
    });
    if (accounts?.length > 0) {
      const data = await program.account.device.fetch(accounts[0].pubkey);
      if (data) {
        setOwnerWallet(data.owner?.toString());
      }
    }
  };
  useEffect(() => {
    projectOwnerWallet().then();
  }, [publicKey]);

  const availableCarbon = carbonForList
    ? carbonForList.mints?.reduce(
        (partialSum, history) => partialSum + Number(history.available || 0),
        0,
      )
    : 0;
  return (
    <Flex vertical gap={10}>
      <ListingForm
        visible={visible}
        carbonForList={carbonForList}
        splTokenList={splTokenList}
        setVisible={setVisible}
        refetch={refetch}
        availableCarbon={availableCarbon}
        projectId={param.id}
      />
      <Flex justify="end">
        {ownerWallet && (!publicKey || ownerWallet !== publicKey.toString()) ? (
          <Tooltip
            title={<span>Connect wallet {truncateText(ownerWallet)}</span>}
          >
            <SubmitButton
              icon={<ExclamationCircleOutlined />}
              disabled={!publicKey || ownerWallet !== publicKey.toString()}
              onClick={() => setVisible(true)}
            >
              Listing
            </SubmitButton>{' '}
          </Tooltip>
        ) : (
          <SubmitButton
            icon={<SellIc />}
            disabled={
              !publicKey || ownerWallet !== publicKey.toString() || !ownerWallet
            }
            onClick={() => setVisible(true)}
          >
            Listing
          </SubmitButton>
        )}
      </Flex>
      {data ? (
        <>
          <Row gutter={[16, 16]} className="project-dashboard">
            <TotalOutputCard
              data={data.carbon_credit.minted}
              title="Total carbon minted"
              img="/image/dashboard/total-minted.svg"
            />
            <TotalOutputCard
              data={data.carbon_credit.sold}
              title="Totalcarbon sold"
              img="/image/dashboard/total-carbon-sold.svg"
            />
            <AnalyticsCard
              data={availableCarbon}
              currency={'CARBON'}
              title="Total crypto available"
              img="/image/dashboard/crypto.webp"
            />
          </Row>
          <Row gutter={[16, 16]} className="project-dashboard">
            <AnalyticsCard
              data={data.aggregation.cost.amount}
              currency={data.aggregation.cost.currency}
              title="Total cost"
              img="/image/dashboard/total-cost.webp"
            />
            <AnalyticsCard
              data={data.aggregation.assets_total}
              title="Total assets available"
              img="/image/dashboard/total-assets.webp"
            />
            <AnalyticsCard
              data={
                carbonForList
                  ? carbonForList.mints.reduce(
                      (partialSum, history) =>
                        partialSum + Number(history.delegated || 0),
                      0,
                    )
                  : 0
              }
              currency={'CARBON'}
              title="Total crypto listing"
              img="/image/dashboard/crypto-market.webp"
            />
          </Row>
        </>
      ) : (
        <Empty />
      )}
    </Flex>
  );
};

export default ProjectDashboard;

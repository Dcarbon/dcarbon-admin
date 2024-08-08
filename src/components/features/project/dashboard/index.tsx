import { useEffect, useState } from 'react';
import { carbonForListing, getDashBoardProject } from '@/adapters/project';
import { QUERY_KEYS } from '@/utils/constants';
import { getSplToken } from '@adapters/config.ts';
import Icon from '@ant-design/icons';
import SellIcon from '@icons/sell.icon.tsx';
import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { Empty, Flex, Row } from 'antd';
import SubmitButton from '@components/common/button/submit-button.tsx';
import ListingForm from '@components/features/project/dashboard/listing-modal.tsx';

import AnalyticsCard from '../analytics-card';
import TotalOutputCard from '../total-output-card';

const SellIc = () => (
  <Icon size={20} component={() => <SellIcon size={20} />} />
);

const ProjectDashboard = () => {
  const { publicKey } = useWallet();
  const [visible, setVisible] = useState(false);
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
    queryKey: [QUERY_KEYS.PROJECT.CARBON_FOR_LISTING, param.id],
    queryFn: () =>
      carbonForListing(param.id, publicKey?.toString() || undefined),
    enabled: !!publicKey,
  });
  useEffect(() => {
    refetch().then();
  }, [publicKey]);
  return (
    <Flex vertical gap={10}>
      <ListingForm
        visible={visible}
        carbonForList={carbonForList}
        splTokenList={splTokenList}
        setVisible={setVisible}
        refetch={refetch}
      />
      <Flex justify="end">
        <SubmitButton icon={<SellIc />} onClick={() => setVisible(true)}>
          Listing
        </SubmitButton>
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
              data={
                carbonForList
                  ? carbonForList.mints?.reduce(
                      (partialSum, history) =>
                        partialSum + Number(history.available || 0),
                      0,
                    )
                  : 0
              }
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

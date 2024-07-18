import { Col, Row } from 'antd';
import CenterContentLayout from '@components/common/layout/center-content/center-content.layout.tsx';
import DcarbonContainer from '@components/features/contract/fungible-token/dcarbon/dcarbon.container.tsx';

import './ft.css';

import { memo } from 'react';
import { getConfigTokens } from '@adapters/config.ts';
import { useQuery } from '@tanstack/react-query';
import CarbonContainer from '@components/features/contract/fungible-token/carbon/carbon.container.tsx';
import { QUERY_KEYS } from '@utils/constants';

const FungibleToken = memo(() => {
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.GET_PROJECT_MODEL],
    queryFn: getConfigTokens,
  });
  return (
    <CenterContentLayout
      contentWidth={'100%'}
      align={'start'}
      className={'ft-div'}
    >
      <Row>
        <Col span={12} style={{ paddingRight: '15px' }}>
          <CarbonContainer
            data={data?.carbon}
            getConfigTokenLoading={isLoading}
          />
        </Col>
        <Col span={12} style={{ paddingLeft: '15px' }}>
          <DcarbonContainer
            getConfigTokenLoading={isLoading}
            data={data?.dcarbon}
          />
        </Col>
      </Row>
    </CenterContentLayout>
  );
});
export default FungibleToken;

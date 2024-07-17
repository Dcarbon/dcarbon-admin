import { Col, Row } from 'antd';
import CenterContentLayout from '@components/common/layout/center-content/center-content.layout.tsx';
import DcarbonContainer from '@components/features/contract/fungible-token/dcarbon/dcarbon.container.tsx';

import './ft.css';

import CarbonContainer from '@components/features/contract/fungible-token/carbon/carbon.container.tsx';

const FungibleToken = () => {
  return (
    <CenterContentLayout
      contentWidth={'100%'}
      align={'start'}
      className={'ft-div'}
    >
      <Row>
        <Col span={12} style={{ paddingRight: '15px' }}>
          <CarbonContainer />
        </Col>
        <Col span={12} style={{ paddingLeft: '15px' }}>
          <DcarbonContainer />
        </Col>
      </Row>
    </CenterContentLayout>
  );
};
export default FungibleToken;

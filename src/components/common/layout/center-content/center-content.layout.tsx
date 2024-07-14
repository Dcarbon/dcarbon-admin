import React from 'react';
import { Flex } from 'antd';

const CenterContentLayout = ({
  children,
  contentWidth,
}: {
  children: React.ReactNode;
  contentWidth?: string;
}) => {
  return (
    <Flex className={'center-content-layout'} align={'center'}>
      <Flex
        align={'center'}
        vertical={true}
        className={'center-content-layout-child w-full'}
      >
        <div style={{ width: contentWidth || '50%' }}>{children}</div>
      </Flex>
    </Flex>
  );
};

export default CenterContentLayout;

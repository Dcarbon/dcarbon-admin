import React from 'react';
import { Flex } from 'antd';

const CenterContentLayout = ({
  children,
  contentWidth,
  vertical,
}: {
  children: React.ReactNode;
  contentWidth?: string;
  vertical?: boolean;
}) => {
  return (
    <Flex className={'center-content-layout'} align={'center'}>
      <Flex
        align={'center'}
        vertical={true}
        className={'center-content-layout-child w-full'}
      >
        <Flex
          vertical={vertical || true}
          style={{ width: contentWidth || '50%' }}
        >
          {children}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default CenterContentLayout;

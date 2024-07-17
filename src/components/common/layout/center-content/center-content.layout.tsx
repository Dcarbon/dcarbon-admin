import React, { CSSProperties } from 'react';
import { Flex } from 'antd';

const CenterContentLayout = ({
  children,
  contentWidth,
  contentMinWidth,
  vertical,
  align,
  className,
}: {
  children: React.ReactNode;
  contentWidth?: string;
  contentMinWidth?: string;
  vertical?: boolean;
  align?: 'center' | 'start';
  className?: string;
}) => {
  const style: CSSProperties = {
    width: contentWidth || '50%',
  };
  if (contentMinWidth) style.minWidth = contentMinWidth;
  return (
    <Flex
      className={
        className
          ? className + ' center-content-layout'
          : 'center-content-layout'
      }
      align={align || 'center'}
    >
      <Flex
        align={'center'}
        vertical={true}
        className={'center-content-layout-child w-full'}
      >
        <Flex vertical={vertical || true} style={style}>
          {children}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default CenterContentLayout;

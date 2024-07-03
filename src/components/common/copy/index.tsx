import React from 'react';
import { CheckOutlined } from '@ant-design/icons';
import { Tag, Tooltip } from 'antd';

import copySvg2 from '/image/copy-svgrepo-com.svg';

const CopyToClipBroad = ({
  text,
  type = 'tag',
}: {
  text: string;
  type?: 'tag' | 'icon';
}) => {
  const [isCopied, setIsCopied] = React.useState(false);
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };
  return (
    <>
      {text ? (
        <>
          {!isCopied ? (
            <Tooltip title="Copy to clipbroad">
              <img
                width={22}
                height={22}
                src={copySvg2}
                alt="copy"
                onClick={() => copyToClipboard(text)}
              />
            </Tooltip>
          ) : (
            <>
              {type === 'icon' ? (
                <CheckOutlined className="copy-successs" />
              ) : (
                <Tag color="green">Copied!</Tag>
              )}
            </>
          )}
        </>
      ) : null}
    </>
  );
};

// eslint-disable-next-line import/no-unused-modules
export default CopyToClipBroad;

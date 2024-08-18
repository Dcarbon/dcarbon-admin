import { memo } from 'react';
import { DownloadOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Flex, Skeleton } from 'antd';
import { IMyMetadata } from '@/types/projects';
import CopyToClipBroad from '@components/common/copy';
import CenterContentLayout from '@components/common/layout/center-content/center-content.layout.tsx';
import { truncateText } from '@utils/helpers';
import { getExplorerUrl } from '@utils/wallet';

const { Meta } = Card;

export interface IDcarbonInfo {
  owner_token_address: string;
  balance: number;
  availableClaim: number;
}

interface IProps {
  dcarbonMetadata?: IMyMetadata;
  loading: boolean;
  dcarbonInfo?: IDcarbonInfo;
  claim: () => void;
  contractDCarbonAvailable?: number;
}

const DCarbonScreen = memo(
  ({
    loading,
    dcarbonMetadata,
    dcarbonInfo,
    claim,
    contractDCarbonAvailable,
  }: IProps) => {
    return (
      <CenterContentLayout align={'center'} marginBottom={'250px'}>
        <Flex vertical>
          {loading || !dcarbonMetadata?.mint ? (
            <Skeleton avatar paragraph={{ rows: 1 }} />
          ) : (
            <Flex vertical={false}>
              <Avatar shape="square" size={75} src={dcarbonMetadata?.image} />
              <Flex vertical style={{ padding: '0px 8px' }}>
                <span>{`${dcarbonMetadata?.name} (${dcarbonMetadata?.symbol})`}</span>
                <span className={'contract-token-mint-address'}>
                  <a
                    href={getExplorerUrl(
                      dcarbonMetadata?.mint || '',
                      'address',
                    )}
                    target="_blank"
                  >
                    {truncateText(dcarbonMetadata?.mint || '')}
                  </a>
                  <CopyToClipBroad
                    text={dcarbonMetadata?.mint || ''}
                    type="icon"
                  />
                </span>
                {contractDCarbonAvailable && (
                  <span className={'contract-token-mint-address'}>
                    Available: {contractDCarbonAvailable}
                  </span>
                )}
              </Flex>
            </Flex>
          )}
          <Flex style={{ marginTop: '15px' }} justify={'space-between'}>
            <Card
              loading={loading || !dcarbonInfo}
              style={{ width: '48%' }}
              actions={[
                <span
                  className={'contract-token-mint-address'}
                  style={{ textAlign: 'left', paddingLeft: '15px' }}
                >
                  <a
                    href={getExplorerUrl(
                      dcarbonInfo?.owner_token_address || '',
                      'address',
                    )}
                    target="_blank"
                  >
                    {truncateText(dcarbonInfo?.owner_token_address || '')}
                  </a>
                  <CopyToClipBroad
                    text={dcarbonInfo?.owner_token_address || ''}
                    type="icon"
                  />
                </span>,
              ]}
            >
              <Meta
                avatar={<Avatar src="/image/dashboard/total-carbon-sold.svg" />}
                title="Your Balance"
                description={
                  <span
                    style={{
                      fontWeight: 'bold',
                      fontSize: '18px',
                      color: 'var(--main-color)',
                    }}
                  >
                    {dcarbonInfo?.balance || 0}
                  </span>
                }
              />
            </Card>
            <Card
              loading={loading || !dcarbonInfo}
              style={{ width: '48%' }}
              actions={[
                <Button
                  type="text"
                  icon={<DownloadOutlined />}
                  iconPosition={'start'}
                  onClick={() => claim()}
                >
                  Claim
                </Button>,
              ]}
            >
              <Meta
                avatar={<Avatar src="/image/dashboard/crypto.webp" />}
                title="Available To Claim"
                description={
                  <span
                    style={{
                      fontWeight: 'bold',
                      fontSize: '18px',
                      color: 'orange',
                    }}
                  >
                    {dcarbonInfo?.availableClaim || 0}
                  </span>
                }
              />
            </Card>
          </Flex>
        </Flex>
      </CenterContentLayout>
    );
  },
);
export default DCarbonScreen;

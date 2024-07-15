import { Flex } from 'antd';
import CenterContentLayout from '@components/common/layout/center-content/center-content.layout.tsx';

import './role.css';

import { memo } from 'react';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import AdminContainer from '@components/features/contract/role/admin/admin.container.tsx';
import MasterContainer from '@components/features/contract/role/master/master.container.tsx';

const ContractRole = memo(() => {
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();
  console.info('ContractRole');
  return (
    <CenterContentLayout
      contentWidth={!connection || !anchorWallet ? '50%' : '480px'}
      vertical
    >
      {!connection || !anchorWallet ? (
        <span
          style={{
            fontSize: '24px',
            fontWeight: '500',
            color: 'orange',
          }}
        >
          You need to connect your wallet to continue!
        </span>
      ) : (
        <Flex vertical>
          <MasterContainer
            connection={connection}
            anchorWallet={anchorWallet}
          />
          <AdminContainer connection={connection} anchorWallet={anchorWallet} />
        </Flex>
      )}
    </CenterContentLayout>
  );
});
export default ContractRole;

import { forwardRef, memo, useImperativeHandle, useState } from 'react';
import { ERROR_CONTRACT } from '@/constants';
import { SwapOutlined } from '@ant-design/icons';
import { Button, Flex } from 'antd';
import SkeletonInput from '@components/common/input/skeleton-input.tsx';
import { IContractUser } from '@components/features/contract/role/role.interface.ts';
import { isSolanaWallet } from '@utils/helpers/common.tsx';
import useNotification from '@utils/helpers/my-notification.tsx';

interface IProps {
  loading?: boolean;
  currentWallet?: string;
  triggerTransferMaster: (wallet: string) => void;
}

const defaultMaster: IContractUser = {
  wallet: '',
  status: 'draft',
};
const MasterScreen = memo(
  forwardRef(
    ({ loading, currentWallet, triggerTransferMaster }: IProps, ref) => {
      const [master, setMaster] = useState<IContractUser>(defaultMaster);
      const [newMaster, setNewMaster] = useState<IContractUser>();
      const [myNotification] = useNotification();
      useImperativeHandle(ref, () => ({
        setMaster(master: IContractUser) {
          setMaster(master);
        },
      }));
      const transferMaster = () => {
        const isWallet = isSolanaWallet(newMaster?.wallet);
        if (!isWallet) {
          myNotification(ERROR_CONTRACT.COMMON.WALLET_INVALID);
          return;
        }
        if (newMaster?.wallet === master.wallet) {
          myNotification(ERROR_CONTRACT.CONTRACT.ROLE.MASTER_IS_CURRENT);
          return;
        }
        if (newMaster?.wallet) triggerTransferMaster(newMaster?.wallet);
      };
      return (
        <>
          <Flex>
            <span className={'contract-span-title'}>Master</span>
          </Flex>
          <Flex>
            <SkeletonInput
              loading={loading}
              disabled={master.wallet !== currentWallet}
              value={newMaster ? newMaster.wallet : master.wallet}
              onChange={(e: any) => {
                setNewMaster({
                  wallet: e.target.value,
                  status: 'draft',
                });
              }}
            />
            <Button
              type={'primary'}
              disabled={loading || master.wallet !== currentWallet}
              icon={<SwapOutlined />}
              className={'contract-button contract-switch-button'}
              onClick={() => transferMaster()}
            />
          </Flex>
        </>
      );
    },
  ),
);
export default MasterScreen;

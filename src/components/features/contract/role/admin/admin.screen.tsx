import {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';
import { ERROR_CONTRACT } from '@/constants';
import { DeleteOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Flex } from 'antd';
import MyButton from '@components/common/button/my-button.tsx';
import MyInput from '@components/common/input/my-input.tsx';
import MySkeletonInput from '@components/common/skeleton/my-skeleton-input.tsx';
import { IContractUser } from '@components/features/contract/role/role.interface.ts';
import { isSolanaWallet } from '@utils/helpers/common.tsx';
import useNotification from '@utils/helpers/my-notification.tsx';

interface IProps {
  loading?: boolean;
  isMaster?: boolean;
  setAdmin: (wallet: string) => void;
  triggerRemoveAdmin: (wallet: string) => void;
}

const defaultAdmins: IContractUser[] = [
  {
    wallet: '',
    status: 'draft',
  },
  {
    wallet: '',
    status: 'draft',
  },
];
const AdminScreen = memo(
  forwardRef(
    ({ loading, isMaster, setAdmin, triggerRemoveAdmin }: IProps, ref) => {
      isMaster = true;
      console.info('AdminScreen');
      const [administrators, addAdministrators] =
        useState<IContractUser[]>(defaultAdmins);
      const [myNotification] = useNotification();
      useImperativeHandle(ref, () => ({
        setAdministrators(admins: IContractUser[]) {
          addAdministrators(admins);
        },
      }));
      const moreAdmin = () => {
        addAdministrators((prevState) => [
          ...prevState,
          { wallet: '', status: 'draft' },
        ]);
      };
      const removeAdmin = (admin: IContractUser, idx: number): void => {
        if (admin.status === 'draft') {
          const newArray = administrators.filter((_info, aIdx) => aIdx !== idx);
          addAdministrators(newArray);
        } else if (admin.status === 'active') triggerRemoveAdmin(admin.wallet);
      };
      const handleWalletInput = (wallet: string, idx: number) => {
        const newArray = [...administrators];
        newArray[idx] = {
          ...newArray[idx],
          wallet,
        };
        addAdministrators(newArray);
      };
      const saveAdmin = (wallet: string) => {
        const isWallet = isSolanaWallet(wallet);
        if (!isWallet) {
          myNotification(ERROR_CONTRACT.COMMON.WALLET_INVALID);
          return;
        }
        const isExits = administrators.find(
          (info) => info.wallet === wallet && info.status === 'active',
        );
        if (isExits) myNotification(ERROR_CONTRACT.CONTRACT.ROLE.ADMIN_EXISTS);
        setAdmin(wallet);
      };
      const renderActionButton = useCallback(
        (admin: IContractUser, idx: number) => {
          switch (admin.status) {
            case 'active':
              return (
                <Button
                  type="primary"
                  danger
                  disabled={loading || !isMaster}
                  icon={<DeleteOutlined />}
                  className={'contract-button contract-button-del'}
                  onClick={() => removeAdmin(admin, idx)}
                />
              );
            case 'draft':
              return (
                <>
                  <Button
                    type={'primary'}
                    disabled={loading || !isMaster}
                    icon={<SaveOutlined />}
                    className={'contract-button'}
                    onClick={() => saveAdmin(admin.wallet)}
                  />
                  <Button
                    type="primary"
                    danger
                    disabled={loading || !isMaster}
                    icon={<DeleteOutlined />}
                    className={'contract-button contract-button-del'}
                    onClick={() => removeAdmin(admin, idx)}
                  />
                </>
              );
            default:
              return (
                <Button
                  icon={<SaveOutlined />}
                  className={'contract-button'}
                  onClick={() => saveAdmin(admin.wallet)}
                />
              );
          }
        },
        [administrators],
      );
      return (
        <>
          <Flex vertical className="contract-admin-div">
            <Flex>
              <span className={'contract-span-title'}>Administrators</span>
            </Flex>
            {administrators.map((admin, idx) => (
              <Flex className={'contract-admin-div-child'}>
                {loading ? (
                  <MySkeletonInput active={true} />
                ) : (
                  <MyInput
                    value={admin.wallet}
                    disabled={admin.status === 'active' || !isMaster}
                    onChange={(e) => handleWalletInput(e.target.value, idx)}
                  />
                )}
                {renderActionButton(admin, idx)}
              </Flex>
            ))}
          </Flex>
          <Flex justify={'center'} className="contract-add-button-div">
            <MyButton
              icon={<PlusOutlined />}
              disabled={(() => {
                const isMatch = administrators.find(
                  (info) => info.status !== 'active',
                );
                return loading || !isMaster || !!isMatch;
              })()}
              onClick={() => moreAdmin()}
            >
              Add
            </MyButton>
          </Flex>
        </>
      );
    },
  ),
);
export default AdminScreen;

import {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';
import { CheckOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Flex } from 'antd';
import MyButton from '@components/common/button/my-button.tsx';
import MyInput from '@components/common/input/my-input.tsx';
import MySkeletonInput from '@components/common/skeleton/my-skeleton-input.tsx';
import { IContractUser } from '@components/features/contract/role/role.interface.ts';

interface IProps {
  loading?: boolean;
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
  forwardRef(({ loading }: IProps, ref) => {
    console.info('AdminScreen');
    const [administrators, addAdministrators] =
      useState<IContractUser[]>(defaultAdmins);
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
    const removeAdmin = (_admin: IContractUser, idx: number): void => {
      const newArray = administrators.filter((_info, aIdx) => aIdx !== idx);
      addAdministrators(newArray);
    };
    const handleWalletInput = (wallet: string, idx: number) => {
      const newArray = [...administrators];
      newArray[idx] = {
        ...newArray[idx],
        wallet,
      };
      addAdministrators(newArray);
    };
    const renderActionButton = useCallback(
      (admin: IContractUser, idx: number) => {
        switch (admin.status) {
          case 'active':
            return (
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                className={'contract-button contract-button-del'}
              />
            );
          case 'draft':
            return (
              <>
                <Button
                  icon={<CheckOutlined />}
                  className={'contract-button'}
                />
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  className={'contract-button contract-button-del'}
                  onClick={() => removeAdmin(admin, idx)}
                />
              </>
            );
          default:
            return (
              <Button icon={<CheckOutlined />} className={'contract-button'} />
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
                  disabled={admin.status === 'active'}
                  onChange={(e) => handleWalletInput(e.target.value, idx)}
                />
              )}
              {renderActionButton(admin, idx)}
            </Flex>
          ))}
        </Flex>
        <Flex justify={'center'} className="contract-add-button-div">
          <MyButton icon={<PlusOutlined />} onClick={() => moreAdmin()}>
            Add
          </MyButton>
        </Flex>
      </>
    );
  }),
);
export default AdminScreen;

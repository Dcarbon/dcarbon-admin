import { forwardRef, memo, useImperativeHandle, useState } from 'react';
import { SwapOutlined } from '@ant-design/icons';
import { Button, Flex } from 'antd';
import MyInput from '@components/common/input/my-input.tsx';
import MySkeletonInput from '@components/common/skeleton/my-skeleton-input.tsx';
import { IContractUser } from '@components/features/contract/role/role.interface.ts';

interface IProps {
  loading?: boolean;
}

const defaultMaster: IContractUser = {
  wallet: '',
  status: 'draft',
};
const MasterScreen = memo(
  forwardRef(({ loading }: IProps, ref) => {
    const [master, setMaster] = useState<IContractUser>(defaultMaster);
    console.info(MasterScreen);
    useImperativeHandle(ref, () => ({
      setMaster(master: IContractUser) {
        setMaster(master);
      },
    }));
    return (
      <>
        <Flex>
          <span className={'contract-span-title'}>Master</span>
        </Flex>
        <Flex>
          {loading ? (
            <MySkeletonInput active={true} />
          ) : (
            <MyInput
              value={master.wallet}
              onChange={(e) => {
                setMaster({
                  wallet: e.target.value,
                  status: 'draft',
                });
              }}
            />
          )}
          <Button
            disabled={loading}
            icon={<SwapOutlined />}
            className={'contract-button'}
          />
        </Flex>
      </>
    );
  }),
);
export default MasterScreen;

import { memo, useState } from 'react';
import { ERROR_CONTRACT } from '@/constants';
import { uploadImage, uploadMetadata } from '@adapters/common.ts';
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from '@solana/wallet-adapter-react';
import { useMutation } from '@tanstack/react-query';
import TxModal from '@components/common/modal/tx-modal.tsx';
import CarbonScreen from '@components/features/contract/fungible-token/carbon/carbon.screen.tsx';
import {
  IFTCreateForm,
  TFungibleTokenInfo,
} from '@components/features/contract/fungible-token/ft.interface.ts';
import useNotification from '@utils/helpers/my-notification.tsx';
import {
  createMetadata,
  createMint,
  ICreateMintResponse,
} from '@utils/wallet/mint.util.ts';

interface IProps {
  getConfigTokenLoading?: boolean;
  data?: SplToken;
}

const CarbonContainer = memo(({ getConfigTokenLoading, data }: IProps) => {
  console.info('DCarbonContainer');
  const { publicKey, wallet } = useWallet();
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();
  const [myNotification] = useNotification();
  const [isLoading, setLoading] = useState(false);
  const [txModalOpen, setTxModalOpen] = useState(false);
  const mutationUploadImage = useMutation({
    mutationFn: uploadImage,
  });
  const mutationUploadMetadata = useMutation({
    mutationFn: uploadMetadata,
  });
  const createToken = async (input: IFTCreateForm) => {
    if (!anchorWallet || !connection || !publicKey || !wallet) {
      myNotification(ERROR_CONTRACT.COMMON.CONNECT_ERROR);
      return;
    }
    try {
      setLoading(true);
      const uri = await createMetadata(
        mutationUploadImage,
        mutationUploadMetadata,
        input,
      );
      const { token, status } = await mintToken(input, uri);
      if (status === 'reject') return;
      myNotification({
        message: 'Create token successful',
        description: status === 'success' ? token : undefined,
        type: status,
        tx_type: 'address',
      });
    } catch (e: any) {
      myNotification({
        description: e.message,
      });
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  const mintToken = async (
    input: IFTCreateForm,
    uri: string,
  ): Promise<ICreateMintResponse> => {
    const result = {} as ICreateMintResponse;
    try {
      if (!anchorWallet || !connection || !publicKey || !wallet) {
        myNotification(ERROR_CONTRACT.COMMON.CONNECT_ERROR);
        return result;
      }
      setTxModalOpen(true);
      const createMintResult = await createMint({
        anchorWallet,
        connection,
        wallet,
        publicKey,
        uri,
        input,
      });
      setTxModalOpen(false);
      if (createMintResult.status !== 'reject') {
        myNotification({
          description: createMintResult.tx,
          type: createMintResult.status,
          tx_type: 'tx',
        });
      }
      return createMintResult;
    } catch (e) {
      setTxModalOpen(false);
      myNotification(ERROR_CONTRACT.COMMON.TX_ERROR);
      console.error(e);
    }
    return result;
  };
  const carbon: Partial<Partial<TFungibleTokenInfo>> = {
    ...data,
    icon: [data?.image || ''],
    revoke_freeze: !data?.freeze_authority,
    revoke_mint: !data?.mint_authority,
  };
  return (
    <>
      <TxModal open={txModalOpen} setOpen={setTxModalOpen} />
      <CarbonScreen
        data={data?.name ? carbon : undefined}
        triggerCreateToken={createToken}
        getConfigTokenLoading={getConfigTokenLoading}
        initConfigTokenLoading={isLoading}
      />
    </>
  );
});
export default CarbonContainer;

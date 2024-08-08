import { memo, useState } from 'react';
import { ERROR_CONTRACT, ERROR_MSG } from '@/constants';
import Icon from '@ant-design/icons';
import { CARBON_IDL } from '@contracts/carbon/carbon.idl.ts';
import { ICarbonContract } from '@contracts/carbon/carbon.interface.ts';
import { AnchorProvider, IdlTypes, Program } from '@coral-xyz/anchor';
import { TOKEN_PROGRAM_ID } from '@coral-xyz/anchor/dist/cjs/utils/token';
import SellIcon from '@icons/sell.icon.tsx';
import { getAssociatedTokenAddressSync } from '@solana/spl-token';
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import {
  Avatar,
  Col,
  Flex,
  Form,
  Modal,
  Row,
  Select,
  Space,
  Typography,
} from 'antd';
import { createStyles } from 'antd-style';
import { ISqlToken } from '@/types/device';
import { IMintOfProject } from '@/types/projects';
import SubmitButton from '@components/common/button/submit-button.tsx';
import MyInputNumber from '@components/common/input/my-input-number.tsx';
import MySelect from '@components/common/input/my-select.tsx';
import TxModal from '@components/common/modal/tx-modal.tsx';
import useNotification from '@utils/helpers/my-notification.tsx';
import { sendTx } from '@utils/wallet';

interface IProps {
  visible?: boolean;
  setVisible: (visible: boolean) => void;
  refetch: () => void;
  carbonForList?: IMintOfProject;
  splTokenList?: ISqlToken[];
}

type ListingArgs = IdlTypes<ICarbonContract>['listingArgs'];

const { Title } = Typography;

const SellIc = () => (
  <Icon size={20} component={() => <SellIcon size={20} />} />
);

const useStyle = createStyles(() => ({
  'my-modal-mask': {
    boxShadow: `inset 0 0 15px #fff`,
  },
  'my-modal-content': {
    border: '1px solid #333',
  },
}));

const ListingForm = memo(
  ({ visible, setVisible, carbonForList, splTokenList, refetch }: IProps) => {
    const [form] = Form.useForm();
    const [myNotification] = useNotification();
    const { publicKey, wallet } = useWallet();
    const { connection } = useConnection();
    const anchorWallet = useAnchorWallet();
    const [txModalOpen, setTxModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { styles } = useStyle();

    const classNames = {
      mask: styles['my-modal-mask'],
      content: styles['my-modal-content'],
    };
    const modalStyles = {
      mask: {
        backdropFilter: 'blur(10px)',
      },
      content: {
        boxShadow: '0 0 30px #999',
        borderRadius: 'var(--div-radius)',
      },
    };
    const submitListing = async (
      volume: number,
      price: number,
      currency: string,
    ): Promise<void> => {
      const matchMint = carbonForList?.mints?.find(
        (info) => info.available >= volume,
      );
      if (!matchMint || !carbonForList?.project_id) {
        myNotification({
          description: ERROR_MSG.LISTING.VOLUME_NOT_AVAILABLE,
        });
        return;
      }
      let transaction;
      try {
        if (!anchorWallet || !connection || !publicKey || !wallet) {
          myNotification(ERROR_CONTRACT.COMMON.CONNECT_ERROR);
          return;
        }
        setLoading(true);
        setTxModalOpen(true);
        const provider = new AnchorProvider(connection, anchorWallet);
        const program = new Program<ICarbonContract>(
          CARBON_IDL as ICarbonContract,
          provider,
        );
        const mint = new PublicKey(matchMint.address);
        const sourceAta = getAssociatedTokenAddressSync(mint, publicKey);

        const [marketplaceCounter] = PublicKey.findProgramAddressSync(
          [Buffer.from('marketplace'), Buffer.from('counter')],
          program.programId,
        );

        const marketplaceCounterData =
          await program.account.marketplaceCounter.fetch(marketplaceCounter);

        const listingArgs: ListingArgs = {
          amount: volume,
          price: price,
          projectId: Number(carbonForList?.project_id),
          nonce: marketplaceCounterData.nonce,
          currency: currency !== 'SOL' ? new PublicKey(currency) : null,
        };

        const listingIns = await program.methods
          .listing(listingArgs)
          .accounts({
            signer: publicKey,
            mint: mint,
            sourceAta: sourceAta,
            tokenProgram: TOKEN_PROGRAM_ID,
          })
          .instruction();
        const { status, tx } = await sendTx({
          connection,
          wallet,
          payerKey: publicKey,
          txInstructions: listingIns,
        });
        transaction = tx;
        setTxModalOpen(false);
        if (status === 'reject') return;
        myNotification({
          description: transaction,
          type: status,
          tx_type: 'tx',
        });
        form.resetFields();
        setVisible(false);
        refetch();
      } catch (e) {
        //
      } finally {
        setLoading(false);
        setTxModalOpen(false);
      }
    };
    return (
      <>
        <TxModal open={txModalOpen} setOpen={setTxModalOpen} />
        <Modal
          open={visible}
          onCancel={() => setVisible(false)}
          maskClosable
          width={500}
          footer={null}
          classNames={classNames}
          styles={modalStyles}
          centered
        >
          <Title level={5}>Listing Carbon</Title>
          <Flex gap={10}>
            <Form
              form={form}
              className="w-full"
              layout="vertical"
              onFinish={(values) =>
                submitListing(values.volume, values.price, values.currency)
              }
              disabled={loading}
            >
              <Form.Item
                name={'volume'}
                label="Volume"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <MyInputNumber width={'100%'} precision={1} min={0} required />
              </Form.Item>
              <Row>
                <Col span={18} style={{ paddingRight: '15px' }}>
                  <Form.Item
                    name={'price'}
                    label="Price"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <MyInputNumber precision={1} width={'100%'} min={0} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label="Currency"
                    name="currency"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <MySelect>
                      {splTokenList &&
                        splTokenList.length > 0 &&
                        splTokenList.map((item) => (
                          <Select.Option key={item.mint} value={item.mint}>
                            <Space>
                              <Avatar size={'small'} src={item.icon} />
                              <span>{item.name}</span>
                            </Space>
                          </Select.Option>
                        ))}
                    </MySelect>
                  </Form.Item>
                </Col>
              </Row>
              <Flex justify="center" gap={10} style={{ marginTop: '30px' }}>
                <SubmitButton
                  loading={loading}
                  htmlType="submit"
                  icon={<SellIc />}
                >
                  Listing
                </SubmitButton>
              </Flex>
            </Form>
          </Flex>
        </Modal>
      </>
    );
  },
);
export default ListingForm;

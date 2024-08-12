import { memo, useEffect, useState } from 'react';
import { ERROR_CONTRACT, ERROR_MSG } from '@/constants';
import Icon from '@ant-design/icons';
import { CARBON_IDL } from '@contracts/carbon/carbon.idl.ts';
import { ICarbonContract } from '@contracts/carbon/carbon.interface.ts';
import { AnchorProvider, IdlTypes, Program } from '@coral-xyz/anchor';
import { TOKEN_PROGRAM_ID } from '@coral-xyz/anchor/dist/cjs/utils/token';
import SellIcon from '@icons/sell.icon.tsx';
import {
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddressSync,
} from '@solana/spl-token';
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from '@solana/wallet-adapter-react';
import { PublicKey, TransactionInstruction } from '@solana/web3.js';
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
import bs58 from 'bs58';
import { ISqlToken } from '@/types/device';
import { IMintListing, IMintOfProject } from '@/types/projects';
import SubmitButton from '@components/common/button/submit-button.tsx';
import MySelect from '@components/common/input/my-select.tsx';
import SkeletonInput from '@components/common/input/skeleton-input.tsx';
import TxModal from '@components/common/modal/tx-modal.tsx';
import { u16ToBytes } from '@utils/helpers';
import useMultipleNotification from '@utils/helpers/multiple-notification.tsx';
import useMyNotification from '@utils/helpers/my-notification.tsx';
import {
  generateListingList,
  getProgram,
  sendMultipleTx,
  splitArray,
} from '@utils/wallet';

interface IProps {
  visible?: boolean;
  setVisible: (visible: boolean) => void;
  refetch: () => void;
  carbonForList?: IMintOfProject;
  splTokenList?: ISqlToken[];
  availableCarbon?: number;
  projectId: string;
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
  ({
    visible,
    setVisible,
    carbonForList,
    splTokenList,
    refetch,
    availableCarbon,
    projectId,
  }: IProps) => {
    const [form] = Form.useForm();
    const [openMultipleNotification] = useMultipleNotification();
    const [myNotification] = useMyNotification();
    const { publicKey, wallet } = useWallet();
    const { connection } = useConnection();
    const anchorWallet = useAnchorWallet();
    const [txModalOpen, setTxModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState('0');
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
      const { result: listingList, status } = generateListingList(
        carbonForList?.mints || [],
        volume,
      );
      if (status === 'error' || listingList?.length === 0) {
        myNotification({
          description: ERROR_MSG.LISTING.VOLUME_NOT_AVAILABLE,
        });
        return;
      }
      let successTransactions = [];
      let errorTransactions = [];
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
        const splitArr = splitArray<IMintListing>(listingList, 4);
        const airdropInsArrayForMultipleTx: TransactionInstruction[][] = [];
        for (let i0 = 0; i0 < splitArr.length; i0++) {
          const airdropInsArray: TransactionInstruction[] = [];
          const result = splitArr[i0];
          for (let i = 0; i < result.length; i++) {
            const mint = new PublicKey(result[i].address);
            const sourceAta = getAssociatedTokenAddressSync(mint, publicKey);
            const amount = Number((result[i].real_available || 0).toFixed(1));
            const listingArgs: ListingArgs = {
              amount,
              price: price * amount,
              projectId: Number(carbonForList?.project_id),
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
            airdropInsArray.push(listingIns);
          }
          if (i0 === 0) {
            const currencyAta = getAssociatedTokenAddressSync(
              new PublicKey(currency),
              publicKey,
            );

            const checkAtaAccount =
              await connection.getAccountInfo(currencyAta);
            if (!checkAtaAccount) {
              const createAtaIns = createAssociatedTokenAccountInstruction(
                publicKey,
                currencyAta,
                publicKey,
                new PublicKey(currency),
              );
              airdropInsArray.unshift(createAtaIns);
            }
          }
          airdropInsArrayForMultipleTx.push(airdropInsArray);
        }
        const result = await sendMultipleTx({
          connection,
          wallet,
          payerKey: publicKey,
          transactionsInsList: airdropInsArrayForMultipleTx,
        });
        if (result.filter((info) => info.status === 'reject').length > 0) {
          return;
        }
        successTransactions = result.filter(
          (info) => info.status === 'success',
        );
        errorTransactions = result.filter((info) => info.status === 'error');
        setTxModalOpen(false);
        if (successTransactions.length > 0) {
          openMultipleNotification({
            txs: successTransactions.map((info) => info.tx || ''),
            type: 'success',
            tx_type: 'tx',
          });
        }
        if (errorTransactions.length > 0) {
          openMultipleNotification({
            txs: errorTransactions.map((info) => info.tx || ''),
            type: 'error',
            tx_type: 'tx',
            successCount: successTransactions.length,
          });
        }
        form.resetFields();
        setTotal('0');
        setVisible(false);
        refetch();
      } catch (e) {
        //
      } finally {
        setLoading(false);
        setTxModalOpen(false);
      }
    };
    const getListingInfo = async () => {
      try {
        setLoading(true);
        const { program } = getProgram(connection);
        const accounts = await connection.getProgramAccounts(
          program.programId,
          {
            dataSlice: { offset: 0, length: 0 },
            filters: [
              {
                memcmp: {
                  offset: 0,
                  bytes: bs58.encode(
                    CARBON_IDL?.accounts.find(
                      (acc: { name: string; discriminator: number[] }) =>
                        acc.name === 'TokenListingInfo',
                    )?.discriminator as number[],
                  ),
                },
              },
              {
                memcmp: {
                  offset: 8 + 32 + 32 + 8 + 8,
                  bytes: bs58.encode(u16ToBytes(Number(projectId))),
                },
              },
            ],
          },
        );
        if (accounts?.length > 0) {
          const data = await program.account.tokenListingInfo.fetch(
            accounts[0].pubkey,
          );
          if (data) {
            form.setFieldsValue({
              price: data.price / data.amount,
              currency: data.currency ? data.currency.toString() : 'SOL',
              isHasListing: true,
            });
          }
        }
      } catch (e) {
        myNotification({
          description: ERROR_MSG.LISTING.GET_LISTING_INFO_ERROR,
        });
        setVisible(false);
      } finally {
        setLoading(false);
      }
    };
    const renderTotal = () => {
      const volume = form.getFieldValue('volume') || 0;
      const price = form.getFieldValue('price') || 0;
      const currency = form.getFieldValue('currency');
      const currencyMatch = splTokenList?.find((cu) => cu.mint === currency);
      setTotal(`${volume * price} ${currencyMatch ? currencyMatch.name : ''}`);
    };
    useEffect(() => {
      if (visible) getListingInfo().then();
    }, [visible]);

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
              onFieldsChange={() => renderTotal()}
              disabled={loading}
            >
              <Row>
                <Col span={18} style={{ paddingRight: '15px' }}>
                  <Form.Item
                    name={'volume'}
                    label="Volume"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <SkeletonInput
                      width={'100%'}
                      precision={1}
                      min={0}
                      required
                      max={availableCarbon}
                      isnumber
                      loading={loading}
                    />
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
                    <MySelect
                      loading={loading}
                      disabled={form.getFieldValue('isHasListing')}
                    >
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
              <Row>
                <Col span={12} style={{ paddingRight: '15px' }}>
                  <Flex>
                    <Form.Item
                      name={'price'}
                      label="Unit price"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <SkeletonInput
                        disabled={form.getFieldValue('isHasListing')}
                        precision={1}
                        width={'100%'}
                        min={0}
                        isnumber
                        loading={loading}
                      />
                    </Form.Item>
                  </Flex>
                </Col>
                <Col
                  span={12}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'end',
                  }}
                >
                  <Flex>
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>
                      Total Price:
                    </span>
                    <span
                      style={{
                        fontSize: '14px',
                        color: 'var(--submit-button-bg-hover)',
                        marginLeft: '15px',
                      }}
                    >
                      {total}
                    </span>
                  </Flex>
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

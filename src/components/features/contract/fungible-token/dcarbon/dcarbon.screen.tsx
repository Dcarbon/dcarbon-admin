import { memo, useCallback, useLayoutEffect, useState } from 'react';
import { useContractRole } from '@/contexts/contract-role-context.tsx';
import { EContractRole } from '@/enums';
import { InfoCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Col,
  Flex,
  Form,
  FormProps,
  message,
  Row,
  Switch,
  Tooltip,
  Upload,
} from 'antd';
import CancelButtonAction from '@components/common/button/button-cancel.tsx';
import SubmitButtonAction from '@components/common/button/button-submit.tsx';
import SubmitButton from '@components/common/button/submit-button.tsx';
import CopyToClipBroad from '@components/common/copy';
import SkeletonInput from '@components/common/input/skeleton-input.tsx';
import SkeletonTextArea from '@components/common/input/skeleton-textarea.tsx';
import {
  IFTCreateForm,
  TFungibleTokenInfo,
} from '@components/features/contract/fungible-token/ft.interface.ts';
import useModalAction from '@utils/helpers/back-action.tsx';
import { truncateText } from '@utils/helpers/common.tsx';
import { getExplorerUrl } from '@utils/wallet';

const FormDefault: Partial<TFungibleTokenInfo> = {
  name: 'DCarbon',
  symbol: 'DCARBON',
  decimals: 9,
  revoke_freeze: true,
  revoke_mint: true,
};

interface IProps {
  triggerCreateToken: (data: IFTCreateForm) => void;
  data?: Partial<TFungibleTokenInfo>;
  getConfigTokenLoading?: boolean;
  initConfigTokenLoading?: boolean;
}

const DCarbonScreen = memo(
  ({
    data = FormDefault,
    triggerCreateToken,
    getConfigTokenLoading,
    initConfigTokenLoading,
  }: IProps) => {
    const [form] = Form.useForm<IFTCreateForm>();
    const [icon, setIcon] = useState([]);
    const goBack = useModalAction({
      type: 'back',
      danger: true,
    });
    const { contractRole } = useContractRole();
    const handleIconChange = useCallback(
      ({ fileList }: { fileList: any }) => {
        setIcon(fileList);
        form.setFieldsValue({ icon: [fileList[0]] });
      },
      [form],
    );
    const beforeUpload = (file: any) => {
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (!isLt1M) {
        message.error('Image must smaller than 1MB!');
      }
      return false;
    };
    const onFinish: FormProps<IFTCreateForm>['onFinish'] = (values) => {
      triggerCreateToken(values);
    };
    useLayoutEffect(() => {
      if (data) {
        if (data.icon) {
          setIcon([
            {
              uid: data.symbol,
              name: data.name,
              url: data.icon[0],
            },
          ] as any);
        }
        form.setFieldsValue({
          name: data.name,
          symbol: data.symbol,
          decimals: data.decimals,
          supply: data.supply,
          icon: data.icon,
          revoke_freeze: data.revoke_freeze,
          revoke_mint: data.revoke_mint,
          description: data.description,
        });
      }
    }, [data, form]);
    return (
      <Flex className={'ft-main-div'}>
        <Flex justify={'space-between'}>
          <span className={'ft-title'}>DCarbon</span>
          {data?.mint && (
            <span className={'contract-token-mint-address'}>
              <a href={getExplorerUrl(data?.mint, 'address')} target="_blank">
                {truncateText(data.mint)}
              </a>
              <CopyToClipBroad text={data.mint} type="icon" />
            </span>
          )}
        </Flex>
        <Flex className={'ft-content'}>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className={'w-full'}
            disabled={
              !!data?.mint || getConfigTokenLoading || initConfigTokenLoading
            }
          >
            <Form.Item style={{ marginBottom: 0 }}>
              <Form.Item
                label="Name"
                name="name"
                rules={[
                  {
                    required: true,
                    max: 20,
                  },
                ]}
                style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
              >
                <SkeletonInput
                  loading={getConfigTokenLoading}
                  placeholder="Enter token name"
                  maxLength={20}
                />
              </Form.Item>
              <Form.Item
                label="Symbol"
                name="symbol"
                rules={[
                  {
                    required: true,
                    max: 8,
                  },
                ]}
                style={{
                  display: 'inline-block',
                  width: 'calc(50% - 8px)',
                  margin: '0 8px',
                }}
              >
                <SkeletonInput
                  loading={getConfigTokenLoading}
                  placeholder="Enter token symbol"
                  maxLength={8}
                />
              </Form.Item>
              <Row>
                <Col span={12}>
                  <Form.Item
                    label="Decimal"
                    name="decimals"
                    rules={[
                      {
                        type: 'number',
                        required: true,
                      },
                    ]}
                    style={{
                      marginRight: '8px',
                    }}
                  >
                    <SkeletonInput
                      loading={getConfigTokenLoading}
                      isnumber
                      placeholder="Enter decimals"
                      width={'100%'}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Supply"
                    name="supply"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                    style={{
                      marginRight: '8px',
                    }}
                  >
                    <SkeletonInput
                      loading={getConfigTokenLoading}
                      isnumber
                      width={'100%'}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Flex className={'ft-icon-div'}>
                    <Form.Item
                      label="Icon"
                      name="icon"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Upload
                        listType="picture-card"
                        fileList={icon}
                        accept="image/*"
                        onChange={handleIconChange}
                        beforeUpload={beforeUpload}
                        style={{ height: '100px' }}
                      >
                        {icon.length < 1 && (
                          <div>
                            <PlusOutlined /> Upload
                          </div>
                        )}
                      </Upload>
                    </Form.Item>
                  </Flex>
                </Col>
              </Row>
              <Form.Item
                label="Description"
                name="description"
                rules={[
                  {
                    required: true,
                    max: 5000,
                  },
                ]}
              >
                <SkeletonTextArea
                  loading={getConfigTokenLoading}
                  placeholder="Enter description"
                  maxLength={5000}
                />
              </Form.Item>
              <Row>
                <Col span={12}>
                  <Flex vertical className={'ft-switch-div'}>
                    <Flex align={'center'}>
                      <Form.Item
                        name="revoke_freeze"
                        valuePropName="checked"
                        style={{ marginBottom: '0px' }}
                      >
                        <Switch />
                      </Form.Item>
                      <label style={{ marginLeft: '5px' }}>
                        Revoke Freeze (required)
                      </label>
                    </Flex>
                    <span>
                      Revoke Freeze allows you to create a liquidity pool
                    </span>
                  </Flex>
                </Col>
                <Col span={12}>
                  <Flex vertical className={'ft-switch-div'}>
                    <Flex align={'center'}>
                      <Form.Item
                        name="revoke_mint"
                        valuePropName="checked"
                        style={{ marginBottom: '0px' }}
                      >
                        <Switch />
                      </Form.Item>
                      <label style={{ marginLeft: '5px' }}>Revoke Mint</label>
                    </Flex>
                    <span>
                      Mint Authority allows you to increase tokens supply
                    </span>
                  </Flex>
                </Col>
              </Row>
            </Form.Item>
            <Flex gap={10} justify="start" style={{ marginTop: '15px' }}>
              {contractRole !== EContractRole.MASTER ? (
                <Tooltip title={'Require role: Master'}>
                  <SubmitButton disabled icon={<InfoCircleOutlined />}>
                    Create
                  </SubmitButton>
                </Tooltip>
              ) : (
                <SubmitButtonAction loading={initConfigTokenLoading}>
                  Create
                </SubmitButtonAction>
              )}
              <CancelButtonAction onClick={goBack}>Cancel</CancelButtonAction>
            </Flex>
          </Form>
        </Flex>
      </Flex>
    );
  },
);
export default DCarbonScreen;

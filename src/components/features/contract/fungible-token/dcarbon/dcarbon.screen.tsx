import { forwardRef, memo, useCallback, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Col, Flex, Form, FormProps, message, Row, Switch, Upload } from 'antd';
import CancelButtonAction from '@components/common/button/button-cancel.tsx';
import SubmitButtonAction from '@components/common/button/button-submit.tsx';
import MyInputNumber from '@components/common/input/my-input-number.tsx';
import MyInput from '@components/common/input/my-input.tsx';
import MyInputTextArea from '@components/common/input/my-textarea.tsx';
import {
  IFTCreateForm,
  TFungibleTokenInfo,
} from '@components/features/contract/fungible-token/ft.interface.ts';
import useModalAction from '@utils/helpers/back-action.tsx';

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
  isLoading?: boolean;
}

const DCarbonScreen = memo(
  forwardRef(
    ({ data = FormDefault, triggerCreateToken, isLoading }: IProps) => {
      console.info('DCarbonScreen');
      const [form] = Form.useForm<IFTCreateForm>();
      const [icon, setIcon] = useState([]);
      const goBack = useModalAction({
        type: 'back',
        danger: true,
      });
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
      return (
        <Flex className={'ft-main-div'}>
          <span className={'ft-title'}>DCarbon</span>
          <Flex className={'ft-content'}>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              className={'w-full'}
              disabled={isLoading}
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
                  initialValue={data.name}
                  style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
                >
                  <MyInput placeholder="Enter token name" maxLength={20} />
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
                  initialValue={data.symbol}
                  style={{
                    display: 'inline-block',
                    width: 'calc(50% - 8px)',
                    margin: '0 8px',
                  }}
                >
                  <MyInput placeholder="Enter token symbol" maxLength={8} />
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
                      initialValue={data.decimals}
                      style={{
                        marginRight: '8px',
                      }}
                    >
                      <MyInputNumber
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
                      <MyInputNumber width={'100%'} />
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
                  <MyInputTextArea
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
                          initialValue={data.revoke_freeze}
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
                          initialValue={data.revoke_mint || false}
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
                <SubmitButtonAction loading={isLoading}>
                  Create
                </SubmitButtonAction>
                <CancelButtonAction onClick={goBack}>Cancel</CancelButtonAction>
              </Flex>
            </Form>
          </Flex>
        </Flex>
      );
    },
  ),
);
export default DCarbonScreen;

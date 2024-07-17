import { InputNumber, InputNumberProps } from 'antd';
import styled from 'styled-components';

export interface IProps extends InputNumberProps {
  width?: string;
}

const MyInputNumber = styled(InputNumber).attrs<IProps>((props: IProps) => ({
  ...props,
}))`
  background-color: var(--main-gray);
  width: ${(props) => props.width || '90px'};
`;
export default MyInputNumber;

import { Input, InputProps } from 'antd';
import styled from 'styled-components';

interface IProps extends InputProps {
  viewMode?: boolean;
}

const MyInput = styled(Input).attrs<IProps>((props: IProps) => ({
  ...props,
  allowClear: true,
}))`
  background-color: var(--main-gray) !important;
  color: ${(props) =>
    props.viewMode ? 'rgba(0, 0, 0, 0.88) !important' : 'inherit'};
`;
export default MyInput;

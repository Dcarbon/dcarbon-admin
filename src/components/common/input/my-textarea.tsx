import { Input } from 'antd';
import { TextAreaProps } from 'antd/es/input/TextArea';
import styled from 'styled-components';

interface IProps extends TextAreaProps {
  viewMode?: boolean;
}

const MyInputTextArea = styled(Input.TextArea).attrs<IProps>((props) => ({
  ...props,
}))`
  background-color: var(--main-gray);
  color: ${(props) =>
    props.viewMode ? 'rgba(0, 0, 0, 0.88) !important' : 'inherit'};
`;
export default MyInputTextArea;

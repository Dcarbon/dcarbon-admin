import { Input } from 'antd';
import { TextAreaProps } from 'antd/es/input';
import MySkeletonInput from '@components/common/skeleton/my-skeleton-input.tsx';

interface IInputProps extends TextAreaProps {
  loading?: boolean;
}

const SkeletonTextArea = (props: IInputProps) => {
  return (
    <>
      {props.loading ? (
        <MySkeletonInput active={true} height={'56.8px'} />
      ) : (
        <Input.TextArea {...props} />
      )}
    </>
  );
};
export default SkeletonTextArea;

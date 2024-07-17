import { InputProps } from 'antd';
import MyInputNumber, {
  IProps as IInputNumberProps,
} from '@components/common/input/my-input-number.tsx';
import MyInput from '@components/common/input/my-input.tsx';
import MySkeletonInput from '@components/common/skeleton/my-skeleton-input.tsx';

interface IInputProps extends InputProps {
  loading?: boolean;
  isNumber?: boolean;
}

interface INumberProps extends IInputNumberProps {
  loading?: boolean;
  isNumber?: boolean;
}

const SkeletonInput = (props: INumberProps | IInputProps) => {
  return (
    <>
      {props.loading ? (
        <MySkeletonInput active={true} />
      ) : props.isNumber ? (
        <MyInputNumber {...(props as INumberProps)} />
      ) : (
        <MyInput {...(props as IInputProps)} />
      )}
    </>
  );
};
export default SkeletonInput;

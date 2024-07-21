import { InputProps } from 'antd';
import MyInputNumber, {
  IProps as IInputNumberProps,
} from '@components/common/input/my-input-number.tsx';
import MyInput from '@components/common/input/my-input.tsx';
import MySkeletonInput from '@components/common/skeleton/my-skeleton-input.tsx';

interface IInputProps extends InputProps {
  loading?: boolean;
  isnumber?: boolean;
}

interface INumberProps extends IInputNumberProps {
  loading?: boolean;
  isnumber?: boolean;
}

const SkeletonInput = (props: INumberProps | IInputProps) => {
  const newProps = { ...props };
  delete newProps.loading;
  delete newProps.isnumber;
  return (
    <>
      {props.loading ? (
        <MySkeletonInput active={true} />
      ) : props.isnumber ? (
        <MyInputNumber {...(newProps as INumberProps)} />
      ) : (
        <MyInput {...(newProps as IInputProps)} />
      )}
    </>
  );
};
export default SkeletonInput;

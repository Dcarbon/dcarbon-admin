import CancelButton from '@components/common/button/cancel-button.tsx';

type ButtonCancelProps = {
  children: React.ReactNode | string;
  onClick?: () => void;
  [key: string]: any;
};
const CancelButtonAction = ({
  children,
  onClick,
  ...props
}: ButtonCancelProps) => {
  return (
    <CancelButton onClick={onClick} {...props}>
      {children}
    </CancelButton>
  );
};

export default CancelButtonAction;

import { useState } from 'react';
import * as React from 'react';
import { EContractRole } from '@/enums';

interface IContextProps {
  contractRole?: EContractRole;
  setContractRole?: (role?: EContractRole) => void;
}

const ContractRoleContext = React.createContext<IContextProps>({});
export const ContractRoleProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [contractRole, setContractRole] = useState<EContractRole>();

  return (
    <ContractRoleContext.Provider value={{ contractRole, setContractRole }}>
      {children}
    </ContractRoleContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export function useContractRole() {
  const context = React.useContext(ContractRoleContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { ContractRoleContext };

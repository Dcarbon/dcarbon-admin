import { EMintScheduleType } from '@/enums';

interface IMintInput {
  amount: number;
  device_id: string;
  project_id: string;
  nonce: number;
  mint_time: number;
}

interface IMintScheduleType {
  type: EMintScheduleType;
  name: string;
  time: string;
}

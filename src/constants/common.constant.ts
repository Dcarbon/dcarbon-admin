import { EMintScheduleType } from '@/enums';
import { IMintScheduleType } from '@/types/mint';

const AVAILABLE_COUNTRIES: string[] = ['VN', 'AU'];
const DEFAULT_PAGING = {
  page: 1,
  limit: 8,
};
const MINT_SCHEDULE_TYPE: IMintScheduleType[] = [
  {
    type: EMintScheduleType.DAILY,
    name: 'Daily',
    time: 'YYYY-MM-DD 00:00:01',
  },
  {
    type: EMintScheduleType.WEEKLY,
    name: 'Weekly',
    time: 'Monday YYYY-MM-DD 00:00:01',
  },
  {
    type: EMintScheduleType.MONTHLY,
    name: 'Monthly',
    time: 'YYYY-MM-01 00:00:01',
  },
  {
    type: EMintScheduleType.YEARLY,
    name: 'Yearly',
    time: 'YYYY-01-01 00:00:01',
  },
];
export { AVAILABLE_COUNTRIES, DEFAULT_PAGING, MINT_SCHEDULE_TYPE };

import { SplToken } from '@/types/projects';

interface IListCarbonManagerPage {
  data: SplToken[];
  paging: {
    total: number;
    page: number;
    limit: number;
  };
}

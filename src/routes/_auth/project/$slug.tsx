import { memo } from 'react';
import { getProjectBySlug } from '@/adapters/project';
import ProjectDashboard from '@/components/features/project/dashboard';
import OverView from '@/components/features/project/overview';
import { QUERY_KEYS } from '@/utils/constants';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useSearch } from '@tanstack/react-router';
import { Tabs } from 'antd';
import Devices from '@components/features/project/devices';

const postQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: [QUERY_KEYS.GET_PROJECT_BY_SLUG, slug],
    queryFn: () => getProjectBySlug(slug),
  });
export const Route = createFileRoute('/_auth/project/$slug')({
  validateSearch: (search: Record<string, unknown>): { key?: string } => {
    return {
      ...search,
    };
  },
  loader: ({ context, params: { slug } }) => {
    const { queryClient } = context as any;
    return queryClient.ensureQueryData(postQueryOptions(slug));
  },
  component: () => <ProjectDetail />,
});
const ProjectDetail = memo(() => {
  const slug = Route.useParams().slug;
  const { data } = useSuspenseQuery(postQueryOptions(slug));
  const search = useSearch({ from: '/_auth/project/$slug' });
  return (
    <div>
      {/* <NavigationBack href="/project" />*/}
      <Tabs
        defaultActiveKey={search.key?.toString() || '1'}
        items={[
          {
            key: '1',
            label: 'Overview',
            children: <OverView data={data} />,
          },
          {
            key: '2',
            label: 'Devices',
            children: <Devices projectSlug={slug} />,
          },
          {
            key: '3',
            label: 'Dashboard',
            children: <ProjectDashboard />,
          },
        ]}
      />
    </div>
  );
});

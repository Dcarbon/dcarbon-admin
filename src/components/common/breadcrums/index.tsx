import { memo } from 'react';
import { HomeOutlined } from '@ant-design/icons';
import { Link, useLocation } from '@tanstack/react-router';
import { Breadcrumb } from 'antd';

const capitalizeFirstLetter = (string: string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1).replace(/-/g, ' ');
};

const Breadcrumbs = memo(() => {
  const location = useLocation();
  const pathSnippets = location.pathname.split('/').filter((i) => i);

  const extraBreadcrumbItems = pathSnippets.map((snippet, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    return {
      key: url,
      title:
        index === pathSnippets.length - 1 ? (
          capitalizeFirstLetter(snippet)
        ) : (
          <Link to={url}>{capitalizeFirstLetter(snippet)}</Link>
        ),
    };
  });

  const breadcrumbItems = [
    {
      key: 'home',
      title: (
        <Link to="/">
          <HomeOutlined />
        </Link>
      ),
    },
    ...extraBreadcrumbItems,
  ];

  return (
    <Breadcrumb className="breadcrumbs-container" items={breadcrumbItems} />
  );
});

export default Breadcrumbs;

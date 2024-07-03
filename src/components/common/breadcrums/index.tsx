import { HomeOutlined } from '@ant-design/icons';
import { Link, useLocation } from '@tanstack/react-router';
import { Breadcrumb } from 'antd';

function Breadcrumbs() {
  const location = useLocation();
  const pathSnippets = location.pathname.split('/').filter((i) => i);
  const extraBreadcrumbItems = pathSnippets.map((snippet, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    return (
      <Breadcrumb.Item key={url}>
        {index === pathSnippets.length - 1 ? (
          snippet
        ) : (
          <Link to={url}>{snippet}</Link>
        )}
      </Breadcrumb.Item>
    );
  });

  const breadcrumbItems = [
    <Breadcrumb.Item key="home">
      <Link to="/">
        <HomeOutlined />
      </Link>
    </Breadcrumb.Item>,
  ].concat(extraBreadcrumbItems);

  return (
    <Breadcrumb className="breadcrumbs-container">{breadcrumbItems}</Breadcrumb>
  );
}

export default Breadcrumbs;

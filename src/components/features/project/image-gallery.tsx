import { memo, useCallback, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Flex, Image } from 'antd';

const ImageGallery = memo(({ data }: { data: string[] }) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePreview = useCallback((index: number) => {
    setCurrentIndex(index);
    setPreviewVisible(true);
  }, []);

  const renderExtraImagesCount = () => {
    const extraCount = data.length - 4;
    return (
      <div
        className="extra-image-count"
        onClick={() => handlePreview(4)}
        style={{
          width: '83px',
          height: '83px',
          display: 'flex',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          border: '1px solid #d9d9d9',
          borderRadius: '2px',
          marginLeft: '8px',
          position: 'relative',
        }}
      >
        <PlusOutlined style={{ fontSize: '12px' }} />
        <span style={{ fontSize: '12px', marginLeft: '4px' }}>
          {extraCount}
        </span>
      </div>
    );
  };
  return (
    <Flex align="center">
      <Image.PreviewGroup
        items={data}
        preview={{
          visible: previewVisible,
          current: currentIndex,
          onVisibleChange(value, _prevValue, current) {
            setPreviewVisible(value);
            setCurrentIndex(current);
          },
          onChange: (nextImg) => setCurrentIndex(nextImg),
        }}
      >
        {data.slice(0, 4).map((image: string, index: number) => (
          <Image
            className="project-image-view"
            key={index}
            src={image}
            alt="image"
            style={{
              width: '100px',
              height: '100px',
              objectFit: 'cover',
              margin: '4px',
            }}
            onClick={() => handlePreview(index)}
          />
        ))}
        {data.length > 4 && renderExtraImagesCount()}
      </Image.PreviewGroup>
    </Flex>
  );
});

export default ImageGallery;

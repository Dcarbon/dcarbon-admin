const MapOverView = ({ src }: { src: string }) => {
  return (
    <div dangerouslySetInnerHTML={{ __html: src }} className="iframe-map" />
  );
};

export default MapOverView;

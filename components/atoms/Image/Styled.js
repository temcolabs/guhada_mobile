export const ImageDiv = ({ backgroundColor, src, size, width, height }) => (
  <div
    style={{
      backgroundColor,
      backgroundImage: src,
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: !!size ? size : 'cover',
      width: !!width ? width : '100%',
      height: !!height ? height : '100%',
    }}
  />
);

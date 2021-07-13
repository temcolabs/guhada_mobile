export default function MypageSectionTitle({ wrapperStyle, title, children }) {
  return (
    <h2
      style={{
        marginTop: '0',
        marginBottom: '0',
        fontSize: '16px',
        fontWeight: 'bold',
        fontStretch: 'normal',
        fontStyle: 'normal',
        lineHeight: '1.14',
        letterSpacing: 'normal',
        textAlign: 'left',
        color: '#111',
        ...wrapperStyle,
      }}
    >
      {title || children}
    </h2>
  );
}

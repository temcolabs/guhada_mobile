import css from './KeyValueTable.module.scss';

export default function KeyValueTable({ children, wrapperStyle = {} }) {
  return (
    <table className={css.wrap} style={wrapperStyle}>
      <tbody>{children}</tbody>
    </table>
  );
}

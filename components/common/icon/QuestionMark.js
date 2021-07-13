import css from './QuestionMark.module.scss';

export default function QuestionMark({ wrapperStyle = {} }) {
  return <span style={wrapperStyle} className={css.wrap} />;
}

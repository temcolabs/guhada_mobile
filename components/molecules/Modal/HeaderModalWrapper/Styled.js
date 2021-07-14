import css from './HeaderModalWrapper.module.scss';

export const Header = ({ children }) => (
  <div className={css['header']}>{children}</div>
);

export const HeaderTitle = ({ children }) => (
  <div className={css['header-title']}>{children}</div>
);

export const HeaderIcon = ({ children }) => (
  <div className={css['header-icon']}>{children}</div>
);

export const HeaderContents = ({ children }) => (
  <div className={css['header-contents']}>{children}</div>
);

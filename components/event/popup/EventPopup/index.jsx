import css from './EventPopup.module.scss';
import PropTypes from 'prop-types';
import PopupPortal from 'components/templates/PopupPortal';

const EventPopup = ({ shade = false, data, handleClose }) => (
  <PopupPortal
    shade={shade}
    handleClose={() => handleClose({}, data.eventTitle)}
  >
    <div className={css['popup']}>
      {data.appDownLink ? (
        <a href={data.appDownLink} target="_blank" rel="noopener noreferrer">
          <div
            className={css['popup__content']}
            style={{
              backgroundImage: `url(${data.imgUrlM})`,
              backgroundColor: data.backgroundColor,
            }}
          />
        </a>
      ) : data.detailPageLink ? (
        <a href={data.detailPageLink} target="_blank" rel="noopener noreferrer">
          <div
            className={css['popup__content']}
            style={{
              backgroundImage: `url(${data.imgUrlM})`,
              backgroundColor: data.backgroundColor,
            }}
          />
        </a>
      ) : (
        <div
          className={css['popup__content']}
          style={{
            backgroundImage: `url(${data.imgUrlM})`,
            backgroundColor: data.backgroundColor,
          }}
        />
      )}
      <div className={css['popup__button']}>
        <div onClick={() => handleClose({ stop: true }, data.eventTitle)}>
          그만보기
        </div>
        <div onClick={() => handleClose({}, data.eventTitle)}>닫기</div>
      </div>
    </div>
  </PopupPortal>
);

EventPopup.propTypes = {
  shade: PropTypes.bool,
  data: PropTypes.any,
  handleClose: PropTypes.func,
};

export default EventPopup;

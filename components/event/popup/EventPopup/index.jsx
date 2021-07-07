import css from './EventPopup.module.scss';
import PropTypes from 'prop-types';
import ModalPortal from 'components/templates/ModalPortal';

const EventPopup = ({ shade = false, data, handleClose }) => (
  <ModalPortal
    shade={shade}
    background={false}
    closeButton={false}
    handleClose={() => handleClose({}, data.eventTitle)}
    center
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
  </ModalPortal>
);

EventPopup.propTypes = {
  shade: PropTypes.bool,
  data: PropTypes.any,
  handleClose: PropTypes.func,
};

export default EventPopup;

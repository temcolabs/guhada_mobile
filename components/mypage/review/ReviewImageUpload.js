import { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import css from './ReviewImageUpload.module.scss';
import { toJS } from 'mobx';

const SortableItem = SortableElement(
  ({ value, index, changeImageFile = () => {}, deleteImage = () => {} }) => (
    <div className={css.imageItem}>
      <div>
        <img src={value} alt="" />
      </div>
      <div className={css.imageHover}>
        <label
          className={css.photoItemWrap}
          htmlFor={`photo_upload_item` + index}
        >
          <img
            className={css.reviewIcon}
            src="/public/icon/icon_review_pencil.png"
            alt=""
          />
          <input
            type="file"
            onChange={(e) => changeImageFile(e, index)}
            id={`photo_upload_item` + index}
          />
        </label>
        <img
          className={css.reviewIcon}
          src="/public/icon/icon_review_del.png"
          alt=""
          onClick={() => {
            deleteImage(index);
          }}
        />
      </div>
    </div>
  )
);

const SortableList = SortableContainer(
  ({ items, changeImageFile = (e, i) => {}, deleteImage = (i) => {} }) => {
    return (
      <div className={css.imageList}>
        {items.map((value, index) => (
          <SortableItem
            key={`item-${index}`}
            index={index}
            value={value.reviewPhotoUrl}
            changeImageFile={changeImageFile}
            deleteImage={deleteImage}
          />
        ))}
      </div>
    );
  }
);

@inject('mypagereview')
@observer
class ReviewImageUpload extends Component {
  changeImageFile = (event, index) => {
    let files = event.target.files;
    const { mypagereview } = this.props;
    let reader = new FileReader();
    reader.onload = (e) => {
      let newImageList = toJS(mypagereview.newReviewPhotos);
      let newDeleteList = toJS(mypagereview.deletedReviewPhotos);
      newImageList[index].imageStatus = 'DELETED';
      mypagereview.deletedImages(newDeleteList.concat(newImageList[index]));

      newImageList[index] = {
        imageStatus: 'ADDED',
        reviewPhotoUrl: [e.target.result],
        newImage: true,
      };
      mypagereview.setReviewPhotos(newImageList);
    };

    let newImageFile = Array.from(mypagereview.reviewPhotosFile);

    let newDeleteFile = Array.from(mypagereview.deletedImagesFile);
    mypagereview.deletedFile(newDeleteFile.concat(newImageFile[index]));

    newImageFile[index] = files[0];
    mypagereview.setReviewPhotosFile(newImageFile);
    if (files[0]) reader.readAsDataURL(files[0]);
  };

  deleteImage = (index) => {
    const { mypagereview } = this.props;
    let newImageList = toJS(mypagereview.newReviewPhotos);
    let newImageFile = Array.from(mypagereview.reviewPhotosFile);

    if (newImageList[index].newImage !== true) {
      let newDeleteList = toJS(mypagereview.deletedReviewPhotos);
      let newDeleteFile = Array.from(mypagereview.deletedImagesFile);

      newImageList[index].imageStatus = 'DELETED';
      mypagereview.deletedImages(newDeleteList.concat(newImageList[index]));
      mypagereview.deletedFile(newDeleteFile.concat(newImageFile[index]));
    }

    newImageList.splice(index, 1);
    newImageFile.splice(index, 1);

    mypagereview.setReviewPhotos(newImageList);
    mypagereview.setReviewPhotosFile(newImageFile);
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    const { mypagereview } = this.props;
    let newReviewPhotos = toJS(mypagereview.newReviewPhotos);
    let changeImages = arrayMove(newReviewPhotos, oldIndex, newIndex);

    changeImages.map((data, index) => {
      //   data.photoOrder = index;
      if (data.imageStatus != 'ADDED') data.imageStatus = 'UPDATED';
    });

    mypagereview.setReviewPhotos(changeImages);
    mypagereview.setReviewPhotosFile(
      arrayMove(mypagereview.reviewPhotosFile, oldIndex, newIndex)
    );
  };
  render() {
    const { mypagereview } = this.props;

    return (
      <Fragment>
        <div className="flex" style={{ paddingBottom: '20px' }}>
          {mypagereview.reviewPhotos ? (
            <SortableList
              items={mypagereview.newReviewPhotos}
              onSortEnd={this.onSortEnd}
              axis="xy"
              previewFile={this.previewFile}
              changeImageFile={this.changeImageFile}
              deleteImage={this.deleteImage}
              distance={2}
            />
          ) : null}
        </div>
      </Fragment>
    );
  }
}

export default ReviewImageUpload;

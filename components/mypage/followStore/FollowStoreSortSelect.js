import { Component, Fragment } from 'react';
import Select from 'react-select';
import { inject, observer } from 'mobx-react';

@inject('mypageFollow')
@observer
class FollowStoreSortSelect extends Component {
  render() {
    let { mypageFollow } = this.props;
    let likeSortOption = [
      {
        value: 'DESC',
        label: '최신 등록순',
      },
      {
        value: 'ASC',
        label: '나중 등록순',
      },
    ];
    let selectStyles = {
      container: () => ({
        position: 'relative',
        width: '100%',
      }),
      valueContainer: () => ({
        padding: 0,
      }),
      control: (provided) => ({
        ...provided,
        minHeight: 30,
        border: 'solid 1px #ddd',
        boxShadow: 0,
        padding: '0px 11px 0px 11px',
        borderRadius: 'none',
        fontSize: 12,
      }),
      placeholder: (provided) => ({
        ...provided,
        color: '#aaa',
        fontWeight: 'normal',
      }),
      option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isFocused ? '#f7f7f8' : '#fff',
        fontSize: 12,
        color: state.isSelected ? '#111' : '#111',
      }),
      menu: (provided, state) => ({
        ...provided,
        margin: 0,
        borderRadius: 'none',
        border: 'none',
        width: '130px',
      }),
      dropdownIndicator: (provided, state) => ({
        ...provided,
        transform: state.selectProps.menuIsOpen ? 'rotate(-180deg)' : '',
        padding: 0,
        width: '16px',
        height: '20px',
        color:
          state.isSelected || state.isDisabled || state.isFocused
            ? '#aaa'
            : '#aaa',
        border: 'none',
      }),
      indicatorsContainer: () => ({
        padding: 0,
      }),
    };

    return (
      <Fragment>
        <Select
          styles={selectStyles}
          options={likeSortOption}
          defaultValue={likeSortOption[0]}
          onChange={(likeSortOption) => {
            mypageFollow.likeSortChange(likeSortOption);
          }}
          isSearchable={false}
        />
      </Fragment>
    );
  }
}

export default FollowStoreSortSelect;

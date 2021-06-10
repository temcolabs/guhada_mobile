import { useEffect } from 'react';
import useStores from 'stores/useStores';
import isServer from 'childs/lib/common/isServer';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';

TempPage.getInitialProps = (ctx) => {
  if (isServer) {
  }

  return {};
};

function TempPage() {
  const { searchByFilter: searchStore, searchByFilterShiz } = useStores();

  return (
    <div>
      <h1>SearchStore Test</h1>
      <div>
        <div style={{ border: '1px solid black' }}>
          <h3>state</h3>
          <div>@observable state - {searchStore.state}</div>
          <div>@observable state2 - {searchByFilterShiz.state}</div>
          <div>@observable countOfDeals - {searchStore.countOfDeals}</div>
        </div>

        <br />

        <div style={{ border: '1px solid black' }}>
          <h3>
            params - {searchStore.params.page * searchStore.params.unitPerPage}
          </h3>
          <ul>
            <li>
              <label htmlFor="page">
                @observable page - {searchStore.params.page}
              </label>
              <input
                style={{
                  backgroundColor: 'pink',
                  width: '50px',
                  textAlign: 'right',
                }}
                type="text"
                id="page"
                value={searchStore.params.page}
                onChange={(e) =>
                  searchStore.setParams({ page: e.target.value })
                }
              />
            </li>
            <li>
              <label htmlFor="unitPerPage">
                @observable unitPerPage - {searchStore.params.unitPerPage}
              </label>
              <input
                style={{
                  backgroundColor: 'pink',
                  width: '50px',
                  textAlign: 'right',
                }}
                type="text"
                id="unitPerPage"
                value={searchStore.params.unitPerPage}
                onChange={(e) =>
                  searchStore.setParams({ unitPerPage: e.target.value })
                }
              />
            </li>
          </ul>
          <button
            style={{ backgroundColor: 'lightgrey' }}
            onClick={searchStore.resetParams}
          >
            @action resetParams
          </button>
        </div>

        <br />

        <div style={{ border: '1px solid black' }}>
          <h3>body</h3>
          <button
            style={{ backgroundColor: 'lightgrey' }}
            onClick={searchStore.resetBody}
          >
            @action resetBody
          </button>
        </div>
      </div>

      <br />

      <button
        style={{ backgroundColor: 'lightgrey' }}
        onClick={searchStore.searchByFilter}
      >
        @action search
      </button>
      <br />

      <div>
        <h2>@observable deals - {searchStore.deals.length}</h2>
        {searchStore.deals.map((deal) => (
          <div>{deal.productId}</div>
        ))}
      </div>
    </div>
  );
}

export default observer(TempPage);

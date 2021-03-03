import React from 'react';
import _ from 'lodash';

const Pagination = (props) => {
  // want to have an array of page numbers, then use the map method to map
  //each page number to a list item.
  const { itemsCount, pageSize } = props;

  const pagesCount = itemsCount / pageSize;
  // must include plus one becuase the last number will not be included
  const pages = _.range(1, pagesCount + 1); // [1,...pagesCount]



  return (<nav>
    <ul className="pagination">
      { pages.map(page => (
      <li key={page} className="page-item">
        <a className="page-link">{ page }</a>
        </li>
        ))}
    </ul>
  </nav>
  );
}
 
export default Pagination;
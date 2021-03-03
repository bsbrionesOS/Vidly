import React, { Component } from 'react';

class TableHeader extends Component {

  raiseSort = path => {
    const  sortColumn = {...this.props.sortColumn};
    if (sortColumn.path === path) 
      sortColumn.order = (sortColumn.order === 'asc') ? 'desc': 'asc';
      else {
        sortColumn.path = path;
        sortColumn.order = 'asc';
      }
      this.props.onSort(sortColumn)
  }

  render() { 
    return ( 
    <thead>
      <tr>
        {this.props.columns.map(colums => (
        <th key={colums.path || colums.key}
        onClick={() => this.raiseSort(colums.path)}>{colums.label}</th>
        ))}
      </tr>
    </thead> );
  }
}
 
export default TableHeader;
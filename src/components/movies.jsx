import React, { Component } from "react";
import {Link} from "react-router-dom";
import ListGroup from "./common/listGroup"
import MoviesTable from './moviesTable';
import Pagination from "./common/pagination";
import { getMovies } from "../services/fakeMovieService";
import { paginate} from "../utils/paginate"
import { getGenres } from "../services/fakeGenreService";
import SearchBox from './searchBox';
import _ from 'lodash'

class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    currentPage: 1,
    pageSize: 4,
    searchQuery: "",
    selectedGenre: "",
    sortColumn: { path: 'title', order: 'asc' }
  };

  componentDidMount() {
    const genres = [{ _id: "", name: 'All Genres'},...getGenres()]
    this.setState({ movies: getMovies(), genres });
  }

  handleDelete = movie => {
    // getting all the movies except for the movie that has been deleted
    const movies = this.state.movies.filter(m => m._id !== movie._id);
    this.setState({ movies });

  }

  handleLike = (movie) => {
    const movies = [...this.state.movies];
    const index = movies.indexOf(movie);
    movies[index] = { ...movies[index] };
    movies[index].liked = !movies[index].liked;
    this.setState({ movies })
  }
  // this should take in the new page number
  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  }

  handleGenreSelect = genre => {
    this.setState({ selectedGenre: genre, searchQuery: "", currentPage: 1})
  }

  handleSearch = query => {
    this.setState({selectedGenre: query, selectedGenre: null, currentPage: 1 });
  }

  handleSort = sortColumn => {
    this.setState({ sortColumn })
  }

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      sortColumn,
      selectedGenre,
      searchQuery,
      movies: allMovies
    } = this.state;

    let filtered = allMovies;
    if (searchQuery)
      filtered = allMovies.filter(m =>
        m.title.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    else if (selectedGenre && selectedGenre._id)
      filtered = allMovies.filter(m => m.genre._id === selectedGenre._id);

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const movies = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: movies };
  };

  render() {
    const { length: count } = this.state.movies;
    const { 
      pageSize, 
      currentPage, 
      searchQuery,
      sortColumn } = this.state;

    if (count === 0) return <p> There are no movies in the database.</p>;

    const { totalCount, data: movies} = this.getPagedData()

    return (
      <div className="row">
        <div className="col-3">
          <ListGroup 
          items={this.state.genres} 
          onItemSelect={this.handleGenreSelect}
          selectedItem={this.state.selectedGenre}
          />
        </div>
        <div className="col">
          <Link
          to="/movies/new"
          className="btn btn-primary"
          style={{ marginBottom: 20 }}
          >
            New Movie
            </Link>
        <p>Showing {totalCount} movies in the database</p>
        <SearchBox value={searchQuery} onChange={this.handleSearch} />
        <MoviesTable 
        movies={movies} 
        onLike={this.handleLike} 
        onDelete={this.handleDelete}
        onSort={this.handleSort}
        sortColumn={sortColumn}
        />
        <Pagination
          itemsCount={totalCount}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={this.handlePageChange}
        />
        </div>
      </div>
    )
  }
}

export default Movies
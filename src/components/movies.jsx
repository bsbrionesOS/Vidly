import React, { Component } from "react";
import ListGroup from "./common/listGroup"
import MoviesTable from './moviesTable';
import Pagination from "./common/pagination";
import { getMovies } from "../services/fakeMovieService";
import { paginate} from "../utils/paginate"
import { getGenres } from "../services/fakeGenreService";
import _ from 'lodash'

class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    currentPage: 1,
    selectedGenre: "",
    pageSize: 4,
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
    this.setState({ selectedGenre: genre, currentPage: 1})
  }

  handleSort = sortColumn => {
    this.setState({ sortColumn })
  }

  render() {
    const { length: count } = this.state.movies;
    const { 
      pageSize, 
      currentPage, 
      movies: allMovies, 
      selectedGenre, 
      sortColumn } = this.state;

    if (count === 0) return <p> There are no movies in the database.</p>;

    const filtered = selectedGenre && selectedGenre._id ? allMovies.filter(m => m.genre._id === selectedGenre._id) : allMovies;

    const sorted =   _.orderBy(filtered, [sortColumn.path], [sortColumn.order])

    const movies = paginate(sorted, currentPage, pageSize)
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
        <p>Showing {filtered.length} movies in the database</p>
        <MoviesTable 
        movies={movies} 
        onLike={this.handleLike} 
        onDelete={this.handleDelete}
        onSort={this.handleSort}
        sortColumn={sortColumn}
        />
        <Pagination
          itemsCount={filtered.length}
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
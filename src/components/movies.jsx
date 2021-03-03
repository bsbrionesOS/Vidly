import React, { Component } from "react";
import { getMovies } from "../services/fakeMovieService";
import Like from "./common/like";
import ListGroup from "./common/listGroup"
import Pagination from "./common/pagination";
import { paginate, Paginate } from "../utils/paginate"
import { getGenres } from "../services/fakeGenreService";

class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    currentPage: 1,
    selectedGenre: "",
    pageSize: 4
  };

  componentDidMount() {
    this.setState({ movies: getMovies(), genres: getGenres() });
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
    this.setState({ selectedGenre: genre})
  }

  render() {
    const { length: count } = this.state.movies;
    const { pageSize, currentPage, movies: allMovies } = this.state;

    if (count === 0) return <p> There are no movies in the database.</p>;

    const movies = paginate(allMovies, currentPage, pageSize)
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
        <p>Showing {count} movies in the database</p>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Genre</th>
              <th>Stock</th>
              <th>Rate</th>
              <th>Likes</th>
            </tr>
          </thead>
          <tbody>
            {movies.map(movie => <tr key={movie._id}>
              <td>{movie.title}</td>
              <td>{movie.genre.name}</td>
              <td>{movie.numberInStock}</td>
              <td>{movie.dailyRentalRate}</td>
              <td>
                <Like liked={movie.liked} onClick={() => this.handleLike(movie)} />
              </td>
              <td><button onClick={() => this.handleDelete(movie)} className="btn btn-danger btn-sm">Delete</button></td>
            </tr>)}
          </tbody>
        </table>
        <Pagination
          itemsCount={count}
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
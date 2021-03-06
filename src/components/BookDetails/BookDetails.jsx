import React, { Component } from 'react'
import axios from 'axios'
import { Media } from 'react-bootstrap'

class BookDetails extends Component {
  state = {
    bookId: '',
    bookOnShelf: 'none',
    book: {},
    isError: false,
    selected: 'None',
    shelfData: {
      none: 'None',
      wantToRead: 'Want To Read',
      currentlyReading: 'Currently Reading',
      read: 'Read'
    }
  }
  updateShelf = e => {
    e.preventDefault()
    this.setState(
      {
        bookId: this.props.match.params.bookId,
        selected: e.target.value
      },
            () => {
              axios
                    .get(`http://localhost:7000/bookshelf/update/${this.state.bookId}/${this.state.selected}`)
                    .then(response => {
                      this.setState({
                        bookOnShelf: this.state.selected ? this.state.selected : 'None'
                      })
                    }, this.getBookDetails())
                    .catch(error => {
                      this.setState({ isError: true })
                    })
            }
        )
  }
  componentDidMount () {
    this.getBookDetails()
  }
  getBookDetails = () => {
    if (this.props.match.url) {
      this.setState(
        {
          bookId: this.props.match.params.bookId
        },
                () => {
                  axios
                        .get(`http://localhost:7000/book/${this.state.bookId}`)
                        .then(response => {
                          this.setState({
                            book: response.data.book,
                            bookOnShelf: response.data.book.shelf,
                            selected: response.data.book.shelf
                          })
                        })
                        .catch(error => {
                          this.setState({ isError: true })
                        })
                }
            )
    }
  }
  render () {
    const { book } = this.state
    return (
      <div>
        <Media>
          <Media.Left align='top'>
            <img src={book.imageLinks ? book.imageLinks.thumbnail : ''} alt={book.title} />
          </Media.Left>
          <Media.Body>
            <Media.Heading>
              <strong>{book.title}</strong>
              {book.subtitle ? <p>{book.subtitle}</p> : ''}
            </Media.Heading>
            <p>
              <strong>Author(s):</strong>
              <br />
              {book.authors ? book.authors.join(', ') : book.authors}
            </p>
            <p>{book.description}</p>
            <p>Publisher: {book.publisher ? book.publisher : ''}</p>
            <p>Published Date: {book.publishedDate ? book.publishedDate : ''}</p>
            <p>Categories: {book.categories ? book.categories.join(', ') : 'None'}</p>
          </Media.Body>
        </Media>
        <div>
          <h4>Current Shelf</h4>
          <div>
            <select
              name='select'
              class='form-control SelectShelf'
              value={this.state.selected}
              onChange={e => this.updateShelf(e)}
                        >
              {Object.entries(this.state.shelfData).map((shelf, idx) => {
                const key = 'shelf-index-' + idx
                if (this.state.bookOnShelf === shelf[0]) {
                  return (
                    <option key={key} value={shelf[0]}>
                        {shelf[1]}
                      </option>
                  )
                } else {
                  return (
                    <option key={key} value={shelf[0]}>
                        {shelf[1]}
                      </option>
                  )
                }
              })}
            </select>
          </div>
        </div>
      </div>
    )
  }
}

export default BookDetails

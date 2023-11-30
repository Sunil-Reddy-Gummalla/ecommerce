import { Component } from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Gender',
    children: ['Men', 'Women'],
  },
  {
    name: 'Color',
    children: ['Blue', 'Red', 'White'],
  },
  {
    name: 'Price',
    children: ['0-250', '250-450', '450-1000'],
  },
  {
    name: 'Type',
    children: ['Polo', 'Hoodie', 'Basic'],
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class AllProductsSection extends Component {
  state = {
    productsList: [],
    apiStatus: apiStatusConstants.initial,
    activeOptionId: sortbyOptions[0].optionId,
    activeCategoryName: '',
    searchInput: '',
    childName: '',
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const {
      activeCategoryName,
      searchInput,
      childName,
      activeOptionId
    } = this.state
    let apiUrl = 'http://localhost:8000/details?';

    if (childName) {
      if (activeCategoryName === 'Price') {
        const [minPrice, maxPrice] = childName.split('-');
        apiUrl += `price_gte=${minPrice}&price_lte=${maxPrice}&`;
      } else {
        apiUrl += `${activeCategoryName.toLowerCase()}=${childName}&`;
      }
    }

    if (searchInput) {
      apiUrl += `name_like=${searchInput}&`;
    }
    if (activeOptionId === 'PRICE_HIGH') {
      apiUrl += '_sort=price&_order=desc';
    } else if (activeOptionId === 'PRICE_LOW') {
      apiUrl += '_sort=price&_order=asc';
    }
    const response = await fetch(apiUrl)
    if (response.ok) {
      const fetchedData = await response.json()
      console.log(fetchedData)
      const updatedData = fetchedData.map(product => ({
        title: product.name,
        brand: product.type,
        price: product.price,
        id: product.id,
        imageUrl: product.imageURL,
        rating: product.rating,
      }))
      this.setState({
        productsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  changeSortby = activeOptionId => {
    this.setState({ activeOptionId }, this.getProducts)
  }

  clearFilters = () => {
    this.setState(
      {
        searchInput: '',
        activeCategoryName: '',
        childName: '',
      },
      this.getProducts,
    )
  }

  changeCategory = activeCategoryName => {
    this.setState({ activeCategoryName })
  }

  enterSearchInput = () => {
    this.getProducts()
  }

  changeSearchInput = searchInput => {
    this.setState({ searchInput })
  }

  renderFailureView = () => (
    <div className="products-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="all-products-error"
        className="products-failure-img"
      />
      <h1 className="product-failure-heading-text">
        Oops! Something Went Wrong
      </h1>
      <p className="products-failure-description">
        We are having some trouble processing your request. Please try again.
      </p>
    </div>
  )

  renderProductsListView = () => {
    const { productsList, activeOptionId } = this.state
    const shouldShowProductsList = productsList.length > 0

    return shouldShowProductsList ? (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
        />
        <ul className="products-list">
          {productsList.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    ) : (
      <div className="no-products-view">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
          className="no-products-img"
          alt="no products"
        />
        <h1 className="no-products-heading">No Products Found</h1>
        <p className="no-products-description">
          We could not find any products. Try other filters.
        </p>
      </div>
    )
  }

  renderLoadingView = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderAllProducts = () => {
    const { apiStatus } = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductsListView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
  onChildButtonClick = childName => {
    this.setState({ childName }, this.getProducts)
  };
  render() {
    const { activeCategoryName, searchInput } = this.state

    return (
      <div className="all-products-section">
        <FiltersGroup
          searchInput={searchInput}
          categoryOptions={categoryOptions}
          changeSearchInput={this.changeSearchInput}
          enterSearchInput={this.enterSearchInput}
          activeCategoryName={activeCategoryName}
          changeCategory={this.changeCategory}
          clearFilters={this.clearFilters}
          onChildButtonClick={this.onChildButtonClick}
        />
        {this.renderAllProducts()}
      </div>
    )
  }
}

export default AllProductsSection

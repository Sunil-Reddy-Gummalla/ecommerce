import { Component } from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import { BsPlusSquare, BsDashSquare } from 'react-icons/bs'

import CartContext from '../../context/CartContext'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productData: {},
    similarProductsData: [],
    apiStatus: apiStatusConstants.initial,
    quantity: 1,
  }

  componentDidMount() {
    this.getProductData()
  }

  getFormattedData = product => ({
    title: product.name,
    brand: product.type,
    price: product.price,
    id: product.id,
    imageUrl: product.imageURL,
    rating: product.rating,
  })

  getProductData = async () => {
    const { match } = this.props
    const { params } = match
    const { id } = params

    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const apiUrl = `http://localhost:8000/details/${id}`
    const response = await fetch(apiUrl)
    if (response.ok) {
      const fetchedData = await response.json()
      console.log(fetchedData);
      const updatedData = this.getFormattedData(fetchedData)
      console.log(updatedData);
      this.setState({
        productData: updatedData,
        apiStatus: apiStatusConstants.success,
        availableQuantity: fetchedData.quantity -1,
      })
    }
    if (response.status === 404) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div className="products-details-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="product-details-error-view-container">
      <img
        alt="error view"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        className="error-view-image"
      />
      <h1 className="product-not-found-heading">Product Not Found</h1>
      <button type="button" className="button">
        Continue Shopping
      </button>
    </div>
  )

  onDecrementQuantity = () => {
    const { quantity } = this.state
    if (quantity > 1) {
      this.setState(prevState => ({ quantity: prevState.quantity - 1 , availableQuantity: prevState.availableQuantity +1}))
    }
  }

  onIncrementQuantity = () => {
    const {  availableQuantity } = this.state;

    if (availableQuantity > 0) {
      this.setState((prevState) => ({ quantity: prevState.quantity + 1, availableQuantity: prevState.availableQuantity -1 }));
    }
  }

  renderProductDetailsView = () => (
    <CartContext.Consumer>
      {value => {
        const { productData, quantity, availableQuantity } = this.state;
        const {
          brand,
          description,
          imageUrl,
          price,
          title,
        } = productData
        const { addCartItem } = value
        const onClickAddToCart = () => {
          addCartItem({ ...productData, quantity })
        }

        return (
          <div className="product-details-success-view">
            <div className="product-details-container">
              <img src={imageUrl} alt="product" className="product-image" />
              <div className="product">
                <h1 className="product-name">{title}</h1>
                <p className="price-details">Rs {price}/-</p>
                <p className="product-description">{description}</p>
                <div className="label-value-container">
                  <p className="label">Available:</p>
                  <p className="value">
                    {availableQuantity > 0 ? availableQuantity : 'Out of Stock'}
                  </p>
                </div>
                <div className="label-value-container">
                  <p className="label">Brand:</p>
                  <p className="value">{brand}</p>
                </div>
                <hr className="horizontal-line" />
                <div className="quantity-container">
                  <button
                    type="button"
                    className="quantity-controller-button"
                    onClick={this.onDecrementQuantity}
                    disabled={quantity === 1}
                  >
                    <BsDashSquare className="quantity-controller-icon" />
                  </button>
                  <p className="quantity">{quantity}</p>
                  <button
                    type="button"
                    className="quantity-controller-button"
                    onClick={this.onIncrementQuantity}
                    disabled={availableQuantity === 0}
                  >
                    <BsPlusSquare className="quantity-controller-icon" />
                  </button>
                </div>
                <button
                  type="button"
                  className="button add-to-cart-btn"
                  onClick={onClickAddToCart}
                >
                  ADD TO CART
                </button>
              </div>
            </div>
          </div>
        )
      }}
    </CartContext.Consumer>
  )

  renderProductDetails = () => {
    const { apiStatus } = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductDetailsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="product-item-details-container">
          {this.renderProductDetails()}
        </div>
      </>
    )
  }
}

export default ProductItemDetails

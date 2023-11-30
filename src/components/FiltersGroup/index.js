import { BsSearch } from 'react-icons/bs';
import { Component } from 'react';

import './index.css';

class FiltersGroup extends Component {
  renderCategoriesList = () => {
    const { categoryOptions } = this.props;

    return categoryOptions.map(category => {
      const { changeCategory, activeCategoryName, onChildButtonClick } = this.props;
      const onClickCategoryItem = () => changeCategory(category.name);
      const isActive = category.name === activeCategoryName;
      const categoryClassName = isActive ? 'category-name active-category-name' : 'category-name';

      return (
        <li className="category-item" key={category.name} onClick={onClickCategoryItem}>
          <p className={categoryClassName}>{category.name}</p>
          {isActive && category.children && (
            <ul className="children-list">
              {category.children.map(child => (
                <li key={child}>
                  <button type="button" onClick={() => onChildButtonClick(child)}>
                    {child}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </li>
      );
    });
  };

  renderProductCategories = () => (
    <>
      <h1 className="category-heading">Category</h1>
      <ul className="categories-list">{this.renderCategoriesList()}</ul>
    </>
  );

  onEnterSearchInput = event => {
    const { enterSearchInput } = this.props;
    if (event.key === 'Enter') {
      enterSearchInput();
    }
  };

  onChangeSearchInput = event => {
    const { changeSearchInput } = this.props;
    changeSearchInput(event.target.value);
  };

  renderSearchInput = () => {
    const { searchInput } = this.props;
    return (
      <div className="search-input-container">
        <input
          value={searchInput}
          type="search"
          className="search-input"
          placeholder="Search"
          onChange={this.onChangeSearchInput}
          onKeyDown={this.onEnterSearchInput}
        />
        <BsSearch className="search-icon" />
      </div>
    );
  };

  render() {
    const { clearFilters } = this.props;

    return (
      <div className="filters-group-container">
        {this.renderSearchInput()}
        {this.renderProductCategories()}
        <button type="button" className="clear-filters-btn" onClick={clearFilters}>
          Clear Filters
        </button>
      </div>
    );
  }
}

export default FiltersGroup;

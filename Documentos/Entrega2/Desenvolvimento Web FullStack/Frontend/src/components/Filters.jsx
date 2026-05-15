import { useState } from 'react';

const categories = [
  'Premium Nuts',
  'Almonds',
  'Cashews',
  'Walnuts',
  'Pistachios',
  'Mixed Nuts',
];

const ratings = [
  { value: 4.0, label: '4.0 & up' },
  { value: 4.5, label: '4.5 & up' },
];

export default function Filters({ onFiltersChange }) {
  const [selectedCategories, setSelectedCategories] = useState(['Premium Nuts']);
  const [priceRange, setPriceRange] = useState(100);
  const [selectedRating, setSelectedRating] = useState(null);
  const [inStockOnly, setInStockOnly] = useState(false);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) => {
      const updated = prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category];
      onFiltersChange({
        categories: updated.length > 0 ? updated : ['Premium Nuts'],
        priceMax: priceRange,
        ratingMin: selectedRating,
        inStock: inStockOnly,
      });
      return updated.length > 0 ? updated : ['Premium Nuts'];
    });
  };

  const handlePriceChange = (e) => {
    const newPrice = parseInt(e.target.value, 10);
    setPriceRange(newPrice);
    onFiltersChange({
      categories: selectedCategories,
      priceMax: newPrice,
      ratingMin: selectedRating,
      inStock: inStockOnly,
    });
  };

  const handleRatingChange = (rating) => {
    const newRating = selectedRating === rating ? null : rating;
    setSelectedRating(newRating);
    onFiltersChange({
      categories: selectedCategories,
      priceMax: priceRange,
      ratingMin: newRating,
      inStock: inStockOnly,
    });
  };

  const handleStockChange = () => {
    const newStock = !inStockOnly;
    setInStockOnly(newStock);
    onFiltersChange({
      categories: selectedCategories,
      priceMax: priceRange,
      ratingMin: selectedRating,
      inStock: newStock,
    });
  };

  return (
    <aside className="w-full md:w-64 bg-white rounded-lg border border-marketplace-cream shadow-sm p-6">
      <h3 className="font-semibold text-marketplace-ink mb-4 text-sm">FILTERS</h3>

      {/* Type Filter */}
      <div className="mb-6">
        <h4 className="font-semibold text-marketplace-ink text-xs mb-3">TYPE</h4>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={() => handleCategoryChange(cat)}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm text-marketplace-muted">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div className="mb-6">
        <h4 className="font-semibold text-marketplace-ink text-xs mb-3">PRICE RANGE</h4>
        <input
          type="range"
          min="0"
          max="300"
          value={priceRange}
          onChange={handlePriceChange}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-marketplace-muted mt-2">
          <span>$0</span>
          <span>${priceRange}+</span>
        </div>
      </div>

      {/* Rating Filter */}
      <div className="mb-6">
        <h4 className="font-semibold text-marketplace-ink text-xs mb-3">RATING</h4>
        <div className="space-y-2">
          {ratings.map((rating) => (
            <label key={rating.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedRating === rating.value}
                onChange={() => handleRatingChange(rating.value)}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm text-marketplace-muted">{rating.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Availability Filter */}
      <div>
        <h4 className="font-semibold text-marketplace-ink text-xs mb-3">AVAILABILITY</h4>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={handleStockChange}
            className="w-4 h-4 rounded"
          />
          <span className="text-sm text-marketplace-muted">In stock only</span>
        </label>
      </div>
    </aside>
  );
}

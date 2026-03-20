import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProductStore } from '@/store/productStore';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProductsPage() {
  const {
    products,
    categories,
    totalPages,
    currentPage,
    isLoading,
    filters,
    fetchProducts,
    fetchCategories,
    setFilters,
    clearFilters,
  } = useProductStore();
  const { addItem } = useCartStore();
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ keyword: searchKeyword });
    fetchProducts({ keyword: searchKeyword });
  };

  const handleCategoryChange = (category) => {
    setFilters({ category });
    fetchProducts({ category });
  };

  const handlePageChange = (page) => {
    fetchProducts({ page });
  };

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Products</h1>

      <div className="mb-8 flex flex-col gap-4 md:flex-row">
        <form onSubmit={handleSearch} className="flex flex-1 gap-2">
          <Input
            placeholder="Search products..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">Search</Button>
        </form>

        <select
          className="rounded-md border border-input bg-background px-3 py-2"
          value={filters.category}
          onChange={(e) => handleCategoryChange(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <Button variant="outline" onClick={() => { clearFilters(); setSearchKeyword(''); fetchProducts(); }}>
          Clear Filters
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="aspect-square bg-muted" />
              <CardHeader>
                <div className="h-4 w-3/4 rounded bg-muted" />
              </CardHeader>
              <CardContent>
                <div className="h-4 w-1/2 rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-muted-foreground">No products found</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <Card key={product._id} className="overflow-hidden">
              <Link to={`/products/${product._id}`}>
                <div className="aspect-square bg-muted">
                  {product.images?.[0] && (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
              </Link>
              <CardHeader>
                <Link to={`/products/${product._id}`}>
                  <CardTitle className="line-clamp-1">{product.name}</CardTitle>
                </Link>
                <p className="text-sm text-muted-foreground">{product.category}</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold">${product.price}</span>
                  <div className="flex items-center">
                    <span className="text-sm text-muted-foreground">
                      {product.ratings} ({product.numReviews})
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => addItem(product)}
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {[...Array(totalPages)].map((_, i) => (
            <Button
              key={i}
              variant={currentPage === i + 1 ? 'default' : 'outline'}
              size="sm"
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

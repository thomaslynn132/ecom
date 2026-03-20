import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProductStore } from '@/store/productStore';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { currentProduct, isLoading, fetchProductById, addReview } = useProductStore();
  const { addItem } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetchProductById(id);
  }, [id]);

  const handleAddToCart = () => {
    if (currentProduct) {
      addItem(currentProduct, quantity);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await addReview(id, { rating, comment });
      setComment('');
      setRating(5);
    } catch (err) {
      console.error('Failed to add review:', err);
    }
  };

  if (isLoading || !currentProduct) {
    return (
      <div className="animate-pulse">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="aspect-square bg-muted" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 rounded bg-muted" />
            <div className="h-6 w-1/4 rounded bg-muted" />
            <div className="h-20 w-full rounded bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="aspect-square bg-muted">
        {currentProduct.images?.[0] && (
          <img
            src={currentProduct.images[0]}
            alt={currentProduct.name}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <div>
        <h1 className="text-3xl font-bold">{currentProduct.name}</h1>
        <p className="mt-2 text-muted-foreground">{currentProduct.category}</p>
        
        <div className="mt-4 flex items-center gap-4">
          <span className="text-2xl font-bold">${currentProduct.price}</span>
          <div className="flex items-center">
            <span className="text-yellow-500">{'★'.repeat(Math.round(currentProduct.ratings))}</span>
            <span className="ml-2 text-muted-foreground">
              ({currentProduct.ratings}) {currentProduct.numReviews} reviews
            </span>
          </div>
        </div>

        <p className="mt-4 text-muted-foreground">{currentProduct.description}</p>

        <div className="mt-6 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label>Quantity:</Label>
            <Input
              type="number"
              min="1"
              max={currentProduct.stock}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-20"
            />
          </div>
          <Button onClick={handleAddToCart} disabled={currentProduct.stock === 0}>
            {currentProduct.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          {currentProduct.stock > 0 ? `${currentProduct.stock} in stock` : 'Out of stock'}
        </p>

        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold">Reviews</h2>
          {currentProduct.reviews?.length === 0 ? (
            <p className="text-muted-foreground">No reviews yet</p>
          ) : (
            <div className="space-y-4">
              {currentProduct.reviews?.map((review, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{review.name}</span>
                      <span className="text-yellow-500">{'★'.repeat(review.rating)}</span>
                    </div>
                    <p className="mt-2 text-muted-foreground">{review.comment}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {isAuthenticated && (
            <form onSubmit={handleSubmitReview} className="mt-6 space-y-4">
              <h3 className="font-semibold">Write a Review</h3>
              <div>
                <Label>Rating</Label>
                <select
                  value={rating}
                  onChange={(e) => setRating(parseInt(e.target.value))}
                  className="ml-2 rounded border border-input bg-background px-2 py-1"
                >
                  {[1, 2, 3, 4, 5].map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Comment</Label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
                  rows={3}
                  required
                />
              </div>
              <Button type="submit">Submit Review</Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

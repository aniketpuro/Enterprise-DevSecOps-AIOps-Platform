import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ShoppingCart as AddToCartIcon,
  Favorite as WishlistIcon,
  FavoriteBorder as WishlistBorderIcon,
  Star as StarIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onToggleWishlist?: (productId: string) => void;
  isInWishlist?: boolean;
  showQuickView?: boolean;
  onQuickView?: (product: Product) => void;
  variant?: 'grid' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onToggleWishlist,
  isInWishlist = false,
  variant = 'grid',
}) => {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  const isOutOfStock = (product.inventory_quantity ?? product.inventory ?? 0) === 0;

  const price =
    typeof product.price === 'string' ? parseFloat(product.price) : product.price;
  const originalPrice =
    product.originalPrice != null
      ? typeof product.originalPrice === 'string'
        ? parseFloat(product.originalPrice)
        : product.originalPrice
      : undefined;

  const discount =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : undefined;

  const imageSrc = imgError
    ? 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNGNUY1RjUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI0FBQSIgZm9udC1zaXplPSIxNCI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+'
    : product.imageUrl || '/product-images/placeholder.jpg';

  const rating = product.rating ?? 4.5;
  const reviewCount = product.reviewCount ?? 0;

  if (variant === 'list') {
    return (
      <Card
        sx={{
          display: 'flex',
          height: 180,
          borderRadius: 3,
          overflow: 'hidden',
          border: '1px solid #f0ece4',
          transition: 'all 0.3s ease',
          '&:hover': { boxShadow: '0 8px 30px rgba(0,0,0,0.12)', transform: 'translateY(-2px)' },
        }}
      >
        {/* Image */}
        <Box
          sx={{ width: 180, flexShrink: 0, position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
          onClick={() => navigate(`/products/${product.id}`)}
        >
          <Box
            component="img"
            src={imageSrc}
            alt={product.name}
            onError={() => setImgError(true)}
            sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease', '&:hover': { transform: 'scale(1.06)' } }}
          />
        </Box>
        {/* Content */}
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, p: 2.5 }}>
          <Chip label={product.category} size="small" variant="outlined" sx={{ width: 'fit-content', fontSize: '0.65rem', mb: 1 }} />
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, mb: 0.5, cursor: 'pointer', fontSize: '1rem', '&:hover': { color: '#d4af37' } }}
            onClick={() => navigate(`/products/${product.id}`)}
          >
            {product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 'auto', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {product.description}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                ${isNaN(price) ? '0.00' : price.toFixed(2)}
              </Typography>
              {originalPrice && originalPrice > price && (
                <Typography variant="body2" sx={{ textDecoration: 'line-through', color: '#aaa' }}>
                  ${originalPrice.toFixed(2)}
                </Typography>
              )}
            </Box>
            <Button
              variant="contained" size="small"
              startIcon={<AddToCartIcon sx={{ fontSize: 16 }} />}
              onClick={() => onAddToCart(product)}
              disabled={isOutOfStock}
              sx={{ bgcolor: '#1a1a1a', color: '#fff', fontSize: '0.75rem', '&:hover': { bgcolor: '#d4af37', color: '#1a1a1a' } }}
            >
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </Box>
        </Box>
      </Card>
    );
  }

  // ── Grid variant ─────────────────────────────────────────────────────────
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid #f0ece4',
        bgcolor: '#fff',
        transition: 'all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1)',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0 16px 48px rgba(0,0,0,0.14)',
          '& .product-img': { transform: 'scale(1.07)' },
          '& .hover-actions': { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      {/* ── Image container ─────────────────────────────────────── */}
      <Box
        sx={{ position: 'relative', overflow: 'hidden', aspectRatio: '3/4', bgcolor: '#f8f6f2', cursor: 'pointer' }}
        onClick={() => navigate(`/products/${product.id}`)}
      >
        <Box
          component="img"
          src={imageSrc}
          alt={product.name}
          className="product-img"
          onError={() => setImgError(true)}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
            transition: 'transform 0.5s ease',
          }}
        />

        {/* Status badges */}
        <Box sx={{ position: 'absolute', top: 10, left: 10, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          {product.isNew && (
            <Chip label="NEW" size="small" sx={{ bgcolor: '#1a1a1a', color: '#fff', fontWeight: 700, fontSize: '0.6rem', height: 22 }} />
          )}
          {discount && discount > 0 && (
            <Chip label={`-${discount}%`} size="small" sx={{ bgcolor: '#d32f2f', color: '#fff', fontWeight: 700, fontSize: '0.6rem', height: 22 }} />
          )}
          {isOutOfStock && (
            <Chip label="SOLD OUT" size="small" sx={{ bgcolor: '#777', color: '#fff', fontWeight: 700, fontSize: '0.6rem', height: 22 }} />
          )}
        </Box>

        {/* Wishlist button */}
        <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
          {onToggleWishlist && (
            <Tooltip title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}>
              <IconButton
                size="small"
                onClick={(e) => { e.stopPropagation(); onToggleWishlist(product.id); }}
                sx={{ bgcolor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', '&:hover': { bgcolor: '#fff' }, boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}
              >
                {isInWishlist ? <WishlistIcon color="error" sx={{ fontSize: 18 }} /> : <WishlistBorderIcon sx={{ fontSize: 18 }} />}
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {/* Slide-up CTA overlay */}
        <Box
          className="hover-actions"
          sx={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            p: 1.5,
            bgcolor: 'rgba(13,13,13,0.82)',
            backdropFilter: 'blur(6px)',
            opacity: 0,
            transform: 'translateY(8px)',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
          }}
        >
          <Button
            fullWidth
            variant="contained"
            size="small"
            startIcon={<AddToCartIcon sx={{ fontSize: 15 }} />}
            onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
            disabled={isOutOfStock}
            sx={{
              bgcolor: '#d4af37',
              color: '#0d0d0d',
              fontWeight: 700,
              fontSize: '0.75rem',
              letterSpacing: 1,
              py: 0.9,
              '&:hover': { bgcolor: '#b8941f' },
              '&:disabled': { bgcolor: '#555', color: '#999' },
            }}
          >
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </Box>
      </Box>

      {/* ── Card content ────────────────────────────────────────── */}
      <CardContent sx={{ flexGrow: 1, pb: 1, px: 2.5, pt: 2 }}>
        <Typography
          variant="overline"
          sx={{ color: '#d4af37', letterSpacing: 1.5, fontSize: '0.6rem', fontWeight: 600 }}
        >
          {product.category}
        </Typography>

        <Typography
          variant="subtitle1"
          component="h3"
          sx={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 600,
            fontSize: '1rem',
            lineHeight: 1.3,
            color: '#1a1a1a',
            mb: 0.75,
            mt: 0.25,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {product.name}
        </Typography>

        {/* Rating */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <StarIcon
              key={i}
              sx={{ fontSize: 12, color: i <= Math.round(rating) ? '#f4b400' : '#ddd' }}
            />
          ))}
          <Typography variant="caption" sx={{ color: '#aaa', ml: 0.5 }}>
            ({reviewCount})
          </Typography>
        </Box>

        {/* Price */}
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#1a1a1a' }}>
            ${isNaN(price) ? '0.00' : price.toFixed(2)}
          </Typography>
          {originalPrice && originalPrice > price && (
            <Typography variant="caption" sx={{ textDecoration: 'line-through', color: '#bbb' }}>
              ${originalPrice.toFixed(2)}
            </Typography>
          )}
        </Box>
      </CardContent>

      {/* ── Card footer ─────────────────────────────────────────── */}
      <CardActions sx={{ px: 2.5, pb: 2, pt: 0 }}>
        <Button
          size="small"
          endIcon={<ArrowIcon sx={{ fontSize: 15 }} />}
          onClick={() => navigate(`/products/${product.id}`)}
          sx={{
            color: '#666',
            fontSize: '0.75rem',
            fontWeight: 500,
            p: 0,
            '&:hover': { color: '#d4af37', bgcolor: 'transparent' },
          }}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
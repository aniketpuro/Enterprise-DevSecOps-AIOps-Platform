import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Button,
  Box,
  Paper,
  Chip,
  Fade,
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  ShoppingBag as ShoppingBagIcon,
  Star as StarIcon,
  LocalShipping as ShippingIcon,
  Security as SecurityIcon,
  Refresh as RefreshIcon,
  Diamond as DiamondIcon,
} from '@mui/icons-material';
import { productService } from '../../services/productService';
import { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';
import ProductCard from '../../components/common/ProductCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';

// ── Feature badges ─────────────────────────────────────────────────────────
const FEATURES = [
  { icon: <ShippingIcon sx={{ fontSize: 28, color: '#d4af37' }} />, title: 'Free Shipping', sub: 'On orders over $500' },
  { icon: <SecurityIcon sx={{ fontSize: 28, color: '#d4af37' }} />, title: 'Secure Payment', sub: '100% secure transactions' },
  { icon: <StarIcon sx={{ fontSize: 28, color: '#d4af37' }} />, title: 'Premium Quality', sub: 'Carefully selected products' },
  { icon: <RefreshIcon sx={{ fontSize: 28, color: '#d4af37' }} />, title: 'Easy Returns', sub: '30-day return policy' },
];

// ── Category chips ──────────────────────────────────────────────────────────
const CATEGORIES = ['All', 'Clothing', 'Accessories', 'Shoes', 'Bags', 'Jewelry'];

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState('All');
  const { addItem } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const all = await productService.getAll();
        setProducts(all.slice(0, 8));
      } catch (error) {
        console.error('[Home] Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const filtered =
    activeCat === 'All'
      ? products
      : products.filter((p) => p.category?.toLowerCase() === activeCat.toLowerCase());

  return (
    <>
      {/* ════════════════════════════════════════
          HERO SECTION
      ════════════════════════════════════════ */}
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: '88vh', md: '90vh' },
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          bgcolor: '#0d0d0d',
        }}
      >
        {/* Subtle animated background gradient */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: `
              radial-gradient(ellipse 80% 60% at 20% 50%, rgba(212,175,55,0.12) 0%, transparent 60%),
              radial-gradient(ellipse 60% 80% at 80% 30%, rgba(212,175,55,0.07) 0%, transparent 60%),
              #0d0d0d
            `,
          }}
        />

        {/* Hero product image — right panel */}
        <Box
          sx={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: { xs: '100%', md: '52%' },
            zIndex: 0,
          }}
        >
          <Box
            component="img"
            src="/product-images/silk-evening-gown.jpg"
            alt="Luxury fashion hero"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center top',
              opacity: { xs: 0.15, md: 0.55 },
              filter: 'brightness(0.85)',
            }}
          />
          {/* Dark gradient overlay on left edge of image */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to right, #0d0d0d 0%, rgba(13,13,13,0.4) 50%, transparent 100%)',
            }}
          />
        </Box>

        {/* Hero text content */}
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ maxWidth: { xs: '100%', md: '55%' }, py: { xs: 10, md: 0 } }}>
            <Fade in timeout={800}>
              <Box>
                {/* Pre-headline badge */}
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 2,
                    py: 0.75,
                    borderRadius: 20,
                    border: '1px solid rgba(212,175,55,0.4)',
                    mb: 3,
                  }}
                >
                  <DiamondIcon sx={{ fontSize: 14, color: '#d4af37' }} />
                  <Typography
                    variant="overline"
                    sx={{ color: '#d4af37', letterSpacing: 3, fontSize: '0.65rem', fontWeight: 600 }}
                  >
                    New Collection 2025
                  </Typography>
                </Box>

                <Typography
                  component="h1"
                  sx={{
                    fontFamily: '"Playfair Display", serif',
                    fontSize: { xs: '2.8rem', sm: '3.6rem', md: '4.2rem' },
                    fontWeight: 700,
                    color: '#fff',
                    lineHeight: 1.1,
                    mb: 3,
                  }}
                >
                  Discover
                  <br />
                  <Box component="span" sx={{ color: '#d4af37' }}>Timeless</Box>
                  <br />
                  Elegance
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    color: 'rgba(255,255,255,0.65)',
                    fontSize: { xs: '1rem', md: '1.1rem' },
                    lineHeight: 1.8,
                    mb: 4.5,
                    maxWidth: 420,
                  }}
                >
                  Indulge in our curated collection of luxury products, where
                  sophistication meets exceptional quality.
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<ShoppingBagIcon />}
                    onClick={() => navigate('/products')}
                    sx={{
                      bgcolor: '#d4af37',
                      color: '#0d0d0d',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      letterSpacing: 1.5,
                      px: 4,
                      py: 1.6,
                      '&:hover': { bgcolor: '#b8941f', transform: 'translateY(-3px)', boxShadow: '0 8px 24px rgba(212,175,55,0.35)' },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Shop Collection
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    href="#featured"
                    sx={{
                      borderColor: 'rgba(255,255,255,0.35)',
                      color: '#fff',
                      fontWeight: 500,
                      fontSize: '0.9rem',
                      px: 4,
                      py: 1.6,
                      '&:hover': { borderColor: '#d4af37', color: '#d4af37', bgcolor: 'transparent' },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Explore More
                  </Button>
                </Box>

                {/* Hero stats */}
                <Box sx={{ display: 'flex', gap: 4, mt: 6, pt: 4, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  {[['500+', 'Products'], ['50K+', 'Happy Clients'], ['10+', 'Years of Luxury']].map(([num, label]) => (
                    <Box key={label}>
                      <Typography sx={{ fontFamily: '"Playfair Display", serif', fontSize: '1.5rem', fontWeight: 700, color: '#d4af37' }}>
                        {num}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)', letterSpacing: 1 }}>
                        {label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Fade>
          </Box>
        </Container>
      </Box>

      {/* ════════════════════════════════════════
          FEATURES STRIP
      ════════════════════════════════════════ */}
      <Box sx={{ bgcolor: '#1a1a1a', py: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={2}>
            {FEATURES.map((f) => (
              <Grid size={{ xs: 6, md: 3 }} key={f.title}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    py: 1,
                    px: 2,
                  }}
                >
                  {f.icon}
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 600, fontSize: '0.8rem' }}>
                      {f.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#888' }}>
                      {f.sub}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ════════════════════════════════════════
          FEATURED PRODUCTS
      ════════════════════════════════════════ */}
      <Box sx={{ bgcolor: '#fafaf8', py: { xs: 8, md: 12 } }} id="featured">
        <Container maxWidth="lg">
          {/* Section heading */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="overline"
              sx={{ color: '#d4af37', letterSpacing: 4, fontWeight: 600, display: 'block', mb: 1 }}
            >
              Handpicked For You
            </Typography>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 700,
                color: '#1a1a1a',
                mb: 1.5,
              }}
            >
              Featured Collection
            </Typography>
            <Box sx={{ width: 60, height: 3, bgcolor: '#d4af37', mx: 'auto', borderRadius: 2 }} />
          </Box>

          {/* Category filter chips */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center', mb: 6 }}>
            {CATEGORIES.map((cat) => (
              <Chip
                key={cat}
                label={cat}
                onClick={() => setActiveCat(cat)}
                sx={{
                  px: 1,
                  fontWeight: activeCat === cat ? 700 : 500,
                  bgcolor: activeCat === cat ? '#1a1a1a' : 'transparent',
                  color: activeCat === cat ? '#fff' : '#666',
                  border: '1px solid',
                  borderColor: activeCat === cat ? '#1a1a1a' : '#ddd',
                  '&:hover': { bgcolor: activeCat === cat ? '#1a1a1a' : '#f5f5f5' },
                  transition: 'all 0.2s',
                }}
              />
            ))}
          </Box>

          {/* Products grid */}
          {loading ? (
            <LoadingSkeleton count={8} />
          ) : (
            <Grid container spacing={3}>
              {(filtered.length > 0 ? filtered : products).map((product) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={product.id}>
                  <ProductCard product={product} onAddToCart={addItem} />
                </Grid>
              ))}
            </Grid>
          )}

          <Box sx={{ textAlign: 'center', mt: 7 }}>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/products')}
              endIcon={<ArrowForwardIcon />}
              sx={{
                px: 5, py: 1.5,
                borderColor: '#1a1a1a', color: '#1a1a1a',
                fontWeight: 600, letterSpacing: 1,
                '&:hover': {
                  bgcolor: '#1a1a1a', color: '#fff',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                },
                transition: 'all 0.3s',
              }}
            >
              View All Products
            </Button>
          </Box>
        </Container>
      </Box>

      {/* ════════════════════════════════════════
          BRAND PROMISE BANNER
      ════════════════════════════════════════ */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          py: { xs: 8, md: 12 },
          bgcolor: '#0d0d0d',
          textAlign: 'center',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(212,175,55,0.1) 0%, transparent 70%)',
          }}
        />
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            variant="overline"
            sx={{ color: '#d4af37', letterSpacing: 4, display: 'block', mb: 2 }}
          >
            Our Promise
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Playfair Display", serif',
              fontSize: { xs: '2rem', md: '3rem' },
              fontWeight: 700,
              color: '#fff',
              mb: 3,
              lineHeight: 1.2,
            }}
          >
            Luxury Redefined for
            <Box component="span" sx={{ color: '#d4af37' }}> Every Occasion</Box>
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '1.05rem', mb: 4, lineHeight: 1.8 }}>
            Each piece in our collection is curated with uncompromising attention to detail,
            craftsmanship, and timeless style.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/products')}
            sx={{
              bgcolor: '#d4af37', color: '#0d0d0d',
              fontWeight: 700, px: 5, py: 1.6,
              fontSize: '0.9rem', letterSpacing: 1.5,
              '&:hover': { bgcolor: '#b8941f', transform: 'translateY(-2px)', boxShadow: '0 8px 20px rgba(212,175,55,0.3)' },
              transition: 'all 0.3s',
            }}
          >
            Explore Collection
          </Button>
        </Container>
      </Box>
    </>
  );
};

export default Home;
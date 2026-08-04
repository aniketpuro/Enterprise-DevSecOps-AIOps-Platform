--
-- PostgreSQL database cluster dump
--

\restrict 8DFBk7zz7K84l1inWldUNcZDKHq1t7F63ZVIj1AoS9C9K3iJWDUZqNrnK7VYj7e

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Roles
--

CREATE ROLE postgres;
ALTER ROLE postgres WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:+W0ct/Z/vVbY3B3Caf2Dew==$uBdV09yFUYBPSwVv0kSvVlTl5ScxjH4KG0r/xZRIuyQ=:/IySb7hEXNhRhNPvrB5ypsfq+gkvtYDzDWavumWmXsM=';

--
-- User Configurations
--








\unrestrict 8DFBk7zz7K84l1inWldUNcZDKHq1t7F63ZVIj1AoS9C9K3iJWDUZqNrnK7VYj7e

--
-- Databases
--

--
-- Database "template1" dump
--

\connect template1

--
-- PostgreSQL database dump
--

\restrict y9EZa3Bye6KjzmhWqNv9eiFpqD1QlU6wKgMhFKrBRytYyEBA8a6ZOe7NeN6ydxY

-- Dumped from database version 15.15
-- Dumped by pg_dump version 15.15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- PostgreSQL database dump complete
--

\unrestrict y9EZa3Bye6KjzmhWqNv9eiFpqD1QlU6wKgMhFKrBRytYyEBA8a6ZOe7NeN6ydxY

--
-- Database "auth_db" dump
--

--
-- PostgreSQL database dump
--

\restrict p93g7CKAQWVb1e708wOtDKio78lYfkotgMJbdaeeGrAJgSu4jd9FdSxmzP0Fbsr

-- Dumped from database version 15.15
-- Dumped by pg_dump version 15.15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: auth_db; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE auth_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE auth_db OWNER TO postgres;

\unrestrict p93g7CKAQWVb1e708wOtDKio78lYfkotgMJbdaeeGrAJgSu4jd9FdSxmzP0Fbsr
\connect auth_db
\restrict p93g7CKAQWVb1e708wOtDKio78lYfkotgMJbdaeeGrAJgSu4jd9FdSxmzP0Fbsr

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- PostgreSQL database dump complete
--

\unrestrict p93g7CKAQWVb1e708wOtDKio78lYfkotgMJbdaeeGrAJgSu4jd9FdSxmzP0Fbsr

--
-- Database "boutique_db" dump
--

--
-- PostgreSQL database dump
--

\restrict ngudfYNR3sTyFZmukmjOIzghQB4ahIsKvznaRZCha28ykfB67HutxK8D38j5Tad

-- Dumped from database version 15.15
-- Dumped by pg_dump version 15.15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: boutique_db; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE boutique_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE boutique_db OWNER TO postgres;

\unrestrict ngudfYNR3sTyFZmukmjOIzghQB4ahIsKvznaRZCha28ykfB67HutxK8D38j5Tad
\connect boutique_db
\restrict ngudfYNR3sTyFZmukmjOIzghQB4ahIsKvznaRZCha28ykfB67HutxK8D38j5Tad

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    image_url character varying(500),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_items (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    order_id uuid,
    product_id uuid,
    quantity integer NOT NULL,
    price numeric(10,2) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.order_items OWNER TO postgres;

--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid,
    total_amount numeric(10,2) NOT NULL,
    status character varying(50) DEFAULT 'pending'::character varying,
    shipping_address text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: product_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_images (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    product_id uuid,
    image_url character varying(500) NOT NULL,
    alt_text character varying(255),
    is_primary boolean DEFAULT false,
    sort_order integer DEFAULT 1,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.product_images OWNER TO postgres;

--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(255) NOT NULL,
    slug character varying(255),
    description text,
    short_description text,
    sku character varying(100),
    brand character varying(100),
    category_id uuid,
    price numeric(10,2) NOT NULL,
    compare_price numeric(10,2),
    materials text,
    care_instructions text,
    inventory_quantity integer DEFAULT 0,
    is_featured boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    first_name character varying(100),
    last_name character varying(100),
    role character varying(50) DEFAULT 'customer'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, name, description, image_url, created_at, updated_at) FROM stdin;
10000000-0000-0000-0000-000000000001	Dresses	Elegant dresses for special occasions	\N	2026-02-07 13:03:01.387673	2026-02-07 13:03:01.387673
10000000-0000-0000-0000-000000000002	Accessories	Luxury accessories and fashion items	\N	2026-02-07 13:03:01.387673	2026-02-07 13:03:01.387673
10000000-0000-0000-0000-000000000003	Bags	Designer handbags and tote bags	\N	2026-02-07 13:03:01.387673	2026-02-07 13:03:01.387673
10000000-0000-0000-0000-000000000004	Outerwear	Coats and jackets	\N	2026-02-07 13:03:01.387673	2026-02-07 13:03:01.387673
10000000-0000-0000-0000-000000000005	Shoes	Designer footwear and heels	\N	2026-02-07 13:03:01.387673	2026-02-07 13:03:01.387673
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_items (id, order_id, product_id, quantity, price, created_at) FROM stdin;
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, user_id, total_amount, status, shipping_address, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: product_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_images (id, product_id, image_url, alt_text, is_primary, sort_order, created_at) FROM stdin;
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, name, slug, description, short_description, sku, brand, category_id, price, compare_price, materials, care_instructions, inventory_quantity, is_featured, created_at, updated_at) FROM stdin;
d463e74a-84cb-42b4-82e1-da0564548fb7	Silk Evening Gown	silk-evening-gown	Beautiful floor-length gown crafted from premium silk	Luxurious silk evening gown	LEG-001	LUXE BOUTIQUE	10000000-0000-0000-0000-000000000001	1899.00	2299.00	\N	\N	15	t	2026-02-07 13:03:01.388084	2026-02-07 13:03:01.388084
8f712af6-9469-4bff-abe1-6746e8077bfe	Cashmere Coat	cashmere-coat	Elegant wool and cashmere blend coat for winter	Warm luxury coat	COAT-001	LUXE BOUTIQUE	10000000-0000-0000-0000-000000000004	899.00	1200.00	\N	\N	20	t	2026-02-07 13:03:01.388084	2026-02-07 13:03:01.388084
36f64ff4-dbe5-455f-b35a-bf1e2bfa7771	Leather Handbag	leather-handbag	Premium Italian leather tote bag	Luxury leather tote	BAG-001	LUXE BOUTIQUE	10000000-0000-0000-0000-000000000003	599.00	799.00	\N	\N	25	t	2026-02-07 13:03:01.388084	2026-02-07 13:03:01.388084
4d73607a-83c6-4cc4-b8df-23f93d53e47f	Diamond Necklace	diamond-necklace	Stunning diamond pendant necklace	Elegant diamond jewelry	JWL-001	LUXE BOUTIQUE	10000000-0000-0000-0000-000000000004	2999.00	3999.00	\N	\N	10	t	2026-02-07 13:03:01.388084	2026-02-07 13:03:01.388084
b0df682a-09be-4151-a96e-dd9636daf762	Designer Heels	designer-heels	Elegant stiletto heels in premium leather	Luxury high heels	SHOES-001	LUXE BOUTIQUE	10000000-0000-0000-0000-000000000005	499.00	699.00	\N	\N	18	t	2026-02-07 13:03:01.388084	2026-02-07 13:03:01.388084
a1b2c3d4-e5f6-7890-abcd-ef1234567801	Floral Midi Dress	floral-midi-dress	A stunning floral midi dress crafted from lightweight chiffon, featuring a vibrant botanical print perfect for garden parties and afternoon soirees	Elegant floral chiffon midi dress	DRS-002	LUXE BOUTIQUE	10000000-0000-0000-0000-000000000001	349.00	499.00	\N	\N	22	t	2026-02-07 13:03:01.388084	2026-02-07 13:03:01.388084
a1b2c3d4-e5f6-7890-abcd-ef1234567802	Velvet Evening Dress	velvet-evening-dress	An exquisite floor-length velvet evening dress with a deep V-neckline and dramatic open back, perfect for black-tie events and gala dinners	Luxurious velvet floor-length gown	DRS-003	LUXE BOUTIQUE	10000000-0000-0000-0000-000000000001	899.00	1199.00	\N	\N	12	t	2026-02-07 13:03:01.388084	2026-02-07 13:03:01.388084
a1b2c3d4-e5f6-7890-abcd-ef1234567803	Bohemian Maxi Dress	bohemian-maxi-dress	A free-spirited bohemian maxi dress featuring intricate embroidery and flowing silhouette crafted from organic cotton, ideal for beach holidays and festivals	Boho embroidered cotton maxi dress	DRS-004	LUXE BOUTIQUE	10000000-0000-0000-0000-000000000001	279.00	399.00	\N	\N	30	f	2026-02-07 13:03:01.388084	2026-02-07 13:03:01.388084
a1b2c3d4-e5f6-7890-abcd-ef1234567804	Lace Cocktail Dress	lace-cocktail-dress	A sophisticated lace cocktail dress with a fitted bodice and A-line skirt, adorned with delicate floral lace overlay for an effortlessly romantic look	Romantic floral lace A-line dress	DRS-005	LUXE BOUTIQUE	10000000-0000-0000-0000-000000000001	429.00	599.00	\N	\N	18	t	2026-02-07 13:03:01.388084	2026-02-07 13:03:01.388084
a1b2c3d4-e5f6-7890-abcd-ef1234567805	Satin Wrap Dress	satin-wrap-dress	A sleek satin wrap dress featuring a flattering wrap silhouette and adjustable tie waist, crafted from lustrous satin for an elegant evening look	Lustrous satin wrap silhouette dress	DRS-006	LUXE BOUTIQUE	10000000-0000-0000-0000-000000000001	319.00	449.00	\N	\N	25	f	2026-02-07 13:03:01.388084	2026-02-07 13:03:01.388084
a1b2c3d4-e5f6-7890-abcd-ef1234567806	Silk Scarf	silk-scarf	A luxurious hand-rolled silk scarf featuring an exclusive artistic print, crafted from the finest mulberry silk for a sumptuous feel against the skin	Luxury hand-rolled mulberry silk scarf	ACC-002	LUXE BOUTIQUE	10000000-0000-0000-0000-000000000002	189.00	269.00	\N	\N	40	f	2026-02-07 13:03:01.388084	2026-02-07 13:03:01.388084
a1b2c3d4-e5f6-7890-abcd-ef1234567807	Pearl Drop Earrings	pearl-drop-earrings	Timeless freshwater pearl drop earrings set in 18-karat gold vermeil, each featuring a lustrous baroque pearl for an elegant, refined aesthetic	Freshwater baroque pearl gold drop earrings	ACC-003	LUXE BOUTIQUE	10000000-0000-0000-0000-000000000002	459.00	649.00	\N	\N	20	t	2026-02-07 13:03:01.388084	2026-02-07 13:03:01.388084
a1b2c3d4-e5f6-7890-abcd-ef1234567808	Gold Bangle Bracelet	gold-bangle-bracelet	A sleek solid 18-karat gold bangle bracelet with a polished finish, a timeless piece that transitions seamlessly from day to evening wear	Solid 18k gold polished bangle	ACC-004	LUXE BOUTIQUE	10000000-0000-0000-0000-000000000002	699.00	899.00	\N	\N	15	t	2026-02-07 13:03:01.388084	2026-02-07 13:03:01.388084
a1b2c3d4-e5f6-7890-abcd-ef1234567809	Crystal Cat-Eye Sunglasses	crystal-cat-eye-sunglasses	Iconic crystal-embellished cat-eye sunglasses with UV400 protection and acetate frames, the ultimate accessory for elevated summer style	Crystal-embellished acetate cat-eye shades	ACC-005	LUXE BOUTIQUE	10000000-0000-0000-0000-000000000002	329.00	459.00	\N	\N	28	t	2026-02-07 13:03:01.388084	2026-02-07 13:03:01.388084
a1b2c3d4-e5f6-7890-abcd-ef1234567810	Leather Waist Belt	leather-waist-belt	A supple full-grain leather waist belt with a gold-toned buckle, designed to cinch the waist and add structure to any outfit with refined sophistication	Full-grain leather belt with gold buckle	ACC-006	LUXE BOUTIQUE	10000000-0000-0000-0000-000000000002	229.00	319.00	\N	\N	35	f	2026-02-07 13:03:01.388084	2026-02-07 13:03:01.388084
a1b2c3d4-e5f6-7890-abcd-ef1234567811	Quilted Chain Bag	quilted-chain-bag	An iconic quilted leather shoulder bag with a signature interlocking chain strap in gold hardware, a timeless investment piece of exceptional craftsmanship	Iconic quilted leather chain shoulder bag	BAG-002	LUXE BOUTIQUE	10000000-0000-0000-0000-000000000003	1299.00	1699.00	\N	\N	8	t	2026-02-07 13:03:01.388084	2026-02-07 13:03:01.388084
a1b2c3d4-e5f6-7890-abcd-ef1234567812	Suede Crossbody Bag	suede-crossbody-bag	A butter-soft suede crossbody bag with adjustable leather strap and gold-toned hardware, offering effortless everyday luxury in a compact silhouette	Soft suede compact crossbody with gold hardware	BAG-003	LUXE BOUTIQUE	10000000-0000-0000-0000-000000000003	649.00	899.00	\N	\N	14	t	2026-02-07 13:03:01.388084	2026-02-07 13:03:01.388084
a1b2c3d4-e5f6-7890-abcd-ef1234567813	Velvet Evening Clutch	velvet-evening-clutch	An opulent velvet evening clutch embellished with sparkling crystal closure, lined with satin and featuring a detachable chain for versatile styling	Crystal-closure velvet satin-lined evening clutch	BAG-004	LUXE BOUTIQUE	10000000-0000-0000-0000-000000000003	499.00	699.00	\N	\N	20	t	2026-02-07 13:03:01.388084	2026-02-07 13:03:01.388084
a1b2c3d4-e5f6-7890-abcd-ef1234567814	Wicker Basket Bag	wicker-basket-bag	A chic hand-woven wicker basket bag with leather trim and handles, the perfect summer accessory blending artisan craft with contemporary luxury fashion	Hand-woven wicker bag with leather trim	BAG-005	LUXE BOUTIQUE	10000000-0000-0000-0000-000000000003	399.00	549.00	\N	\N	18	f	2026-02-07 13:03:01.388084	2026-02-07 13:03:01.388084
a1b2c3d4-e5f6-7890-abcd-ef1234567815	Mini Backpack	mini-backpack	A refined mini leather backpack with convertible straps that transform it into a clutch, crafted from pebbled calfskin with rose gold hardware accents	Convertible pebbled calfskin mini backpack	BAG-006	LUXE BOUTIQUE	10000000-0000-0000-0000-000000000003	549.00	749.00	\N	\N	16	t	2026-02-07 13:03:01.388084	2026-02-07 13:03:01.388084
a1b2c3d4-e5f6-7890-abcd-ef1234567816	Classic Trench Coat	classic-trench-coat	A timeless double-breasted trench coat crafted from water-resistant cotton gabardine, featuring adjustable belt, storm flap, and signature check lining	Iconic water-resistant cotton gabardine trench	OUT-002	LUXE BOUTIQUE	10000000-0000-0000-0000-000000000004	799.00	1099.00	\N	\N	20	t	2026-02-07 13:03:01.388084	2026-02-07 13:03:01.388084
a1b2c3d4-e5f6-7890-abcd-ef1234567817	Faux Fur Statement Jacket	faux-fur-statement-jacket	A bold and glamorous faux fur statement jacket in luxuriously soft pile fabric, designed to be the showpiece of any winter wardrobe with a relaxed oversized fit	Luxe oversized faux fur statement jacket	OUT-003	LUXE BOUTIQUE	10000000-0000-0000-0000-000000000004	899.00	1199.00	\N	\N	12	t	2026-02-07 13:03:01.388084	2026-02-07 13:03:01.388084
a1b2c3d4-e5f6-7890-abcd-ef1234567818	Tailored Wool Blazer	tailored-wool-blazer	An impeccably tailored single-breasted wool blazer with a structured silhouette and peak lapels, versatile enough to elevate both casual and formal ensembles	Structured single-breasted peak-lapel wool blazer	OUT-004	LUXE BOUTIQUE	10000000-0000-0000-0000-000000000004	649.00	899.00	\N	\N	22	t	2026-02-07 13:03:01.388084	2026-02-07 13:03:01.388084
a1b2c3d4-e5f6-7890-abcd-ef1234567819	Oversized Puffer Coat	oversized-puffer-coat	A sleek oversized puffer coat filled with premium recycled down, featuring a high-shine exterior and cinched waist belt for a fashion-forward winter silhouette	Recycled down high-shine oversized puffer	OUT-005	LUXE BOUTIQUE	10000000-0000-0000-0000-000000000004	549.00	749.00	\N	\N	25	f	2026-02-07 13:03:01.388084	2026-02-07 13:03:01.388084
a1b2c3d4-e5f6-7890-abcd-ef1234567820	Double-Breasted Peacoat	double-breasted-peacoat	A sophisticated double-breasted peacoat crafted from heritage wool-blend fabric, featuring statement buttons and a tailored silhouette for refined winter dressing	Heritage wool-blend double-breasted peacoat	OUT-006	LUXE BOUTIQUE	10000000-0000-0000-0000-000000000004	729.00	999.00	\N	\N	18	t	2026-02-07 13:03:01.388084	2026-02-07 13:03:01.388084
a1b2c3d4-e5f6-7890-abcd-ef1234567821	Strappy Stiletto Sandals	strappy-stiletto-sandals	Elegant strappy stiletto sandals crafted from buttery-soft nappa leather with crystal-embellished ankle strap, designed for unforgettable evenings	Crystal ankle-strap nappa leather stilettos	SHO-002	LUXE BOUTIQUE	10000000-0000-0000-0000-000000000005	459.00	649.00	\N	\N	20	t	2026-02-07 13:03:01.388084	2026-02-07 13:03:01.388084
a1b2c3d4-e5f6-7890-abcd-ef1234567822	Pointed Toe Ankle Boots	pointed-toe-ankle-boots	Sophisticated pointed-toe ankle boots in smooth calfskin leather with a block heel and side zip, the perfect blend of comfort and high-fashion elegance	Calfskin block-heel pointed ankle boots	SHO-003	LUXE BOUTIQUE	10000000-0000-0000-0000-000000000005	549.00	749.00	\N	\N	16	t	2026-02-07 13:03:01.388084	2026-02-07 13:03:01.388084
a1b2c3d4-e5f6-7890-abcd-ef1234567823	Chunky Platform Sneakers	chunky-platform-sneakers	Bold chunky platform sneakers with a sculpted rubber sole and premium leather upper, blending streetwear attitude with luxury craftsmanship for an elevated casual look	Luxury leather chunky platform sneakers	SHO-004	LUXE BOUTIQUE	10000000-0000-0000-0000-000000000005	329.00	459.00	\N	\N	28	t	2026-02-07 13:03:01.388084	2026-02-07 13:03:01.388084
a1b2c3d4-e5f6-7890-abcd-ef1234567824	Open-Toe Mule Heels	open-toe-mule-heels	Chic open-toe mule heels in polished patent leather featuring a sculptural kitten heel and square toe, effortlessly transitioning from office to evening	Patent leather square-toe kitten-heel mules	SHO-005	LUXE BOUTIQUE	10000000-0000-0000-0000-000000000005	389.00	549.00	\N	\N	22	f	2026-02-07 13:03:01.388084	2026-02-07 13:03:01.388084
a1b2c3d4-e5f6-7890-abcd-ef1234567825	Classic Leather Loafers	classic-leather-loafers	Heritage-crafted leather loafers with a signature horsebit embellishment in gold-toned metal, combining traditional shoemaking with contemporary luxury style	Horsebit-embellished heritage leather loafers	SHO-006	LUXE BOUTIQUE	10000000-0000-0000-0000-000000000005	429.00	599.00	\N	\N	24	t	2026-02-07 13:03:01.388084	2026-02-07 13:03:01.388084
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password_hash, first_name, last_name, role, created_at, updated_at) FROM stdin;
f3d73cfa-b59e-4a9a-a5fa-848c433e631c	admin@boutique.com	$2a$10$placeholder_hash	Admin	User	admin	2026-02-07 13:03:01.387149	2026-02-07 13:03:01.387149
e39ddf24-30a5-4ee3-86f4-8ba89a103040	customer@boutique.com	$2a$10$placeholder_hash	John	Doe	customer	2026-02-07 13:03:01.387149	2026-02-07 13:03:01.387149
\.


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: product_images product_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: order_items order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: product_images product_images_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- PostgreSQL database dump complete
--

\unrestrict ngudfYNR3sTyFZmukmjOIzghQB4ahIsKvznaRZCha28ykfB67HutxK8D38j5Tad

--
-- Database "orders_db" dump
--

--
-- PostgreSQL database dump
--

\restrict eTVQIHKYS2Lvu62heWXuS7wI63NUtOMYfQ7ssjjw3vMLqMIgQsmGefHp2t5DigH

-- Dumped from database version 15.15
-- Dumped by pg_dump version 15.15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: orders_db; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE orders_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE orders_db OWNER TO postgres;

\unrestrict eTVQIHKYS2Lvu62heWXuS7wI63NUtOMYfQ7ssjjw3vMLqMIgQsmGefHp2t5DigH
\connect orders_db
\restrict eTVQIHKYS2Lvu62heWXuS7wI63NUtOMYfQ7ssjjw3vMLqMIgQsmGefHp2t5DigH

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: order_service; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA order_service;


ALTER SCHEMA order_service OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: orders; Type: TABLE; Schema: order_service; Owner: postgres
--

CREATE TABLE order_service.orders (
    id integer NOT NULL,
    product_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE order_service.orders OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: order_service; Owner: postgres
--

CREATE SEQUENCE order_service.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE order_service.orders_id_seq OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: order_service; Owner: postgres
--

ALTER SEQUENCE order_service.orders_id_seq OWNED BY order_service.orders.id;


--
-- Name: orders id; Type: DEFAULT; Schema: order_service; Owner: postgres
--

ALTER TABLE ONLY order_service.orders ALTER COLUMN id SET DEFAULT nextval('order_service.orders_id_seq'::regclass);


--
-- Data for Name: orders; Type: TABLE DATA; Schema: order_service; Owner: postgres
--

COPY order_service.orders (id, product_id, created_at) FROM stdin;
\.


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: order_service; Owner: postgres
--

SELECT pg_catalog.setval('order_service.orders_id_seq', 1, false);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: order_service; Owner: postgres
--

ALTER TABLE ONLY order_service.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

\unrestrict eTVQIHKYS2Lvu62heWXuS7wI63NUtOMYfQ7ssjjw3vMLqMIgQsmGefHp2t5DigH

--
-- Database "postgres" dump
--

\connect postgres

--
-- PostgreSQL database dump
--

\restrict FstxkrMDaBlLIMjpqqBdBV4M6zG33ixCRE38xZ9IDh8MBCSPRZLwn274hPqftdc

-- Dumped from database version 15.15
-- Dumped by pg_dump version 15.15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- PostgreSQL database dump complete
--

\unrestrict FstxkrMDaBlLIMjpqqBdBV4M6zG33ixCRE38xZ9IDh8MBCSPRZLwn274hPqftdc

--
-- Database "products_db" dump
--

--
-- PostgreSQL database dump
--

\restrict 5aM8ojgDpTHysSdLRAV10eytfJgZxB6WarBqTsG0G07byJ1R1j98w7ycC97TB7v

-- Dumped from database version 15.15
-- Dumped by pg_dump version 15.15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: products_db; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE products_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE products_db OWNER TO postgres;

\unrestrict 5aM8ojgDpTHysSdLRAV10eytfJgZxB6WarBqTsG0G07byJ1R1j98w7ycC97TB7v
\connect products_db
\restrict 5aM8ojgDpTHysSdLRAV10eytfJgZxB6WarBqTsG0G07byJ1R1j98w7ycC97TB7v

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    image_url character varying(500),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_items (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    order_id uuid,
    product_id uuid,
    quantity integer NOT NULL,
    price numeric(10,2) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.order_items OWNER TO postgres;

--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid,
    total_amount numeric(10,2) NOT NULL,
    status character varying(50) DEFAULT 'pending'::character varying,
    shipping_address text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: product_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_images (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    product_id uuid,
    image_url character varying(500) NOT NULL,
    alt_text character varying(255),
    is_primary boolean DEFAULT false,
    sort_order integer DEFAULT 1,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.product_images OWNER TO postgres;

--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(255) NOT NULL,
    slug character varying(255),
    description text,
    short_description text,
    sku character varying(100),
    brand character varying(100),
    category_id uuid,
    price numeric(10,2) NOT NULL,
    compare_price numeric(10,2),
    materials text,
    care_instructions text,
    inventory_quantity integer DEFAULT 0,
    is_featured boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    first_name character varying(100),
    last_name character varying(100),
    role character varying(50) DEFAULT 'customer'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, name, description, image_url, created_at, updated_at) FROM stdin;
10000000-0000-0000-0000-000000000001	Dresses	Elegant dresses for special occasions	\N	2026-02-07 13:04:03.83623	2026-02-07 13:04:03.83623
10000000-0000-0000-0000-000000000002	Accessories	Luxury accessories and fashion items	\N	2026-02-07 13:04:03.83623	2026-02-07 13:04:03.83623
10000000-0000-0000-0000-000000000003	Bags	Designer handbags and tote bags	\N	2026-02-07 13:04:03.83623	2026-02-07 13:04:03.83623
10000000-0000-0000-0000-000000000004	Outerwear	Coats and jackets	\N	2026-02-07 13:04:03.83623	2026-02-07 13:04:03.83623
10000000-0000-0000-0000-000000000005	Shoes	Designer footwear and heels	\N	2026-02-07 13:04:03.83623	2026-02-07 13:04:03.83623
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_items (id, order_id, product_id, quantity, price, created_at) FROM stdin;
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, user_id, total_amount, status, shipping_address, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: product_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_images (id, product_id, image_url, alt_text, is_primary, sort_order, created_at) FROM stdin;
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, name, slug, description, short_description, sku, brand, category_id, price, compare_price, materials, care_instructions, inventory_quantity, is_featured, created_at, updated_at) FROM stdin;
67be2d5e-ecfb-4bf9-b751-8474f9d7bcac	Silk Evening Gown	silk-evening-gown	Beautiful floor-length gown crafted from premium silk	Luxurious silk evening gown	LEG-001	LUXE BOUTIQUE	10000000-0000-0000-0000-000000000001	1899.00	2299.00	\N	\N	15	t	2026-02-07 13:04:03.836716	2026-02-07 13:04:03.836716
7554ae99-7c37-4ba7-b348-6a5a35ec5cc5	Cashmere Coat	cashmere-coat	Elegant wool and cashmere blend coat for winter	Warm luxury coat	COAT-001	LUXE BOUTIQUE	10000000-0000-0000-0000-000000000004	899.00	1200.00	\N	\N	20	t	2026-02-07 13:04:03.836716	2026-02-07 13:04:03.836716
9be82459-8ef3-45cb-ad70-7adbe3df843f	Leather Handbag	leather-handbag	Premium Italian leather tote bag	Luxury leather tote	BAG-001	LUXE BOUTIQUE	10000000-0000-0000-0000-000000000003	599.00	799.00	\N	\N	25	t	2026-02-07 13:04:03.836716	2026-02-07 13:04:03.836716
25e17b84-2c9a-4e8c-bc78-0ab6af7d3fb0	Diamond Necklace	diamond-necklace	Stunning diamond pendant necklace	Elegant diamond jewelry	JWL-001	LUXE BOUTIQUE	10000000-0000-0000-0000-000000000004	2999.00	3999.00	\N	\N	10	t	2026-02-07 13:04:03.836716	2026-02-07 13:04:03.836716
9e873053-7127-458e-80d7-4dbce3018e6e	Designer Heels	designer-heels	Elegant stiletto heels in premium leather	Luxury high heels	SHOES-001	LUXE BOUTIQUE	10000000-0000-0000-0000-000000000005	499.00	699.00	\N	\N	18	t	2026-02-07 13:04:03.836716	2026-02-07 13:04:03.836716
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password_hash, first_name, last_name, role, created_at, updated_at) FROM stdin;
bfd7090c-8428-4134-b17a-485bc520efc4	admin@boutique.com	$2a$10$placeholder_hash	Admin	User	admin	2026-02-07 13:04:03.835464	2026-02-07 13:04:03.835464
500c014d-299d-48b9-b107-20bc3518b806	customer@boutique.com	$2a$10$placeholder_hash	John	Doe	customer	2026-02-07 13:04:03.835464	2026-02-07 13:04:03.835464
\.


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: product_images product_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: order_items order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: product_images product_images_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- PostgreSQL database dump complete
--

\unrestrict 5aM8ojgDpTHysSdLRAV10eytfJgZxB6WarBqTsG0G07byJ1R1j98w7ycC97TB7v

--
-- Database "users_db" dump
--

--
-- PostgreSQL database dump
--

\restrict wrVTBlt75aHhrvfa8IvUG9zxjcEN5GktpRGTiUa3t2cCePtgyUK7M3fL6R52oON

-- Dumped from database version 15.15
-- Dumped by pg_dump version 15.15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: users_db; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE users_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE users_db OWNER TO postgres;

\unrestrict wrVTBlt75aHhrvfa8IvUG9zxjcEN5GktpRGTiUa3t2cCePtgyUK7M3fL6R52oON
\connect users_db
\restrict wrVTBlt75aHhrvfa8IvUG9zxjcEN5GktpRGTiUa3t2cCePtgyUK7M3fL6R52oON

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- PostgreSQL database dump complete
--

\unrestrict wrVTBlt75aHhrvfa8IvUG9zxjcEN5GktpRGTiUa3t2cCePtgyUK7M3fL6R52oON

--
-- PostgreSQL database cluster dump complete
--


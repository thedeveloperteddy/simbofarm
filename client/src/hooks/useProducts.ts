import { useState, useEffect } from 'react';
import { Product } from '../types';
import { api } from '../utils/api';
import { PRODUCTS } from '../lib/data';

export function useProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/products');

                // Laravel returns an array directly or wrapped in { data: [...] }
                const raw: any[] = Array.isArray(response)
                    ? response
                    : Array.isArray(response?.data)
                        ? response.data
                        : null;

                if (!raw) {
                    throw new Error('Unexpected response format from server');
                }

                const parsedData: Product[] = raw.map((p: any) => ({
                    id: String(p.id),
                    name: p.name ?? p.p_name ?? 'Unknown',
                    category: p.category ?? p.p_type ?? 'broilers',
                    price: parseFloat(p.price ?? p.p_price ?? '0'),
                    description: p.description ?? p.p_discription ?? '',
                    stock: parseInt(p.stock ?? p.p_number_of_sallary ?? '0', 10),
                    image: p.image ?? p.p_midea ?? '',
                }));

                setProducts(parsedData);
            } catch (err: any) {
                console.warn('Failed to fetch products from API, using fallback data:', err.message);
                setProducts(PRODUCTS);
                setError(null); // Don't show an error — show the static fallback silently
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return { products, loading, error };
}

import { Product } from "../types";

export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Premium Broilers",
    description: "Healthy, well-fed organic broilers ready for consumption. Average weight 2.5kg. Raised in climate-controlled environments for optimal health.",
    price: 15.50,
    stock: 250,
    category: "broilers",
    image: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/bd6a7ca0-01db-4d64-8307-483208f69f39/product-broilers-9fadeef0-1771921084640.webp"
  },
  {
    id: "2",
    name: "Fresh Farm Eggs",
    description: "Nutritious brown eggs collected daily from our healthy layers. 30 eggs per crate. Rich in protein and essential vitamins.",
    price: 8.00,
    stock: 120,
    category: "eggs",
    image: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/bd6a7ca0-01db-4d64-8307-483208f69f39/product-eggs-82f938ae-1771921089833.webp"
  },
  {
    id: "3",
    name: "Day-Old Chicks",
    description: "Highly productive day-old chicks, vaccinated and ready for brooding. Hybrid breeds optimized for high egg production or fast growth.",
    price: 1.20,
    stock: 5000,
    category: "chicks",
    image: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/bd6a7ca0-01db-4d64-8307-483208f69f39/product-chicks-795e6244-1771921089618.webp"
  },
  {
    id: "4",
    name: "Nutrient-Rich Feed",
    description: "Specially formulated poultry feed for optimal growth and high egg production. Contains natural vitamins and minerals.",
    price: 45.00,
    stock: 45,
    category: "feed",
    image: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/bd6a7ca0-01db-4d64-8307-483208f69f39/product-feed-bf5f68da-1771921094732.webp"
  },
  {
    id: "5",
    name: "Organic Layers",
    description: "Productive laying hens ready for egg production. Average 20 weeks old, fully vaccinated and healthy.",
    price: 12.00,
    stock: 85,
    category: "broilers",
    image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "6",
    name: "Starter Crumble",
    description: "High-protein starter feed for day-old chicks to ensure strong immunity and rapid early development.",
    price: 52.00,
    stock: 15,
    category: "feed",
    image: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&q=80&w=600"
  }
];
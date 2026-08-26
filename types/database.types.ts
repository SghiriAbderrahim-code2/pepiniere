// Type definitions mirroring the Supabase `public` schema.
// Keep these in sync with the actual database (see supabase/schema.sql).

export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  short_description: string | null;
  description: string | null;
  main_image: string | null;
  visible: boolean;
  light_requirement: string | null;
  water_requirement: string | null;
  care_instructions: string | null;
  suitable_location: string | null;
  temperature: string | null;
  humidity: string | null;
  created_at: string;
  updated_at: string;
};

export type ProductImage = {
  id: string;
  product_id: string;
  image_url: string;
  public_id: string | null;
  created_at: string;
};

export type Profile = {
  id: string;
  name: string | null;
  role: "admin" | null;
  created_at: string;
};

export type ProductSort =
  | "name-asc"
  | "name-desc"
  | "price-asc"
  | "price-desc"
  | "newest";

type ProductsInsert = {
  id?: string;
  slug: string;
  name: string;
  price?: number;
  short_description?: string | null;
  description?: string | null;
  main_image?: string | null;
  visible?: boolean;
  light_requirement?: string | null;
  water_requirement?: string | null;
  care_instructions?: string | null;
  suitable_location?: string | null;
  temperature?: string | null;
  humidity?: string | null;
  created_at?: string;
  updated_at?: string;
};

type ProductsUpdate = {
  [K in keyof ProductsInsert]?: ProductsInsert[K];
};

type ProductImagesInsert = {
  id?: string;
  product_id: string;
  image_url: string;
  public_id?: string | null;
  created_at?: string;
};

type ProductImagesUpdate = {
  [K in keyof ProductImagesInsert]?: ProductImagesInsert[K];
};

type ProfilesInsert = {
  id: string;
  name?: string | null;
  role?: string | null;
  created_at?: string;
};

type ProfilesUpdate = {
  [K in keyof ProfilesInsert]?: ProfilesInsert[K];
};

export type Database = {
  public: {
    Tables: {
      products: {
        Row: Product;
        Insert: ProductsInsert;
        Update: ProductsUpdate;
        Relationships: [];
      };
      product_images: {
        Row: ProductImage;
        Insert: ProductImagesInsert;
        Update: ProductImagesUpdate;
        Relationships: [];
      };
      profiles: {
        Row: Profile;
        Insert: ProfilesInsert;
        Update: ProfilesUpdate;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

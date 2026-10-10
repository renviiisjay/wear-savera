import dress from "@/assets/p-dress.jpg";
import shirt from "@/assets/p-shirt.jpg";
import kurta from "@/assets/p-kurta.jpg";
import coord from "@/assets/p-coord.jpg";
import jeans from "@/assets/p-jeans.jpg";
import skirt from "@/assets/p-skirt.jpg";
import coat from "@/assets/p-coat.jpg";
import essential from "@/assets/p-essential.jpg";
import hero from "@/assets/hero.jpg";
import story from "@/assets/story.jpg";
import creators from "@/assets/creators.png";

export const IMG = { dress, shirt, kurta, coord, jeans, skirt, coat, essential, hero, story, creators };

export const CATEGORY_IMG: Record<string, string> = {
  Dresses: dress,
  "Tops & Shirts": shirt,
  "Kurtas & Ethnic Wear": kurta,
  "Co-ord Sets": coord,
  "Trousers & Jeans": jeans,
  Skirts: skirt,
  Outerwear: coat,
  "Everyday Essentials": essential,
};

export const COLLECTION_IMG: Record<string, string> = {
  "everyday-elegance": skirt,
  "modern-indian-muse": kurta,
  "minimalist-wardrobe": shirt,
};

export interface Entry {
    date: Date;
    dateString: string;
    status: "pending" | "firstFermentation" | "secondFermentation" | "completed";    fermentationDay: number;
    temperature: {
      value: number;
      unit: 'celsius' | 'fahrenheit';
    };
    pH: number;
    notes: string;
    flavorProfile: {
      sweetness: number;
      acidity: number;
      bitterness: number;
      carbonation: number;
    };
    appearance: {
      color: string;
      clarity: 'clear' | 'slightly cloudy' | 'cloudy' | 'very cloudy';
    };
    pellicle: {
      thickness: number;
      unit: 'mm' | 'cm' | 'inches';
      appearance: string;
    };
    smell: string;
    tasteRating: number;
    overallQuality: number;
    adjustments: {
      type: 'temperature' | 'ingredients' | 'fermentation time' | 'other';
      description: string;
    }[];
    images: string[];
  }
export type Unit = 'ml' | 'liters' | 'cups' | 'ounces' | 'grams';

interface IngredientWithAmount {
  amount: number;
  unit: Unit;
}

export interface Ingredient {
  name: string;
  amount: number;
  unit: Unit;
}

export interface FlavorProfile {
  sweetness: number;
  acidity: number;
  bitterness: number;
  carbonation: number;
}

export interface Ratings {
  averageRating: number;
  numberOfRatings: number;
}

export interface KombuchaRecipe {
  id: number;
  name: string;
  description: string;
  teaType: string;
  sugar: IngredientWithAmount;
  sugarType: string;
  F2ingredients: Ingredient[];
  instructions: {
    brewing: string;
    firstFermentation: string;
    secondFermentation: string;
  };
  F1Days: number;
  F2Days: number;
  water: IngredientWithAmount;
  tea: IngredientWithAmount;
  starter: IngredientWithAmount;
  flavorProfile: FlavorProfile;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  ratings: Ratings;
  author: string;
  isPublic: boolean;
}
export interface BakersPercentageRecipe {
  water: number;  // Always 100%
  sugar: number;
  tea: number;
  starter: number;
}
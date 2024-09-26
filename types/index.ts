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
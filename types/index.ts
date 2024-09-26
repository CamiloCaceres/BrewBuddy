export interface KombuchaEntry {
    date: Date;
    dateString: string;
    fermentationStage: 'F1' | 'F2';
    fermentationDay: number;
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
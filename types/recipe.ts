export type TeaType = 'Green' | 'Black' | 'Oolong' | 'White' | 'Herbal';
  
export interface Recipe {
  id: string;
  name: string;
  description: string;
  teaType: TeaType;
  F1Days: number;
  F2Days: number;
  updated: string;
  expand?: {
    author: {
      name: string;
    }
  }
}

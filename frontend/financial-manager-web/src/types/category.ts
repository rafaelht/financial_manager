export interface Category {
  id: number;
  name: string;
  transactions?: [];
}

export interface CreateCategoryDto {
  name: string;
}

export interface UpdateCategoryDto {
  name: string;
}

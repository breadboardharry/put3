type MainCategory = {
  name: string;
  subCategories?: SubCategory[];
};

type SubCategory = {
  name: string;
  mainCategoryName: string;
  mainCategory?: MainCategory;
  illustrationUUID?: string;
  requiresCondition?: boolean;
  requiresMileage?: boolean;
};

export { MainCategory, SubCategory };
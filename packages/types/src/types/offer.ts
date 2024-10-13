import { EnumCondition } from '../enums/enum-condition';
import { EnumOfferSortBy } from '../enums/offer';
import { User } from './user';

type OfferImage = {
  imageUUID: string;
  position: number;
};

type Offer = {
  id: number;
  authorId: number;
  author: User;
  title: string;
  price: number;
  subCategoryName: string;
  subCategory?: {
    name: string;
    mainCategoryName: string;
  };
  description: string;
  images: OfferImage[];
  createdAt: Date;
  updatedAt: Date;
  bookmarked?: boolean;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  // OPTIONAL FIELDS
  condition?: EnumCondition;
  mileage?: number;
};

type Rating = {
  id: number;
  authorId: number;
  author?: User;
  targetId: number;
  value: number;
  note?: string;
  datetime: Date;
};

type OfferFilters = {
  priceMin: number | undefined;
  priceMax: number | undefined;
  condition: EnumCondition[];
  mileageMin: number | undefined;
  mileageMax: number | undefined;
  sortBy: EnumOfferSortBy;
};

type OfferSearchQueryParams = {
  category?: string;
  subCategory?: string;
  rawText?: string;
};

export { Rating, Offer, OfferImage, OfferFilters, OfferSearchQueryParams };

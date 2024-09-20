import { UserFavoriteRestaurant } from "@prisma/client";

export const isRestaurantFavorited = (
  restaurantId: String,
  UserFavoriteRestaurant: UserFavoriteRestaurant[],
) => UserFavoriteRestaurant?.some((fav) => fav.restaurantId === restaurantId);

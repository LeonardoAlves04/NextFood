import RestaurantItem from "@/app/_components/restaurant-item";
import { db } from "@/app/_lib/prisma";

const RecommendedRestaurants = async () => {
  const restaurants = await db.restaurant.findMany({});

  return (
    <div>
      {restaurants.map((restaurant) => (
        <RestaurantItem key={restaurant.id} restaurant={restaurant} />
      ))}
    </div>
  );
};

export default RecommendedRestaurants;

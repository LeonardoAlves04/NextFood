"use client";

import { notFound, useSearchParams } from "next/navigation";

const Restaurants = () => {
  const searchParams = useSearchParams();

  const searchFor = searchParams.get("search");

  if (!searchFor) {
    return notFound();
  }

  return searchParams.get("search");
};

export default Restaurants;

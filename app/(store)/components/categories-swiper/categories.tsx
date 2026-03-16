"use client";

import { useEffect, useState } from "react";
import { categoryService } from "@/services/category";
import { CategoriesSwiper } from "./categories-swiper";

export const Categories = () => {
  const [categories, setCategories] = useState({ data: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const result = await categoryService.getAll({ type: "main" });
        setCategories(result);
      } catch (error) {
        console.log("Failed to load categories, using empty array");
        setCategories({ data: [] });
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const parsedSettings = {
    ui_type: process.env.NEXT_PUBLIC_UI_TYPE || '1'
  };
  
  if (loading) {
    return null; // or a loading spinner
  }
  
  if (parsedSettings?.ui_type === "4") {
    return <CategoriesSwiper categories={categories} />;
  }

  return null;
};

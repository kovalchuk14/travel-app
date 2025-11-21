'use client';

import { useState, useRef, useEffect } from "react";
import { Category } from "@/types/story";
import css from "./CategoriesMenu.module.css";
import { Icon } from "../Icon/Icon";

interface Props {
  categories: Category[];
  value: string;
  onChange: (categoryId: string) => void;
}

export default function CategoriesMenu({ categories, value, onChange }: Props) {
  const [menuVisible, setMenuVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

 const allOptions = [
    { _id: 'all', name: 'Всі історії' },
    ...(Array.isArray(categories) ? categories : [])
  ];

   const currentOption = allOptions.find(opt => opt._id === value) || allOptions[0];

  useEffect(() => {
    if (!menuVisible) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setMenuVisible(false);
      }
      };
      document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [menuVisible]);


  const chooseCategory = (id: string) => {
     onChange(id);
      setMenuVisible(false);
    };

 return (
    <>
      <label htmlFor="categorySelect" className={css.label}>
        Категорії
      </label>

      <div className={css.selectWrapper} ref={containerRef}>
        <div
          className={`${css.select} ${menuVisible ? css.selectOpen : ""}`}
          onClick={() => setMenuVisible((prev) => !prev)}
        >
          <span className={css.selectText}>{currentOption.name}</span>
          <Icon
            name={
              menuVisible
                ? "icon-keyboard_up"
                : "icon-keyboard_down"}
            className={css.selectIcon}
          />
        </div>

        {menuVisible && (
          <div className={css.dropdown}>
            {allOptions.map((option) => (
              <div
                key={option._id}
                className={`${css.dropdownItem} ${
                  value === option._id ? css.dropdownItemSelected : ""
                }`}
                onClick={() => chooseCategory(option._id)}
              >
                {option.name}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={css.buttonsWrapper}>
        {allOptions.map((item) => (
          <button
            key={item._id}
            className={`${css.categoryBtn} ${
              value === item._id ? css.active : ""
            }`}
            onClick={() => onChange(item._id)}
          >
            {item.name}
          </button>
        ))}
      </div>
   </>
   
  );
}
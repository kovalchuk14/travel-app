"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useFormik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import styles from "./AddStoryPage.module.css";
import { Story } from "@/types/story";
import { useRef } from "react";
import { postNewStory } from "@/lib/api/clientApi";

type FormData = {
  storyImage: File | null;
  title: string;
  // shortDescription: string;
  description: string;
  category: string;
};

const categoryOptions = [
  { value: "68fb50c80ae91338641121f0", label: "Азія" },
  { value: "68fb50c80ae91338641121f4", label: "Африка" },
  { value: "68fb50c80ae91338641121f8", label: "Кавказ" },
  { value: "68fb50c80ae91338641121f7", label: "Балкани" },
  { value: "68fb50c80ae91338641121f6", label: "Пустелі" },
  { value: "68fb50c80ae91338641121f2", label: "Європа" },
  { value: "68fb50c80ae91338641121f3", label: "Америка" },
  { value: "68fb50c80ae91338641121f9", label: "Океанія" },
  { value: "68fb50c80ae91338641121f1", label: "Гори" },
];

export default function AddStoryPage() {
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  // React Query Mutation
  const createStoryMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return await postNewStory(formData);
    },
    onSuccess: (data) => {
      console.log(`/stories/${data._id}`);

      router.push(`/stories/${data._id}`);
    },
    onError: () => {
      alert("Помилка збереження");
    },
  });

  const validationSchema = Yup.object({
    storyImage: Yup.mixed().required("Додайте зображення"),
    title: Yup.string()
      .max(80, "Максимум 80 символів")
      .required("Введіть заголовок"),
    // shortDescription: Yup.string().max(61, "Максимум 61 символ"),
    // .required("Введіть короткий опис"),
    description: Yup.string()
      .max(2500, "Максимум 2500 символів")
      .required("Введіть текст історії"),
    category: Yup.string().required("Оберіть категорію"),
  });

  const formik = useFormik<FormData>({
    initialValues: {
      storyImage: null,
      title: "",
      // shortDescription: "",
      description: "",
      category: "",
    },
    validateOnMount: true,
    validationSchema,
    onSubmit: (
      values: FormData,
      { setSubmitting }: FormikHelpers<FormData>
    ) => {
      const formData = new FormData();

      if (values.storyImage) {
        formData.append("storyImage", values.storyImage as Blob);
      }

      formData.append("title", values.title);
      // formData.append("shortDescription", values.shortDescription);
      formData.append("description", values.description);
      formData.append("category", values.category);

      // formData.append("date", new Date().toISOString());

      createStoryMutation.mutate(formData);
      setSubmitting(false);
    },
  });

  return (
    <div className={styles.page}>
      <form onSubmit={formik.handleSubmit} className={styles.formWrapper}>
        <div className={styles.left}>
          <h1 className={styles.title}>Створити нову історію</h1>
          {/* Обкладинка */}

          <label className={styles.label}>Обкладинка статті</label>
          <div className={styles.coverPreview}>
            {preview ? (
              <Image
                src={preview}
                alt="cover"
                width={600}
                height={400}
                className={styles.coverImage}
                unoptimized
              />
            ) : (
              <div className={styles.placeholder}>
                <span>📷</span>
                <p>Завантажте зображення</p>
              </div>
            )}
          </div>
          {formik.errors.storyImage && formik.touched.storyImage && (
            <p className={styles.error}>{formik.errors.storyImage}</p>
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                formik.setFieldValue("storyImage", file);
                setPreview(URL.createObjectURL(file));
              }
            }}
          />

          <button
            type="button"
            className={styles.uploadBtn}
            onClick={handleFileButtonClick}
          >
            <span className={styles.btnSpan}>Завантажити фото</span>
          </button>

          {/* Заголовок */}
          <div className={styles.field}>
            <label>Заголовок</label>
            <input
              type="text"
              name="title"
              placeholder="Введіть заголовок історії"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={styles.storieTitle}
            />
            {formik.errors.title && formik.touched.title && (
              <p className={styles.error}>{formik.errors.title}</p>
            )}
          </div>

          {/* Категорія */}
          <div className={styles.field}>
            <label>Категорія</label>
            <select
              name="category"
              value={formik.values.category}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={styles.selectField}
            >
              <option value="">Категорія</option>
              {categoryOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {formik.errors.category && formik.touched.category && (
              <p className={styles.error}>{formik.errors.category}</p>
            )}
          </div>

          {/* Короткий опис */}
          {/* <div className={styles.hidden}>
            <div className={styles.field}>
              <label className={styles.shortDescLabel}>Короткий опис</label>
              <textarea
                name="shortDescription"
                placeholder="Введіть короткий опис"
                value={formik.values.shortDescription}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                maxLength={61}
                className={styles.shortDesc}
              />
              <div className={styles.counter}>
                {formik.values.shortDescription?.length || 0}/61
              </div>
              {formik.errors.shortDescription &&
                formik.touched.shortDescription && (
                  <p className={styles.error}>
                    {formik.errors.shortDescription}
                  </p>
                )}
            </div>
          </div> */}

          {/* Текст історії */}
          <div className={styles.field}>
            <label>Текст історії</label>
            <textarea
              name="description"
              placeholder="Ваша історія тут"
              rows={7}
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.description && formik.touched.description && (
              <p className={styles.error}>{formik.errors.description}</p>
            )}
          </div>
        </div>

        <div className={styles.right}>
          <button
            type="submit"
            className={`${styles.save} ${formik.isValid ? styles.active : ""}`}
            disabled={!formik.isValid || createStoryMutation.isPending}
          >
            {createStoryMutation.isPending ? "Збереження..." : "Зберегти"}
          </button>
          <button
            type="button"
            className={styles.cancel}
            onClick={() => router.push("/stories")}
          >
            Відмінити
          </button>
        </div>
      </form>
    </div>
  );
}

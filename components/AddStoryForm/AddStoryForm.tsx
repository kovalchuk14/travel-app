"use client";

import { Formik, Form, Field, ErrorMessage, FieldProps } from "formik";
import * as Yup from "yup";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import styles from "./AddStoryForm.module.css";
import type { Category, CategoriesResponse } from "@/types/story";

const LOCAL_API_URL = process.env.NEXT_PUBLIC_LOCAL_API_URL!;

export interface StoryFormValues {
  img: File | string | null;
  title: string;
  category: string;
  shortDescription: string;
  article: string;
}

interface AddStoryFormProps {
  initialValues?: StoryFormValues;
  storyId?: string;
  isEditMode?: boolean;
}

const validationSchema = Yup.object({
  img: Yup.mixed().required("Обкладинка обовʼязкова"),
  title: Yup.string()
    .min(3, "Мінімум 3 символи")
    .max(100, "Максимум 100 символів")
    .required("Введіть заголовок"),
  shortDescription: Yup.string().max(61, "Максимум 61 символ"),
  category: Yup.string().required("Оберіть категорію"),
  article: Yup.string().required("Розкажіть свою історію"),
});

export default function AddStoryForm({
  initialValues,
  storyId,
  isEditMode = false,
}: AddStoryFormProps) {
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(
    typeof initialValues?.img === "string" ? initialValues.img : null
  );

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // --- Fetch categories з бекенду ---
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch(`${LOCAL_API_URL}/categories`);
        const data: CategoriesResponse = await res.json();
        setCategories(data.data.data); // масив Category[]
      } catch (err) {
        console.error("Помилка завантаження категорій:", err);
      } finally {
        setLoadingCategories(false);
      }
    }
    loadCategories();
  }, []);

  const autoResize = (el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  const saveStoryMutation = useMutation({
    mutationFn: async (values: StoryFormValues) => {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("category", values.category);
      formData.append("description", values.article);

      if (values.img instanceof File) {
        formData.append("storyImage", values.img);
      } else if (typeof values.img === "string") {
        formData.append("imgUrl", values.img);
      }

      const method = isEditMode ? "PATCH" : "POST";
      const url = isEditMode
        ? `${LOCAL_API_URL}/stories/${storyId}`
        : `${LOCAL_API_URL}/stories`;

      const res = await fetch(url, {
        method,
        body: formData,
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok)
        throw new Error(data.message || "Помилка збереження історії");

      return data;
    },
    onSuccess: (data) => {
      const id = isEditMode ? storyId : data.data._id;
      router.push(`/stories/${id}`);
    },
    onError: (error: any) => {
      alert(
        error instanceof Error ? error.message : "Помилка збереження історії"
      );
    },
  });

  const defaultValues: StoryFormValues = {
    img: null,
    title: "",
    category: "",
    shortDescription: "",
    article: "",
  };

  if (loadingCategories) return <div>Завантаження категорій...</div>;

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues || defaultValues}
      validationSchema={validationSchema}
      validateOnChange
      validateOnBlur={false}
      onSubmit={(values, { setSubmitting }) => {
        saveStoryMutation.mutate(values);
        setSubmitting(false);
      }}
    >
      {({ setFieldValue, isValid, values, errors, touched, isSubmitting }) => (
        <Form className={styles.formContainer}>
          <div className={styles.formMain}>
            {/* Обкладинка */}
            <div className={styles.formSection}>
              <label className={styles.label}>Обкладинка статті</label>
              <div className={styles.imageUploadArea}>
                <div className={styles.imagePlaceholder}>
                  <Image
                    src={imagePreview || "/images/form-images.jpg"}
                    alt="Превʼю"
                    width={335}
                    height={223}
                    className={styles.image}
                  />
                </div>

                <input
                  type="file"
                  id="coverImageUpload"
                  className={styles.hiddenInput}
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.currentTarget.files?.[0] || null;
                    if (file) {
                      setFieldValue("img", file);
                      const reader = new FileReader();
                      reader.onloadend = () =>
                        setImagePreview(reader.result as string);
                      reader.readAsDataURL(file);
                    }
                  }}
                />

                <button
                  type="button"
                  className={styles.uploadButton}
                  onClick={() =>
                    document.getElementById("coverImageUpload")?.click()
                  }
                >
                  Завантажити фото
                </button>

                <ErrorMessage
                  name="img"
                  component="div"
                  className={styles.errorText}
                />
              </div>
            </div>

            {/* Заголовок */}
            <div className={styles.formField}>
              <label htmlFor="title" className={styles.label}>
                Заголовок
              </label>
              <Field
                id="title"
                name="title"
                type="text"
                className={`${styles.textInput} ${
                  errors.title && touched.title ? styles.inputError : ""
                }`}
                placeholder="Введіть заголовок"
              />
              <ErrorMessage
                name="title"
                component="div"
                className={styles.errorText}
              />
            </div>

            {/* Категорія */}
            <div className={styles.formField}>
              <label className={styles.label}>Категорія</label>
              <Field
                as="select"
                name="category"
                className={`${styles.selectInput} ${
                  errors.category && touched.category ? styles.inputError : ""
                }`}
              >
                <option value="">Оберіть категорію</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="category"
                component="div"
                className={styles.errorText}
              />
            </div>

            {/* Короткий опис */}
            <div className={`${styles.formField} ${styles.hidden}`}>
              <label className={styles.label}>Короткий опис</label>
              <Field
                as="textarea"
                name="shortDescription"
                className={styles.textareaInput}
                rows={3}
                placeholder="Введіть короткий опис"
              />
              <div className={styles.fieldFooter}>
                <ErrorMessage
                  name="shortDescription"
                  component="span"
                  className={styles.errorText}
                />
                <span className={styles.charCount}>
                  Залишилось {61 - (values.shortDescription?.length || 0)}{" "}
                  символів
                </span>
              </div>
            </div>

            {/* Текст історії */}
            <div className={styles.formField}>
              <label className={styles.label}>Текст історії</label>
              <Field name="article">
                {({ field }: FieldProps) => (
                  <textarea
                    {...field}
                    ref={(el) => {
                      textareaRef.current = el;
                      autoResize(el);
                    }}
                    onInput={(e) => autoResize(e.currentTarget)}
                    rows={3}
                    placeholder="Ваша історія тут"
                    className={`${styles.textareaInput} ${
                      errors.article && touched.article ? styles.inputError : ""
                    }`}
                  />
                )}
              </Field>
              <ErrorMessage
                name="article"
                component="div"
                className={styles.errorText}
              />
            </div>
          </div>

          {/* Кнопки */}
          <div className={styles.actionsColumn}>
            <button
              type="submit"
              className={styles.saveButton}
              disabled={!isValid || isSubmitting || saveStoryMutation.isPending}
            >
              {saveStoryMutation.isPending ? "Збереження..." : "Зберегти"}
            </button>

            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => router.back()}
            >
              Відмінити
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

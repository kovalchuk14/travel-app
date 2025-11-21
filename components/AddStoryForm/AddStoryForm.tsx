"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import type { FieldProps } from "formik";
import * as Yup from "yup";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./AddStoryForm.module.css";

const LOCAL_API_URL = process.env.NEXT_PUBLIC_LOCAL_API_URL!;

interface StoryFormValues {
  img: File | string | null;
  title: string;
  category: string;
  shortDescription: string;
  article: string;
}

interface Category {
  _id: string;
  name: string;
}

interface AddStoryFormProps {
  initialValues?: StoryFormValues;
  categories?: Category[];
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
  categories = [],
  storyId,
  isEditMode = false,
}: AddStoryFormProps) {
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const autoResize = (el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  const [imagePreview, setImagePreview] = useState<string | null>(
    typeof initialValues?.img === "string" ? initialValues.img : null
  );

  const defaultValues: StoryFormValues = {
    img: null,
    title: "",
    category: "",
    shortDescription: "",
    article: "",
  };

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues || defaultValues}
      validationSchema={validationSchema}
      validateOnChange={true}
      validateOnBlur={false}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const formData = new FormData();
          formData.append("title", values.title);
          formData.append("category", values.category);
          // formData.append("shortDescription", values.shortDescription);
          formData.append("description", values.article);

          if (values.img instanceof File) {
            formData.append("storyImage", values.img);
          } else if (typeof values.img === "string") {
            formData.append("imgUrl", values.img);
          }

          const method = isEditMode ? "PATCH" : "POST";
          // const url = isEditMode
          //   ? `${LOCAL_API_URL}/stories/${storyId}`
          //   : `${LOCAL_API_URL}/stories`;
          const url = `${LOCAL_API_URL}/stories/${storyId}`;

          console.log(method, url);

          const res = await fetch(url, {
            method,
            body: formData,
            credentials: "include",
          });

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.message || "Помилка збереження історії");
          }

          router.push(`/stories/${data.data._id}`);
        } catch (error) {
          console.error("Помилка:", error);
          const message =
            error instanceof Error
              ? error.message
              : "Помилка збереження історії";
          alert(message);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ setFieldValue, isValid, values, errors, isSubmitting }) => (
        <Form className={styles.formContainer}>
          <div className={styles.formMain}>
            {/* Обкладинка статті */}
            <div className={styles.formSection}>
              <label className={styles.label}>Обкладинка статті</label>
              <div className={styles.imageUploadArea}>
                <div className={styles.imagePlaceholder}>
                  <Image
                    src={imagePreview || "/images/form-images.jpg"}
                    alt="Превʼю обкладинки"
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
                      reader.onloadend = () => {
                        setImagePreview(reader.result as string);
                      };
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
                placeholder="Введіть заголовок історії"
                className={`${styles.textInput} ${
                  errors.title ? styles.inputError : ""
                }`}
              />
              <ErrorMessage
                name="title"
                component="div"
                className={styles.errorText}
              />
            </div>

            {/* Категорія */}
            <div className={styles.formField}>
              <label htmlFor="category" className={styles.label}>
                Категорія
              </label>
              <Field
                as="select"
                id="category"
                name="category"
                className={`${styles.selectInput} ${
                  errors.category ? styles.inputError : ""
                }`}
              >
                <option value="">Оберіть категорію</option>
                {Array.isArray(categories) &&
                  categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
              </Field>
              <ErrorMessage
                name="category"
                component="div"
                className={styles.errorText}
              />
            </div>

            {/* Короткий опис
            <div className={styles.formField}>
              <label htmlFor="shortDescription" className={styles.label}>
                Короткий опис
              </label>
              <Field
                as="textarea"
                id="shortDescription"
                name="shortDescription"
                placeholder="Введіть короткий опис"
                rows={3}
                className={`${styles.textareaInput} ${
                  errors.shortDescription ? styles.inputError : ""
                }`}
              />
              <div className={styles.fieldFooter}>
                <ErrorMessage
                  name="shortDescription"
                  component="span"
                  className={styles.errorText}
                />
                <span className={styles.charCount}>
                  Залишилось{" "}
                  {Math.max(0, 61 - (values.shortDescription?.length || 0))}{" "}
                  символів
                </span>
              </div>
            </div> */}

            {/* Текст історії */}
            <div className={styles.formField}>
              <label htmlFor="article" className={styles.label}>
                Текст історії
              </label>

              <Field name="article">
                {({ field }: FieldProps) => (
                  <textarea
                    {...field}
                    id="article"
                    ref={(el) => {
                      textareaRef.current = el;
                      autoResize(el);
                    }}
                    placeholder="Ваша історія тут"
                    className={`${styles.textareaInput} ${
                      errors.article ? styles.inputError : ""
                    }`}
                    rows={3}
                    onInput={(e) => {
                      autoResize(e.currentTarget);
                    }}
                  />
                )}
              </Field>

              <div className={styles.fieldFooter}>
                <ErrorMessage
                  name="article"
                  component="span"
                  className={styles.errorText}
                />
              </div>
            </div>
          </div>

          <div className={styles.actionsColumn}>
            <button
              type="submit"
              className={styles.saveButton}
              disabled={!isValid || isSubmitting}
            >
              Зберегти
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

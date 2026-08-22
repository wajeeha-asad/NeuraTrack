import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters.")
    .max(50, "Title must be less than 50 characters."),

  description: z
    .string()
    .min(5, "Description is required.")
    .max(200, "Description must be less than 200 characters."),

  category: z.string().min(1, "Please select a category."),

  difficulty: z.string().min(1, "Please select a difficulty."),

  totalMinutes: z.coerce
    .number()
    .min(1, "Estimated minutes must be at least 1."),

  deadline: z.string().min(1, "Please select a deadline."),
});

export default function EditPathDialog({
  open,
  onOpenChange,
  path,
  onUpdate,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),

    defaultValues: {
      title: "",
      description: "",
      category: "",
      difficulty: "",
      totalMinutes: "",
      deadline: "",
    },
  });

  useEffect(() => {
    if (path) {
      reset({
        title: path.title || "",
        description: path.description || "",
        category: path.category || "",
        difficulty: path.difficulty || "",
        totalMinutes: path.totalMinutes || "",
        deadline: path.deadline || "",
      });
    }
  }, [path, reset]);

  function onSubmit(values) {
    // totalMinutes is intentionally excluded from the update request.
    // Keep the current backend behavior while avoiding an unused variable.
    const pathUpdates = {
      title: values.title,
      description: values.description,
      category: values.category,
      difficulty: values.difficulty,
      deadline: values.deadline,
    };

    onUpdate(path.id, pathUpdates);

    onOpenChange(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-h-[90vh] w-[calc(100%-1rem)] max-w-lg overflow-y-auto border-white/10 bg-[#101633] text-white sm:w-full">

        <DialogHeader>
          <DialogTitle className="text-2xl">
            Edit Learning Path
          </DialogTitle>

          <DialogDescription className="text-slate-400">
            Update your learning path details.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >

          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Title
            </label>

            <Input
              placeholder="e.g. AI Engineering"
              {...register("title")}
            />

            {errors.title && (
              <p className="text-sm text-red-400">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Description
            </label>

            <Textarea
              placeholder="What do you want to learn?"
              {...register("description")}
            />

            {errors.description && (
              <p className="text-sm text-red-400">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Category + Difficulty */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Category
              </label>

              <select
                {...register("category")}
                className="h-10 w-full rounded-md border border-white/10 bg-[#151B45] px-3 text-sm text-white outline-none focus:ring-2 focus:ring-[#8093F1]"
              >
                <option value="">
                  Select category
                </option>

                <option value="AI">
                  AI / Machine Learning
                </option>

                <option value="Web">
                  Web Development
                </option>

                <option value="Programming">
                  Programming
                </option>

                <option value="Data">
                  Data Science
                </option>

                <option value="Other">
                  Other
                </option>
              </select>

              {errors.category && (
                <p className="text-sm text-red-400">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Difficulty
              </label>

              <select
                {...register("difficulty")}
                className="h-10 w-full rounded-md border border-white/10 bg-[#151B45] px-3 text-sm text-white outline-none focus:ring-2 focus:ring-[#8093F1]"
              >
                <option value="">
                  Select difficulty
                </option>

                <option value="Beginner">
                  Beginner
                </option>

                <option value="Intermediate">
                  Intermediate
                </option>

                <option value="Advanced">
                  Advanced
                </option>
              </select>

              {errors.difficulty && (
                <p className="text-sm text-red-400">
                  {errors.difficulty.message}
                </p>
              )}
            </div>

          </div>

          {/* Minutes + Deadline */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Estimated Minutes
              </label>

              <Input
                type="number"
                placeholder="120"
                {...register("totalMinutes")}
              />

              {errors.totalMinutes && (
                <p className="text-sm text-red-400">
                  {errors.totalMinutes.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Deadline
              </label>

              <Input
                type="date"
                {...register("deadline")}
              />

              {errors.deadline && (
                <p className="text-sm text-red-400">
                  {errors.deadline.message}
                </p>
              )}
            </div>

          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">

            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#4F8CFF] sm:w-auto"
            >
              Save Changes
            </Button>

          </div>

        </form>

      </DialogContent>
    </Dialog>
  );
}
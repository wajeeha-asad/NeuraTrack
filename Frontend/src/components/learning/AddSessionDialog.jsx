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

// ==================================================
// FORM VALIDATION
// ==================================================

const formSchema = z.object({
  title: z
    .string()
    .min(
      2,
      "Session title must be at least 2 characters."
    )
    .max(
      100,
      "Session title must be less than 100 characters."
    ),

  // Duration is stored in MINUTES
  duration: z.coerce
    .number()
    .int(
      "Duration must be a whole number of minutes."
    )
    .min(
      1,
      "Duration must be at least 1 minute."
    ),
});

// ==================================================
// COMPONENT
// ==================================================

export default function AddSessionDialog({
  open,
  onOpenChange,
  onAdd,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver:
      zodResolver(formSchema),

    defaultValues: {
      title: "",
      duration: "",
    },
  });

  // ==================================================
  // SUBMIT
  // ==================================================

  function onSubmit(values) {
    onAdd({
      ...values,

      // Make absolutely sure duration
      // is stored as a number of minutes
      duration: Number(
        values.duration
      ),
    });

    reset();

    onOpenChange(false);
  }

  // ==================================================
  // CLOSE
  // ==================================================

  function handleClose(open) {
    if (!open) {
      reset();
    }

    onOpenChange(open);
  }

  // ==================================================
  // UI
  // ==================================================

  return (
    <Dialog
      open={open}
      onOpenChange={handleClose}
    >
      <DialogContent className="max-h-[90vh] w-[calc(100%-1rem)] max-w-md overflow-y-auto border-white/10 bg-[#101633] text-white sm:w-full">

        <DialogHeader>

          <DialogTitle className="text-2xl">
            Add Learning Session
          </DialogTitle>

          <DialogDescription className="text-slate-400">
            Add a session to your learning path and set how long it will take.
          </DialogDescription>

        </DialogHeader>

        <form
          onSubmit={handleSubmit(
            onSubmit
          )}
          className="space-y-5"
        >

          {/* SESSION TITLE */}

          <div className="space-y-2">

            <label className="text-sm font-medium">
              Session Title
            </label>

            <Input
              placeholder="e.g. Learn Python Functions"
              {...register("title")}
            />

            {errors.title && (
              <p className="text-sm text-red-400">
                {errors.title.message}
              </p>
            )}

          </div>

          {/* SESSION DURATION */}

          <div className="space-y-2">

            <label className="text-sm font-medium">
              Duration (minutes)
            </label>

            <Input
              type="number"
              step="1"
              min="1"
              placeholder="25"
              {...register(
                "duration"
              )}
            />

            <p className="text-xs text-slate-500">
              Example: 20, 25, 50, or 120 minutes
            </p>

            {errors.duration && (
              <p className="text-sm text-red-400">
                {errors.duration.message}
              </p>
            )}

          </div>

          {/* ACTIONS */}

          <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">

            <Button
              type="button"
              variant="ghost"
              onClick={() =>
                handleClose(false)
              }
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#8093F1] to-[#72DDF7] text-[#101633] sm:w-auto"
            >
              Add Session
            </Button>

          </div>

        </form>

      </DialogContent>
    </Dialog>
  );
}
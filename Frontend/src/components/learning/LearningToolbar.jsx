import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "../ui/input";

export default function LearningToolbar({
  search,
  setSearch,
  category,
  setCategory,
  difficulty,
  setDifficulty,
}) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl lg:flex-row lg:items-center">

      {/* Search */}
      <div className="relative flex-1">

        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <Input
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search learning paths..."
          className="h-11 border-white/10 bg-white/[0.04] pl-11"
        />

      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex">

        <div className="relative">
          <SlidersHorizontal
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value)
            }
            className="h-11 w-full rounded-xl border border-white/10 bg-[#151B45] pl-9 pr-8 text-sm text-white outline-none transition focus:ring-2 focus:ring-[#8093F1] sm:w-44"
          >
            <option value="all">
              All Categories
            </option>

            <option value="AI">
              AI / ML
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
        </div>

        <select
          value={difficulty}
          onChange={(event) =>
            setDifficulty(event.target.value)
          }
          className="h-11 rounded-xl border border-white/10 bg-[#151B45] px-4 text-sm text-white outline-none transition focus:ring-2 focus:ring-[#8093F1] sm:w-44"
        >
          <option value="all">
            All Difficulties
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

      </div>

    </div>
  );
}
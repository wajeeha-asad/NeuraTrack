import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Layout from "../components/layout/Layout";
import LearningHeader from "../components/learning/LearningHeader";
import LearningToolbar from "../components/learning/LearningToolbar";
import LearningGrid from "../components/learning/LearningGrid";
import CreatePathDialog from "../components/learning/CreatePathDialog";
import EditPathDialog from "../components/learning/EditPathDialog";
import PathDetailsDialog from "../components/learning/PathDetailsDialog";
import {
  getLearningPaths, createLearningPath, updateLearningPath, deleteLearningPath,
} from "../services/learningPathService";

export default function LearningPaths() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [paths, setPaths] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedPath, setSelectedPath] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadPaths() {
    try {
      setLoading(true);
      setPaths(await getLearningPaths());
    } catch (error) {
      toast.error(error.message || "Failed to load learning paths.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadPaths(); }, []);

  async function handleCreatePath(values) {
    try {
      const newPath = await createLearningPath(values);
      setPaths(current => [...current, newPath]);
      toast.success("Learning path created successfully!");
    } catch (error) { toast.error(error.message || "Failed to create path."); }
  }

  async function handleDeletePath(id) {
    if (!window.confirm("Are you sure you want to delete this learning path?")) return;
    try {
      await deleteLearningPath(id);
      setPaths(current => current.filter(path => path.id !== id));
      toast.success("Learning path deleted.");
    } catch (error) { toast.error(error.message || "Failed to delete path."); }
  }

  function handleEditPath(path) {
    setSelectedPath(path);
    setEditDialogOpen(true);
  }

  async function handleUpdatePath(id, updates) {
    try {
      const updatedPath = await updateLearningPath(id, updates);
      setPaths(current => current.map(path => path.id === id ? updatedPath : path));
      setSelectedPath(updatedPath);
      toast.success("Learning path updated successfully!");
    } catch (error) { toast.error(error.message || "Failed to update path."); }
  }

  function handleViewPath(path) {
    setSelectedPath(path);
    setDetailsDialogOpen(true);
  }

  function handlePathUpdate(updatedPath) {
    setPaths(current => current.map(path => path.id === updatedPath.id ? updatedPath : path));
    setSelectedPath(updatedPath);
  }

  const filteredPaths = useMemo(() => paths.filter(path => {
    const q = search.toLowerCase();
    return (
      (path.title.toLowerCase().includes(q) || path.description.toLowerCase().includes(q)) &&
      (category === "all" || path.category === category) &&
      (difficulty === "all" || path.difficulty === difficulty)
    );
  }), [paths, search, category, difficulty]);

  return (
    <Layout>
      <div className="min-w-0 space-y-6 sm:space-y-8">
        <LearningHeader onCreateClick={() => setDialogOpen(true)} />
        <LearningToolbar search={search} setSearch={setSearch} category={category}
          setCategory={setCategory} difficulty={difficulty} setDifficulty={setDifficulty} />
        {loading ? (
          <div className="py-20 text-center text-slate-400">Loading learning paths...</div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">Showing <span className="font-semibold text-white">{filteredPaths.length}</span>{" "}
                {filteredPaths.length === 1 ? "learning path" : "learning paths"}</p>
            </div>
            <LearningGrid paths={filteredPaths} onDelete={handleDeletePath}
              onEdit={handleEditPath} onView={handleViewPath} />
          </>
        )}
      </div>

      <CreatePathDialog open={dialogOpen} onOpenChange={setDialogOpen} onCreate={handleCreatePath} />
      <EditPathDialog open={editDialogOpen} onOpenChange={open => {
        setEditDialogOpen(open); if (!open) setSelectedPath(null);
      }} path={selectedPath} onUpdate={handleUpdatePath} />
      <PathDetailsDialog open={detailsDialogOpen} onOpenChange={open => {
        setDetailsDialogOpen(open); if (!open) setSelectedPath(null);
      }} path={selectedPath} onPathUpdate={handlePathUpdate} />
    </Layout>
  );
}

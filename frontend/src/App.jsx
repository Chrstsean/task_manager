import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  const API_URL = "http://127.0.0.1:8000/api/tasks/";

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(API_URL);
      setTasks(res.data);
    } catch (err) {
      setError("Failed to fetch tasks. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add task
  const addTask = async () => {
    if (!title.trim()) {
      setError("Please enter a task title");
      return;
    }

    try {
      setAdding(true);
      setError("");
      await axios.post(API_URL, {
        title: title.trim(),
        is_completed: false,
      });

      setTitle("");
      await fetchTasks();
    } catch (err) {
      setError("Failed to add task. Please try again.");
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !adding) {
      addTask();
    }
  };

  return (
    <div style={styles.mainContainer}>
      {/* Animated background elements */}
      <div style={styles.blob1}></div>
      <div style={styles.blob2}></div>
      <div style={styles.blob3}></div>

      <div style={styles.contentWrapper}>
        {/* Header Card */}
        <div style={styles.headerCard}>
          <div style={styles.headerContent}>
            <h1 style={styles.title}>✨ Task Manager</h1>
            <div style={styles.emoji}>📋</div>
          </div>
          <p style={styles.subtitle}>Manage your tasks efficiently</p>
        </div>

        {/* Input Section */}
        <div style={styles.inputCard}>
          {error && (
            <div style={styles.errorMessage}>
              {error}
            </div>
          )}

          <div style={styles.inputWrapper}>
            <div style={styles.inputContainer}>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={adding}
                style={styles.input}
                placeholder="What's your next task?"
              />
            </div>
            <button
              onClick={addTask}
              disabled={adding}
              style={styles.addButton}
            >
              {adding ? (
                <>
                  <span style={styles.spinnerEmoji}>⏳</span>
                  Adding...
                </>
              ) : (
                <>
                  <span>➕</span>
                  Add
                </>
              )}
            </button>
          </div>

          <p style={styles.taskCounter}>
            {tasks.length} task{tasks.length !== 1 ? "s" : ""} • Press Enter to add
          </p>
        </div>

        {/* Tasks Section */}
        <div style={styles.tasksCard}>
          <h2 style={styles.tasksTitle}>Your Tasks</h2>

          {loading ? (
            <div style={styles.skeletonContainer}>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={styles.skeleton}
                ></div>
              ))}
            </div>
          ) : tasks.length === 0 ? (
            <div style={styles.emptyState}>
              <p style={styles.emptyEmoji}>🎉</p>
              <p style={styles.emptyText}>No tasks yet. Create one to get started!</p>
            </div>
          ) : (
            <div style={styles.tasksList}>
              {tasks.map((task, index) => (
                <div
                  key={task.id}
                  style={{
                    ...styles.taskItem,
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  <div style={styles.taskContent}>
                    <span style={styles.taskIcon}>
                      {task.is_completed ? "✅" : "⭕"}
                    </span>
                    <span
                      style={{
                        ...styles.taskTitle,
                        ...(task.is_completed && styles.completedTask),
                      }}
                    >
                      {task.title}
                    </span>
                  </div>
                  <span
                    style={{
                      ...styles.taskBadge,
                      ...(task.is_completed
                        ? styles.completedBadge
                        : styles.pendingBadge),
                    }}
                  >
                    {task.is_completed ? "Done ✓" : "Pending"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  mainContainer: {
    minHeight: "100vh",
    background: "linear-gradient(to bottom right, rgb(37, 99, 235), rgb(147, 51, 234), rgb(236, 72, 153))",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
    position: "relative",
    overflow: "hidden",
  },
  blob1: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "18rem",
    height: "18rem",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: "50%",
    filter: "blur(3rem)",
    mixBlendMode: "multiply",
    animation: "blob 7s infinite",
    pointerEvents: "none",
  },
  blob2: {
    position: "absolute",
    top: 0,
    right: 0,
    width: "18rem",
    height: "18rem",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: "50%",
    filter: "blur(3rem)",
    mixBlendMode: "multiply",
    animation: "blob 7s infinite",
    animationDelay: "2s",
    pointerEvents: "none",
  },
  blob3: {
    position: "absolute",
    bottom: "-2rem",
    left: "50%",
    transform: "translateX(-50%)",
    width: "18rem",
    height: "18rem",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: "50%",
    filter: "blur(3rem)",
    mixBlendMode: "multiply",
    animation: "blob 7s infinite",
    animationDelay: "4s",
    pointerEvents: "none",
  },
  contentWrapper: {
    position: "relative",
    zIndex: 10,
    width: "100%",
    maxWidth: "48rem",
  },
  headerCard: {
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(1rem)",
    borderRadius: "1.5rem",
    padding: "2rem",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    marginBottom: "1.5rem",
    animation: "fadeIn 0.6s ease-out",
  },
  headerContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "0.5rem",
  },
  title: {
    fontSize: "2.25rem",
    fontWeight: "700",
    color: "white",
    textShadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
  },
  emoji: {
    fontSize: "2.25rem",
    animation: "bounce 1s ease-in-out infinite",
  },
  subtitle: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: "0.875rem",
  },
  inputCard: {
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(1rem)",
    borderRadius: "1.5rem",
    padding: "1.5rem",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    marginBottom: "1.5rem",
    animation: "fadeIn 0.6s ease-out",
    animationDelay: "0.2s",
    opacity: 1,
  },
  errorMessage: {
    marginBottom: "1rem",
    padding: "0.75rem",
    background: "rgba(239, 68, 68, 0.2)",
    border: "1px solid rgba(244, 114, 114, 0.5)",
    borderRadius: "0.5rem",
    color: "rgb(254, 202, 202)",
    fontSize: "0.875rem",
    animation: "shake 0.4s ease-in-out",
  },
  inputWrapper: {
    display: "flex",
    gap: "0.75rem",
    marginBottom: "1rem",
  },
  inputContainer: {
    flex: 1,
    position: "relative",
  },
  input: {
    width: "100%",
    padding: "0.75rem 1rem",
    background: "rgba(255, 255, 255, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "0.5rem",
    color: "white",
    fontSize: "1rem",
    fontFamily: "inherit",
    transition: "all 0.3s ease",
    outline: "none",
  },
  addButton: {
    padding: "0.75rem 1.5rem",
    background: "linear-gradient(to right, rgb(96, 165, 250), rgb(168, 85, 247))",
    color: "white",
    fontWeight: "600",
    border: "none",
    borderRadius: "0.5rem",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  spinnerEmoji: {
    display: "inline-block",
    animation: "spin 1s linear infinite",
  },
  taskCounter: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: "0.75rem",
  },
  tasksCard: {
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(1rem)",
    borderRadius: "1.5rem",
    padding: "1.5rem",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    animation: "fadeIn 0.6s ease-out",
    animationDelay: "0.4s",
    opacity: 1,
  },
  tasksTitle: {
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "white",
    marginBottom: "1rem",
  },
  skeletonContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  skeleton: {
    height: "3.5rem",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "0.5rem",
    animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
    border: "1px solid rgba(255, 255, 255, 0.2)",
  },
  emptyState: {
    textAlign: "center",
    paddingTop: "3rem",
    paddingBottom: "3rem",
  },
  emptyEmoji: {
    fontSize: "3.75rem",
    marginBottom: "0.75rem",
  },
  emptyText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: "1.125rem",
  },
  tasksList: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    maxHeight: "24rem",
    overflowY: "auto",
    paddingRight: "0.5rem",
  },
  taskItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem",
    background: "rgba(255, 255, 255, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "0.75rem",
    transition: "all 0.3s ease",
    animation: "slideUp 0.5s ease-out forwards",
    cursor: "pointer",
  },
  taskContent: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    flex: 1,
    minWidth: 0,
  },
  taskIcon: {
    fontSize: "1.5rem",
  },
  taskTitle: {
    color: "white",
    fontWeight: "500",
    transition: "all 0.3s ease",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  completedTask: {
    textDecoration: "line-through",
    color: "rgba(255, 255, 255, 0.6)",
  },
  taskBadge: {
    fontSize: "0.75rem",
    fontWeight: "600",
    padding: "0.25rem 0.75rem",
    borderRadius: "9999px",
    whiteSpace: "nowrap",
    marginLeft: "0.5rem",
    border: "1px solid",
  },
  completedBadge: {
    background: "rgba(34, 197, 94, 0.4)",
    color: "rgb(187, 247, 208)",
    borderColor: "rgba(134, 239, 172, 0.5)",
  },
  pendingBadge: {
    background: "rgba(234, 179, 8, 0.4)",
    color: "rgb(254, 243, 199)",
    borderColor: "rgba(253, 224, 71, 0.5)",
  },
};
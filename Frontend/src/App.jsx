import { Toaster } from "react-hot-toast";

import AppRouter from "./routes/AppRouter";

function App() {
  return (
    <>
      <AppRouter />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#11162F",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.1)",
          },
        }}
      />
    </>
  );
}

export default App;
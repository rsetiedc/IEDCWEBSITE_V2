import Navbar from "./components/Navbar/Navbar";

export default function App() {
  return (
    <>
      <Navbar />

      <section
        id="home"
        style={{
          height: "100vh",
          background: "#09090b",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          fontSize: "4rem",
          fontWeight: "700",
        }}
      >
        IEDC
      </section>
    </>
  );
}

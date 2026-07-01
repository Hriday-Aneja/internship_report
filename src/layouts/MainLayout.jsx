import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Sidebar from "../components/Sidebar/Sidebar";

function MainLayout({ children }) {
  return (
    <>
      <Header />

      <div className="main-container">

        <Sidebar />

        <main className="content">
          {children}
        </main>

      </div>

      <Footer />
    </>
  );
}

export default MainLayout;
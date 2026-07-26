import React from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import StatsBar from "./components/StatsBar";
import Categories from "./components/Categories";
import FeaturedProducts from "./components/FeaturedProducts";
import KoperasiSection from "./components/KoperasiSection";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen bg-[#F8F7F4] font-sans text-slate-800">
      <Header />
      <Hero />
      <StatsBar />
      {/* Bungkus bagian Produk dengan background putih penuh */}
      <div className="bg-white w-full border-y border-slate-100 py-16">
        <section id="produk" className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-extrabold text-center mb-10 bg-gradient-to-r from-[#00378A] to-[#0453C9] bg-clip-text text-transparent">
            Produk
          </h2>
          <Categories />
          <FeaturedProducts />
        </section>
      </div>
      <KoperasiSection />
      <Footer />
    </div>
  );
}

export default App;

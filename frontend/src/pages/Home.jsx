import Header from "../components/layout/Header";
import Hero from "../components/home/Hero";
import StatsBar from "../components/home/StatsBar";
import Categories from "../components/home/Categories";
import FeaturedProducts from "../components/home/FeaturedProducts";
import KoperasiSection from "../components/home/KoperasiSection";
import Footer from "../components/layout/Footer";

export default function Home() {
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

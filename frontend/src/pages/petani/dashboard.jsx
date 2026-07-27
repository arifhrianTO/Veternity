import React from "react";
import PetaniSidebar from "../../components/petani/PetaniSidebar";
import PetaniHeader from "../../components/petani/PetaniHeader";
import PetaniStatCard from "../../components/petani/PetaniStatCard";
import PetaniOffers from "../../components/petani/PetaniOffers";
import PetaniOrders from "../../components/petani/PetaniOrders";
import { dashboardMetrics, latestOffers, latestOrders } from "../../data/petaniData";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#F3F8F6] font-sans text-slate-900">
      <div className="flex max-w-[1360px] mx-auto py-8 gap-6 px-4">
        <PetaniSidebar />

        <div className="flex-1">
          <PetaniHeader />

          <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_1fr_1fr_1fr]">
              {dashboardMetrics.map((m) => (
                <PetaniStatCard key={m.title} {...m} />
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <PetaniOffers offers={latestOffers} />
            <PetaniOrders orders={latestOrders} />
          </div>
        </div>
      </div>
    </div>
  );
}

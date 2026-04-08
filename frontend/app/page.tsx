export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">ADA Sentinel</h1>
          <p className="text-gray-400 text-sm mt-1">Autonomous Last-Mile Recovery Engine</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          <span className="text-green-400 text-sm">Live</span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Deliveries", value: "248", sub: "today" },
          { label: "High Risk", value: "12", sub: "score > 75%" },
          { label: "Auto-Resolved", value: "9", sub: "via WhatsApp" },
          { label: "Failed", value: "2", sub: "re-attempting" },
        ].map((s) => (
          <div key={s.label} className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <p className="text-gray-400 text-xs mb-1">{s.label}</p>
            <p className="text-2xl font-semibold">{s.value}</p>
            <p className="text-gray-500 text-xs mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Map Placeholder + Delivery List */}
      <div className="grid grid-cols-3 gap-4">
        
        {/* Map */}
        <div className="col-span-2 bg-gray-900 rounded-xl border border-gray-800 h-96 flex items-center justify-center">
          <p className="text-gray-600 text-sm">Mapbox live risk heatmap — coming soon</p>
        </div>

        {/* Delivery Risk Cards */}
        <div className="flex flex-col gap-3 overflow-y-auto h-96">
          {[
            { id: "DEL-001", name: "Ravi Kumar", score: 91, reason: "Heavy rain + missed before", status: "whatsapp_sent" },
            { id: "DEL-002", name: "Priya Nair", score: 82, reason: "Traffic jam on route", status: "whatsapp_sent" },
            { id: "DEL-003", name: "Arjun Singh", score: 61, reason: "Moderate rain", status: "monitoring" },
            { id: "DEL-004", name: "Sneha Rao", score: 34, reason: "Clear conditions", status: "safe" },
            { id: "DEL-005", name: "Kiran Mehta", score: 78, reason: "Customer unresponsive history", status: "whatsapp_sent" },
          ].map((d) => (
            <div key={d.id} className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm font-medium">{d.name}</p>
                  <p className="text-gray-500 text-xs">{d.id}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  d.score > 75 ? "bg-red-900 text-red-300" :
                  d.score > 50 ? "bg-yellow-900 text-yellow-300" :
                  "bg-green-900 text-green-300"
                }`}>
                  {d.score}%
                </span>
              </div>
              <p className="text-gray-400 text-xs mb-2">{d.reason}</p>
              <div className="w-full bg-gray-800 rounded-full h-1.5">
                <div className={`h-1.5 rounded-full ${
                  d.score > 75 ? "bg-red-500" :
                  d.score > 50 ? "bg-yellow-500" : "bg-green-500"
                }`} style={{ width: `${d.score}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
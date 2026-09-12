import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { SparePart } from '../../types';
import { 
  Boxes, 
  Search, 
  Plus, 
  AlertTriangle, 
  X
} from 'lucide-react';

export const InventoryManager: React.FC = () => {
  const { parts, addPart, adjustPartStock } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [isAddPartModalOpen, setIsAddPartModalOpen] = useState(false);

  // New Part Form State
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<SparePart['category']>('Display');
  const [compatibleModels, setCompatibleModels] = useState('');
  const [stockQty, setStockQty] = useState(5);
  const [minThreshold, setMinThreshold] = useState(3);
  const [buyingPrice, setBuyingPrice] = useState(50);
  const [sellingPrice, setSellingPrice] = useState(120);
  const [supplier, setSupplier] = useState('');
  const [locationBin, setLocationBin] = useState('');

  // Stats
  const totalSkus = parts.length;
  const lowStockCount = parts.filter(p => p.stockQty <= p.minThreshold && p.stockQty > 0).length;
  const totalValuation = parts.reduce((sum, p) => sum + (p.stockQty * p.buyingPrice), 0);
  const totalRetailPotential = parts.reduce((sum, p) => sum + (p.stockQty * p.sellingPrice), 0);

  const categories = ['all', 'Display', 'Battery', 'Charging Port', 'Camera', 'Housing', 'Motherboard IC', 'Speaker/Mic'];

  const filteredParts = parts.filter((part) => {
    const matchesSearch = 
      part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.compatibleModels.some(m => m.toLowerCase().includes(searchQuery.toLowerCase())) ||
      part.locationBin.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || part.category === selectedCategory;
    const matchesLowStock = !showLowStockOnly || part.stockQty <= part.minThreshold;

    return matchesSearch && matchesCategory && matchesLowStock;
  });

  const handleCreatePart = (e: React.FormEvent) => {
    e.preventDefault();
    addPart({
      sku: sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      name: name || 'OEM Replacement Component',
      category,
      compatibleModels: compatibleModels.split(',').map(m => m.trim()).filter(Boolean),
      stockQty: Number(stockQty),
      minThreshold: Number(minThreshold),
      buyingPrice: Number(buyingPrice),
      sellingPrice: Number(sellingPrice),
      supplier: supplier || 'Foxconn Direct Solutions',
      locationBin: locationBin || 'A-01',
    });

    setIsAddPartModalOpen(false);
    setSku('');
    setName('');
    setCompatibleModels('');
    setStockQty(5);
    setBuyingPrice(50);
    setSellingPrice(120);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Boxes className="w-6 h-6 text-amber-500" />
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
              Inventory & Spare Parts Catalog
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            Real-time stock tracking, storage bin locations, reorder thresholds, and profit margins.
          </p>
        </div>

        <button
          onClick={() => setIsAddPartModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-md shadow-brand-500/25 hover:shadow-glow-brand transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Spare Part</span>
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
          <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Total Catalog SKUs</span>
          <div className="text-2xl font-black text-zinc-900 dark:text-white mt-1">{totalSkus}</div>
          <span className="text-[11px] text-zinc-400">Across 7 hardware categories</span>
        </div>

        <div className="p-4 bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Low Stock Alerts</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">{lowStockCount}</div>
          <span className="text-[11px] text-amber-600/80 dark:text-amber-400/80 font-medium">Below safety threshold</span>
        </div>

        <div className="p-4 bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
          <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Inventory Asset Cost</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">${totalValuation.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
          <span className="text-[11px] text-zinc-400">Asset value at buying price</span>
        </div>

        <div className="p-4 bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
          <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Retail Valuation</span>
          <div className="text-2xl font-black text-brand-600 dark:text-brand-400 mt-1 font-mono">${totalRetailPotential.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
          <span className="text-[11px] text-zinc-400">Projected customer revenue</span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="p-4 bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-3 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search parts by name, SKU, model (e.g. iPhone 15 Pro OLED), or bin (A-12)..."
              className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer bg-zinc-100 dark:bg-zinc-950 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 font-semibold">
              <input
                type="checkbox"
                checked={showLowStockOnly}
                onChange={(e) => setShowLowStockOnly(e.target.checked)}
                className="rounded border-zinc-300 dark:border-zinc-700 text-amber-500 focus:ring-amber-500/30"
              />
              <span className="text-amber-600 dark:text-amber-400">Low Stock Only (&lt;5)</span>
            </label>
          </div>

        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800'
              }`}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Parts Inventory Table */}
      <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/40 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                <th className="py-3 px-4">Part / SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Compatible Devices</th>
                <th className="py-3 px-4">Stock Level</th>
                <th className="py-3 px-4">Bin Location</th>
                <th className="py-3 px-4">Cost / Retail</th>
                <th className="py-3 px-4">Margin</th>
                <th className="py-3 px-4 text-right">Quick Restock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {filteredParts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-zinc-400 font-medium">
                    No spare parts found matching the criteria.
                  </td>
                </tr>
              ) : (
                filteredParts.map((part) => {
                  const isLow = part.stockQty <= part.minThreshold;
                  const marginPercent = Math.round(((part.sellingPrice - part.buyingPrice) / part.sellingPrice) * 100);

                  return (
                    <tr key={part.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                      
                      {/* Name & SKU */}
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-bold text-zinc-900 dark:text-zinc-100">{part.name}</p>
                          <p className="text-[10px] font-mono text-zinc-500 mt-0.5">{part.sku}</p>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                          {part.category}
                        </span>
                      </td>

                      {/* Compatible Models */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="flex flex-wrap gap-1">
                          {part.compatibleModels.map((m, idx) => (
                            <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 font-medium">
                              {m}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Stock Level with Badge */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`font-mono font-bold text-sm ${
                            part.stockQty === 0 ? 'text-rose-600 dark:text-rose-400' : isLow ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
                          }`}>
                            {part.stockQty}
                          </span>
                          {isLow && (
                            <span className="text-[9px] font-bold uppercase tracking-tight bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded">
                              {part.stockQty === 0 ? 'OUT' : 'LOW'}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-zinc-400 font-medium">Min: {part.minThreshold}</span>
                      </td>

                      {/* Bin Location */}
                      <td className="py-3 px-4 font-mono text-zinc-700 dark:text-zinc-300 font-semibold">
                        <span className="bg-zinc-100 dark:bg-zinc-950 px-2 py-1 rounded border border-zinc-200 dark:border-zinc-800 text-xs">
                          {part.locationBin}
                        </span>
                      </td>

                      {/* Cost / Retail */}
                      <td className="py-3 px-4 font-mono">
                        <div className="text-zinc-500 text-[11px]">Cost: ${part.buyingPrice.toFixed(2)}</div>
                        <div className="text-zinc-900 dark:text-zinc-100 font-bold text-xs">Retail: ${part.sellingPrice.toFixed(2)}</div>
                      </td>

                      {/* Margin */}
                      <td className="py-3 px-4 font-mono">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          +{marginPercent}%
                        </span>
                      </td>

                      {/* Quick Restock Actions */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => adjustPartStock(part.id, 5)}
                          className="px-2.5 py-1 text-[11px] font-bold text-brand-700 dark:text-brand-300 bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/30 rounded-lg transition-colors whitespace-nowrap"
                          title="Quick restock 5 units"
                        >
                          +5 Restock
                        </button>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Part Modal */}
      {isAddPartModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div 
            className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950/40">
              <div className="flex items-center gap-2">
                <Boxes className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">Add New Spare Part</h3>
              </div>
              <button
                onClick={() => setIsAddPartModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePart} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Part SKU / Code</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="e.g. DISP-IP16P-OLED"
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
                  >
                    <option value="Display">Display</option>
                    <option value="Battery">Battery</option>
                    <option value="Charging Port">Charging Port</option>
                    <option value="Camera">Camera</option>
                    <option value="Housing">Housing</option>
                    <option value="Motherboard IC">Motherboard IC</option>
                    <option value="Speaker/Mic">Speaker/Mic</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Part Description / Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. iPhone 15 Pro OLED Assembly with TrueTone IC"
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Compatible Device Models (Comma-separated)</label>
                <input
                  type="text"
                  value={compatibleModels}
                  onChange={(e) => setCompatibleModels(e.target.value)}
                  placeholder="iPhone 15 Pro, iPhone 15 Pro Max"
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Initial Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={stockQty}
                    onChange={(e) => setStockQty(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Min Threshold</label>
                  <input
                    type="number"
                    min="1"
                    value={minThreshold}
                    onChange={(e) => setMinThreshold(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Buying Cost ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={buyingPrice}
                    onChange={(e) => setBuyingPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Selling Retail ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Supplier</label>
                  <input
                    type="text"
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value)}
                    placeholder="e.g. Foxconn Direct"
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Storage Bin / Shelf</label>
                  <input
                    type="text"
                    value={locationBin}
                    onChange={(e) => setLocationBin(e.target.value)}
                    placeholder="e.g. A-14, Bin #3"
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddPartModalOpen(false)}
                  className="px-3 py-2 text-xs font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-md shadow-brand-500/25"
                >
                  Save Spare Part
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

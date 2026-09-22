import React, { useState, useMemo } from 'react';
import { DispatchRecord } from '../data/scenarios';
import { Search, Filter, AlertTriangle, TrendingUp, DollarSign, Clock, Truck } from 'lucide-react';

interface DataExplorerProps {
  data: DispatchRecord[];
}

export const DataExplorer: React.FC<DataExplorerProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [carrierFilter, setCarrierFilter] = useState<'All' | 'Apex Fleet' | 'Third-Party Broker'>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Filtered dataset
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      const matchesSearch =
        row.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.clientAccount.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCarrier = carrierFilter === 'All' || row.carrierType === carrierFilter;
      const matchesStatus = statusFilter === 'All' || row.status === statusFilter;

      return matchesSearch && matchesCarrier && matchesStatus;
    });
  }, [data, searchTerm, carrierFilter, statusFilter]);

  // Computed summary metrics for the analyst
  const metrics = useMemo(() => {
    const fleetRuns = data.filter((r) => r.carrierType === 'Apex Fleet');
    const brokerRuns = data.filter((r) => r.carrierType === 'Third-Party Broker');

    const totalFleetMiles = fleetRuns.reduce((acc, r) => acc + r.miles, 0);
    const totalFleetCost = fleetRuns.reduce((acc, r) => acc + (r.fuelCost + (r.driverRegularHours + r.driverOvertimeHours * 1.5) * 32), 0);
    const avgFleetCostPerMile = totalFleetMiles > 0 ? (totalFleetCost / totalFleetMiles).toFixed(2) : '0';

    const totalBrokerMiles = brokerRuns.reduce((acc, r) => acc + r.miles, 0);
    const totalBrokerCost = brokerRuns.reduce((acc, r) => acc + (r.fuelCost + r.billedRevenue * 0.95), 0);
    const avgBrokerCostPerMile = totalBrokerMiles > 0 ? (totalBrokerCost / totalBrokerMiles).toFixed(2) : '0';

    const totalDetentionHours = data.reduce((acc, r) => acc + r.detentionHoursAtDepot, 0);
    const delayedRuns = data.filter((r) => r.status.includes('Delayed') || r.status.includes('Late')).length;

    return {
      avgFleetCostPerMile,
      avgBrokerCostPerMile,
      totalDetentionHours: totalDetentionHours.toFixed(1),
      delayedRate: ((delayedRuns / data.length) * 100).toFixed(0),
    };
  }, [data]);

  return (
    <div className="space-y-6">
      
      {/* Quick Analysis Header / Insight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Apex Internal Fleet Cost/Mile</span>
            <Truck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">${metrics.avgFleetCostPerMile} <span className="text-xs font-normal text-slate-400">/ mi</span></div>
          <div className="text-xs text-emerald-400 mt-1 flex items-center space-x-1">
            <span>Baseline targeted freight run</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-amber-900/40 rounded-xl p-4 shadow-sm bg-gradient-to-br from-amber-950/20 to-slate-900">
          <div className="flex items-center justify-between text-xs text-amber-400 mb-1">
            <span className="font-semibold">3rd-Party Broker Cost/Mile</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-200 font-mono">${metrics.avgBrokerCostPerMile} <span className="text-xs font-normal text-slate-400">/ mi</span></div>
          <div className="text-xs text-rose-400 mt-1">
            +68% markup over internal fleet!
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Cross-Dock Dwell / Detention</span>
            <Clock className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{metrics.totalDetentionHours} <span className="text-xs font-normal text-slate-400">hrs</span></div>
          <div className="text-xs text-slate-400 mt-1">
            Heavily concentrated in Chicago & Detroit
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Dispatched Runs Delayed</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{metrics.delayedRate}%</div>
          <div className="text-xs text-slate-400 mt-1">
            Depot congestion cited on 85% of delays
          </div>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
        
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search dispatch ID, origin, destination, client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="flex items-center space-x-1.5 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Carrier:</span>
          </div>
          <select
            value={carrierFilter}
            onChange={(e) => setCarrierFilter(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 rounded-lg text-xs text-white px-2.5 py-1.5 focus:outline-none focus:border-brand-500"
          >
            <option value="All">All Carriers</option>
            <option value="Apex Fleet">Apex Fleet Only</option>
            <option value="Third-Party Broker">3rd-Party Broker Only</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg text-xs text-white px-2.5 py-1.5 focus:outline-none focus:border-brand-500"
          >
            <option value="All">All Statuses</option>
            <option value="On-Time">On-Time</option>
            <option value="Delayed - Depot Congestion">Depot Congestion</option>
            <option value="Late Window">Late Window</option>
          </select>
        </div>

      </div>

      {/* The Data Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-3 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Showing <strong>{filteredData.length}</strong> of <strong>{data.length}</strong> dispatch logs</span>
          <span className="text-[11px] text-slate-500 italic">Tip: Compare Apex Fleet vs 3rd-Party Broker fuel & overtime rows</span>
        </div>

        <div className="overflow-x-auto max-h-[520px]">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-950/90 sticky top-0 border-b border-slate-800 text-slate-400 uppercase font-mono tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Dispatch ID</th>
                <th className="py-2.5 px-3">Lane (Route)</th>
                <th className="py-2.5 px-3">Carrier</th>
                <th className="py-2.5 px-3 text-right">Miles</th>
                <th className="py-2.5 px-3 text-right">Revenue</th>
                <th className="py-2.5 px-3 text-right">Fuel Cost</th>
                <th className="py-2.5 px-3 text-right">Reg / OT Hrs</th>
                <th className="py-2.5 px-3 text-right">Depot Dwell</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Client</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredData.map((row) => {
                const isBroker = row.carrierType === 'Third-Party Broker';
                const hasHighDwell = row.detentionHoursAtDepot > 2.5;

                return (
                  <tr
                    key={row.id}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      isBroker ? 'bg-amber-950/5' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 font-mono font-medium text-slate-200">
                      {row.id}
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">
                      <span className="font-medium text-white">{row.origin}</span>
                      <span className="text-slate-500 mx-1">→</span>
                      <span>{row.destination}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                          isBroker
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}
                      >
                        {row.carrierType}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-300">
                      {row.miles}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-white font-medium">
                      ${row.billedRevenue}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-rose-300">
                      ${row.fuelCost}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono">
                      <span className="text-slate-300">{row.driverRegularHours}h</span>
                      {row.driverOvertimeHours > 0 && (
                        <span className="text-rose-400 font-semibold ml-1.5">
                          +{row.driverOvertimeHours}h OT
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono">
                      <span
                        className={`${
                          hasHighDwell ? 'text-amber-400 font-bold' : 'text-slate-400'
                        }`}
                      >
                        {row.detentionHoursAtDepot}h
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`text-[11px] ${
                          row.status === 'On-Time'
                            ? 'text-emerald-400'
                            : row.status.includes('Congestion')
                            ? 'text-amber-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 text-[11px] truncate max-w-[120px]">
                      {row.clientAccount}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

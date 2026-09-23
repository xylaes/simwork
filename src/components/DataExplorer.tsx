import React, { useState, useMemo } from 'react';
import { DispatchRecord } from '../data/scenarios';
import { Search, Filter, AlertTriangle, TrendingUp, DollarSign, Clock, Truck, BarChart3, Terminal, Play, Check } from 'lucide-react';

interface DataExplorerProps {
  data: DispatchRecord[];
}

export const DataExplorer: React.FC<DataExplorerProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [carrierFilter, setCarrierFilter] = useState<'All' | 'Apex Fleet' | 'Third-Party Broker'>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'table' | 'visuals' | 'sql'>('table');
  const [selectedSqlPreset, setSelectedSqlPreset] = useState<number>(0);
  const [sqlExecuted, setSqlExecuted] = useState<boolean>(false);

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

  // Computed summary metrics
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

    // Chicago dwell vs other
    const chicagoRuns = data.filter((r) => r.origin.includes('Chicago') || r.destination.includes('Chicago'));
    const avgChicagoDwell = (chicagoRuns.reduce((acc, r) => acc + r.detentionHoursAtDepot, 0) / chicagoRuns.length).toFixed(1);

    return {
      avgFleetCostPerMile,
      avgBrokerCostPerMile,
      totalDetentionHours: totalDetentionHours.toFixed(1),
      avgChicagoDwell,
      delayedRate: ((delayedRuns / data.length) * 100).toFixed(0),
    };
  }, [data]);

  const SQL_PRESETS = [
    {
      title: 'Carrier Cost-Per-Mile Comparison',
      query: `SELECT carrier_type,\n       COUNT(*) AS total_dispatches,\n       ROUND(AVG(total_cost / miles), 2) AS avg_cost_per_mile\nFROM midwest_dispatch_logs\nGROUP BY 1;`,
      resultHeaders: ['carrier_type', 'total_dispatches', 'avg_cost_per_mile'],
      resultRows: [
        ['Apex Fleet', '10 runs', '$2.48 / mi (Target Baseline)'],
        ['Third-Party Broker', '10 runs', '$4.12 / mi (+68% Over Budget!)']
      ],
      insight: 'Audit finding: Emergency 3rd-party spot brokers dilute gross margins by $1.64/mile on average.'
    },
    {
      title: 'Depot Detention Dwell vs. Driver Overtime',
      query: `SELECT CASE WHEN origin LIKE '%Chicago%' OR destination LIKE '%Chicago%' THEN 'Chicago Corridor' ELSE 'Other Midwest' END AS depot_hub,\n       ROUND(AVG(detention_hours), 1) AS avg_dwell_hrs,\n       ROUND(AVG(driver_overtime_hours), 1) AS avg_ot_hrs\nFROM midwest_dispatch_logs\nGROUP BY 1;`,
      resultHeaders: ['depot_hub', 'avg_dwell_hrs', 'avg_ot_hrs'],
      resultRows: [
        ['Chicago Corridor', '3.6 hrs', '3.4 hrs OT (1.5x Pay Penalty)'],
        ['Other Midwest', '0.4 hrs', '0.0 hrs OT (Clean Window)']
      ],
      insight: 'Audit finding: Cross-dock dwell time at Chicago depot is directly generating 100% of driver overtime.'
    }
  ];

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
            <span>Target internal benchmark</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-amber-900/40 rounded-xl p-4 shadow-sm bg-gradient-to-br from-amber-950/20 to-slate-900">
          <div className="flex items-center justify-between text-xs text-amber-400 mb-1">
            <span className="font-semibold">3rd-Party Broker Cost/Mile</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-200 font-mono">${metrics.avgBrokerCostPerMile} <span className="text-xs font-normal text-slate-400">/ mi</span></div>
          <div className="text-xs text-rose-400 mt-1">
            +68% markup over internal fleet
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Chicago Cross-Dock Dwell</span>
            <Clock className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{metrics.avgChicagoDwell} <span className="text-xs font-normal text-slate-400">hrs avg</span></div>
          <div className="text-xs text-slate-400 mt-1">
            Industry target is &lt; 1.0 hour
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Dispatches Delayed</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{metrics.delayedRate}%</div>
          <div className="text-xs text-slate-400 mt-1">
            Depot congestion cited on 85% of delays
          </div>
        </div>

      </div>

      {/* Explorer Mode Toggle */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('table')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'table' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Raw Dispatch Table
          </button>
          <button
            onClick={() => setActiveTab('visuals')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center space-x-1.5 ${
              activeTab === 'visuals' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Operational Visual Breakdown</span>
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center space-x-1.5 ${
              activeTab === 'sql' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>SQL Audit Sandbox</span>
          </button>
        </div>
      </div>

      {/* View 1: Raw Table */}
      {activeTab === 'table' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                placeholder="Search dispatch ID, lane, client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="flex items-center space-x-3 w-full md:w-auto">
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

          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto max-h-[500px]">
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
      )}

      {/* View 2: Visual Operational Breakdown */}
      {activeTab === 'visuals' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h4 className="text-sm font-semibold text-white">Cost-Per-Mile Discrepancy (Fleet vs Broker)</h4>
            <div className="space-y-3 pt-2">
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Apex Internal Fleet</span>
                  <span className="font-mono font-bold text-emerald-400">$2.48 / mi</span>
                </div>
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '60%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>3rd-Party Spot Broker</span>
                  <span className="font-mono font-bold text-amber-400">$4.12 / mi (+68% Over Target)</span>
                </div>
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '100%' }} />
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-400 pt-2 border-t border-slate-800">
              💡 <strong>Key Finding:</strong> Apex absorbed emergency spot broker charges to satisfy customer demand, eroding 510 bps of gross margin alone.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h4 className="text-sm font-semibold text-white">Depot Detention Dwell Time (Chicago Hub vs Others)</h4>
            <div className="space-y-3 pt-2">
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Chicago / Detroit Cross-Dock Dwell</span>
                  <span className="font-mono font-bold text-rose-400">3.6 Hours (Bottleneck)</span>
                </div>
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: '90%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Indianapolis & Columbus Depots</span>
                  <span className="font-mono font-bold text-emerald-400">0.4 Hours (Normal)</span>
                </div>
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '12%' }} />
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-400 pt-2 border-t border-slate-800">
              💡 <strong>Key Finding:</strong> Drivers waiting at the Chicago cross-dock exceeded DOT driving clocks, triggering mandatory 1.5x overtime and delay fees.
            </p>
          </div>

        </div>
      )}

      {/* View 3: SQL / Metric Sandbox */}
      {activeTab === 'sql' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div>
              <h4 className="text-sm font-semibold text-white flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Simulated Warehouse SQL Query Console</span>
              </h4>
              <p className="text-xs text-slate-400">Run aggregation queries directly against the dispatch database.</p>
            </div>

            <div className="flex items-center space-x-2">
              {SQL_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedSqlPreset(idx);
                    setSqlExecuted(false);
                  }}
                  className={`px-2.5 py-1 rounded text-xs transition ${
                    selectedSqlPreset === idx
                      ? 'bg-slate-800 text-white border border-slate-700 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Preset {idx + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300 whitespace-pre leading-relaxed relative">
            {SQL_PRESETS[selectedSqlPreset].query}
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => setSqlExecuted(true)}
              className="px-4 py-2 rounded-lg text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white flex items-center space-x-2 shadow transition"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Execute SQL Query</span>
            </button>
          </div>

          {sqlExecuted && (
            <div className="space-y-3 pt-3 border-t border-slate-800 animate-fade-in">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-500 uppercase text-[10px]">
                      {SQL_PRESETS[selectedSqlPreset].resultHeaders.map((h, i) => (
                        <th key={i} className="py-2 px-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {SQL_PRESETS[selectedSqlPreset].resultRows.map((row, i) => (
                      <tr key={i} className="text-slate-200">
                        {row.map((cell, j) => (
                          <td key={j} className="py-2 px-3">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/40 text-xs text-emerald-300">
                {SQL_PRESETS[selectedSqlPreset].insight}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

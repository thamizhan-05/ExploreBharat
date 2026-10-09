'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  Activity, 
  PlusCircle,
  Database,
  ImageIcon,
  Compass,
  FileText,
  BarChart3
} from 'lucide-react';
import { api, getCurrentUser, getAuthToken } from '../../lib/api';
import Logo from '../../components/Logo';
import AdminOverviewTab from './components/AdminOverviewTab';
import AdminDataCenterTab from './components/AdminDataCenterTab';
import AdminImageIntegrityTab from './components/AdminImageIntegrityTab';
import AdminGooglePlacesTab from './components/AdminGooglePlacesTab';
import AdminSuggestionsTab from './components/AdminSuggestionsTab';
import AdminProvidersTab from './components/AdminProvidersTab';
import AdminAnalyticsTab from './components/AdminAnalyticsTab';
import AdminAddAttractionModal from './components/AdminAddAttractionModal';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<any | null>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [citiesList, setCitiesList] = useState<any[]>([]);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'datacenter' | 'integrity' | 'googleplaces' | 'suggestions' | 'providers' | 'analytics'>('overview');
  
  // Real Data Center & Image Integrity Data
  const [dataCenterData, setDataCenterData] = useState<any | null>(null);
  const [imageIntegrityData, setImageIntegrityData] = useState<any | null>(null);
  const [providerHealth, setProviderHealth] = useState<any | null>(null);
  const [healthChecking, setHealthChecking] = useState(false);
  const [actionNotice, setActionNotice] = useState('');

  // Startup Analytics Data
  const [analyticsData, setAnalyticsData] = useState<any | null>(null);
  const [funnelData, setFunnelData] = useState<any | null>(null);
  const [trendsData, setTrendsData] = useState<any | null>(null);

  // Suggestions & Duplicate Detector State
  const [suggestionsList, setSuggestionsList] = useState<any[]>([]);
  const [suggestionsFilter, setSuggestionsFilter] = useState<'ALL' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED'>('ALL');
  const [duplicateCheckQuery, setDuplicateCheckQuery] = useState('Meenakshi Temple');
  const [duplicateCheckCity, setDuplicateCheckCity] = useState('Madurai');
  const [duplicateResults, setDuplicateResults] = useState<any[] | null>(null);
  const [duplicateChecking, setDuplicateChecking] = useState(false);

  // Google Places Ingestion
  const [googleQuery, setGoogleQuery] = useState('Meenakshi Amman Temple Madurai');
  const [googleResults, setGoogleResults] = useState<any | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Attraction Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState('');
  const [formError, setFormError] = useState('');
  
  const [attrForm, setAttrForm] = useState({
    name: '',
    cityId: '',
    categoryId: '',
    description: '',
    address: '',
    imageUrl: '',
    openingHours: '9:00 AM – 6:00 PM',
    entryType: 'FREE',
    entryDescription: '',
    feeSource: 'Official Tourism Portal',
    feeVerificationStatus: 'VERIFIED',
    
    // Paid fields
    adultIndianFee: '',
    childIndianFee: '',
    seniorCitizenFee: '',
    foreignVisitorFee: '',
    studentFee: '',
    ticketRequired: false,
    bookingRequired: false,
    onlineBookingAvailable: false,
    walkInAvailable: true,
    officialBookingUrl: '',

    // Permit fields
    permitAuthority: '',
    permitUrl: '',
    permitInformation: '',
    requiredDocuments: 'Valid Government Photo ID, Passport size photos',
    restrictions: 'Border permit required, restricted photography'
  });

  const loadAllMetrics = async () => {
    try {
      const [metricRes, usersRes, citiesRes, catsRes, dcRes, intRes, suggRes, provRes, anaRes, funRes, treRes] = await Promise.all([
        api.getAdminMetrics().catch(() => ({ data: null })),
        api.getAdminUsers().catch(() => ({ data: [] })),
        api.getCities('?limit=50').catch(() => ({ data: [] })),
        api.getCategories().catch(() => ({ data: [] })),
        api.getAdminDataCenter().catch(() => ({ data: null })),
        api.getAdminImageIntegrity().catch(() => ({ data: null })),
        api.getAdminSuggestions().catch(() => ({ data: [] })),
        api.getProviderHealth().catch(() => ({ data: null })),
        api.getAnalyticsDashboard().catch(() => ({ data: null })),
        api.getAnalyticsFunnel().catch(() => ({ data: null })),
        api.getAnalyticsTrends().catch(() => ({ data: null }))
      ]);
      setData(metricRes.data);
      setUsersList(usersRes.data || []);
      setCitiesList(citiesRes.data || []);
      setCategoriesList(catsRes.data || []);
      setDataCenterData(dcRes.data);
      setImageIntegrityData(intRes.data);
      setSuggestionsList(suggRes.data || []);
      setProviderHealth(provRes.data || provRes);
      setAnalyticsData(anaRes.data);
      setFunnelData(funRes.data);
      setTrendsData(treRes.data);

      if (citiesRes.data?.length > 0 && !attrForm.cityId) {
        setAttrForm(prev => ({ ...prev, cityId: citiesRes.data[0].id }));
      }
      if (catsRes.data?.length > 0 && !attrForm.categoryId) {
        setAttrForm(prev => ({ ...prev, categoryId: catsRes.data[0].id }));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch admin metrics.');
    }
  };

  const handleApproveSuggestion = async (id: string) => {
    try {
      setActionNotice('Approving and publishing suggestion to national catalog...');
      await api.approveAdminSuggestion(id);
      setActionNotice('Suggestion approved! Destination created and published.');
      await loadAllMetrics();
      setTimeout(() => setActionNotice(''), 4000);
    } catch (err: any) {
      setActionNotice(`Approval error: ${err.message}`);
    }
  };

  const handleRejectSuggestion = async (id: string) => {
    try {
      setActionNotice('Marking suggestion as rejected...');
      await api.rejectAdminSuggestion(id, 'Does not meet editorial guidelines.');
      setActionNotice('Suggestion rejected.');
      await loadAllMetrics();
      setTimeout(() => setActionNotice(''), 4000);
    } catch (err: any) {
      setActionNotice(`Rejection error: ${err.message}`);
    }
  };

  const handleRunDuplicateCheck = async () => {
    if (!duplicateCheckQuery.trim()) return;
    setDuplicateChecking(true);
    try {
      const params = `?name=${encodeURIComponent(duplicateCheckQuery.trim())}${duplicateCheckCity ? `&cityName=${encodeURIComponent(duplicateCheckCity.trim())}` : ''}`;
      const res = await api.checkPlaceDuplicates(params);
      setDuplicateResults(res.data || []);
    } catch (err: any) {
      setActionNotice(`Duplicate check error: ${err.message}`);
    } finally {
      setDuplicateChecking(false);
    }
  };

  useEffect(() => {
    async function init() {
      const user = getCurrentUser();
      const token = getAuthToken();
      if (!token || user?.role !== 'ADMIN') {
        setError('Access denied. Administrator privileges required.');
        setLoading(false);
        return;
      }
      await loadAllMetrics();
      setLoading(false);
    }
    init();
  }, []);

  const handleImageAction = async (imageId: string, action: string) => {
    try {
      setActionNotice(`Processing ${action}...`);
      await api.postAdminImageAction({ imageId, action });
      await loadAllMetrics();
      setActionNotice(`Action "${action}" applied successfully.`);
      setTimeout(() => setActionNotice(''), 4000);
    } catch (err: any) {
      setActionNotice(`Error: ${err.message}`);
    }
  };

  const handleRunHealthCheck = async () => {
    try {
      setHealthChecking(true);
      setActionNotice('Running automated image hash verification and HTTP health checks...');
      const res = await api.postAdminHealthCheck();
      await loadAllMetrics();
      setActionNotice(`Automated audit complete: ${res.data?.scanned || 0} images scanned, ${res.data?.brokenImages || 0} broken.`);
      setTimeout(() => setActionNotice(''), 6000);
    } catch (err: any) {
      setActionNotice(`Health check error: ${err.message}`);
    } finally {
      setHealthChecking(false);
    }
  };

  const handleGoogleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleQuery.trim()) return;
    try {
      setGoogleLoading(true);
      const res = await api.searchGooglePlaces(googleQuery);
      setGoogleResults(res.data);
    } catch (err: any) {
      setActionNotice(`Google Places API error: ${err.message}`);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleCreateAttraction = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError('');
    setFormSuccess('');

    try {
      const payload: any = {
        name: attrForm.name,
        cityId: attrForm.cityId,
        categoryId: attrForm.categoryId,
        description: attrForm.description,
        address: attrForm.address,
        imageUrl: attrForm.imageUrl || null,
        openingHours: attrForm.openingHours,
        entryType: attrForm.entryType,
        entryDescription: attrForm.entryDescription || null,
        feeSource: attrForm.feeSource || null,
        feeVerificationStatus: attrForm.feeVerificationStatus
      };

      if (attrForm.entryType === 'PAID') {
        payload.adultIndianFee = attrForm.adultIndianFee ? Number(attrForm.adultIndianFee) : 50;
        payload.childIndianFee = attrForm.childIndianFee ? Number(attrForm.childIndianFee) : 0;
        payload.seniorCitizenFee = attrForm.seniorCitizenFee ? Number(attrForm.seniorCitizenFee) : 0;
        payload.foreignVisitorFee = attrForm.foreignVisitorFee ? Number(attrForm.foreignVisitorFee) : 500;
        payload.studentFee = attrForm.studentFee ? Number(attrForm.studentFee) : null;
        payload.ticketRequired = attrForm.ticketRequired;
        payload.bookingRequired = attrForm.bookingRequired;
        payload.onlineBookingAvailable = attrForm.onlineBookingAvailable;
        payload.walkInAvailable = attrForm.walkInAvailable;
        if (attrForm.officialBookingUrl) payload.officialBookingUrl = attrForm.officialBookingUrl;
      } else if (attrForm.entryType === 'CONDITIONAL') {
        payload.ticketRequired = false;
        payload.bookingRequired = false;
        if (attrForm.adultIndianFee) payload.adultIndianFee = Number(attrForm.adultIndianFee);
        if (attrForm.officialBookingUrl) payload.officialBookingUrl = attrForm.officialBookingUrl;
      } else if (attrForm.entryType === 'PERMIT_REQUIRED') {
        payload.ticketRequired = false;
        payload.bookingRequired = true;
        payload.permitAuthority = attrForm.permitAuthority || 'State District Magistrate & Forest Dept';
        payload.permitInformation = attrForm.permitInformation;
        if (attrForm.permitUrl) payload.permitUrl = attrForm.permitUrl;
        if (attrForm.requiredDocuments) {
          payload.requiredDocuments = attrForm.requiredDocuments.split(',').map(s => s.trim()).filter(Boolean);
        }
        if (attrForm.restrictions) {
          payload.restrictions = attrForm.restrictions.split(',').map(s => s.trim()).filter(Boolean);
        }
      } else if (attrForm.entryType === 'FREE') {
        payload.ticketRequired = false;
        payload.bookingRequired = false;
        payload.onlineBookingAvailable = false;
        payload.walkInAvailable = true;
      }

      await api.createAdminAttraction(payload);
      setFormSuccess(`Attraction "${attrForm.name}" registered successfully as ${attrForm.entryType} entry!`);
      setAttrForm(prev => ({
        ...prev,
        name: '',
        description: '',
        address: '',
        imageUrl: '',
        entryDescription: '',
        adultIndianFee: '',
        childIndianFee: '',
        seniorCitizenFee: '',
        foreignVisitorFee: '',
        officialBookingUrl: '',
        permitUrl: '',
        permitAuthority: ''
      }));
      await loadAllMetrics();
    } catch (err: any) {
      setFormError(err.message || 'Failed to create attraction.');
    } finally {
      setFormSubmitting(false);
    }
  };

  if (loading) return <div className="py-24 text-center font-medium text-stone-500">Loading admin operations...</div>;

  if (error) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center space-y-4">
        <ShieldCheck className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-2xl font-black text-stone-900">Administrator Access Required</h2>
        <p className="text-xs text-stone-500">{error}</p>
        <button
          onClick={() => router.push('/login')}
          className="px-6 py-2.5 bg-bharat-saffron text-white font-bold rounded-xl text-xs"
        >
          Sign In as Admin
        </button>
      </div>
    );
  }

  const metrics = data?.metrics || {};
  const dc = dataCenterData || {};
  const ii = imageIntegrityData || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Logo variant="compact" size="md" href="/" />
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#132238] text-white">Admin Command Center</span>
          </div>
          <p className="text-xs text-slate-500 pt-1">ExploreBharat Real Tourism Data & Integrity Engine — Zero Duplicate Architecture.</p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-[#F58220] hover:bg-[#DC6E10] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Tourist Attraction</span>
          </button>
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Gateway: Live</span>
          </div>
        </div>
      </div>

      {/* Action Notification Banner */}
      {actionNotice && (
        <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl text-xs font-bold flex items-center justify-between">
          <span>{actionNotice}</span>
          <button onClick={() => setActionNotice('')} className="text-blue-500 hover:text-blue-700">✕</button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-stone-200 gap-2 sm:gap-6 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-1 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'overview'
              ? 'border-bharat-saffron text-bharat-saffron'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Overview & Bookings</span>
        </button>

        <button
          onClick={() => setActiveTab('datacenter')}
          className={`pb-3 px-1 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'datacenter'
              ? 'border-bharat-saffron text-bharat-saffron'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>🏛️ Real Data Center</span>
          <span className="px-1.5 py-0.2 bg-stone-100 rounded text-[10px] text-stone-600">{dc.attractions?.total || 0} Places</span>
        </button>

        <button
          onClick={() => setActiveTab('integrity')}
          className={`pb-3 px-1 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'integrity'
              ? 'border-bharat-saffron text-bharat-saffron'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>🖼️ Image Integrity & Provenance</span>
          <span className={`px-1.5 py-0.2 rounded text-[10px] font-black ${
            (ii.exactDuplicatesCount || 0) === 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
          }`}>
            {(ii.exactDuplicatesCount || 0) === 0 ? '0 Duplicates' : `${ii.exactDuplicatesCount} Dups`}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('googleplaces')}
          className={`pb-3 px-1 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'googleplaces'
              ? 'border-bharat-saffron text-bharat-saffron'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>🌐 Google Places Provider</span>
        </button>

        <button
          onClick={() => setActiveTab('suggestions')}
          className={`pb-3 px-1 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'suggestions'
              ? 'border-bharat-saffron text-bharat-saffron'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>📬 Place Suggestions & Duplicates</span>
          <span className="px-1.5 py-0.2 bg-stone-100 rounded text-[10px] text-stone-600">
            {suggestionsList.filter((s) => s.status === 'PENDING_REVIEW').length} Pending
          </span>
        </button>

        <button
          onClick={() => setActiveTab('providers')}
          className={`pb-3 px-1 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'providers'
              ? 'border-bharat-saffron text-bharat-saffron'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>🔌 External Providers & API Health</span>
          <span className="px-1.5 py-0.2 rounded text-[10px] font-black bg-emerald-100 text-emerald-800">
            {providerHealth?.providers?.filter((p: any) => p.status === 'CONNECTED').length || 7} Online
          </span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-3 px-1 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'analytics'
              ? 'border-bharat-saffron text-bharat-saffron'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>📊 Startup Analytics & Funnel</span>
          <span className="px-1.5 py-0.2 rounded text-[10px] font-black bg-blue-100 text-blue-800">
            {analyticsData?.overview?.dau || 14} DAU
          </span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & BOOKINGS */}
      {activeTab === 'overview' && (
        <AdminOverviewTab metrics={metrics} data={data} usersList={usersList} />
      )}

      {/* TAB 2: DATA CENTER & INVENTORY AUDIT */}
      {activeTab === 'datacenter' && (
        <AdminDataCenterTab dc={dc} onRefresh={loadAllMetrics} />
      )}

      {/* TAB 3: IMAGE INTEGRITY & DUPLICATE DETECTION */}
      {activeTab === 'integrity' && (
        <AdminImageIntegrityTab
          ii={ii}
          healthChecking={healthChecking}
          onRunHealthCheck={handleRunHealthCheck}
          onImageAction={handleImageAction}
        />
      )}

      {/* TAB 4: GOOGLE PLACES INGESTION */}
      {activeTab === 'googleplaces' && (
        <AdminGooglePlacesTab
          googleQuery={googleQuery}
          setGoogleQuery={setGoogleQuery}
          googleLoading={googleLoading}
          googleResults={googleResults}
          onSearch={handleGoogleSearch}
        />
      )}

      {/* TAB 5: COMMUNITY PLACE SUGGESTIONS & DUPLICATE RESOLUTION */}
      {activeTab === 'suggestions' && (
        <AdminSuggestionsTab
          duplicateCheckQuery={duplicateCheckQuery}
          setDuplicateCheckQuery={setDuplicateCheckQuery}
          duplicateCheckCity={duplicateCheckCity}
          setDuplicateCheckCity={setDuplicateCheckCity}
          duplicateChecking={duplicateChecking}
          duplicateResults={duplicateResults}
          onRunDuplicateCheck={handleRunDuplicateCheck}
          suggestionsFilter={suggestionsFilter}
          setSuggestionsFilter={setSuggestionsFilter}
          suggestionsList={suggestionsList}
          onApproveSuggestion={handleApproveSuggestion}
          onRejectSuggestion={handleRejectSuggestion}
        />
      )}

      {/* TAB 6: EXTERNAL PROVIDERS & API HEALTH MONITOR */}
      {activeTab === 'providers' && (
        <AdminProvidersTab
          providerHealth={providerHealth}
          onRefresh={loadAllMetrics}
        />
      )}

      {/* TAB 7: STARTUP ANALYTICS & CONVERSION FUNNEL */}
      {activeTab === 'analytics' && (
        <AdminAnalyticsTab
          analyticsData={analyticsData}
          funnelData={funnelData}
          trendsData={trendsData}
          metrics={metrics}
        />
      )}

      {/* Add Attraction Modal */}
      <AdminAddAttractionModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        attrForm={attrForm}
        setAttrForm={setAttrForm}
        citiesList={citiesList}
        categoriesList={categoriesList}
        formSubmitting={formSubmitting}
        formSuccess={formSuccess}
        formError={formError}
        onSubmit={handleCreateAttraction}
      />

    </div>
  );
}

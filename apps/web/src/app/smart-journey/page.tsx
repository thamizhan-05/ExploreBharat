'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  RefreshCw 
} from 'lucide-react';
import { api } from '../../lib/api';
import JourneyParametersForm from './components/JourneyParametersForm';
import JourneyAlternativesCards from './components/JourneyAlternativesCards';
import JourneyTimelineTab from './components/JourneyTimelineTab';
import JourneyCostTab from './components/JourneyCostTab';
import JourneyAlertsTab from './components/JourneyAlertsTab';
import JourneyRouteMapTab from './components/JourneyRouteMapTab';
import JourneyAuditModal from './components/JourneyAuditModal';

const PRESET_ORIGINS = [
  { label: 'Connaught Place, New Delhi', city: 'Delhi', lat: 28.6315, lng: 77.2167 },
  { label: 'Kalyan, Mumbai', city: 'Mumbai', lat: 19.2437, lng: 73.1355 },
  { label: 'Indiranagar, Bengaluru', city: 'Bengaluru', lat: 12.9784, lng: 77.6408 },
  { label: 'T. Nagar, Chennai', city: 'Chennai', lat: 13.0418, lng: 80.2341 },
  { label: 'Park Street, Kolkata', city: 'Kolkata', lat: 22.5512, lng: 88.3526 }
];

const DESTINATION_COORDINATES: Record<string, { lat: number; lng: number }> = {
  Jaipur: { lat: 26.9124, lng: 75.7873 },
  Madurai: { lat: 9.9252, lng: 78.1198 },
  Mumbai: { lat: 18.9220, lng: 72.8347 },
  Delhi: { lat: 28.6139, lng: 77.2090 },
  Agra: { lat: 27.1767, lng: 78.0081 },
  Varanasi: { lat: 25.3176, lng: 82.9739 },
  Udaipur: { lat: 24.5854, lng: 73.7125 },
  Bengaluru: { lat: 12.9716, lng: 77.5946 },
  Goa: { lat: 15.2993, lng: 74.1240 },
  Mysore: { lat: 12.2958, lng: 76.6394 }
};

const PRESET_DESTINATIONS = [
  'Jaipur',
  'Madurai',
  'Mumbai',
  'Delhi',
  'Agra',
  'Varanasi',
  'Udaipur'
];

export default function SmartJourneyPlannerPage() {
  // Input form state
  const [origin, setOrigin] = useState('Connaught Place, New Delhi');
  const [originLat, setOriginLat] = useState<number | null>(28.6315);
  const [originLng, setOriginLng] = useState<number | null>(77.2167);
  const [destination, setDestination] = useState('Jaipur');
  const [travelDate, setTravelDate] = useState('2026-11-15');
  const [returnDate, setReturnDate] = useState('2026-11-17');
  const [travellers, setTravellers] = useState(2);
  const [travellerType, setTravellerType] = useState('couple');
  const [budget, setBudget] = useState(25000);
  const [travelPreference, setTravelPreference] = useState('balanced');
  const [walkingPreference, setWalkingPreference] = useState('moderate');
  const [hotelPreference, setHotelPreference] = useState('heritage');
  const [maxTransfers, setMaxTransfers] = useState(2);

  // Geolocation state
  const [geoLocating, setGeoLocating] = useState(false);
  const [geoStatus, setGeoStatus] = useState<string | null>(null);

  // Planning state
  const [planning, setPlanning] = useState(false);
  const [planResult, setPlanResult] = useState<any | null>(null);
  const [selectedAlternative, setSelectedAlternative] = useState<string>('BALANCED');
  const [selectedTimelineItem, setSelectedTimelineItem] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'timeline' | 'cost' | 'alerts' | 'map'>('timeline');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Automatically plan default itinerary on load
  useEffect(() => {
    executePlan();
  }, []);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoStatus('Geolocation is not supported by your browser.');
      return;
    }
    setGeoLocating(true);
    setGeoStatus('Detecting GPS location...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setOriginLat(pos.coords.latitude);
        setOriginLng(pos.coords.longitude);
        setOrigin(`Current Location (${pos.coords.latitude.toFixed(3)}, ${pos.coords.longitude.toFixed(3)})`);
        setGeoLocating(false);
        setGeoStatus('Location successfully locked to current device GPS.');
      },
      (err) => {
        setGeoLocating(false);
        setGeoStatus(`Permission denied or unavailable (${err.message}). Please type your location.`);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const executePlan = async (prefOverride?: string) => {
    setPlanning(true);
    setErrorMessage(null);
    const prefToUse = prefOverride || travelPreference;
    try {
      const response = await api.planJourney({
        origin,
        originLatitude: originLat || undefined,
        originLongitude: originLng || undefined,
        destination,
        startDate: travelDate,
        endDate: returnDate,
        travelDate,
        returnDate,
        travellers,
        travellersCount: travellers,
        travellerType,
        budget,
        budgetInr: budget,
        travelPreference: prefToUse,
        transportPreference: prefToUse,
        walkingPreference,
        hotelPreference,
        hotelTier: hotelPreference,
        maxTransfers
      });

      if (response && response.success) {
        setPlanResult(response.data);
        if (prefOverride) {
          setSelectedAlternative(prefOverride.toUpperCase());
        }
      } else {
        setErrorMessage(response?.message || 'Could not calculate door-to-door itinerary.');
      }
    } catch (err: any) {
      console.error('Plan error:', err);
      setErrorMessage(err.message || 'Failed to connect to Multimodal Journey Planner service.');
    } finally {
      setPlanning(false);
    }
  };

  const handleSelectAlternative = (optionKey: string) => {
    setSelectedAlternative(optionKey);
    let mappedPref = 'balanced';
    if (optionKey === 'FASTEST') mappedPref = 'fastest';
    if (optionKey === 'CHEAPEST') mappedPref = 'cheapest';
    setTravelPreference(mappedPref);
    executePlan(mappedPref);
  };

  const days = planResult?.activeItinerary?.days || [];
  const cost = planResult?.costBreakdown || {};
  const currentOption = planResult?.options?.find((opt: any) => opt.optionKey === selectedAlternative) 
    || planResult?.options?.[0];

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Top Banner: Authenticity Guarantee */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white py-2.5 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-stone-200">
              ExploreBharat Authentic Transit Engine: Door-to-Door Multimodal Routing
            </span>
          </div>
          <span className="text-[11px] text-stone-400">
            Real Indian Railways Timetables • Official Metro Lines • Metered Regional Cabs
          </span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-white border-b border-stone-200/80 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-bharat-saffron">
                Phase 3 Multimodal Transport Network
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight mt-1">
                Smart Journey &amp; Corridor Planner
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 max-w-2xl mt-1">
                Calculates door-to-door multimodal itineraries across First-Mile, Intercity Trains/Flights, Hotel Check-ins, and Last-Mile Monument sightseeing with transparent pricing audits.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => executePlan()}
                disabled={planning}
                className="px-5 py-2.5 bg-bharat-saffron hover:bg-orange-600 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                {planning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Calculating Routes...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Recalculate Route
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Journey Parameters Form */}
          <div className="lg:col-span-4">
            <JourneyParametersForm
              origin={origin}
              setOrigin={setOrigin}
              setOriginLat={setOriginLat}
              setOriginLng={setOriginLng}
              destination={destination}
              setDestination={setDestination}
              travelDate={travelDate}
              setTravelDate={setTravelDate}
              returnDate={returnDate}
              setReturnDate={setReturnDate}
              travellers={travellers}
              setTravellers={setTravellers}
              travellerType={travellerType}
              setTravellerType={setTravellerType}
              budget={budget}
              setBudget={setBudget}
              travelPreference={travelPreference}
              setTravelPreference={setTravelPreference}
              walkingPreference={walkingPreference}
              setWalkingPreference={setWalkingPreference}
              hotelPreference={hotelPreference}
              setHotelPreference={setHotelPreference}
              maxTransfers={maxTransfers}
              setMaxTransfers={setMaxTransfers}
              geoLocating={geoLocating}
              geoStatus={geoStatus}
              onGetCurrentLocation={handleGetCurrentLocation}
              planning={planning}
              onExecutePlan={() => executePlan()}
              presetOrigins={PRESET_ORIGINS}
              presetDestinations={PRESET_DESTINATIONS}
            />
          </div>

          {/* RIGHT COLUMN: Results, Alternatives, Timeline, Cost */}
          <div className="lg:col-span-8 space-y-6">
            {errorMessage && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-800 text-xs flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <div>
                  <p className="font-bold">Journey Calculation Notice</p>
                  <p>{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Alternatives Tabs */}
            <JourneyAlternativesCards
              options={planResult?.options}
              selectedAlternative={selectedAlternative}
              onSelectAlternative={handleSelectAlternative}
            />

            {/* View Selector (Timeline / Cost Breakdown / Alerts / Map) */}
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('timeline')}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    activeTab === 'timeline'
                      ? 'bg-stone-900 text-white shadow-sm'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  Itinerary Timeline
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('cost')}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    activeTab === 'cost'
                      ? 'bg-stone-900 text-white shadow-sm'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  Trip Cost Breakdown
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('alerts')}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                    activeTab === 'alerts'
                      ? 'bg-stone-900 text-white shadow-sm'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  Safety &amp; Buffers
                  {planResult?.alerts?.length > 0 && (
                    <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">
                      {planResult.alerts.length}
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('map')}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    activeTab === 'map'
                      ? 'bg-stone-900 text-white shadow-sm'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  Route Map
                </button>
              </div>

              {planResult?.tripId && (
                <div className="text-[11px] text-stone-500 font-medium">
                  Trip Reference: <span className="font-mono text-stone-800">{planResult.tripId.slice(0, 8)}...</span>
                </div>
              )}
            </div>

            {/* TAB 1: TIMELINE */}
            {activeTab === 'timeline' && (
              <JourneyTimelineTab
                days={days}
                onSelectTimelineItem={(item) => setSelectedTimelineItem(item)}
              />
            )}

            {/* TAB 2: COST BREAKDOWN */}
            {activeTab === 'cost' && (
              <JourneyCostTab cost={cost} />
            )}

            {/* TAB 3: SAFETY & CONNECTION ALERTS */}
            {activeTab === 'alerts' && (
              <JourneyAlertsTab alerts={planResult?.alerts} />
            )}

            {/* TAB 4: ROUTE MAP VISUALIZER */}
            {activeTab === 'map' && (
              <JourneyRouteMapTab
                destination={destination}
                origin={origin}
                destinationCoordinates={DESTINATION_COORDINATES}
                currentOption={currentOption}
              />
            )}

          </div>
        </div>
      </div>

      {/* DATA AUDIT MODAL */}
      <JourneyAuditModal
        selectedItem={selectedTimelineItem}
        onClose={() => setSelectedTimelineItem(null)}
      />
    </div>
  );
}

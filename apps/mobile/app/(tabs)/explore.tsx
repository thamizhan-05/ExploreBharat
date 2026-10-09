import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { mobileApi } from '../../src/lib/api';
import MobileLogo from '../../src/components/Logo';

export default function MobileExploreScreen() {
  const [activeTab, setActiveTab] = useState<'ATTRACTIONS' | 'DESTINATIONS' | 'HOTELS' | 'EVENTS'>('ATTRACTIONS');
  const [attractions, setAttractions] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters (queried against backend)
  const [entryTypeFilter, setEntryTypeFilter] = useState('ALL');
  const [priceRangeFilter, setPriceRangeFilter] = useState('ALL');
  const [wheelchairOnly, setWheelchairOnly] = useState(false);
  const [kidFriendlyOnly, setKidFriendlyOnly] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (entryTypeFilter !== 'ALL') queryParams.append('entryType', entryTypeFilter);
        if (priceRangeFilter !== 'ALL') queryParams.append('priceRange', priceRangeFilter);
        if (wheelchairOnly) queryParams.append('wheelchair', 'true');
        if (kidFriendlyOnly) queryParams.append('childFriendly', 'true');

        const [attrRes, citiesRes, hotelsRes, eventsRes] = await Promise.all([
          mobileApi.getAttractions(queryParams.toString() ? `?${queryParams.toString()}` : '?limit=20'),
          mobileApi.getCities('?popular=true'),
          mobileApi.getHotels('?limit=8'),
          mobileApi.getEvents('?limit=6')
        ]);
        setAttractions(attrRes.data || []);
        setCities(citiesRes.data || []);
        setHotels(hotelsRes.data || []);
        setEvents(eventsRes.data || []);
      } catch (err) {
        console.log('Mobile explore error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [entryTypeFilter, priceRangeFilter, wheelchairOnly, kidFriendlyOnly]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <MobileLogo size="md" showTagline={false} />
          <Text style={styles.subtitle}>Discover tourist places, nearby stays, festivals, and travel experiences</Text>
        </View>

        {/* Tab Selector */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            onPress={() => setActiveTab('ATTRACTIONS')}
            style={[styles.tabBtn, activeTab === 'ATTRACTIONS' && styles.tabBtnActive]}
          >
            <Text style={[styles.tabBtnText, activeTab === 'ATTRACTIONS' && styles.tabBtnTextActive]}>
              Places ({attractions.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('DESTINATIONS')}
            style={[styles.tabBtn, activeTab === 'DESTINATIONS' && styles.tabBtnActive]}
          >
            <Text style={[styles.tabBtnText, activeTab === 'DESTINATIONS' && styles.tabBtnTextActive]}>
              Cities
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('HOTELS')}
            style={[styles.tabBtn, activeTab === 'HOTELS' && styles.tabBtnActive]}
          >
            <Text style={[styles.tabBtnText, activeTab === 'HOTELS' && styles.tabBtnTextActive]}>
              Stays
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('EVENTS')}
            style={[styles.tabBtn, activeTab === 'EVENTS' && styles.tabBtnActive]}
          >
            <Text style={[styles.tabBtnText, activeTab === 'EVENTS' && styles.tabBtnTextActive]}>
              Festivals
            </Text>
          </TouchableOpacity>
        </View>

        {/* Dynamic Filters for Attractions */}
        {activeTab === 'ATTRACTIONS' && (
          <View style={styles.filterSection}>
            {/* Entry Fee Filters */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
              {[
                { id: 'ALL', label: 'All Entry' },
                { id: 'FREE', label: '🟢 Free Entry' },
                { id: 'PAID', label: '🎟️ Paid Entry' },
                { id: 'CONDITIONAL', label: '🟡 Free / Paid' },
                { id: 'PERMIT_REQUIRED', label: '⚠️ Permit' }
              ].map((f) => (
                <TouchableOpacity
                  key={f.id}
                  onPress={() => setEntryTypeFilter(f.id)}
                  style={[styles.filterChip, entryTypeFilter === f.id && styles.filterChipActive]}
                >
                  <Text style={[styles.filterChipText, entryTypeFilter === f.id && styles.filterChipTextActive]}>
                    {f.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Accessibility Filters */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRowSub}>
              <TouchableOpacity
                onPress={() => setWheelchairOnly(!wheelchairOnly)}
                style={[styles.priceChip, wheelchairOnly && styles.priceChipActive]}
              >
                <Text style={[styles.priceChipText, wheelchairOnly && styles.priceChipTextActive]}>
                  ♿ Wheelchair Friendly
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setKidFriendlyOnly(!kidFriendlyOnly)}
                style={[styles.priceChip, kidFriendlyOnly && styles.priceChipActive]}
              >
                <Text style={[styles.priceChipText, kidFriendlyOnly && styles.priceChipTextActive]}>
                  👶 Kid Friendly
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}

        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="small" color="#FF671F" />
            <Text style={{ marginTop: 8, fontSize: 12, color: '#64748B' }}>Querying attractions...</Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
            {activeTab === 'ATTRACTIONS' && (
              <View style={styles.list}>
                {attractions.length === 0 ? (
                  <View style={{ padding: 30, alignItems: 'center' }}>
                    <Text style={{ fontSize: 13, color: '#64748B' }}>No attractions match these filters.</Text>
                  </View>
                ) : (
                  attractions.map((a) => {
                    const isFree = a.entryType === 'FREE';
                    const isConditional = a.entryType === 'CONDITIONAL';
                    const isPermit = a.entryType === 'PERMIT_REQUIRED';
                    return (
                      <TouchableOpacity key={a.id} style={styles.attractionCard}>
                        <Image source={{ uri: a.heroImageUrl }} style={styles.attractionImage} />
                        <View style={styles.attractionBody}>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={styles.attractionCategory}>{a.category?.name || 'Sanctuary'}</Text>
                            <View style={[styles.entryBadge, {
                              backgroundColor: isFree ? '#DCFCE7' : isConditional ? '#FEF3C7' : isPermit ? '#FEE2E2' : '#F1F5F9',
                              borderColor: isFree ? '#86EFAC' : isConditional ? '#FDE047' : isPermit ? '#FCA5A5' : '#E2E8F0'
                            }]}>
                              <Text style={[styles.entryBadgeText, {
                                color: isFree ? '#166534' : isConditional ? '#854D0E' : isPermit ? '#991B1B' : '#475569'
                              }]}>
                                {isFree ? 'FREE' : isConditional ? 'FREE/PAID' : isPermit ? 'PERMIT' : 'PAID'}
                              </Text>
                            </View>
                          </View>

                          <Text style={styles.attractionName} numberOfLines={1}>{a.name}</Text>
                          <Text style={styles.attractionAddress} numberOfLines={1}>
                            {a.city?.name}, {a.city?.state?.name || 'India'}
                          </Text>

                          <View style={styles.attractionFooter}>
                            <Text style={styles.attractionRating}>★ {a.rating?.toFixed(1) || '4.8'}</Text>
                            <Text style={styles.attractionFeeText}>
                              {isFree ? 'Free Entry' : isConditional ? 'Free Sanctum' : isPermit ? 'Permit Req.' : `₹${a.entryFee || a.adultIndianFee || 50}`}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })
                )}
              </View>
            )}

            {activeTab === 'DESTINATIONS' && (
              <View style={styles.grid}>
                {cities.map((c) => (
                  <TouchableOpacity key={c.id} style={styles.cityCard}>
                    <Image source={{ uri: c.imageUrl }} style={styles.cityImage} />
                    <View style={styles.cityOverlay} />
                    <View style={styles.cityContent}>
                      <Text style={styles.cityName}>{c.name}</Text>
                      <Text style={styles.cityState}>{c.state?.name || 'India'}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {activeTab === 'HOTELS' && (
              <View style={styles.list}>
                {hotels.map((h) => (
                  <TouchableOpacity key={h.id} style={styles.hotelCard}>
                    <Image source={{ uri: h.heroImageUrl }} style={styles.hotelImage} />
                    <View style={styles.hotelBody}>
                      <Text style={styles.hotelTier}>{h.tier}</Text>
                      <Text style={styles.hotelName} numberOfLines={1}>{h.name}</Text>
                      <Text style={styles.hotelAddress} numberOfLines={1}>{h.address}</Text>
                      <View style={styles.hotelFooter}>
                        <Text style={styles.hotelRating}>★ {h.rating?.toFixed(1) || '4.5'}</Text>
                        <Text style={styles.hotelPrice}>₹{h.startingPriceInr?.toLocaleString('en-IN')}/night</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* 13. EVENTS TAB ON MOBILE */}
            {activeTab === 'EVENTS' && (
              <View style={styles.list}>
                {events.map((ev) => (
                  <TouchableOpacity key={ev.id} style={styles.hotelCard}>
                    <Image source={{ uri: ev.imageUrl }} style={styles.hotelImage} />
                    <View style={styles.hotelBody}>
                      <Text style={styles.hotelTier}>{ev.category}</Text>
                      <Text style={styles.hotelName} numberOfLines={1}>{ev.name}</Text>
                      <Text style={styles.hotelAddress} numberOfLines={1}>{ev.startDate} • {ev.location}</Text>
                      <View style={styles.hotelFooter}>
                        <Text style={[styles.entryBadgeText, { color: '#166534' }]}>{ev.ticketInfo || 'Free Entry'}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <View style={{ height: 40 }} />
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAF8F5' },
  container: { flex: 1, paddingHorizontal: 16 },
  header: { paddingVertical: 14 },
  title: { fontSize: 24, fontWeight: '900', color: '#0F172A' },
  subtitle: { fontSize: 12, color: '#64748B', marginTop: 2 },
  tabBar: { flexDirection: 'row', backgroundColor: '#E2E8F0', borderRadius: 14, padding: 4, marginBottom: 10 },
  tabBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 10 },
  tabBtnActive: { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3 },
  tabBtnText: { fontSize: 11, fontWeight: '700', color: '#64748B' },
  tabBtnTextActive: { color: '#FF671F' },
  
  filterSection: { marginBottom: 12, gap: 6 },
  filterRow: { flexDirection: 'row', marginBottom: 2 },
  filterRowSub: { flexDirection: 'row' },
  filterChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', marginRight: 8 },
  filterChipActive: { backgroundColor: '#0F172A', borderColor: '#0F172A' },
  filterChipText: { fontSize: 11, fontWeight: '700', color: '#475569' },
  filterChipTextActive: { color: '#FFFFFF' },
  priceChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, backgroundColor: '#F1F5F9', marginRight: 6 },
  priceChipActive: { backgroundColor: '#FF671F' },
  priceChipText: { fontSize: 10, fontWeight: '700', color: '#64748B' },
  priceChipTextActive: { color: '#FFFFFF' },

  list: { gap: 12 },
  attractionCard: { backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#E2E8F0', flexDirection: 'row' },
  attractionImage: { width: 100, height: 100 },
  attractionBody: { flex: 1, padding: 10, justifyContent: 'space-between' },
  attractionCategory: { fontSize: 9, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase' },
  entryBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, borderWidth: 1 },
  entryBadgeText: { fontSize: 9, fontWeight: '900' },
  attractionName: { fontSize: 13, fontWeight: '800', color: '#0F172A' },
  attractionAddress: { fontSize: 11, color: '#64748B' },
  attractionFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  attractionRating: { fontSize: 11, fontWeight: '700', color: '#D97706' },
  attractionFeeText: { fontSize: 11, fontWeight: '800', color: '#0F172A' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10 },
  cityCard: { width: '48%', height: 160, borderRadius: 16, overflow: 'hidden', position: 'relative' },
  cityImage: { width: '100%', height: '100%' },
  cityOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },
  cityContent: { position: 'absolute', bottom: 10, left: 10, right: 10 },
  cityName: { fontSize: 15, fontWeight: '900', color: '#FFFFFF' },
  cityState: { fontSize: 11, color: '#FDE047', fontWeight: '600' },

  hotelCard: { backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#E2E8F0', flexDirection: 'row' },
  hotelImage: { width: 100, height: 100 },
  hotelBody: { flex: 1, padding: 10, justifyContent: 'space-between' },
  hotelTier: { fontSize: 9, fontWeight: '800', color: '#FF671F', letterSpacing: 0.5 },
  hotelName: { fontSize: 13, fontWeight: '800', color: '#0F172A' },
  hotelAddress: { fontSize: 11, color: '#64748B' },
  hotelFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  hotelRating: { fontSize: 11, fontWeight: '700', color: '#D97706' },
  hotelPrice: { fontSize: 13, fontWeight: '900', color: '#0F172A' }
});

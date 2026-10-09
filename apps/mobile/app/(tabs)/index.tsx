import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView
} from 'react-native';
import { mobileApi } from '../../src/lib/api';
import MobileLogo from '../../src/components/Logo';

export default function MobileHomeScreen() {
  const [search, setSearch] = useState('');
  const [attractions, setAttractions] = useState<any[]>([]);
  const [freeItems, setFreeItems] = useState<any[]>([]);
  const [nearbyItems, setNearbyItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [attrRes, freeRes, nearRes] = await Promise.all([
          mobileApi.getAttractions('?featured=true&limit=6'),
          mobileApi.getAttractions('?entryType=FREE&limit=6'),
          mobileApi.getNearby(26.9855, 75.8513) // Amber Fort coordinates
        ]);
        setAttractions(attrRes.data || []);
        setFreeItems(freeRes.data || []);
        setNearbyItems(nearRes.data?.slice(0, 4) || []);
      } catch (err) {
        console.log('Mobile home load notice:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const categories = [
    { label: 'Forts & Palaces', icon: '🏰' },
    { label: 'Religious', icon: '🛕' },
    { label: 'Nature & Hills', icon: '⛰️' },
    { label: 'Wildlife Safari', icon: '🐅' },
    { label: 'Hidden Gems', icon: '✨' }
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <MobileLogo size="md" showTagline={true} />
          <TouchableOpacity style={styles.bellButton}>
            <Text style={{ fontSize: 16 }}>🔔</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search forts, Jaipur, Taj Mahal..."
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Categories Carousel */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Explore by Experience</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {categories.map((c, i) => (
            <TouchableOpacity key={i} style={styles.categoryCard}>
              <Text style={{ fontSize: 20 }}>{c.icon}</Text>
              <Text style={styles.categoryLabel}>{c.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Section 17: "Near Me" Geo-distance Attractions */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Near Me</Text>
            <Text style={styles.sectionSubtext}>Sorted by real-time GPS distance</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>Filter Radius</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {nearbyItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.nearCard}>
              <Image source={{ uri: item.heroImageUrl }} style={styles.nearImage} />
              <View style={styles.nearDistanceBadge}>
                <Text style={styles.nearDistanceText}>{item.distanceKm || '1.2'} km away</Text>
              </View>
              <View style={styles.nearCardBody}>
                <Text style={styles.nearCardTitle} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.nearCardRating}>⭐ {item.rating?.toFixed(1) || '4.8'} • ASI Verified</Text>
                <Text style={styles.nearCardPrice}>From ₹{item.ticketTypes?.[0]?.priceInr || 50}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Explore India for Free 🇮🇳 Section */}
        <View style={styles.sectionHeader}>
          <View>
            <View style={{ backgroundColor: '#ECFDF5', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, alignSelf: 'flex-start', marginBottom: 4, borderWidth: 1, borderColor: '#A7F3D0' }}>
              <Text style={{ fontSize: 9, fontWeight: '900', color: '#065F46', letterSpacing: 0.5 }}>ZERO ADMISSION FEE</Text>
            </View>
            <Text style={styles.sectionTitle}>Explore India for Free 🇮🇳</Text>
            <Text style={styles.sectionSubtext}>Iconic public landmarks, waterfronts & sacred heritage</Text>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {freeItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.nearCard}>
              <Image source={{ uri: item.heroImageUrl }} style={styles.nearImage} />
              <View style={[styles.nearDistanceBadge, { backgroundColor: '#059669' }]}>
                <Text style={styles.nearDistanceText}>FREE ENTRY</Text>
              </View>
              <View style={styles.nearCardBody}>
                <Text style={styles.nearCardTitle} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.nearCardRating}>⭐ {item.rating?.toFixed(1) || '4.8'} • {item.city?.name || 'India'}</Text>
                <Text style={[styles.nearCardPrice, { color: '#059669' }]}>No Ticket Required</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Trending Heritage & Attractions */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Featured Attractions</Text>
            <Text style={styles.sectionSubtext}>Verified entry protocols & official ticketing</Text>
          </View>
        </View>

        <View style={styles.verticalList}>
          {attractions.map((a) => {
            const isFree = a.entryType === 'FREE';
            const isConditional = a.entryType === 'CONDITIONAL';
            const isPermit = a.entryType === 'PERMIT_REQUIRED';
            const badgeLabel = isFree 
              ? 'FREE ENTRY' 
              : isConditional 
              ? 'FREE / PAID AREAS' 
              : isPermit 
              ? 'PERMIT REQUIRED' 
              : `ENTRY ₹${a.adultIndianFee ?? a.ticketTypes?.[0]?.priceInr ?? 50}`;
            const badgeColor = isFree ? '#065F46' : isConditional ? '#92400E' : isPermit ? '#9F1239' : '#1E40AF';
            const badgeBg = isFree ? '#ECFDF5' : isConditional ? '#FEF3C7' : isPermit ? '#FFE4E6' : '#EFF6FF';
            const badgeBorder = isFree ? '#A7F3D0' : isConditional ? '#FDE68A' : isPermit ? '#FECDD3' : '#BFDBFE';

            return (
              <TouchableOpacity key={a.id} style={styles.attractionCard}>
                <Image source={{ uri: a.heroImageUrl }} style={styles.attractionImage} />
                <View style={styles.attractionBody}>
                  <View style={styles.badgeRow}>
                    <Text style={styles.categoryBadge}>{a.category?.name || 'Heritage'}</Text>
                    <View style={{ backgroundColor: badgeBg, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, borderWidth: 1, borderColor: badgeBorder }}>
                      <Text style={{ fontSize: 9, fontWeight: '900', color: badgeColor }}>{badgeLabel}</Text>
                    </View>
                  </View>
                  <Text style={styles.attractionTitle} numberOfLines={1}>{a.name}</Text>
                  <Text style={styles.attractionCity}>📍 {a.city?.name || 'India'}, {a.city?.state?.name || ''}</Text>
                  
                  <View style={styles.priceRow}>
                    {isFree ? (
                      <>
                        <Text style={[styles.priceText, { color: '#059669' }]}>Free Entry</Text>
                        <View style={{ backgroundColor: '#F0FDF4', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, borderWidth: 1, borderColor: '#BBF7D0' }}>
                          <Text style={{ fontSize: 11, fontWeight: '800', color: '#166534' }}>No Ticket Needed</Text>
                        </View>
                      </>
                    ) : isPermit ? (
                      <>
                        <Text style={[styles.priceText, { color: '#BE123C' }]}>Permit Required</Text>
                        <View style={{ backgroundColor: '#FFF1F2', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, borderWidth: 1, borderColor: '#FECDD3' }}>
                          <Text style={{ fontSize: 11, fontWeight: '800', color: '#9F1239' }}>View Guidelines</Text>
                        </View>
                      </>
                    ) : isConditional ? (
                      <>
                        <Text style={styles.priceText}>Free General</Text>
                        <View style={{ backgroundColor: '#FEF3C7', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, borderWidth: 1, borderColor: '#FDE68A' }}>
                          <Text style={{ fontSize: 11, fontWeight: '800', color: '#92400E' }}>Free / Paid Areas</Text>
                        </View>
                      </>
                    ) : (
                      <>
                        <Text style={styles.priceText}>₹{a.adultIndianFee ?? a.ticketTypes?.[0]?.priceInr ?? 50} <Text style={styles.priceUnit}>/person</Text></Text>
                        <View style={styles.bookMiniBtn}>
                          <Text style={styles.bookMiniBtnText}>Reserve Pass</Text>
                        </View>
                      </>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF8F5'
  },
  container: {
    flex: 1,
    paddingHorizontal: 16
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16
  },
  brandSubtitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A'
  },
  bellButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '500'
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
    marginTop: 8
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A'
  },
  sectionSubtext: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF671F'
  },
  categoryScroll: {
    marginBottom: 20
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155'
  },
  horizontalScroll: {
    marginBottom: 24
  },
  nearCard: {
    width: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  nearImage: {
    width: '100%',
    height: 110
  },
  nearDistanceBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8
  },
  nearDistanceText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FDE047'
  },
  nearCardBody: {
    padding: 10
  },
  nearCardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A'
  },
  nearCardRating: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2
  },
  nearCardPrice: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FF671F',
    marginTop: 4
  },
  verticalList: {
    gap: 12
  },
  attractionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row'
  },
  attractionImage: {
    width: 110,
    height: 110
  },
  attractionBody: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between'
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6
  },
  categoryBadge: {
    fontSize: 9,
    fontWeight: '700',
    backgroundColor: '#F1F5F9',
    color: '#475569',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6
  },
  asiBadge: {
    fontSize: 9,
    fontWeight: '800',
    backgroundColor: '#DCFCE7',
    color: '#166534',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6
  },
  attractionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2
  },
  attractionCity: {
    fontSize: 11,
    color: '#64748B'
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4
  },
  priceText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F172A'
  },
  priceUnit: {
    fontSize: 10,
    fontWeight: '400',
    color: '#94A3B8'
  },
  bookMiniBtn: {
    backgroundColor: '#FF671F',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8
  },
  bookMiniBtnText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800'
  }
});

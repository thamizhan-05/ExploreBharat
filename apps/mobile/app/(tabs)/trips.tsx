import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView
} from 'react-native';
import { mobileApi } from '../../src/lib/api';

export default function MobileTripsScreen() {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiPrompt, setAiPrompt] = useState('4 days in Rajasthan forts & nature');
  const [generating, setGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<any | null>(null);

  useEffect(() => {
    async function loadTrips() {
      try {
        const res = await mobileApi.getMyTrips();
        setTrips(res.data || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    loadTrips();
  }, []);

  const handleGenerateAi = async () => {
    setGenerating(true);
    try {
      const res = await mobileApi.generateAiPlan({
        prompt: aiPrompt,
        daysCount: 4,
        budgetInr: 25000,
        travelCompanions: 'FAMILY'
      });
      setGeneratedPlan(res.data);
    } catch (err) {
      alert('Could not generate plan: ' + err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>My Trips</Text>
          <Text style={styles.subtitle}>Multi-day schedules & deterministic travel budget</Text>
        </View>

        {/* AI Quick Generator Box */}
        <View style={styles.aiBox}>
          <View style={styles.aiHeader}>
            <Text style={{ fontSize: 16 }}>✨</Text>
            <Text style={styles.aiTitle}>AI Instant Itinerary Synthesizer</Text>
          </View>
          <TextInput
            style={styles.aiInput}
            value={aiPrompt}
            onChangeText={setAiPrompt}
            placeholder="e.g. 4 days in Jaipur forts under 25000"
            placeholderTextColor="#94A3B8"
          />
          <TouchableOpacity
            style={styles.aiButton}
            onPress={handleGenerateAi}
            disabled={generating}
          >
            <Text style={styles.aiButtonText}>
              {generating ? 'Calculating Budget & Schedule...' : 'Generate Itinerary'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Generated Plan Preview */}
        {generatedPlan && (
          <View style={styles.planCard}>
            <Text style={styles.planDest}>{generatedPlan.destination}</Text>
            <Text style={styles.planSummary}>{generatedPlan.summary}</Text>
            
            <View style={styles.budgetRow}>
              <View style={styles.budgetItem}>
                <Text style={styles.budgetVal}>₹{generatedPlan.budgetBreakdown?.hotelsInr}</Text>
                <Text style={styles.budgetLbl}>Stays</Text>
              </View>
              <View style={styles.budgetItem}>
                <Text style={styles.budgetVal}>₹{generatedPlan.budgetBreakdown?.ticketsInr}</Text>
                <Text style={styles.budgetLbl}>Passes</Text>
              </View>
              <View style={styles.budgetItem}>
                <Text style={styles.budgetVal}>₹{generatedPlan.budgetBreakdown?.foodInr}</Text>
                <Text style={styles.budgetLbl}>Dining</Text>
              </View>
              <View style={styles.budgetItem}>
                <Text style={[styles.budgetVal, { color: '#FF671F' }]}>₹{generatedPlan.budgetBreakdown?.totalInr}</Text>
                <Text style={styles.budgetLbl}>Total Est.</Text>
              </View>
            </View>

            <View style={styles.daysList}>
              {generatedPlan.days?.map((d: any) => (
                <View key={d.dayNumber} style={styles.dayItem}>
                  <Text style={styles.dayNum}>Day {d.dayNumber}</Text>
                  <Text style={styles.dayPlace}>🌅 {d.morning.place}</Text>
                  <Text style={styles.dayPlace}>☀️ {d.afternoon.place}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Pre-saved Trips */}
        <View style={styles.savedSection}>
          <Text style={styles.sectionTitle}>Planned Journeys</Text>
          {trips.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={{ fontSize: 28, textAlign: 'center' }}>🗺️</Text>
              <Text style={styles.emptyTitle}>No Trips Saved</Text>
              <Text style={styles.emptyDesc}>Use the AI synthesizer above or the Web portal to create custom itineraries.</Text>
            </View>
          ) : (
            trips.map((t) => (
              <View key={t.id} style={styles.tripCard}>
                <View style={styles.tripCardHeader}>
                  <Text style={styles.tripCardTitle}>{t.title}</Text>
                  <Text style={styles.tripCardDates}>{t.startDate} - {t.endDate}</Text>
                </View>
                <Text style={styles.tripCardDest}>📍 {t.destination} • {t.companions} Travel</Text>
                <View style={styles.tripCardFooter}>
                  <Text style={styles.tripCardBudget}>Budget: ₹{t.budgetBreakdown?.totalInr?.toLocaleString('en-IN')}</Text>
                  <Text style={styles.tripCardDays}>{t.days?.length || 1} Days Planned</Text>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAF8F5' },
  container: { flex: 1, paddingHorizontal: 16 },
  header: { paddingVertical: 14 },
  title: { fontSize: 24, fontWeight: '900', color: '#0F172A' },
  subtitle: { fontSize: 12, color: '#64748B', marginTop: 2 },
  aiBox: { backgroundColor: '#1E293B', borderRadius: 20, padding: 16, marginBottom: 20 },
  aiHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  aiTitle: { color: '#FDE047', fontWeight: '800', fontSize: 13 },
  aiInput: { backgroundColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, fontSize: 13, marginBottom: 10 },
  aiButton: { backgroundColor: '#FF671F', borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  aiButtonText: { color: '#FFFFFF', fontWeight: '800', fontSize: 13 },
  planCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 20 },
  planDest: { fontSize: 18, fontWeight: '900', color: '#0F172A' },
  planSummary: { fontSize: 12, color: '#475569', marginTop: 4, lineHeight: 18 },
  budgetRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#F8FAFC', borderRadius: 14, padding: 10, marginTop: 12 },
  budgetItem: { alignItems: 'center' },
  budgetVal: { fontSize: 13, fontWeight: '900', color: '#0F172A' },
  budgetLbl: { fontSize: 10, color: '#64748B', marginTop: 2 },
  daysList: { marginTop: 12, gap: 8 },
  dayItem: { backgroundColor: '#F1F5F9', padding: 10, borderRadius: 12 },
  dayNum: { fontSize: 11, fontWeight: '800', color: '#FF671F' },
  dayPlace: { fontSize: 12, color: '#1E293B', fontWeight: '600', marginTop: 2 },
  savedSection: { marginTop: 6 },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: '#0F172A', marginBottom: 12 },
  emptyCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  emptyTitle: { fontSize: 14, fontWeight: '800', color: '#0F172A', marginTop: 8 },
  emptyDesc: { fontSize: 11, color: '#64748B', textAlign: 'center', marginTop: 4 },
  tripCard: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 12 },
  tripCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tripCardTitle: { fontSize: 14, fontWeight: '800', color: '#0F172A' },
  tripCardDates: { fontSize: 11, color: '#94A3B8', fontWeight: '600' },
  tripCardDest: { fontSize: 12, color: '#64748B', marginTop: 4 },
  tripCardFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  tripCardBudget: { fontSize: 12, fontWeight: '800', color: '#0F172A' },
  tripCardDays: { fontSize: 11, color: '#FF671F', fontWeight: '700' }
});

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  StyleSheet,
  SafeAreaView
} from 'react-native';
import { mobileApi } from '../../src/lib/api';

export default function MobileBookingsScreen() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);

  useEffect(() => {
    async function loadBookings() {
      try {
        const res = await mobileApi.getMyBookings();
        setBookings(res.data || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    loadBookings();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>My Bookings</Text>
          <Text style={styles.subtitle}>Digital admission passes & verified reservations</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          {bookings.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={{ fontSize: 32 }}>🎫</Text>
              <Text style={styles.emptyTitle}>No Bookings Yet</Text>
              <Text style={styles.emptyDesc}>Reserve monument tickets or heritage havelis to view digital passes here.</Text>
            </View>
          ) : (
            bookings.map((b) => (
              <View key={b.id} style={styles.bookingCard}>
                <View style={styles.bookingCardHeader}>
                  <Text style={styles.bookingRef}>{b.bookingReference}</Text>
                  <Text style={[styles.statusBadge, b.status === 'CONFIRMED' ? styles.confirmedBadge : styles.cancelledBadge]}>
                    {b.status}
                  </Text>
                </View>

                <Text style={styles.bookingTitle}>{b.title}</Text>
                <Text style={styles.bookingDetails}>📍 {b.location}</Text>
                <Text style={styles.bookingDetails}>📅 {b.checkInDate} {b.slotTime ? `• ${b.slotTime}` : ''} • {b.guestCount} Guest(s)</Text>

                <View style={styles.bookingCardFooter}>
                  <Text style={styles.bookingPrice}>₹{b.totalAmountInr?.toLocaleString('en-IN')}</Text>
                  <TouchableOpacity
                    style={styles.qrButton}
                    onPress={() => setSelectedTicket(b)}
                  >
                    <Text style={styles.qrButtonText}>📱 Show QR Pass</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
          <View style={{ height: 40 }} />
        </ScrollView>

        {/* QR Pass Modal */}
        <Modal
          visible={!!selectedTicket}
          transparent
          animationType="fade"
          onRequestClose={() => setSelectedTicket(null)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalBox}>
              <Text style={styles.modalBadge}>OFFICIAL ADMISSION PASS</Text>
              <Text style={styles.modalTitle}>{selectedTicket?.title}</Text>
              <Text style={styles.modalRef}>{selectedTicket?.bookingReference}</Text>

              {/* QR Mock graphic for Native mobile view */}
              <View style={styles.qrBox}>
                <Text style={{ fontSize: 48, textAlign: 'center' }}>🏁</Text>
                <Text style={styles.qrText}>[CRYPTO SIGNED QR TOKEN]</Text>
                <Text style={styles.qrSubtext}>Verified by ExploreBharat Security Gate</Text>
              </View>

              <View style={styles.modalDetails}>
                <Text style={styles.detailText}>Date: {selectedTicket?.checkInDate}</Text>
                <Text style={styles.detailText}>Slot: {selectedTicket?.slotTime || 'Full Day Access'}</Text>
                <Text style={styles.detailText}>Guests: {selectedTicket?.guestCount} Admission(s)</Text>
              </View>

              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setSelectedTicket(null)}
              >
                <Text style={styles.closeBtnText}>Close Pass</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

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
  emptyCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 32, alignItems: 'center', marginTop: 20, borderWidth: 1, borderColor: '#E2E8F0' },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginTop: 10 },
  emptyDesc: { fontSize: 12, color: '#64748B', textAlign: 'center', marginTop: 4 },
  bookingCard: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 12 },
  bookingCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  bookingRef: { fontSize: 11, fontWeight: '800', color: '#FF671F', letterSpacing: 0.5 },
  statusBadge: { fontSize: 9, fontWeight: '800', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  confirmedBadge: { backgroundColor: '#DCFCE7', color: '#166534' },
  cancelledBadge: { backgroundColor: '#FEE2E2', color: '#991B1B' },
  bookingTitle: { fontSize: 14, fontWeight: '800', color: '#0F172A' },
  bookingDetails: { fontSize: 11, color: '#64748B', marginTop: 3 },
  bookingCardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  bookingPrice: { fontSize: 14, fontWeight: '900', color: '#0F172A' },
  qrButton: { backgroundColor: '#0F172A', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  qrButtonText: { color: '#FFFFFF', fontSize: 11, fontWeight: '800' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalBox: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, width: '100%', maxWidth: 340, alignItems: 'center' },
  modalBadge: { fontSize: 9, fontWeight: '800', color: '#166534', backgroundColor: '#DCFCE7', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  modalTitle: { fontSize: 16, fontWeight: '900', color: '#0F172A', textAlign: 'center', marginTop: 10 },
  modalRef: { fontSize: 12, fontWeight: '800', color: '#FF671F', marginTop: 4 },
  qrBox: { width: 180, height: 180, backgroundColor: '#F8FAFC', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center', marginVertical: 16 },
  qrText: { fontSize: 9, fontWeight: '800', color: '#334155', marginTop: 8 },
  qrSubtext: { fontSize: 8, color: '#94A3B8', marginTop: 2 },
  modalDetails: { width: '100%', backgroundColor: '#F8FAFC', borderRadius: 12, padding: 12, gap: 4 },
  detailText: { fontSize: 11, color: '#334155' },
  closeBtn: { marginTop: 16, width: '100%', backgroundColor: '#FF671F', borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  closeBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 13 }
});

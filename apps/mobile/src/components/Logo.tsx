import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface MobileLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  isDark?: boolean;
}

export default function MobileLogo({
  size = 'md',
  showTagline = false,
  isDark = false
}: MobileLogoProps) {
  const pinSize = size === 'sm' ? 26 : size === 'lg' ? 42 : 32;
  const textSize = size === 'sm' ? 16 : size === 'lg' ? 24 : 20;

  return (
    <View style={styles.container}>
      {/* Map Pin Mark representation */}
      <View
        style={[
          styles.pinWrapper,
          {
            width: pinSize,
            height: pinSize * 1.15,
            borderColor: '#F58220',
          }
        ]}
      >
        {/* Navy body */}
        <View
          style={[
            styles.pinBody,
            { backgroundColor: isDark ? '#FFFFFF' : '#132238' }
          ]}
        >
          {/* Orange top-right arc indicator */}
          <View style={styles.orangeArc} />
          {/* Inner compass dial */}
          <View
            style={[
              styles.innerDial,
              { backgroundColor: isDark ? '#132238' : '#FFFFFF' }
            ]}
          >
            {/* Compass Needle */}
            <View style={styles.needle} />
          </View>
        </View>
      </View>

      {/* Typography */}
      <View style={styles.textContainer}>
        <Text
          style={[
            styles.wordmark,
            {
              fontSize: textSize,
              color: isDark ? '#FFFFFF' : '#132238'
            }
          ]}
        >
          Explore<Text style={{ fontWeight: '900', color: isDark ? '#FFFFFF' : '#132238' }}>Bharat</Text>
        </Text>
        {showTagline && (
          <Text
            style={[
              styles.tagline,
              { color: isDark ? '#94A3B8' : '#132238' }
            ]}
          >
            DISCOVER INDIA. PLAN YOUR JOURNEY.
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pinWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  pinBody: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    borderBottomRightRadius: 2,
    transform: [{ rotate: '-45deg' }],
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  orangeArc: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '50%',
    height: '50%',
    backgroundColor: '#F58220',
    borderTopRightRadius: 12,
  },
  innerDial: {
    width: '55%',
    height: '55%',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  needle: {
    width: 6,
    height: 6,
    backgroundColor: '#F58220',
    transform: [{ rotate: '45deg' }],
    borderRadius: 1,
  },
  textContainer: {
    flexDirection: 'column',
  },
  wordmark: {
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 24,
  },
  tagline: {
    fontSize: 7.5,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginTop: 1,
  },
});

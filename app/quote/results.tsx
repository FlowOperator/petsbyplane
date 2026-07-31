import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius, shadows, layout } from '../../src/theme';
import { Badge } from '../../src/components/ui';
import { useQuoteFlow } from '../../src/services/quoteContext';

/**
 * Quote Results Screen — Step 2 of 4
 * Airline options listed by price, cheapest highlighted.
 */

interface RouteResult {
  airline: string;
  price: number;
  route: string;
  via?: string;
  isDirect?: boolean;
  isCheapest?: boolean;
}

const MOCK_RESULTS: RouteResult[] = [
  { airline: 'Ethiopian Airlines', price: 1453, route: 'LHR → ADD → CPT', via: 'ADD', isCheapest: true },
  { airline: 'KLM Royal Dutch Airlines', price: 1661, route: 'LHR → AMS → CPT', via: 'AMS' },
  { airline: 'Lufthansa', price: 2184, route: 'LHR → FRA → CPT', via: 'FRA' },
  { airline: 'British Airways', price: 2598, route: 'LHR → LHR → CPT', via: 'LHR' },
  { airline: 'British Airways', price: 2598, route: 'LHR → CPT', isDirect: true },
  { airline: 'Emirates', price: 2696, route: 'LHR → DXB → CPT', via: 'DXB' },
];

export default function QuoteResultsScreen() {
  const { quoteDispatch } = useQuoteFlow();

  const handleSelect = (result: RouteResult) => {
    quoteDispatch({
      type: 'SET_SELECTED_FLIGHT',
      payload: {
        airline: result.airline,
        price: result.price,
        route: result.route,
        via: result.via,
      },
    });
    router.push('/quote/addons');
  };
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Progress bar */}
      <View style={styles.progressRow}>
        <View style={[styles.progressDot, styles.progressActive]} />
        <View style={[styles.progressDot, styles.progressActive]} />
        <View style={styles.progressDot} />
        <View style={styles.progressDot} />
      </View>

      {/* Results count */}
      <Text style={styles.resultsInfo}>
        {MOCK_RESULTS.length} options · prices in GBP · flights + documents only
      </Text>

      {/* Results list */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {MOCK_RESULTS.map((result, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.resultCard,
              result.isCheapest && styles.resultCardCheapest,
            ]}
            onPress={() => handleSelect(result)}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={`${result.airline}, ${result.route}, £${result.price}`}
          >
            <View style={styles.resultTop}>
              {/* Airline logo placeholder + name */}
              <View style={styles.airlineCol}>
                <View style={styles.airlineLogo}>
                  <Ionicons name="airplane" size={16} color={colors.textSecondary} />
                </View>
                <View style={styles.airlineInfo}>
                  <View style={styles.airlineNameRow}>
                    <Text style={styles.airlineName}>{result.airline}</Text>
                    {result.isCheapest && (
                      <View style={styles.cheapestBadge}>
                        <Text style={styles.cheapestText}>Cheapest</Text>
                      </View>
                    )}
                    {result.isDirect && (
                      <View style={styles.directBadge}>
                        <Text style={styles.directText}>Direct</Text>
                      </View>
                    )}
                    {result.via && !result.isCheapest && !result.isDirect && (
                      <View style={styles.viaBadge}>
                        <Text style={styles.viaText}>via {result.via}</Text>
                      </View>
                    )}
                    {result.isCheapest && result.via && (
                      <View style={styles.viaBadge}>
                        <Text style={styles.viaText}>via {result.via}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.routeText}>{result.route}</Text>
                </View>
              </View>

              {/* Price + select */}
              <View style={styles.priceCol}>
                <Text style={styles.price}>£{result.price.toLocaleString()}</Text>
                <TouchableOpacity
                  style={styles.selectBtn}
                  onPress={() => handleSelect(result)}
                  accessibilityRole="button"
                >
                  <Text style={styles.selectBtnText}>Select →</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },

  // Progress
  progressRow: {
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: 16,
    marginBottom: 14,
  },
  progressDot: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E4DFD4',
  },
  progressActive: {
    backgroundColor: colors.primary,
  },

  resultsInfo: {
    ...typography.caption,
    color: colors.textSecondary,
    paddingHorizontal: layout.screenPaddingHorizontal,
    marginBottom: 14,
  },

  // List
  scrollView: { flex: 1 },
  scrollContent: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingBottom: 40,
    gap: 10,
  },

  // Card
  resultCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.borderMedium,
    ...shadows.cardLight,
  },
  resultCardCheapest: {
    borderColor: colors.success,
    borderWidth: 2,
  },

  resultTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  airlineCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  airlineLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  airlineInfo: {
    flex: 1,
    minWidth: 0,
  },
  airlineNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  airlineName: {
    ...typography.body,
    fontFamily: 'Nunito_700Bold',
    color: colors.textPrimary,
  },
  cheapestBadge: {
    backgroundColor: colors.successLight,
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  cheapestText: {
    ...typography.tiny,
    fontFamily: 'Nunito_700Bold',
    color: colors.success,
  },
  directBadge: {
    backgroundColor: colors.successLight,
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  directText: {
    ...typography.tiny,
    fontFamily: 'Nunito_700Bold',
    color: colors.success,
  },
  viaBadge: {
    backgroundColor: colors.secondarySubtle,
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  viaText: {
    ...typography.tiny,
    fontFamily: 'Nunito_700Bold',
    color: colors.secondaryDark,
  },
  routeText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 3,
  },

  // Price
  priceCol: {
    alignItems: 'flex-end',
    gap: 8,
    marginLeft: 12,
  },
  price: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 18,
    color: colors.textPrimary,
  },
  selectBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: 7,
    paddingHorizontal: 14,
  },
  selectBtnText: {
    ...typography.tiny,
    fontFamily: 'Nunito_700Bold',
    color: colors.white,
  },
});

const API_URL = 'https://api.retellai.com/v2/list-calls';
const API_KEY = import.meta.env.VITE_RETELL_API_KEY;

/**
 * Classify a single call into a category.
 * Priority: custom_analysis_data > call_summary > transcript keywords > fallback
 */
function classifyCall(call) {
  // 1. Check custom_analysis_data for explicit category
  const customData = call.call_analysis?.custom_analysis_data;
  if (customData) {
    const category = customData.call_category || customData.category || customData.call_type || customData.type;
    if (category) return normalizeCategoryName(category);
  }

  // 2. Check call_summary for classification clues
  const summary = (call.call_analysis?.call_summary || '').toLowerCase();
  const transcript = (call.transcript || '').toLowerCase();
  const combined = summary + ' ' + transcript;

  // 3. Keyword-based classification
  const appointmentKeywords = [
    'appointment', 'schedule', 'booking', 'book', 'reserve', 'reservation',
    'availability', 'available', 'slot', 'calendar', 'reschedule', 'cancel appointment',
    'next monday', 'next week', 'tomorrow', 'come in', 'visit'
  ];
  const inquiryKeywords = [
    'question', 'inquiry', 'information', 'details', 'how much', 'what is',
    'tell me about', 'learn more', 'pricing', 'cost', 'hours', 'location',
    'address', 'services', 'menu', 'options', 'explain', 'wondering'
  ];
  const complaintKeywords = [
    'complaint', 'complain', 'unhappy', 'dissatisfied', 'frustrated', 'angry',
    'problem', 'issue', 'wrong', 'terrible', 'worst', 'refund', 'manager',
    'not working', 'broken', 'disappointed', 'unacceptable', 'rude'
  ];

  const appointmentScore = appointmentKeywords.filter(k => combined.includes(k)).length;
  const inquiryScore = inquiryKeywords.filter(k => combined.includes(k)).length;
  const complaintScore = complaintKeywords.filter(k => combined.includes(k)).length;

  const maxScore = Math.max(appointmentScore, inquiryScore, complaintScore);

  if (maxScore === 0) return 'Irrelevant';
  if (appointmentScore === maxScore) return 'Appointment Scheduling';
  if (inquiryScore === maxScore) return 'General Inquiries';
  if (complaintScore === maxScore) return 'Customer Complaints';

  return 'Irrelevant';
}

/**
 * Normalize a category string from custom_analysis_data into a friendly display name
 */
function normalizeCategoryName(raw) {
  const s = raw.toLowerCase().trim();
  if (s.includes('appointment') || s.includes('schedule') || s.includes('booking')) return 'Appointment Scheduling';
  if (s.includes('inquiry') || s.includes('question') || s.includes('information') || s.includes('general')) return 'General Inquiries';
  if (s.includes('complaint') || s.includes('issue') || s.includes('problem')) return 'Customer Complaints';
  if (s.includes('irrelevant') || s.includes('spam') || s.includes('wrong number')) return 'Irrelevant';
  // Return the original with title case if no match
  return raw.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export const fetchAnalyticsForAgent = async (agentId) => {
  if (!API_KEY) {
    console.warn("No Retell API Key found in .env.");
    return { calls: '0', duration: '0 min', relevance: '0%', peaks: ['N/A'], dailyVolume: [], callTypes: {} };
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sort_order: 'descending',
        limit: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const allCalls = await response.json();

    // Filter by agent if applicable
    const agentCalls = allCalls.filter(c => c.agent_id === agentId);
    const callsToAnalyze = agentCalls.length > 0 ? agentCalls : allCalls;

    // --- Total Calls ---
    const totalCalls = callsToAnalyze.length;

    // --- Avg Call Duration ---
    let totalDurationMs = 0;
    let callsWithDuration = 0;
    callsToAnalyze.forEach(call => {
      if (call.duration_ms) {
        totalDurationMs += call.duration_ms;
        callsWithDuration++;
      }
    });
    const avgDurationMin = callsWithDuration > 0
      ? (totalDurationMs / callsWithDuration / 60000).toFixed(1)
      : '0';

    // --- Peak Call Hours ---
    const hourCounts = {};
    callsToAnalyze.forEach(call => {
      if (call.start_timestamp) {
        const date = new Date(call.start_timestamp);
        const hour = date.getHours();
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      }
    });
    const peaks = Object.entries(hourCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([hour]) => {
        const h = parseInt(hour);
        return h >= 12 ? `${h === 12 ? 12 : h - 12}:00 PM` : `${h === 0 ? 12 : h}:00 AM`;
      });

    // --- Daily Call Volume (Last 30 Days) ---
    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
    const dailyMap = {};
    callsToAnalyze.forEach(call => {
      if (call.start_timestamp && call.start_timestamp >= thirtyDaysAgo) {
        const dateStr = new Date(call.start_timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        if (!dailyMap[dateStr]) {
          dailyMap[dateStr] = { count: 0, totalDurationMs: 0, callsWithDuration: 0 };
        }
        dailyMap[dateStr].count++;
        if (call.duration_ms) {
          dailyMap[dateStr].totalDurationMs += call.duration_ms;
          dailyMap[dateStr].callsWithDuration++;
        }
      }
    });
    const dailyVolume = Object.entries(dailyMap)
      .map(([date, data]) => ({
        date,
        count: data.count,
        avgDuration: data.callsWithDuration > 0
          ? (data.totalDurationMs / data.callsWithDuration / 60000).toFixed(1)
          : '0'
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    // --- Call Types Distribution (Smart Classification) ---
    const callTypes = {};
    callsToAnalyze.forEach(call => {
      const category = classifyCall(call);
      callTypes[category] = (callTypes[category] || 0) + 1;
    });

    // --- Relevance ---
    let successfulCalls = 0;
    let analyzedCalls = 0;
    callsToAnalyze.forEach(call => {
      if (call.call_analysis && typeof call.call_analysis.call_successful === 'boolean') {
        analyzedCalls++;
        if (call.call_analysis.call_successful) successfulCalls++;
      }
    });
    const relevance = analyzedCalls > 0
      ? Math.round((successfulCalls / analyzedCalls) * 100) + '%'
      : 'N/A';

    return {
      calls: totalCalls.toString(),
      duration: `${avgDurationMin} min`,
      relevance,
      peaks: peaks.length > 0 ? peaks : ['N/A'],
      dailyVolume,
      callTypes,
    };
  } catch (error) {
    console.error("Error fetching Retell data:", error);
    return { calls: '0', duration: '0 min', relevance: '0%', peaks: [], dailyVolume: [], callTypes: {} };
  }
};

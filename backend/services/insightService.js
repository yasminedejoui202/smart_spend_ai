const ONE_DAY_MS = 24 * 60 * 60 * 1000

function toNumber(value) {
  return Number(value) || 0
}

function sumAmounts(items) {
  return items.reduce((total, item) => total + toNumber(item.amount), 0)
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function startOfNextMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1)
}

function filterByDateRange(items, startDate, endDate) {
  return items.filter((item) => {
    const itemDate = new Date(item.date)
    return itemDate >= startDate && itemDate < endDate
  })
}

function percentChange(currentValue, previousValue) {
  if (!previousValue && !currentValue) return 0
  if (!previousValue) return 100
  return Math.round(((currentValue - previousValue) / previousValue) * 100)
}

function groupTotalsByCategory(items) {
  return items.reduce((totals, item) => {
    const category = item.category || 'Other'
    totals[category] = (totals[category] || 0) + toNumber(item.amount)
    return totals
  }, {})
}

function getTopCategory(categoryTotals) {
  const [name, total] = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0] || []

  return name ? { name, total } : null
}

function createInsight(type, title, message, priority, metric = '') {
  return { type, title, message, priority, metric }
}

function buildMonthlyTrend(expenses, incomes, now) {
  return Array.from({ length: 6 }, (_, index) => {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1)
    const nextMonth = startOfNextMonth(monthDate)
    const monthExpenses = filterByDateRange(expenses, monthDate, nextMonth)
    const monthIncome = filterByDateRange(incomes, monthDate, nextMonth)

    return {
      label: monthDate.toLocaleString('en-US', { month: 'short' }),
      income: sumAmounts(monthIncome),
      expenses: sumAmounts(monthExpenses),
      savings: sumAmounts(monthIncome) - sumAmounts(monthExpenses),
    }
  })
}

function generateInsights(expenses = [], incomes = []) {
  const now = new Date()
  const currentMonthStart = startOfMonth(now)
  const nextMonthStart = startOfNextMonth(now)
  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const sevenDaysAgo = new Date(now.getTime() - 7 * ONE_DAY_MS)
  const fourteenDaysAgo = new Date(now.getTime() - 14 * ONE_DAY_MS)

  const currentMonthExpenses = filterByDateRange(expenses, currentMonthStart, nextMonthStart)
  const previousMonthExpenses = filterByDateRange(expenses, previousMonthStart, currentMonthStart)
  const currentMonthIncome = filterByDateRange(incomes, currentMonthStart, nextMonthStart)
  const previousMonthIncome = filterByDateRange(incomes, previousMonthStart, currentMonthStart)
  const currentWeekExpenses = filterByDateRange(expenses, sevenDaysAgo, now)
  const previousWeekExpenses = filterByDateRange(expenses, fourteenDaysAgo, sevenDaysAgo)

  const totalExpenses = sumAmounts(expenses)
  const totalIncome = sumAmounts(incomes)
  const balance = totalIncome - totalExpenses
  const currentMonthExpenseTotal = sumAmounts(currentMonthExpenses)
  const previousMonthExpenseTotal = sumAmounts(previousMonthExpenses)
  const currentMonthIncomeTotal = sumAmounts(currentMonthIncome)
  const previousMonthIncomeTotal = sumAmounts(previousMonthIncome)
  const currentMonthSavings = currentMonthIncomeTotal - currentMonthExpenseTotal
  const previousMonthSavings = previousMonthIncomeTotal - previousMonthExpenseTotal
  const expenseTrendPercent = percentChange(currentMonthExpenseTotal, previousMonthExpenseTotal)
  const savingsTrendPercent = percentChange(currentMonthSavings, previousMonthSavings)
  const categoryTotals = groupTotalsByCategory(expenses)
  const currentWeekCategoryTotals = groupTotalsByCategory(currentWeekExpenses)
  const previousWeekCategoryTotals = groupTotalsByCategory(previousWeekExpenses)
  const topCategory = getTopCategory(categoryTotals)
  const currentMonthCategoryTotals = groupTotalsByCategory(currentMonthExpenses)
  const topMonthlyCategory = getTopCategory(currentMonthCategoryTotals)
  const monthlyTrend = buildMonthlyTrend(expenses, incomes, now)
  const insights = []

  if (!expenses.length && !incomes.length) {
    insights.push(createInsight(
      'neutral',
      'Start tracking your money',
      'Add income and expenses to unlock personalized Smart Spend AI insights.',
      50,
    ))
  }

  if (topCategory) {
    insights.push(createInsight(
      'neutral',
      'Highest spending category',
      `Your highest spending category is ${topCategory.name}, with ${topCategory.total.toFixed(2)} recorded so far.`,
      70,
      topCategory.name,
    ))
  }

  Object.entries(currentWeekCategoryTotals).forEach(([category, total]) => {
    const previousTotal = previousWeekCategoryTotals[category] || 0
    const change = percentChange(total, previousTotal)

    if (total > 0 && previousTotal > 0 && change >= 25) {
      insights.push(createInsight(
        'warning',
        `${category} spending increased`,
        `You spent ${change}% more on ${category} this week compared with the previous week.`,
        95,
        `+${change}%`,
      ))
    }
  })

  if (expenseTrendPercent >= 20 && currentMonthExpenseTotal > 0) {
    insights.push(createInsight(
      'warning',
      'Monthly expenses increased',
      `Your expenses increased by ${expenseTrendPercent}% compared to last month. Review your top categories for savings opportunities.`,
      90,
      `+${expenseTrendPercent}%`,
    ))
  }

  if (expenseTrendPercent <= -15 && previousMonthExpenseTotal > 0) {
    insights.push(createInsight(
      'positive',
      'Spending is improving',
      `Your expenses are down ${Math.abs(expenseTrendPercent)}% compared to last month. Keep the momentum going.`,
      85,
      `${expenseTrendPercent}%`,
    ))
  }

  if (currentMonthSavings > previousMonthSavings && currentMonthSavings > 0) {
    insights.push(createInsight(
      'positive',
      'Savings improved this month',
      `You are saving more this month. Current monthly savings are ${currentMonthSavings.toFixed(2)}.`,
      88,
      `+${Math.max(savingsTrendPercent, 0)}%`,
    ))
  }

  if (currentMonthIncomeTotal > 0 && currentMonthExpenseTotal / currentMonthIncomeTotal >= 0.85) {
    insights.push(createInsight(
      'warning',
      'Balance is decreasing quickly',
      'Your current month expenses are using most of your income. Consider slowing discretionary spending.',
      92,
    ))
  }

  if (currentMonthIncomeTotal > 0 && currentMonthExpenseTotal / currentMonthIncomeTotal <= 0.6) {
    insights.push(createInsight(
      'positive',
      'Income covers expenses comfortably',
      'Your income covers your expenses comfortably this month. This is a healthy savings position.',
      82,
    ))
  }

  if (topMonthlyCategory && currentMonthExpenseTotal > 0 && topMonthlyCategory.total / currentMonthExpenseTotal >= 0.35) {
    insights.push(createInsight(
      'warning',
      `${topMonthlyCategory.name} is unusually high`,
      `${topMonthlyCategory.name} makes up ${Math.round((topMonthlyCategory.total / currentMonthExpenseTotal) * 100)}% of your monthly spending. Set a monthly budget for this category.`,
      86,
      topMonthlyCategory.name,
    ))
  }

  if (categoryTotals.Food || categoryTotals.Entertainment) {
    const lifestyleTotal = (categoryTotals.Food || 0) + (categoryTotals.Entertainment || 0)
    const lifestyleShare = totalExpenses ? lifestyleTotal / totalExpenses : 0

    if (lifestyleShare >= 0.4) {
      insights.push(createInsight(
        'neutral',
        'Smart suggestion',
        'Consider reducing restaurant or entertainment spending to improve your monthly savings rate.',
        74,
      ))
    }
  }

  if (categoryTotals.Shopping && totalExpenses && categoryTotals.Shopping / totalExpenses >= 0.25) {
    insights.push(createInsight(
      'neutral',
      'Shopping budget suggestion',
      'Shopping is a major part of your expenses. Set a monthly shopping budget to stay in control.',
      76,
    ))
  }

  const sortedInsights = insights
    .sort((first, second) => second.priority - first.priority)
    .slice(0, 8)

  return {
    insights: sortedInsights,
    analytics: {
      totalIncome,
      totalExpenses,
      balance,
      currentMonthIncome: currentMonthIncomeTotal,
      currentMonthExpenses: currentMonthExpenseTotal,
      currentMonthSavings,
      previousMonthIncome: previousMonthIncomeTotal,
      previousMonthExpenses: previousMonthExpenseTotal,
      previousMonthSavings,
      expenseTrendPercent,
      savingsTrendPercent,
      topCategory,
      categoryTotals,
      monthlyTrend,
    },
  }
}

module.exports = {
  generateInsights,
}